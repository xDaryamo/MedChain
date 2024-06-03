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

// CreatePrescription creates a new prescription
func (t *PrescriptionChaincode) CreatePrescription(ctx contractapi.TransactionContextInterface, medicationRequestJSON string) (string, error) {
	var medicationRequest MedicationRequest
	err := json.Unmarshal([]byte(medicationRequestJSON), &medicationRequest)
	if err != nil {
		return "", errors.New("failed to decode JSON")
	}

	if medicationRequest.ID == nil || medicationRequest.ID.Value == "" {
		return "", errors.New("medication request ID is required")
	}

	// Check if the prescription already exists
	existingPrescriptionAsBytes, err := ctx.GetStub().GetState(medicationRequest.ID.Value)
	if err != nil {
		return "", errors.New("failed to read from world state")
	}
	if existingPrescriptionAsBytes != nil {
		return "", errors.New("the prescription already exists")
	}

	medicationRequestAsBytes, err := json.Marshal(medicationRequest)
	if err != nil {
		return "", errors.New("failed to marshal medication request")
	}

	err = ctx.GetStub().PutState(medicationRequest.ID.Value, medicationRequestAsBytes)
	if err != nil {
		return "", errors.New("failed to put state")
	}

	return `{"message": "Prescription created successfully"}`, nil
}

// Verifica una prescrizione
func (t *PrescriptionChaincode) VerifyPrescription(ctx contractapi.TransactionContextInterface, prescriptionID string, pharmacyID string) (string, error) {
	prescriptionAsBytes, err := ctx.GetStub().GetState(prescriptionID)
	if err != nil {
		return `{"error": "failed to read from world state"}`, err
	}
	if prescriptionAsBytes == nil {
		return `{"error": "the prescription does not exist"}`, errors.New("the prescription does not exist")
	}

	var prescription MedicationRequest
	err = json.Unmarshal(prescriptionAsBytes, &prescription)
	if err != nil {
		return `{"error": "failed to unmarshal prescription"}`, err
	}

	if prescription.Status == nil || len(prescription.Status.Coding) == 0 || prescription.Status.Coding[0].Code != "active" {
		return `{"error": "prescription is not active or no status code available"}`, errors.New("prescription is not active or no status code available")
	}

	prescription.Status.Coding[0].Code = "completed"
	prescription.DispenseRequest.Performer = &Reference{Reference: pharmacyID}
	updatedPrescriptionAsBytes, err := json.Marshal(prescription)
	if err != nil {
		return `{"error": "failed to marshal updated prescription"}`, err
	}

	err = ctx.GetStub().PutState(prescriptionID, updatedPrescriptionAsBytes)
	if err != nil {
		return `{"error": "failed to put state"}`, err
	}

	return `{"message": "prescription verified successfully"}`, nil
}

// Leggi una prescrizione
func (t *PrescriptionChaincode) ReadPrescription(ctx contractapi.TransactionContextInterface, prescriptionID string) (string, error) {
	prescriptionAsBytes, err := ctx.GetStub().GetState(prescriptionID)
	if err != nil {
		return `{"error": "failed to read from world state"}`, err
	}
	if prescriptionAsBytes == nil {
		return `{"error": "the prescription does not exist"}`, errors.New("the prescription does not exist")
	}

	return string(prescriptionAsBytes), nil
}


// UpdatePrescription updates an existing prescription
func (t *PrescriptionChaincode) UpdatePrescription(ctx contractapi.TransactionContextInterface, medicationRequestJSON string) (string, error) {
	var updatedMedicationRequest MedicationRequest
	err := json.Unmarshal([]byte(medicationRequestJSON), &updatedMedicationRequest)
	if err != nil {
		return "", errors.New("failed to decode JSON")
	}

	if updatedMedicationRequest.ID == nil || updatedMedicationRequest.ID.Value == "" {
		return "", errors.New("medication request ID is required")
	}

	existingPrescriptionAsBytes, err := ctx.GetStub().GetState(updatedMedicationRequest.ID.Value)
	if err != nil {
		return "", errors.New("failed to read from world state")
	}
	if existingPrescriptionAsBytes == nil {
		return "", errors.New("the prescription does not exist")
	}

	updatedMedicationRequestAsBytes, err := json.Marshal(updatedMedicationRequest)
	if err != nil {
		return "", errors.New("failed to marshal updated medication request")
	}

	err = ctx.GetStub().PutState(updatedMedicationRequest.ID.Value, updatedMedicationRequestAsBytes)
	if err != nil {
		return "", errors.New("failed to put state")
	}

	return `{"message": "Prescription updated successfully"}`, nil
}

// DeletePrescription removes a prescription from the ledger
func (t *PrescriptionChaincode) DeletePrescription(ctx contractapi.TransactionContextInterface, prescriptionID string) (string, error) {
	existingPrescriptionAsBytes, err := ctx.GetStub().GetState(prescriptionID)
	if err != nil {
		return "", errors.New("failed to read from world state")
	}
	if existingPrescriptionAsBytes == nil {
		return "", errors.New("the prescription does not exist")
	}

	err = ctx.GetStub().DelState(prescriptionID)
	if err != nil {
		return "", errors.New("failed to delete state")
	}

	return `{"message": "Prescription deleted successfully"}`, nil
}

func (t *PrescriptionChaincode) SearchPrescriptions(ctx contractapi.TransactionContextInterface, queryString string) (string, error) {
	log.Printf("Executing query: %s", queryString)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return "", errors.New("failed to execute query: " + err.Error())
	}
	defer resultsIterator.Close()

	var prescriptions []MedicationRequest
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return "", errors.New("failed to iterate query results: " + err.Error())
		}

		log.Printf("Query response: %s", string(queryResponse.Value))

		var prescription MedicationRequest
		err = json.Unmarshal(queryResponse.Value, &prescription)
		if err != nil {
			return "", errors.New("failed to unmarshal query response: " + err.Error())
		}
		prescriptions = append(prescriptions, prescription)
	}

	resultsJSON, err := json.Marshal(prescriptions)
	if err != nil {
		return "", errors.New("failed to encode results to JSON: " + err.Error())
	}

	log.Printf("Query results JSON: %s", string(resultsJSON))
	return string(resultsJSON), nil
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
