package patient

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/xDaryamo/MedChain/fhir"
)

type PatientContract struct {
	contractapi.Contract
}

// CreatePatient adds a new patient record to the ledger
func (c *PatientContract) CreatePatient(ctx contractapi.TransactionContextInterface, patientID string, patientJSON string) error {
	var patient fhir.Patient
	err := json.Unmarshal([]byte(patientJSON), &patient)
	if err != nil {
		return fmt.Errorf("failed to unmarshal patient: %v", err)
	}

	exists, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return fmt.Errorf("failed to get patient: %v", err)
	}
	if exists != nil {
		return fmt.Errorf("patient already exists: %s", patientID)
	}

	patientJSONBytes, err := json.Marshal(patient)
	if err != nil {
		return err
	}

	// Save the new patient to the ledger
	return ctx.GetStub().PutState(patientID, patientJSONBytes)
}

// ReadPatient retrieves a patient record from the ledger
func (c *PatientContract) ReadPatient(ctx contractapi.TransactionContextInterface, patientID string) (*fhir.Patient, error) {
	patientJSON, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return nil, fmt.Errorf("failed to read patient: %v", err)
	}
	if patientJSON == nil {
		return nil, fmt.Errorf("patient does not exist: %s", patientID)
	}

	var patient fhir.Patient
	err = json.Unmarshal(patientJSON, &patient)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal patient: %v", err)
	}

	return &patient, nil
}

// UpdatePatient updates an existing patient record in the ledger
func (c *PatientContract) UpdatePatient(ctx contractapi.TransactionContextInterface, patientID string, patientJSON string) error {
	exists, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return fmt.Errorf("failed to get patient: %v", err)
	}
	if exists == nil {
		return fmt.Errorf("patient does not exist: %s", patientID)
	}

	return ctx.GetStub().PutState(patientID, []byte(patientJSON))
}

// DeletePatient removes a patient record from the ledger
func (c *PatientContract) DeletePatient(ctx contractapi.TransactionContextInterface, patientID string) error {
	exists, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return fmt.Errorf("failed to get patient: %v", err)
	}
	if exists == nil {
		return fmt.Errorf("patient does not exist: %s", patientID)
	}

	// Remove the patient record
	return ctx.GetStub().DelState(patientID)
}
