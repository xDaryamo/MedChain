package main

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type Authorization struct {
	PatientID      string          `json:"patientId"`
	Authorized     map[string]bool `json:"authorized"`     // Map of UserID and the authorizations
	AuthorizedOrgs map[string]bool `json:"authorizedOrgs"` // Map of OrgID and the authorizations
}

type PatientContract struct {
	contractapi.Contract
}

func (c *PatientContract) CreatePatient(ctx contractapi.TransactionContextInterface, patientJSON string) (string, error) {

	log.Printf("Patient JSON from param: %s", string(patientJSON))

	// Deserialize JSON data into a Go data structure
	var patient Patient
	err := json.Unmarshal([]byte(patientJSON), &patient)
	if err != nil {
		return "", errors.New("failed to unmarshal patient: " + err.Error())
	}

	log.Printf("Patient struct unmarshalled: %+v", patient)

	// Check if the patient request ID is provided and if it already exists
	if patient.ID.Value == "" {
		return "", errors.New("patient request ID is required")
	}

	existingPatient, err := ctx.GetStub().GetState(patient.ID.Value)
	if err != nil {
		return "", errors.New("failed to get patient " + patient.ID.Value + " from world state")
	}
	if existingPatient != nil {
		return "", errors.New("patient already exists: " + patient.ID.Value)
	}

	// Serialize the patient and save it on the blockchain
	patientJSONBytes, err := json.Marshal(patient)
	if err != nil {
		return "", errors.New("failed to marshal patient: " + err.Error())
	}

	// Save the new patient to the ledger
	err = ctx.GetStub().PutState(patient.ID.Value, patientJSONBytes)
	if err != nil {
		return "", errors.New("failed to put state: " + err.Error())
	}

	log.Printf("Patient with ID: %s created successfully", patient.ID.Value)
	log.Printf("Serialized Patient JSON: %s", string(patientJSONBytes))

	return `{"message": "Patient created successfully"}`, nil
}

func (c *PatientContract) ReadPatient(ctx contractapi.TransactionContextInterface, patientID string) (string, error) {
	var patient Patient

	patientJSON, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return "", errors.New("failed to read patient: " + err.Error())
	}
	if patientJSON == nil {
		return "", errors.New("patient does not exist: " + patientID)
	}

	log.Printf("Patient JSON from ledger: %s", string(patientJSON))

	err = json.Unmarshal(patientJSON, &patient)
	if err != nil {
		return "", errors.New("failed to unmarshal patient: " + err.Error())
	}

	log.Printf("Patient object: %+v", patient)

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return "", errors.New("failed to get client ID attribute: " + err.Error())
	}
	if !exists {
		return "", errors.New("client ID attribute does not exist")
	}

	authorized, err := c.IsAuthorized(ctx, patientID, clientID)
	if err != nil {
		return "", err
	}
	if authorized {
		return string(patientJSON), nil
	} else {
		return "", errors.New("unauthorized access: client is neither the patient nor an authorized entity")
	}
}

// UpdatePatient updates an existing patient record in the ledger
func (c *PatientContract) UpdatePatient(ctx contractapi.TransactionContextInterface, patientJSON string) (string, error) {
	// Deserializza il JSON del paziente ricevuto
	var patient Patient
	if err := json.Unmarshal([]byte(patientJSON), &patient); err != nil {
		return "", errors.New("failed to unmarshal patient: " + err.Error())
	}

	// Ottieni l'ID del paziente dal JSON deserializzato
	patientID := patient.ID.Value
	if patientID == "" {
		return "", errors.New("patient ID is required in the JSON")
	}

	exists, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return "", errors.New("failed to get patient: " + err.Error())
	}
	if exists == nil {
		return "", errors.New("patient does not exist: " + patientID)
	}

	// Ottieni l'ID del client che effettua la richiesta dall'attributo userId
	clientID, existsAttr, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return "", errors.New("failed to get client ID attribute: " + err.Error())
	}
	if !existsAttr {
		return "", errors.New("client ID attribute does not exist")
	}

	log.Printf("Client ID (userId attribute): %s", clientID)

	authorized, err := c.IsAuthorized(ctx, patientID, clientID)
	if err != nil {
		return "", err
	}
	if !authorized {
		return "", errors.New("unauthorized to update patient records")
	}

	// Serializza di nuovo il paziente per l'aggiornamento
	patientJSONBytes, err := json.Marshal(patient)
	if err != nil {
		return "", errors.New("failed to marshal patient: " + err.Error())
	}

	// Aggiorna il paziente nel ledger
	err = ctx.GetStub().PutState(patientID, patientJSONBytes)
	if err != nil {
		return "", errors.New("failed to put state: " + err.Error())
	}

	log.Printf("Patient with ID: %s updated successfully", patientID)
	return `{"message": "Patient updated successfully"}`, nil
}

// DeletePatient removes a patient record from the ledger
func (c *PatientContract) DeletePatient(ctx contractapi.TransactionContextInterface, patientID string) (string, error) {
	exists, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return "", errors.New("failed to get patient: " + err.Error())
	}
	if exists == nil {
		return "", errors.New("patient does not exist: " + patientID)
	}

	err = ctx.GetStub().DelState(patientID)
	if err != nil {
		return "", errors.New("failed to delete patient: " + err.Error())
	}

	log.Printf("Patient with ID: %s deleted successfully", patientID)

	// Remove the patient record
	return `{"message": "Patient deleted successfully"}`, nil
}

/*
================================
	AUTHORIZATION OPERATIONS
================================
*/

func (c *PatientContract) RequestAccess(ctx contractapi.TransactionContextInterface, patientID string, requesterID string, isOrg bool) (string, error) {
	authAsBytes, err := ctx.GetStub().GetState("auth_" + patientID)
	if err != nil {
		return "", err
	}

	var auth Authorization
	if authAsBytes != nil {
		json.Unmarshal(authAsBytes, &auth)
	} else {
		auth = Authorization{PatientID: patientID, Authorized: make(map[string]bool), AuthorizedOrgs: make(map[string]bool)}
	}

	if isOrg {
		auth.AuthorizedOrgs[requesterID] = false
	} else {
		auth.Authorized[requesterID] = false
	}

	updatedAuthBytes, err := json.Marshal(auth)
	if err != nil {
		return "", err
	}

	err = ctx.GetStub().PutState("auth_"+patientID, updatedAuthBytes)
	if err != nil {
		return "", err
	}

	log.Printf("Access request for patient %s by %s recorded", patientID, requesterID)

	return `{"message": "Access request recorded"}`, nil
}

func (c *PatientContract) GrantAccess(ctx contractapi.TransactionContextInterface, patientID string, requesterID string, isOrg bool) (string, error) {
	authAsBytes, err := ctx.GetStub().GetState("auth_" + patientID)
	if err != nil {
		return "", err
	}
	if authAsBytes == nil {
		return "", errors.New("no authorization record found")
	}

	var auth Authorization
	err = json.Unmarshal(authAsBytes, &auth)
	if err != nil {
		return "", errors.New("failed to unmarshal authorization: " + err.Error())
	}

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return "", err
	}
	if !exists {
		return "", errors.New("client ID attribute does not exist")
	}

	if clientID != patientID {
		return "", errors.New("only the patient can grant access")
	}

	if isOrg {
		if _, ok := auth.AuthorizedOrgs[requesterID]; !ok {
			return "", errors.New("no access request found for organization")
		}
		auth.AuthorizedOrgs[requesterID] = true

		// Invoca il chaincode dell'organizzazione
		invokeArgs := [][]byte{[]byte("GrantAccess"), []byte(patientID), []byte(requesterID)}
		response := ctx.GetStub().InvokeChaincode("organization", invokeArgs, "")
		if response.Status != 200 {
			return "", errors.New("failed to invoke organization chaincode: " + response.Message)
		}
	} else {
		if _, ok := auth.Authorized[requesterID]; !ok {
			return "", errors.New("no access request found for requester")
		}
		auth.Authorized[requesterID] = true

		// Invoca il chaincode del practitioner
		invokeArgs := [][]byte{[]byte("GrantAccess"), []byte(patientID), []byte(requesterID)}
		response := ctx.GetStub().InvokeChaincode("practitioner", invokeArgs, "")
		if response.Status != 200 {
			return "", errors.New("failed to invoke practitioner chaincode: " + response.Message)
		}
	}

	updatedAuthBytes, err := json.Marshal(auth)
	if err != nil {
		return "", err
	}

	err = ctx.GetStub().PutState("auth_"+patientID, updatedAuthBytes)
	if err != nil {
		return "", err
	}

	log.Printf("Access granted for patient %s to %s", patientID, requesterID)
	return `{"message": "Access granted"}`, nil
}

func (c *PatientContract) RevokeAccess(ctx contractapi.TransactionContextInterface, patientID string, requesterID string, isOrg bool) (string, error) {
	authAsBytes, err := ctx.GetStub().GetState("auth_" + patientID)
	if err != nil {
		return "", err
	}
	if authAsBytes == nil {
		return "", errors.New("no authorization record found")
	}

	var auth Authorization
	err = json.Unmarshal(authAsBytes, &auth)
	if err != nil {
		return "", errors.New("failed to unmarshal authorization data: " + err.Error())
	}

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return "", err
	}
	if !exists {
		return "", errors.New("client ID attribute does not exist")
	}

	if clientID != patientID {
		return "", errors.New("only the patient can revoke access")
	}

	if isOrg {
		if _, ok := auth.AuthorizedOrgs[requesterID]; !ok {
			return "", errors.New("no authorization found for organization")
		}
		auth.AuthorizedOrgs[requesterID] = false

		// Invoca il chaincode dell'organizzazione
		invokeArgs := [][]byte{[]byte("RevokeAccess"), []byte(patientID), []byte(requesterID)}
		response := ctx.GetStub().InvokeChaincode("organization", invokeArgs, "")
		if response.Status != 200 {
			return "", errors.New("failed to invoke organization chaincode: " + response.Message)
		}
	} else {
		if _, ok := auth.Authorized[requesterID]; !ok {
			return "", errors.New("no authorization found for user")
		}
		auth.Authorized[requesterID] = false

		// Invoca il chaincode del practitioner
		invokeArgs := [][]byte{[]byte("RevokeAccess"), []byte(patientID), []byte(requesterID)}
		response := ctx.GetStub().InvokeChaincode("practitioner", invokeArgs, "")
		if response.Status != 200 {
			return "", errors.New("failed to invoke practitioner chaincode: " + response.Message)
		}
	}

	updatedAuthBytes, err := json.Marshal(auth)
	if err != nil {
		return "", err
	}

	err = ctx.GetStub().PutState("auth_"+patientID, updatedAuthBytes)
	if err != nil {
		return "", err
	}

	log.Printf("Access revoked for patient %s from requester %s", patientID, requesterID)
	return `{"message": "Access revoked"}`, nil
}

func (c *PatientContract) IsAuthorized(ctx contractapi.TransactionContextInterface, patientID string, clientID string) (bool, error) {
	if clientID == patientID {
		return true, nil
	}

	authAsBytes, err := ctx.GetStub().GetState("auth_" + patientID)
	if err != nil {
		return false, errors.New("failed to get authorization data: " + err.Error())
	}
	if authAsBytes == nil {
		return false, nil
	}

	var auth Authorization
	err = json.Unmarshal(authAsBytes, &auth)
	if err != nil {
		return false, errors.New("failed to unmarshal authorization data: " + err.Error())
	}

	if authorized, ok := auth.Authorized[clientID]; ok && authorized {
		return true, nil
	}

	orgID, exists, err := ctx.GetClientIdentity().GetAttributeValue("org")
	if err != nil {
		return false, errors.New("failed to get organization ID attribute: " + err.Error())
	}
	if !exists {
		return false, errors.New("organization ID attribute does not exist")
	}

	if authorizedOrg, ok := auth.AuthorizedOrgs[orgID]; ok && authorizedOrg {
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
