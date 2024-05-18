package main

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type PrescriptionChaincode struct {
	contractapi.Contract
}

func (t *PrescriptionChaincode) CreatePrescription(ctx contractapi.TransactionContextInterface, medicationRequestJSON string) error {
	var medicationRequest MedicationRequest
	err := json.Unmarshal([]byte(medicationRequestJSON), &medicationRequest)
	if err != nil {
		return errors.New("failed to decode JSON")
	}

	if medicationRequest.ID == nil || medicationRequest.ID.Value == "" {
		return errors.New("medication request ID is required")
	}

	exists, err := t.PrescriptionExists(ctx, medicationRequest.ID.Value)
	if err != nil {
		return err
	}
	if exists {
		return errors.New("the prescription already exists")
	}

	medicationRequestAsBytes, err := json.Marshal(medicationRequest)
	if err != nil {
		return errors.New("failed to marshal medication request")
	}

	return ctx.GetStub().PutState(medicationRequest.ID.Value, medicationRequestAsBytes)
}

func (t *PrescriptionChaincode) VerifyPrescription(ctx contractapi.TransactionContextInterface, prescriptionID string, pharmacyID string) error {
	prescriptionAsBytes, err := ctx.GetStub().GetState(prescriptionID)
	if err != nil {
		return errors.New("failed to read from world state")
	}
	if prescriptionAsBytes == nil {
		return errors.New("the prescription does not exist")
	}

	var prescription MedicationRequest
	err = json.Unmarshal(prescriptionAsBytes, &prescription)
	if err != nil {
		return errors.New("failed to unmarshal prescription")
	}

	if prescription.Status == nil || len(prescription.Status.Coding) == 0 || prescription.Status.Coding[0].Code != "active" {
		return errors.New("prescription is not active or no status code available")
	}

	prescription.Status.Coding[0].Code = "completed"
	prescription.DispenseRequest.Performer = &Reference{Reference: pharmacyID}
	updatedPrescriptionAsBytes, err := json.Marshal(prescription)
	if err != nil {
		return errors.New("failed to marshal updated prescription")
	}

	return ctx.GetStub().PutState(prescriptionID, updatedPrescriptionAsBytes)
}

func (t *PrescriptionChaincode) ReadPrescription(ctx contractapi.TransactionContextInterface, prescriptionID string) (string, error) {
	prescriptionAsBytes, err := ctx.GetStub().GetState(prescriptionID)
	if err != nil {
		return "", errors.New("failed to read from world state")
	}
	if prescriptionAsBytes == nil {
		return "", errors.New("the prescription does not exist")
	}

	return string(prescriptionAsBytes), nil
}

func (t *PrescriptionChaincode) PrescriptionExists(ctx contractapi.TransactionContextInterface, prescriptionID string) (bool, error) {
	prescriptionAsBytes, err := ctx.GetStub().GetState(prescriptionID)
	if err != nil {
		return false, errors.New("failed to read from world state")
	}
	return prescriptionAsBytes != nil, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(PrescriptionChaincode))
	if err != nil {
		log.Panic("Error creating prescription chaincode: ", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panic("Error starting prescription chaincode: ", err)
	}
}
