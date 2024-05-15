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

// CreateMedicationRequest creates a new medication request on the blockchain
func (t *PrescriptionChaincode) CreateMedicationRequest(ctx contractapi.TransactionContextInterface, medicationRequestJSON string) error {
	// Deserialize JSON data into a Go data structure
	var medicationRequest MedicationRequest
	err := json.Unmarshal([]byte(medicationRequestJSON), &medicationRequest)

	if err != nil {
		return errors.New("failed to unmarshal prescription: " + err.Error())
	}

	// Check if the medication request ID is provided and if the prescription already exists
	if medicationRequest.ID.Value == "" {
		return errors.New("medication request ID is required")
	}

	existingPrescription, err := ctx.GetStub().GetState(medicationRequest.ID.Value)
	if err != nil {
		return errors.New("failed to retrieve prescription " + medicationRequest.ID.Value + " from world state")
	}

	if existingPrescription != nil {
		return errors.New("the prescription already exists " + medicationRequest.ID.Value)
	}

	// Serialize the prescription and save it on the blockchain
	medicationRequestAsBytes, err := json.Marshal(medicationRequest)
	if err != nil {
		return errors.New("failed to marshal prescription: " + err.Error())
	}

	return ctx.GetStub().PutState(medicationRequest.ID.Value, medicationRequestAsBytes)
}

// VerifyPrescription modifies the status of a prescription when it is filled by a pharmacy
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

	// Ensure that the status code is defined and accessible
	if len(prescription.Status.Coding) == 0 || prescription.Status.Coding[0].Code != "active" {
		return errors.New("prescription is not active or no status code available")
	}

	// Change the status to 'completed'
	prescription.Status.Coding[0].Code = "completed"
	prescription.DispenseRequest.Performer = &Reference{Reference: pharmacyID}
	updatedPrescriptionAsBytes, _ := json.Marshal(prescription)

	return ctx.GetStub().PutState(prescriptionID, updatedPrescriptionAsBytes)
}

// GetMedicationRequest retrieves a specific prescription from the blockchain
func (t *PrescriptionChaincode) GetMedicationRequest(ctx contractapi.TransactionContextInterface, prescriptionID string) (string, error) {
	prescriptionAsBytes, err := ctx.GetStub().GetState(prescriptionID)
	if err != nil {
		return "", errors.New("failed to read from world state")
	}
	if prescriptionAsBytes == nil {
		return "", errors.New("the prescription does not exist")
	}

	return string(prescriptionAsBytes), nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(PrescriptionChaincode))
	if err != nil {
		log.Panic(errors.New("Error creating prescription chaincode: " + err.Error()))
	}

	if err := chaincode.Start(); err != nil {
		log.Panic(errors.New("Error starting prescription chaincode: " + err.Error()))
	}
}
