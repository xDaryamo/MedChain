package main

import (
	"encoding/json"
	"errors"
	"fmt"
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

	log.Printf("Medical record JSON from param: %s", string(medicalRecordJSON))

	// Deserialize JSON data into a Go data structure
	var medicalRecord MedicalRecords
	err := json.Unmarshal([]byte(medicalRecordJSON), &medicalRecord)

	if err != nil {
		return "", errors.New("failed to unmarshal medical record: " + err.Error())
	}

	log.Printf("Medical record struct unmarshalled: %+v", medicalRecord)

	if medicalRecord.RecordID == "" {
		return "", errors.New("record ID is required")
	}

	// Check if the medical record folder already exists
	existingRecord, err := ctx.GetStub().GetState(medicalRecord.RecordID)
	if err != nil {
		return "", errors.New("failed to get medical record for patient " + medicalRecord.PatientID + " from wolrd state")
	}
	if existingRecord != nil {
		return "", errors.New("medical records already exist for patient " + medicalRecord.PatientID)
	}

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return "", errors.New("failed to get client ID attribute: " + err.Error())
	}
	if !exists {
		return "", errors.New("client ID attribute does not exist")
	}

	patientref := medicalRecord.PatientID
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return "", errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	medicalRecordJSONBytes, err := json.Marshal(medicalRecord)
	if err != nil {
		return "", errors.New("failed to marshal practitioner: " + err.Error())
	}

	log.Printf("Medical record for patient with ID: %s created successfully", medicalRecord.PatientID)
	log.Printf("Serialized Medical record JSON: %s", string(medicalRecordJSON))
	err = ctx.GetStub().PutState(medicalRecord.RecordID, medicalRecordJSONBytes)

	if err != nil {
		return "", errors.New("failed to put medical record in world state: " + err.Error())
	}

	log.Printf("Record with ID: %s created successfully", medicalRecord.RecordID)

	return `{"message": "Record created successfully"}`, nil
}

// GetMedicalRecords retrieves a patient's medical record folder from the blockchain
func (mc *MedicalRecordsChaincode) ReadMedicalRecords(ctx contractapi.TransactionContextInterface, recordID string) (string, error) {
	// Retrieve the Medical record from the blockchain
	recordJSON, err := ctx.GetStub().GetState(recordID)
	if err != nil {
		return "", errors.New("failed to read medical record: " + err.Error())
	}
	if recordJSON == nil {
		return "", errors.New("medical record does: " + recordID)
	}

	log.Printf("Medical record JSON from ledger: %s", string(recordJSON))

	// Deserialize the Encounter record
	var record MedicalRecords
	err = json.Unmarshal(recordJSON, &record)
	if err != nil {
		return "", errors.New("failed to unmarshal medical record: " + err.Error())
	}

	log.Printf("Medical record object: %+v", record)

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return "", errors.New("failed to get client ID attribute: " + err.Error())
	}
	if !exists {
		return "", errors.New("client ID attribute does not exist")
	}

	patientref := record.PatientID
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return "", errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	return string(recordJSON), nil
}

// UpdateMedicalRecords updates an existing medical record folder for a patient
func (mc *MedicalRecordsChaincode) UpdateMedicalRecords(ctx contractapi.TransactionContextInterface, recordID string, updatedMedicalRecordJSON string) (string, error) {
	// Retrieve the existing Encounter record
	existingRecord, err := ctx.GetStub().GetState(recordID)
	if err != nil {
		return "", errors.New("failed to get record: " + err.Error())
	}
	if existingRecord == nil {
		return "", errors.New("record does not exist: " + recordID)
	}

	// Deserialize the Encounter record
	var record MedicalRecords
	err = json.Unmarshal(existingRecord, &record)
	if err != nil {
		return "", errors.New("failed to unmarshal record: " + err.Error())
	}

	// Ottieni l'ID del client che effettua la richiesta
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return "", errors.New("failed to get client ID")
	}

	patientref := record.PatientID
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return "", errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	// Deserialize the updated JSON data into a Go data structure
	var updatedRecord MedicalRecords
	if err := json.Unmarshal([]byte(updatedMedicalRecordJSON), &updatedRecord); err != nil {
		return "", errors.New("failed to unmarshal record: " + err.Error())
	}

	// Serialize the updated record and save it on the blockchain
	updatedRecordJSONBytes, err := json.Marshal(existingRecord)
	if err != nil {
		return "", errors.New("failed to marshal encounter: " + err.Error())
	}

	if err := ctx.GetStub().PutState(updatedRecord.RecordID, updatedRecordJSONBytes); err != nil {
		return "", errors.New("failed to put state: " + err.Error())
	}

	return `{"message": "Record updated successfully"}`, nil
}

// DeleteMedicalRecords removes an existing medical record folder for a patient
func (mc *MedicalRecordsChaincode) DeleteMedicalRecords(ctx contractapi.TransactionContextInterface, recordID string) (string, error) {
	// Check if the Encounter record exists
	existingRecord, err := ctx.GetStub().GetState(recordID)
	if err != nil {
		return "", errors.New("failed to get record: " + err.Error())
	}
	if existingRecord == nil {
		return "", errors.New("record not found: " + recordID)
	}

	// Deserialize the Encounter record
	var record MedicalRecords
	err = json.Unmarshal(existingRecord, &record)
	if err != nil {
		return "", errors.New("failed to unmarshal record: " + err.Error())
	}

	// Ottieni l'ID del client che effettua la richiesta
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return "", errors.New("failed to get client ID")
	}

	patientref := record.PatientID
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return "", errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	err = ctx.GetStub().DelState(recordID)

	if err != nil {
		return "", errors.New("failed to delete record: " + err.Error())
	}

	return `{"message": "Record deleted successfully"}`, nil
}

// SearchMedicalRecordsByPatientID allows searching for medical records based on the patient ID
func (mc *MedicalRecordsChaincode) SearchMedicalRecordsByPatientID(ctx contractapi.TransactionContextInterface, patientID string) ([]string, error) {
	queryString := fmt.Sprintf(`{"selector":{"patientID":"%s"}}`, patientID)
	return mc.QueryMedicalRecords(ctx, queryString)
}

// queryMedicalRecords executes a CouchDB query and returns the results as a JSON string
func (mc *MedicalRecordsChaincode) QueryMedicalRecords(ctx contractapi.TransactionContextInterface, queryString string) ([]string, error) {
	var medicalRecords []string
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return medicalRecords, err
	}
	defer resultsIterator.Close()

	// Get the client ID
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return medicalRecords, errors.New("failed to get client ID: " + err.Error())
	}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return medicalRecords, err
		}

		var medicalRecord MedicalRecords
		err = json.Unmarshal(queryResponse.Value, &medicalRecord)
		if err != nil {
			return medicalRecords, err
		}

		// Perform the authorization check by invoking the patient chaincode
		chaincodeName := "patient"
		functionName := "IsAuthorized"
		invokeArgs := [][]byte{[]byte(functionName), []byte(medicalRecord.PatientID), []byte(clientID)}

		response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
		if response.Status != 200 {
			return medicalRecords, errors.New("failed to invoke chaincode: " + response.Message)
		}

		log.Printf("Client ID: %s", clientID)
		log.Printf("Patient ID: %s", medicalRecord.PatientID)

		medicalRecordJSON, err := json.Marshal(medicalRecord)
		if err != nil {
			return medicalRecords, err
		}

		medicalRecords = append(medicalRecords, string(medicalRecordJSON))
	}

	return medicalRecords, nil
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
