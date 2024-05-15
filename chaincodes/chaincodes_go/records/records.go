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
	PatienID      string
	Allergies     []AllergyIntolerance
	Conditions    []Condition
	Prescriptions []MedicationStatement
	CarePlan      CarePlanActivity
	Request       MedicationRequest
}

// CreateMedicalRecords creates a new medical record folder for a patient
func (mc *MedicalRecordsChaincode) CreateMedicalRecords(ctx contractapi.TransactionContextInterface, patientID string, medicalRecordJSON string) error {
	// Deserialize JSON data into a Go data structure
	var medicalRecord MedicalRecords
	if err := json.Unmarshal([]byte(medicalRecordJSON), &medicalRecord); err != nil {
		return errors.New("failed to unmarshal medical record: " + err.Error())
	}

	// Check if the medical record folder already exists
	existingRecord, err := mc.GetMedicalRecords(ctx, patientID)
	if err != nil {
		return errors.New("failed to get medical record for patient " + patientID + " from wolrd state")
	}
	if existingRecord != nil {
		return errors.New("medical records already exist for patient " + patientID)
	}

	// Serialize the medical record folder and save it on the blockchain
	medicalRecordJSONBytes, err := json.Marshal(medicalRecord)
	if err != nil {
		return errors.New("failed to marshal practitioner: " + err.Error())
	}
	return ctx.GetStub().PutState(patientID, medicalRecordJSONBytes)
}

// GetMedicalRecords retrieves a patient's medical record folder from the blockchain
func (mc *MedicalRecordsChaincode) GetMedicalRecords(ctx contractapi.TransactionContextInterface, patientID string) (*MedicalRecords, error) {
	// Retrieve the medical record folder from the blockchain
	medicalRecordJSON, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return nil, err
	}
	if medicalRecordJSON == nil {
		return nil, nil
	}

	// Deserialize the medical record folder
	var medicalRecord MedicalRecords
	err = json.Unmarshal(medicalRecordJSON, &medicalRecord)
	if err != nil {
		return nil, err
	}

	return &medicalRecord, nil
}

// UpdateMedicalRecords updates an existing medical record folder for a patient
func (mc *MedicalRecordsChaincode) UpdateMedicalRecords(ctx contractapi.TransactionContextInterface, patientID string, updatedMedicalRecordJSON string) error {
	// Retrieve the existing medical record folder
	existingRecord, err := mc.GetMedicalRecords(ctx, patientID)
	if err != nil {
		return err
	}
	if existingRecord == nil {
		return errors.New("medical records not found for patient")
	}

	// Deserialize the updated JSON data into a Go data structure
	var updatedMedicalRecord MedicalRecords
	if err := json.Unmarshal([]byte(updatedMedicalRecordJSON), &updatedMedicalRecord); err != nil {
		return err
	}

	// Update the existing medical record folder with the new data
	existingRecord.Allergies = updatedMedicalRecord.Allergies
	existingRecord.Conditions = updatedMedicalRecord.Conditions
	existingRecord.Prescriptions = updatedMedicalRecord.Prescriptions
	existingRecord.CarePlan = updatedMedicalRecord.CarePlan
	existingRecord.Request = updatedMedicalRecord.Request

	// Serialize the updated medical record folder and save it on the blockchain
	updatedMedicalRecordJSONBytes, err := json.Marshal(existingRecord)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(patientID, updatedMedicalRecordJSONBytes)
}

// DeleteMedicalRecords removes an existing medical record folder for a patient
func (mc *MedicalRecordsChaincode) DeleteMedicalRecords(ctx contractapi.TransactionContextInterface, patientID string) error {
	// Check if the medical record folder for the patient exists
	existingRecord, err := mc.GetMedicalRecords(ctx, patientID)
	if err != nil {
		return err
	}
	if existingRecord == nil {
		return errors.New("medical records not found for patient")
	}

	// Remove the medical record folder from the blockchain
	return ctx.GetStub().DelState(patientID)
}

func (mc *MedicalRecordsChaincode) SearchMedicalRecords(ctx contractapi.TransactionContextInterface, query string) ([]*MedicalRecords, error) {
	var results []*MedicalRecords

	// Retrieve all medical records stored on the blockchain
	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer iterator.Close()

	// Iterate through all records and filter those that match the query
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

		// Check if any condition matches the query
		for _, condition := range medicalRecord.Conditions {
			if strings.Contains(condition.ID.Value, query) {

				results = append(results, &medicalRecord)
				break
			}
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
