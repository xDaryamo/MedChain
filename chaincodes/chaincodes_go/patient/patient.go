package main

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type PatientContract struct {
	contractapi.Contract
}

// CreatePatient adds a new patient record to the ledger
func (c *PatientContract) CreatePatient(ctx contractapi.TransactionContextInterface, patientID string, patientJSON string) error {
	// Check if patient exists before unmarshaling JSON to avoid unnecessary processing
	exists, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return errors.New("failed to get patient: " + err.Error())
	}
	if exists != nil {
		return errors.New("patient already exists: " + patientID)
	}

	var patient Patient
	err = json.Unmarshal([]byte(patientJSON), &patient)
	if err != nil {
		return errors.New("failed to unmarshal patient: " + err.Error())
	}

	patientJSONBytes, err := json.Marshal(patient)
	if err != nil {
		return errors.New("failed to marshal patient: " + err.Error())
	}

	// Save the new patient to the ledger
	return ctx.GetStub().PutState(patientID, patientJSONBytes)
}

// ReadPatient retrieves a patient record from the ledger
func (c *PatientContract) ReadPatient(ctx contractapi.TransactionContextInterface, patientID string) (*Patient, error) {
	patientJSON, err := ctx.GetStub().GetState(patientID)
	if err != nil {
		return nil, errors.New("failed to read patient: " + err.Error())
	}
	if patientJSON == nil {
		return nil, errors.New("patient does not exist: " + patientID)
	}

	var patient Patient
	err = json.Unmarshal(patientJSON, &patient)
	if err != nil {
		return nil, errors.New("failed to unmarshal patient: " + err.Error())
	}

	return &patient, nil
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

	var patient Patient
	if err := json.Unmarshal([]byte(patientJSON), &patient); err != nil {
		return errors.New("failed to unmarshal patient: " + err.Error())
	}

	if err := ctx.GetStub().PutState(patientID, []byte(patientJSON)); err != nil {
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

func main() {
	chaincode, err := contractapi.NewChaincode(new(PatientContract))
	if err != nil {
		log.Panic(errors.New("Error creating patient chaincode: " + err.Error()))
	}

	if err := chaincode.Start(); err != nil {
		log.Panic(errors.New("Error starting patient chaincode: " + err.Error()))
	}

}
