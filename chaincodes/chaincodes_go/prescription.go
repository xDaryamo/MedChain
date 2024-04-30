package prescription

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/xDaryamo/MedChain/fhir"
)

type PrescriptionChaincode struct {
	contractapi.Contract
}

// CreateMedicationRequest creates a new medication request on the blockchain
func (t *PrescriptionChaincode) CreateMedicationRequest(ctx contractapi.TransactionContextInterface, medicationRequestJSON string) error {
	var medicationRequest fhir.MedicationRequest
	err := json.Unmarshal([]byte(medicationRequestJSON), &medicationRequest)
	if err != nil {
		return errors.New("failed to decode JSON")
	}

	// Check if the medication request ID is provided and if the prescription already exists
	if medicationRequest.ID.Value == "" {
		return errors.New("medication request ID is required")
	}
	exists, err := t.PrescriptionExists(ctx, medicationRequest.ID.Value)
	if err != nil {
		return err
	}
	if exists {
		return errors.New("the prescription already exists")
	}

	medicationRequestAsBytes, _ := json.Marshal(medicationRequest)
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

	var prescription fhir.MedicationRequest
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
	prescription.DispenseRequest.Performer = &fhir.Reference{Reference: pharmacyID}
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

// PrescriptionExists checks if a prescription exists in the blockchain
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
		log.Panic(errors.New("Error creating prescription chaincode: " + err.Error()))
	}

	if err := chaincode.Start(); err != nil {
		log.Panic(errors.New("Error starting prescription chaincode: " + err.Error()))
	}
}
