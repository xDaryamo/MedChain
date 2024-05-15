package main

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Authorization struct {
	PatientID  string          `json:"patientId"`
	Authorized map[string]bool `json:"authorized"` // Map of UserID and the authorizations
}

type PatientContract struct {
	contractapi.Contract
}

// CreatePatient adds a new patient record to the ledger
func (c *PatientContract) CreatePatient(ctx contractapi.TransactionContextInterface, patientJSON string) error {
	// Deserialize JSON data into a Go data structure
	var patient Patient
	err := json.Unmarshal([]byte(patientJSON), &patient)
	if err != nil {
		return errors.New("failed to unmarshal patient: " + err.Error())
	}

	// Check if the patient request ID is provided and if it already exists
	if patient.ID.Value == "" {
		return errors.New("patient request ID is required")
	}

	existingPatient, err := ctx.GetStub().GetState(patient.ID.Value)
	if err != nil {
		return errors.New("failed to get patient " + patient.ID.Value + " from world state")
	}
	if existingPatient != nil {
		return errors.New("patient already exists: " + patient.ID.Value)
	}

	// Serialize the patient and save it on the blockchain
	patientJSONBytes, err := json.Marshal(patient)
	if err != nil {
		return errors.New("failed to marshal patient: " + err.Error())
	}

	log.Printf("Patient with ID: %s created successfully", patientID)

	// Save the new patient to the ledger
	return ctx.GetStub().PutState(patient.ID.Value, patientJSONBytes)
}

func (c *PatientContract) ReadPatient(ctx contractapi.TransactionContextInterface, patientID string) (*Patient, error) {
	patientJSON, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return nil, errors.New("failed to read patient: " + err.Error())
	}
	if patientJSON == nil {
		return nil, errors.New("patient does not exist: " + patientID)
	}

	log.Printf("Patient JSON: %s", string(patientJSON))

	var patient Patient
	err = json.Unmarshal(patientJSON, &patient)
	if err != nil {
		return nil, errors.New("failed to unmarshal patient: " + err.Error())
	}

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return nil, errors.New("failed to get client ID attribute: " + err.Error())
	}
	if !exists {
		return nil, errors.New("client ID attribute does not exist")
	}
	
	log.Printf("Client ID (patientID attribute): %s", clientID)
	log.Printf("Patient ID: %s", patientID)

	// Verifica se il richiedente è il paziente stesso
	if clientID == patientID {
		log.Printf("Uguale")	
		return &patient, nil // Paziente accede ai propri dati
	} else {
		log.Printf("Non Uguale")	
		// Altrimenti, verifica se il richiedente è autorizzato
		authorized, err := c.isAuthorized(ctx, patientID, clientID)
		if err != nil {
			return nil, err
		}
		if authorized {
			return &patient, nil
		} else {
			return nil, errors.New("unauthorized access: client is neither the patient nor an authorized entity")
		}
	}
}

// UpdatePatient updates an existing patient record in the ledger
func (c *PatientContract) UpdatePatient(ctx contractapi.TransactionContextInterface, patientID string, patientJSON string) error {

	exists, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return errors.New("failed to get patient: " + err.Error())
	}
	if exists == nil {
		return errors.New("patient does not exist: " + patientID)
	}

	// Ottieni l'ID del client che effettua la richiesta
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return errors.New("failed to get client ID")
	}

	// Controlla se il richiedente è il paziente stesso o un ente autorizzato
	if clientID != patientID {
		authorized, err := c.isAuthorized(ctx, patientID, clientID)
		if err != nil {
			return err
		}
		if !authorized {
			return errors.New("unauthorized to update patient records")
		}
	}

	// Deserializza il JSON del paziente ricevuto
	var patient Patient
	if err := json.Unmarshal([]byte(patientJSON), &patient); err != nil {
		return errors.New("failed to unmarshal patient: " + err.Error())
	}

	// Serializza di nuovo il paziente per l'aggiornamento
	patientJSONBytes, err := json.Marshal(patient)
	if err != nil {
		return errors.New("failed to marshal patient: " + err.Error())
	}

	// Aggiorna il paziente nel ledger
	if err := ctx.GetStub().PutState(patientID, patientJSONBytes); err != nil {
		return errors.New("failed to put state: " + err.Error())
	}

	return nil
}

// DeletePatient removes a patient record from the ledger
func (c *PatientContract) DeletePatient(ctx contractapi.TransactionContextInterface, patientID string) error {
	exists, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return errors.New("failed to get patient: " + err.Error())
	}
	if exists == nil {
		return errors.New("patient does not exist: " + patientID)
	}

	// Remove the patient record
	return ctx.GetStub().DelState(patientID)
}

/*
================================
	AUTHORIZATION OPERATIONS
================================
*/

func (c *PatientContract) RequestAccess(ctx contractapi.TransactionContextInterface, patientID string, requesterID string) error {
	// Check if an authorization record exists
	authAsBytes, err := ctx.GetStub().GetState("auth_" + patientID)
	if err != nil {
		return err
	}

	var auth Authorization
	if authAsBytes != nil {
		json.Unmarshal(authAsBytes, &auth)
	} else {
		auth = Authorization{PatientID: patientID, Authorized: make(map[string]bool)}
	}

	// Add the request with False state
	auth.Authorized[requesterID] = false
	updatedAuthBytes, err := json.Marshal(auth)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState("auth_"+patientID, updatedAuthBytes)
}

func (c *PatientContract) GrantAccess(ctx contractapi.TransactionContextInterface, patientID string, requesterID string) error {
	authAsBytes, err := ctx.GetStub().GetState("auth_" + patientID)
	if err != nil {
		return err
	}
	if authAsBytes == nil {
		return errors.New("no authorization record found")
	}

	var auth Authorization
	json.Unmarshal(authAsBytes, &auth)

	// Solo il paziente può concedere l'accesso
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return err
	}
	if clientID != patientID {
		return errors.New("only the patient can grant access")
	}

	// Concede l'accesso
	auth.Authorized[requesterID] = true
	updatedAuthBytes, err := json.Marshal(auth)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState("auth_"+patientID, updatedAuthBytes)
}

func (c *PatientContract) RevokeAccess(ctx contractapi.TransactionContextInterface, patientID string, requesterID string) error {
	authAsBytes, err := ctx.GetStub().GetState("auth_" + patientID)
	if err != nil {
		return err
	}
	if authAsBytes == nil {
		return errors.New("no authorization record found")
	}

	var auth Authorization
	json.Unmarshal(authAsBytes, &auth)

	// Solo il paziente può revocare l'accesso
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return err
	}
	if clientID != patientID {
		return errors.New("only the patient can revoke access")
	}

	// Revoca l'accesso
	auth.Authorized[requesterID] = false
	updatedAuthBytes, err := json.Marshal(auth)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState("auth_"+patientID, updatedAuthBytes)
}

func (c *PatientContract) isAuthorized(ctx contractapi.TransactionContextInterface, patientID string, clientID string) (bool, error) {
	authAsBytes, err := ctx.GetStub().GetState("auth_" + patientID)
	if err != nil {
		return false, errors.New("failed to get authorization data: " + err.Error())
	}
	if authAsBytes == nil {
		return false, nil // No Authorization found, no access
	}

	var auth Authorization
	err = json.Unmarshal(authAsBytes, &auth)
	if err != nil {
		return false, errors.New("failed to unmarshal authorization data: " + err.Error())
	}

	// Check if the clientID is in Authorized list and if the access is granted
	if authorized, ok := auth.Authorized[clientID]; ok && authorized {
		return true, nil
	}
	return false, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(PatientContract))
	if err != nil {
		log.Panic(errors.New("Error creating patient chaincode: " + err.Error()))
	}

	if err := chaincode.Start(); err != nil {
		log.Panic(errors.New("Error starting patient chaincode: " + err.Error()))
	}

}
