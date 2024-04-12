package records

import (
	"encoding/json"
	"errors"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/xDaryamo/Medchain/fhir"
)

// MedicalRecordsContract represents the contract for managing medical records on the blockchain
type MedicalRecordsContract struct {
	contractapi.Contract
}

// MedicalRecords represents the data structure for a medical record folder
type MedicalRecords struct {
	PatienID      string
	Allergies     []fhir.AllergyIntolerance
	Conditions    []fhir.Condition
	Prescriptions []fhir.MedicationStatement
	CarePlan      fhir.CarePlanActivity
	Request       fhir.MedicationRequest
}

// CreateMedicalRecords creates a new medical record folder for a patient
func (mc *MedicalRecordsContract) CreateMedicalRecords(ctx contractapi.TransactionContextInterface, patientID string, medicalRecordJSON string) error {
	// Deserialize JSON data into a Go data structure
	var medicalRecord MedicalRecords
	if err := json.Unmarshal([]byte(medicalRecordJSON), &medicalRecord); err != nil {
		return err
	}

	// Check if the medical record folder already exists
	existingRecord, err := mc.GetMedicalRecords(ctx, patientID)
	if err != nil {
		return err
	}
	if existingRecord != nil {
		return errors.New("medical records already exist for patient")
	}

	// Serialize the medical record folder and save it on the blockchain
	medicalRecordJSONBytes, err := json.Marshal(medicalRecord)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(patientID, medicalRecordJSONBytes)
}

// GetMedicalRecords retrieves a patient's medical record folder from the blockchain
func (mc *MedicalRecordsContract) GetMedicalRecords(ctx contractapi.TransactionContextInterface, patientID string) (*MedicalRecords, error) {
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
func (mc *MedicalRecordsContract) UpdateMedicalRecords(ctx contractapi.TransactionContextInterface, patientID string, updatedMedicalRecordJSON string) error {
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
func (mc *MedicalRecordsContract) DeleteMedicalRecords(ctx contractapi.TransactionContextInterface, patientID string) error {
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
