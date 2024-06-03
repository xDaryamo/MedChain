package main

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// MedicalRecordsChaincode represents the Chaincode for managing medical records on the blockchain
type MedicalRecordsChaincode struct {
	contractapi.Contract
}

// MedicalRecords represents the data structure for a medical record folder
type MedicalRecords struct {
	RecordID       string               `json:"identifier,omitempty"`
	PatientID      string               `json:"patient,omitempty"`
	Allergies      []AllergyIntolerance `json:"allergies,omitempty"`
	Conditions     []Condition          `json:"conditions,omitempty"`
	Procedures     []Procedure          `json:"procedures,omitempty"`
	Prescriptions  []MedicationRequest  `json:"prescriptions,omitempty"`
	ServiceRequest *Reference           `json:"service,omitempty"`
	Attachments    []Attachment         `json:"attachments,omitempty"`
}

// CreateMedicalRecords creates a new medical record folder for a patient
func (mc *MedicalRecordsChaincode) CreateMedicalRecords(ctx contractapi.TransactionContextInterface, medicalRecordJSON string) (string, error) {
	var medicalRecord MedicalRecords
	err := json.Unmarshal([]byte(medicalRecordJSON), &medicalRecord)
	if err != nil {
		return `{"error": "failed to unmarshal medical record: ` + err.Error() + `"}`, err
	}

	if medicalRecord.RecordID == "" {
		return `{"error": "record ID is required"}`, errors.New("record ID is required")
	}

	existingRecord, err := ctx.GetStub().GetState(medicalRecord.RecordID)
	if err != nil {
		return `{"error": "failed to get medical record for patient ` + medicalRecord.PatientID + ` from world state: ` + err.Error() + `"}`, err
	}
	if existingRecord != nil {
		return `{"error": "medical records already exist for patient ` + medicalRecord.PatientID + `"}`, errors.New("medical records already exist")
	}

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return `{"error": "failed to get client ID attribute: ` + err.Error() + `"}`, err
	}
	if !exists {
		return `{"error": "client ID attribute does not exist"}`, errors.New("client ID attribute does not exist")
	}

	patientref := medicalRecord.PatientID
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return `{"error": "failed to invoke chaincode: ` + response.Message + `"}`, errors.New("failed to invoke chaincode: " + response.Message)
	}

	medicalRecordJSONBytes, err := json.Marshal(medicalRecord)
	if err != nil {
		return `{"error": "failed to marshal medical record: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(medicalRecord.RecordID, medicalRecordJSONBytes)
	if err != nil {
		return `{"error": "failed to put medical record in world state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Record created successfully"}`, nil
}

// ReadMedicalRecords retrieves a patient's medical record folder from the blockchain
func (mc *MedicalRecordsChaincode) ReadMedicalRecords(ctx contractapi.TransactionContextInterface, recordID string) (string, error) {
	recordJSON, err := ctx.GetStub().GetState(recordID)
	if err != nil {
		return `{"error": "failed to read medical record: ` + err.Error() + `"}`, err
	}
	if recordJSON == nil {
		return `{"error": "medical record does not exist: ` + recordID + `"}`, errors.New("medical record does not exist")
	}

	var record MedicalRecords
	err = json.Unmarshal(recordJSON, &record)
	if err != nil {
		return `{"error": "failed to unmarshal medical record: ` + err.Error() + `"}`, err
	}

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return `{"error": "failed to get client ID attribute: ` + err.Error() + `"}`, err
	}
	if !exists {
		return `{"error": "client ID attribute does not exist"}`, errors.New("client ID attribute does not exist")
	}

	patientref := record.PatientID
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return `{"error": "failed to invoke chaincode: ` + response.Message + `"}`, errors.New("failed to invoke chaincode: " + response.Message)
	}

	return string(recordJSON), nil
}

// UpdateMedicalRecords updates an existing medical record folder for a patient
func (mc *MedicalRecordsChaincode) UpdateMedicalRecords(ctx contractapi.TransactionContextInterface, recordID string, updatedMedicalRecordJSON string) (string, error) {
	existingRecord, err := ctx.GetStub().GetState(recordID)
	if err != nil {
		return `{"error": "failed to get record: ` + err.Error() + `"}`, err
	}
	if existingRecord == nil {
		return `{"error": "record does not exist: ` + recordID + `"}`, errors.New("record does not exist")
	}

	var record MedicalRecords
	err = json.Unmarshal(existingRecord, &record)
	if err != nil {
		return `{"error": "failed to unmarshal record: ` + err.Error() + `"}`, err
	}

	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return `{"error": "failed to get client ID: ` + err.Error() + `"}`, err
	}

	patientref := record.PatientID
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return `{"error": "failed to invoke chaincode: ` + response.Message + `"}`, errors.New("failed to invoke chaincode: " + response.Message)
	}

	var updatedRecord MedicalRecords
	if err := json.Unmarshal([]byte(updatedMedicalRecordJSON), &updatedRecord); err != nil {
		return `{"error": "failed to unmarshal record: ` + err.Error() + `"}`, err
	}

	updatedRecordJSONBytes, err := json.Marshal(updatedRecord)
	if err != nil {
		return `{"error": "failed to marshal record: ` + err.Error() + `"}`, err
	}

	if err := ctx.GetStub().PutState(updatedRecord.RecordID, updatedRecordJSONBytes); err != nil {
		return `{"error": "failed to put state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Record updated successfully"}`, nil
}

// DeleteMedicalRecords removes an existing medical record folder for a patient
func (mc *MedicalRecordsChaincode) DeleteMedicalRecords(ctx contractapi.TransactionContextInterface, recordID string) (string, error) {
	existingRecord, err := ctx.GetStub().GetState(recordID)
	if err != nil {
		return `{"error": "failed to get record: ` + err.Error() + `"}`, err
	}
	if existingRecord == nil {
		return `{"error": "record not found: ` + recordID + `"}`, errors.New("record not found")
	}

	var record MedicalRecords
	err = json.Unmarshal(existingRecord, &record)
	if err != nil {
		return `{"error": "failed to unmarshal record: ` + err.Error() + `"}`, err
	}

	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return `{"error": "failed to get client ID: ` + err.Error() + `"}`, err
	}

	patientref := record.PatientID
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return `{"error": "failed to invoke chaincode: ` + response.Message + `"}`, errors.New("failed to invoke chaincode: " + response.Message)
	}

	err = ctx.GetStub().DelState(recordID)
	if err != nil {
		return `{"error": "failed to delete record: ` + err.Error() + `"}`, err
	}

	return `{"message": "Record deleted successfully"}`, nil
}

// SearchMedicalRecords executes a CouchDB query and returns the results as a JSON string
func (mc *MedicalRecordsChaincode) SearchMedicalRecords(ctx contractapi.TransactionContextInterface, queryString string) (string, error) {
	// Execute the query
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return `{"error": "failed to execute query: ` + err.Error() + `"}`, err
	}
	defer resultsIterator.Close()

	var medicalRecords []MedicalRecords

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return `{"error": "failed to iterate query results: ` + err.Error() + `"}`, err
		}

		var medicalRecord MedicalRecords
		err = json.Unmarshal(queryResponse.Value, &medicalRecord)
		if err != nil {
			return `{"error": "failed to unmarshal query response: ` + err.Error() + `"}`, err
		}

		// Get the client ID
		clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
		if err != nil {
			return `{"error": "failed to get client ID attribute: ` + err.Error() + `"}`, err
		}
		if !exists {
			return `{"error": "client ID attribute does not exist"}`, errors.New("client ID attribute does not exist")
		}

		// Perform the authorization check by invoking the patient chaincode
		chaincodeName := "patient"
		functionName := "IsAuthorized"
		invokeArgs := [][]byte{[]byte(functionName), []byte(medicalRecord.PatientID), []byte(clientID)}

		response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
		if response.Status != 200 {
			return `{"error": "failed to invoke chaincode: ` + response.Message + `"}`, errors.New("failed to invoke chaincode: " + response.Message)
		}

		medicalRecords = append(medicalRecords, medicalRecord)
	}

	resultsJSON, err := json.Marshal(medicalRecords)
	if err != nil {
		return `{"error": "failed to encode results to JSON: ` + err.Error() + `"}`, err
	}

	return string(resultsJSON), nil
}


func main() {
	chaincode, err := contractapi.NewChaincode(new(MedicalRecordsChaincode))
	if err != nil {
		log.Panic(errors.New("Error creating medical records chaincode: " + err.Error()))
	}

	if err := chaincode.Start(); err != nil {
		log.Panic(errors.New("Error starting medical records chaincode: " + err.Error()))
	}
}
