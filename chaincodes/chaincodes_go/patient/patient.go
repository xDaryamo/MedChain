package main

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/hyperledger/fabric-protos-go/peer"
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
	// Deserialize JSON data into a Go data structure
	log.Printf("Received patient: " + patientJSON)
	var patient Patient
	err := json.Unmarshal([]byte(patientJSON), &patient)
	if err != nil {
		return `{"error": "failed to unmarshal patient: ` + err.Error() + `"}`, err
	}
	log.Printf("Unmarshalled patient: %+v", patient)


	// Check if the patient request ID is provided and if it already exists
	if patient.ID.Value == "" {
		return `{"error": "patient request ID is required"}`, errors.New("patient request ID is required")
	}

	existingPatient, err := ctx.GetStub().GetState(patient.ID.Value)
	if err != nil {
		return `{"error": "failed to get patient: ` + err.Error() + `"}`, err
	}
	if existingPatient != nil {
		return `{"error": "patient already exists: ` + patient.ID.Value + `"}`, errors.New("patient already exists")
	}

	// Serialize the patient and save it on the blockchain
	patientJSONBytes, err := json.Marshal(patient)
	if err != nil {
		return `{"error": "failed to marshal patient: ` + err.Error() + `"}`, err
	}

	// Save the new patient to the ledger
	err = ctx.GetStub().PutState(patient.ID.Value, patientJSONBytes)
	if err != nil {
		return `{"error": "failed to put state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Patient created successfully"}`, nil
}

func (c *PatientContract) ReadPatient(ctx contractapi.TransactionContextInterface, patientID string) (string, error) {
	patientJSON, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return `{"error": "failed to read patient: ` + err.Error() + `"}`, err
	}
	if patientJSON == nil {
		return `{"error": "patient does not exist: ` + patientID + `"}`, errors.New("patient does not exist")
	}


	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return `{"error": "failed to get client ID attribute: ` + err.Error() + `"}`, err
	}
	if !exists {
		return `{"error": "client ID attribute does not exist"}`, errors.New("client ID attribute does not exist")
	}

	authorized, err := c.IsAuthorized(ctx, patientID, clientID)
	if err != nil {
		return `{"error": "` + err.Error() + `"}`, err
	}
	if authorized {
		return string(patientJSON), nil
	} else {
		return `{"error": "unauthorized access: client is neither the patient nor an authorized entity"}`, errors.New("unauthorized access: client is neither the patient nor an authorized entity")
	}
}

// UpdatePatient updates an existing patient record in the ledger
func (c *PatientContract) UpdatePatient(ctx contractapi.TransactionContextInterface, patientJSON string) (string, error) {
	var patient Patient
	if err := json.Unmarshal([]byte(patientJSON), &patient); err != nil {
		return `{"error": "failed to unmarshal patient: ` + err.Error() + `"}`, err
	}

	patientID := patient.ID.Value
	if patientID == "" {
		return `{"error": "patient ID is required in the JSON"}`, errors.New("patient ID is required in the JSON")
	}

	exists, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return `{"error": "failed to get patient: ` + err.Error() + `"}`, err
	}
	if exists == nil {
		return `{"error": "patient does not exist: ` + patientID + `"}`, errors.New("patient does not exist: " + patientID)
	}

	clientID, existsAttr, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return `{"error": "failed to get client ID attribute: ` + err.Error() + `"}`, err
	}
	if !existsAttr {
		return `{"error": "client ID attribute does not exist"}`, errors.New("client ID attribute does not exist")
	}

	authorized, err := c.IsAuthorized(ctx, patientID, clientID)
	if err != nil {
		return `{"error": "` + err.Error() + `"}`, err
	}
	if !authorized {
		return `{"error": "unauthorized to update patient records"}`, errors.New("unauthorized to update patient records")
	}

	patientJSONBytes, err := json.Marshal(patient)
	if err != nil {
		return `{"error": "failed to marshal patient: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(patientID, patientJSONBytes)
	if err != nil {
		return `{"error": "failed to put state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Patient updated successfully"}`, nil
}

// DeletePatient removes a patient record from the ledger
func (c *PatientContract) DeletePatient(ctx contractapi.TransactionContextInterface, patientID string) (string, error) {
	exists, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return `{"error": "failed to get patient: ` + err.Error() + `"}`, err
	}
	if exists == nil {
		return `{"error": "patient does not exist: ` + patientID + `"}`, errors.New("patient does not exist: " + patientID)
	}

	err = ctx.GetStub().DelState(patientID)
	if err != nil {
		return `{"error": "failed to delete patient: ` + err.Error() + `"}`, err
	}
	return `{"message": "Patient deleted successfully"}`, nil
}

/*
================================
	AUTHORIZATION OPERATIONS
================================
*/

func (c *PatientContract) RequestAccess(ctx contractapi.TransactionContextInterface, patientID string, requesterID string, isOrg bool) (string, error) {
	// Check if the patient exists
	existingPatient, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return `{"error": "failed to get patient: ` + err.Error() + `"}`, err
	}
	if existingPatient == nil {
		return `{"error": "patient does not exist: ` + patientID + `"}`, errors.New("patient does not exist: " + patientID)
	}

	authAsBytes, err := ctx.GetStub().GetState("auth_" + patientID)
	if err != nil {
		return `{"error": "failed to get authorization data: ` + err.Error() + `"}`, err
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
		return `{"error": "failed to marshal authorization data: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState("auth_"+patientID, updatedAuthBytes)
	if err != nil {
		return `{"error": "failed to put authorization data: ` + err.Error() + `"}`, err
	}

	return `{"message": "Access request recorded"}`, nil
}

// Funzione GrantAccess aggiornata
func (c *PatientContract) GrantAccess(ctx contractapi.TransactionContextInterface, patientID string, requesterID string, isOrg bool) (string, error) {
	// Check if the requester exists (organization or practitioner)
	var invokeArgs [][]byte
	if isOrg {
		invokeArgs = [][]byte{[]byte("CheckOrganizationExists"), []byte(requesterID)}
	} else {
		invokeArgs = [][]byte{[]byte("CheckPractitionerExists"), []byte(requesterID)}
	}

	var response peer.Response
	if isOrg {
		response = ctx.GetStub().InvokeChaincode("organization", invokeArgs, "")
	} else {
		response = ctx.GetStub().InvokeChaincode("practitioner", invokeArgs, "")
	}

	if response.Status != 200 {
		return `{"error": "failed to invoke chaincode: ` + response.Message + `"}`, errors.New("failed to invoke chaincode: " + response.Message)
	}

	authAsBytes, err := ctx.GetStub().GetState("auth_" + patientID)
	if err != nil {
		return `{"error": "failed to get authorization data: ` + err.Error() + `"}`, err
	}
	if authAsBytes == nil {
		return `{"error": "no authorization record found"}`, errors.New("no authorization record found")
	}

	var auth Authorization
	err = json.Unmarshal(authAsBytes, &auth)
	if err != nil {
		return `{"error": "failed to unmarshal authorization data: ` + err.Error() + `"}`, err
	}

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return `{"error": "failed to get client ID attribute: ` + err.Error() + `"}`, err
	}
	if !exists {
		return `{"error": "client ID attribute does not exist"}`, errors.New("client ID attribute does not exist")
	}

	if clientID != patientID {
		return `{"error": "only the patient can grant access"}`, errors.New("only the patient can grant access")
	}

	if isOrg {
		if _, ok := auth.AuthorizedOrgs[requesterID]; !ok {
			return `{"error": "no access request found for organization"}`, errors.New("no access request found for organization")
		}
		auth.AuthorizedOrgs[requesterID] = true
		invokeArgs := [][]byte{[]byte("GrantAccess"), []byte(patientID), []byte(requesterID)}
		response := ctx.GetStub().InvokeChaincode("organization", invokeArgs, "")
		if response.Status != 200 {
			return `{"error": "failed to invoke organization chaincode: ` + response.Message + `"}`, errors.New("failed to invoke organization chaincode: " + response.Message)
		}
	} else {
		if _, ok := auth.Authorized[requesterID]; !ok {
			return `{"error": "no access request found for requester"}`, errors.New("no access request found for requester")
		}
		auth.Authorized[requesterID] = true
		invokeArgs := [][]byte{[]byte("GrantAccess"), []byte(patientID), []byte(requesterID)}
		response := ctx.GetStub().InvokeChaincode("practitioner", invokeArgs, "")
		if response.Status != 200 {
			return `{"error": "failed to invoke practitioner chaincode: ` + response.Message + `"}`, errors.New("failed to invoke practitioner chaincode: " + response.Message)
		}
	}

	updatedAuthBytes, err := json.Marshal(auth)
	if err != nil {
		return `{"error": "failed to marshal authorization data: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState("auth_"+patientID, updatedAuthBytes)
	if err != nil {
		return `{"error": "failed to put authorization data: ` + err.Error() + `"}`, err
	}
	return `{"message": "Access granted"}`, nil
}

// Funzione RevokeAccess aggiornata
func (c *PatientContract) RevokeAccess(ctx contractapi.TransactionContextInterface, patientID string, requesterID string, isOrg bool) (string, error) {
	// Check if the requester exists (organization or practitioner)
	var invokeArgs [][]byte
	if isOrg {
		invokeArgs = [][]byte{[]byte("CheckOrganizationExists"), []byte(requesterID)}
	} else {
		invokeArgs = [][]byte{[]byte("CheckPractitionerExists"), []byte(requesterID)}
	}

	var response peer.Response
	if isOrg {
		response = ctx.GetStub().InvokeChaincode("organization", invokeArgs, "")
	} else {
		response = ctx.GetStub().InvokeChaincode("practitioner", invokeArgs, "")
	}

	if response.Status != 200 {
		return `{"error": "failed to invoke chaincode: ` + response.Message + `"}`, errors.New("failed to invoke chaincode: " + response.Message)
	}

	authAsBytes, err := ctx.GetStub().GetState("auth_" + patientID)
	if err != nil {
		return `{"error": "failed to get authorization data: ` + err.Error() + `"}`, err
	}
	if authAsBytes == nil {
		return `{"error": "no authorization record found"}`, errors.New("no authorization record found")
	}

	var auth Authorization
	err = json.Unmarshal(authAsBytes, &auth)
	if err != nil {
		return `{"error": "failed to unmarshal authorization data: ` + err.Error() + `"}`, err
	}

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return `{"error": "failed to get client ID attribute: ` + err.Error() + `"}`, err
	}
	if !exists {
		return `{"error": "client ID attribute does not exist"}`, errors.New("client ID attribute does not exist")
	}

	if clientID != patientID {
		return `{"error": "only the patient can revoke access"}`, errors.New("only the patient can revoke access")
	}

	if isOrg {
		if _, ok := auth.AuthorizedOrgs[requesterID]; !ok {
			return `{"error": "no authorization found for organization"}`, errors.New("no authorization found for organization")
		}
		auth.AuthorizedOrgs[requesterID] = false
		invokeArgs := [][]byte{[]byte("RevokeAccess"), []byte(patientID), []byte(requesterID)}
		response := ctx.GetStub().InvokeChaincode("organization", invokeArgs, "")
		if response.Status != 200 {
			return `{"error": "failed to invoke organization chaincode: ` + response.Message + `"}`, errors.New("failed to invoke organization chaincode: " + response.Message)
		}
	} else {
		if _, ok := auth.Authorized[requesterID]; !ok {
			return `{"error": "no authorization found for user"}`, errors.New("no authorization found for user")
		}
		auth.Authorized[requesterID] = false
		invokeArgs := [][]byte{[]byte("RevokeAccess"), []byte(patientID), []byte(requesterID)}
		response := ctx.GetStub().InvokeChaincode("practitioner", invokeArgs, "")
		if response.Status != 200 {
			return `{"error": "failed to invoke practitioner chaincode: ` + response.Message + `"}`, errors.New("failed to invoke practitioner chaincode: " + response.Message)
		}
	}

	updatedAuthBytes, err := json.Marshal(auth)
	if err != nil {
		return `{"error": "failed to marshal authorization data: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState("auth_"+patientID, updatedAuthBytes)
	if err != nil {
		return `{"error": "failed to put authorization data: ` + err.Error() + `"}`, err
	}

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

// SearchPatients allows searching for patients based on a query string
func (c *PatientContract) SearchPatients(ctx contractapi.TransactionContextInterface, queryString string) (string, error) {
	log.Printf("Executing query: %s", queryString)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return `{"error": "failed to execute query: ` + err.Error() + `"}`, err
	}
	defer resultsIterator.Close()

	var patients []Patient
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return `{"error": "failed to iterate query results: ` + err.Error() + `"}`, err
		}

		var patient Patient
		err = json.Unmarshal(queryResponse.Value, &patient)
		if err != nil {
			return `{"error": "failed to unmarshal query response: ` + err.Error() + `"}`, err
		}
		patients = append(patients, patient)
	}

	resultsJSON, err := json.Marshal(patients)
	if err != nil {
		return `{"error": "failed to encode results to JSON: ` + err.Error() + `"}`, err
	}

	return string(resultsJSON), nil
}

// GetAccessRequests returns the list of access requests for a given patient
func (c *PatientContract) GetAccessRequests(ctx contractapi.TransactionContextInterface, patientID string) (string, error) {
	authAsBytes, err := ctx.GetStub().GetState("auth_" + patientID)
	if err != nil {
		return `{"error": "failed to get authorization data: ` + err.Error() + `"}`, err
	}
	if authAsBytes == nil {
		return `{"error": "no authorization record found for patient: ` + patientID + `"}`, errors.New("no authorization record found for patient: " + patientID)
	}

	var auth Authorization
	err = json.Unmarshal(authAsBytes, &auth)
	if err != nil {
		return `{"error": "failed to unmarshal authorization data: ` + err.Error() + `"}`, err
	}

	requests := make(map[string]interface{})
	requests["Authorized"] = auth.Authorized
	requests["AuthorizedOrgs"] = auth.AuthorizedOrgs

	requestsJSON, err := json.Marshal(requests)
	if err != nil {
		return `{"error": "failed to marshal requests to JSON: ` + err.Error() + `"}`, err
	}

	return string(requestsJSON), nil
}


// DeletePendingRequest deletes a pending authorization request for a patient
func (c *PatientContract) DeletePendingRequest(ctx contractapi.TransactionContextInterface, patientID string, requesterID string, isOrg bool) (string, error) {
	authAsBytes, err := ctx.GetStub().GetState("auth_" + patientID)
	if err != nil {
		return `{"error": "failed to get authorization data: ` + err.Error() + `"}`, err
	}
	if authAsBytes == nil {
		return `{"error": "no authorization record found for patient: ` + patientID + `"}`, errors.New("no authorization record found for patient: " + patientID)
	}

	var auth Authorization
	err = json.Unmarshal(authAsBytes, &auth)
	if err != nil {
		return `{"error": "failed to unmarshal authorization data: ` + err.Error() + `"}`, err
	}

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return `{"error": "failed to get client ID attribute: ` + err.Error() + `"}`, err
	}
	if !exists {
		return `{"error": "client ID attribute does not exist"}`, errors.New("client ID attribute does not exist")
	}

	if clientID != patientID {
		return `{"error": "only the patient can delete pending requests"}`, errors.New("only the patient can delete pending requests")
	}

	if isOrg {
		if _, ok := auth.AuthorizedOrgs[requesterID]; ok {
			delete(auth.AuthorizedOrgs, requesterID)
		} else {
			return `{"error": "no pending request found for organization"}`, errors.New("no pending request found for organization")
		}
	} else {
		if _, ok := auth.Authorized[requesterID]; ok {
			delete(auth.Authorized, requesterID)
		} else {
			return `{"error": "no pending request found for user"}`, errors.New("no pending request found for user")
		}
	}

	updatedAuthBytes, err := json.Marshal(auth)
	if err != nil {
		return `{"error": "failed to marshal authorization data: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState("auth_"+patientID, updatedAuthBytes)
	if err != nil {
		return `{"error": "failed to put authorization data: ` + err.Error() + `"}`, err
	}

	return `{"message": "Pending request deleted successfully"}`, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(PatientContract))
	if err != nil {
		log.Panic("Error creating patient chaincode: ", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panic("Error starting patient chaincode: ", err)
	}
}
