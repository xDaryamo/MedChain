package main

import (
	"encoding/json"
	"errors"
	"log"
	"strings"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// MedicalRecordsChaincode represents the Chaincode for managing medical records on the blockchain
type MedicalRecordsChaincode struct {
	contractapi.Contract
}

// MedicalRecords represents the data structure for a medical record folder
type MedicalRecords struct {
	RecordID       string
	PatienID       string
	Allergies      []AllergyIntolerance
	Conditions     []Condition
	Procedures     []Procedure
	Prescriptions  []MedicationRequest
	ServiceRequest *Reference
}

// CreateMedicalRecords creates a new medical record folder for a patient
func (mc *MedicalRecordsChaincode) CreateMedicalRecords(ctx contractapi.TransactionContextInterface, medicalRecordJSON string) error {

	log.Printf("Medical record JSON from param: %s", string(medicalRecordJSON))

	// Deserialize JSON data into a Go data structure
	var medicalRecord MedicalRecords
	err := json.Unmarshal([]byte(medicalRecordJSON), &medicalRecord)

	if err != nil {
		return errors.New("failed to unmarshal medical record: " + err.Error())
	}

	log.Printf("Medical record struct unmarshalled: %+v", medicalRecord)

	if medicalRecord.RecordID == "" {
		return errors.New("record ID is required")
	}

	// Check if the medical record folder already exists
	existingRecord, err := ctx.GetStub().GetState(medicalRecord.RecordID)
	if err != nil {
		return errors.New("failed to get medical record for patient " + medicalRecord.PatienID + " from wolrd state")
	}
	if existingRecord != nil {
		return errors.New("medical records already exist for patient " + medicalRecord.PatienID)
	}

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return errors.New("failed to get client ID attribute: " + err.Error())
	}
	if !exists {
		return errors.New("client ID attribute does not exist")
	}

	patientref := medicalRecord.PatienID
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	// Serialize the medical record folder and save it on the blockchain
	medicalRecordJSONBytes, err := json.Marshal(medicalRecord)
	if err != nil {
		return errors.New("failed to marshal practitioner: " + err.Error())
	}

	log.Printf("Medical record for patient with ID: %s created successfully", medicalRecord.PatienID)
	log.Printf("Serialized Medical record JSON: %s", string(medicalRecordJSON))

	return ctx.GetStub().PutState(medicalRecord.RecordID, medicalRecordJSONBytes)
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

	patientref := record.PatienID
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
func (mc *MedicalRecordsChaincode) UpdateMedicalRecords(ctx contractapi.TransactionContextInterface, recordID string, updatedMedicalRecordJSON string) error {
	// Retrieve the existing Encounter record
	existingRecord, err := ctx.GetStub().GetState(recordID)
	if err != nil {
		return errors.New("failed to get record: " + err.Error())
	}
	if existingRecord == nil {
		return errors.New("record does not exist: " + recordID)
	}

	// Deserialize the Encounter record
	var record MedicalRecords
	err = json.Unmarshal(existingRecord, &record)
	if err != nil {
		return errors.New("failed to unmarshal record: " + err.Error())
	}

	// Ottieni l'ID del client che effettua la richiesta
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return errors.New("failed to get client ID")
	}

	patientref := record.PatienID
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	// Deserialize the updated JSON data into a Go data structure
	var updatedRecord MedicalRecords
	if err := json.Unmarshal([]byte(updatedMedicalRecordJSON), &updatedRecord); err != nil {
		return errors.New("failed to unmarshal record: " + err.Error())
	}

	// Serialize the updated Encounter record and save it on the blockchain
	updatedRecordJSONBytes, err := json.Marshal(existingRecord)
	if err != nil {
		return errors.New("failed to marshal encounter: " + err.Error())
	}

	if err := ctx.GetStub().PutState(updatedRecord.RecordID, updatedRecordJSONBytes); err != nil {
		return errors.New("failed to put state: " + err.Error())
	}

	return nil
}

// DeleteMedicalRecords removes an existing medical record folder for a patient
func (mc *MedicalRecordsChaincode) DeleteMedicalRecords(ctx contractapi.TransactionContextInterface, recordID string) error {
	// Check if the Encounter record exists
	existingRecord, err := ctx.GetStub().GetState(recordID)
	if err != nil {
		return err
	}
	if existingRecord == nil {
		return errors.New("medical record not found")
	}

	// Deserialize the Encounter record
	var record MedicalRecords
	err = json.Unmarshal(existingRecord, &record)
	if err != nil {
		return errors.New("failed to unmarshal record: " + err.Error())
	}

	// Ottieni l'ID del client che effettua la richiesta
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return errors.New("failed to get client ID")
	}

	patientref := record.PatienID
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	// Remove the Medical record from the blockchain
	return ctx.GetStub().DelState(recordID)
}

func (mc *MedicalRecordsChaincode) SearchMedicalRecords(ctx contractapi.TransactionContextInterface, query string) ([]string, error) {
	var results []string

	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return results, errors.New("failed to get client ID")
	}

	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(query), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return results, errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", query)

	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer iterator.Close()

	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return nil, err
		}
		var medicalRecord MedicalRecords
		err = json.Unmarshal(result.Value, &medicalRecord)
		if err != nil {
			return nil, err
		}

		if strings.Compare(medicalRecord.PatienID, query) == 0 {
			recordJSON, err := json.Marshal(medicalRecord)
			if err != nil {
				return nil, err
			}
			results = append(results, string(recordJSON))
			break
		}

	}

	return results, nil
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
