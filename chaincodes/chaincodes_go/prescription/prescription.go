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

/*
================================
	CRUD OPERATIONS
================================
*/


func (t *PrescriptionChaincode) CreatePrescription(ctx contractapi.TransactionContextInterface, medicationRequestJSON string) (string, error) {
	var medicationRequest MedicationRequest
	err := json.Unmarshal([]byte(medicationRequestJSON), &medicationRequest)
	if err != nil {
		return `{"error": "failed to decode JSON"}`, err
	}

	if medicationRequest.ID == nil || medicationRequest.ID.Value == "" {
		return `{"error": "medication request ID is required"}`, errors.New("medication request ID is required")
	}

	// Check if the prescription already exists
	existingPrescriptionAsBytes, err := ctx.GetStub().GetState(medicationRequest.ID.Value)
	if err != nil {
		return `{"error": "failed to read from world state"}`, err
	}
	if existingPrescriptionAsBytes != nil {
		return `{"error": "the prescription already exists"}`, errors.New("the prescription already exists")
	}

	medicationRequestAsBytes, err := json.Marshal(medicationRequest)
	if err != nil {
		return `{"error": "failed to marshal medication request"}`, err
	}

	err = ctx.GetStub().PutState(medicationRequest.ID.Value, medicationRequestAsBytes)
	if err != nil {
		return `{"error": "failed to put state"}`, err
	}

	return `{"message": "Prescription created successfully"}`, nil
}

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


func (t *PrescriptionChaincode) UpdatePrescription(ctx contractapi.TransactionContextInterface, medicationRequestJSON string) (string, error) {
	var updatedMedicationRequest MedicationRequest
	err := json.Unmarshal([]byte(medicationRequestJSON), &updatedMedicationRequest)
	if err != nil {
		return `{"error": "failed to decode JSON"}`, err
	}

	if updatedMedicationRequest.ID == nil || updatedMedicationRequest.ID.Value == "" {
		return `{"error": "medication request ID is required"}`, errors.New("medication request ID is required")
	}

	existingPrescriptionAsBytes, err := ctx.GetStub().GetState(updatedMedicationRequest.ID.Value)
	if err != nil {
		return `{"error": "failed to read from world state"}`, err
	}
	if existingPrescriptionAsBytes == nil {
		return `{"error": "the prescription does not exist"}`, errors.New("the prescription does not exist")
	}

	updatedMedicationRequestAsBytes, err := json.Marshal(updatedMedicationRequest)
	if err != nil {
		return `{"error": "failed to marshal updated medication request"}`, err
	}

	err = ctx.GetStub().PutState(updatedMedicationRequest.ID.Value, updatedMedicationRequestAsBytes)
	if err != nil {
		return `{"error": "failed to put state"}`, err
	}

	return `{"message": "Prescription updated successfully"}`, nil
}

func (t *PrescriptionChaincode) DeletePrescription(ctx contractapi.TransactionContextInterface, prescriptionID string) (string, error) {
	existingPrescriptionAsBytes, err := ctx.GetStub().GetState(prescriptionID)
	if err != nil {
		return `{"error": "failed to read from world state"}`, err
	}
	if existingPrescriptionAsBytes == nil {
		return `{"error": "the prescription does not exist"}`, errors.New("the prescription does not exist")
	}

	err = ctx.GetStub().DelState(prescriptionID)
	if err != nil {
		return `{"error": "failed to delete state"}`, err
	}

	return `{"message": "Prescription deleted successfully"}`, nil
}

func (t *PrescriptionChaincode) SearchPrescriptions(ctx contractapi.TransactionContextInterface, queryString string) (string, error) {
	log.Printf("Executing query: %s", queryString)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return `{"error": "failed to execute query"}`, err
	}
	defer resultsIterator.Close()

	var prescriptions []MedicationRequest
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return `{"error": "failed to iterate query results"}`, err
		}

		log.Printf("Query response: %s", string(queryResponse.Value))

		var prescription MedicationRequest
		err = json.Unmarshal(queryResponse.Value, &prescription)
		if err != nil {
			return `{"error": "failed to unmarshal query response"}`, err
		}
		prescriptions = append(prescriptions, prescription)
	}

	resultsJSON, err := json.Marshal(prescriptions)
	if err != nil {
		return `{"error": "failed to encode results to JSON"}`, err
	}

	log.Printf("Query results JSON: %s", string(resultsJSON))
	return string(resultsJSON), nil
}

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

func (t *PrescriptionChaincode) CreatePrescriptionsBatch(ctx contractapi.TransactionContextInterface, medicationRequestsJSON string) (string, error) {
	var medicationRequests []MedicationRequest
	err := json.Unmarshal([]byte(medicationRequestsJSON), &medicationRequests)
	if err != nil {
		return `{"error": "failed to decode JSON"}`, err
	}

	for _, medicationRequest := range medicationRequests {
		if medicationRequest.ID == nil || medicationRequest.ID.Value == "" {
			return `{"error": "medication request ID is required for all requests"}`, errors.New("medication request ID is required for all requests")
		}

		existingPrescriptionAsBytes, err := ctx.GetStub().GetState(medicationRequest.ID.Value)
		if err != nil {
			return `{"error": "failed to read from world state"}`, err
		}
		if existingPrescriptionAsBytes != nil {
			return `{"error": "a prescription already exists for ID ` + medicationRequest.ID.Value + `"}`, errors.New("prescription already exists for ID " + medicationRequest.ID.Value)
		}

		medicationRequestAsBytes, err := json.Marshal(medicationRequest)
		if err != nil {
			return `{"error": "failed to marshal medication request"}`, err
		}

		err = ctx.GetStub().PutState(medicationRequest.ID.Value, medicationRequestAsBytes)
		if err != nil {
			return `{"error": "failed to put state"}`, err
		}
	}

	return `{"message": "Prescriptions created successfully"}`, nil
}

func (t *PrescriptionChaincode) UpdatePrescriptionsBatch(ctx contractapi.TransactionContextInterface, medicationRequestsJSON string) (string, error) {
	var medicationRequests []MedicationRequest
	err := json.Unmarshal([]byte(medicationRequestsJSON), &medicationRequests)
	if err != nil {
		return `{"error": "failed to decode JSON"}`, err
	}

	for _, medicationRequest := range medicationRequests {
		if medicationRequest.ID == nil || medicationRequest.ID.Value == "" {
			return `{"error": "medication request ID is required for all requests"}`, errors.New("medication request ID is required for all requests")
		}

		existingPrescriptionAsBytes, err := ctx.GetStub().GetState(medicationRequest.ID.Value)
		if err != nil {
			return `{"error": "failed to read from world state"}`, err
		}
		if existingPrescriptionAsBytes == nil {
			return `{"error": "prescription does not exist for ID ` + medicationRequest.ID.Value + `"}`, errors.New("prescription does not exist for ID " + medicationRequest.ID.Value)
		}

		updatedMedicationRequestAsBytes, err := json.Marshal(medicationRequest)
		if err != nil {
			return `{"error": "failed to marshal medication request"}`, err
		}

		err = ctx.GetStub().PutState(medicationRequest.ID.Value, updatedMedicationRequestAsBytes)
		if err != nil {
			return `{"error": "failed to put state"}`, err
		}
	}

	return `{"message": "Prescriptions updated successfully"}`, nil
}

func (t *PrescriptionChaincode) DeletePrescriptionsBatch(ctx contractapi.TransactionContextInterface, prescriptionIDsJSON string) (string, error) {
	var prescriptionIDs []string
	err := json.Unmarshal([]byte(prescriptionIDsJSON), &prescriptionIDs)
	if err != nil {
		return `{"error": "failed to decode JSON"}`, err
	}

	for _, prescriptionID := range prescriptionIDs {
		existingPrescriptionAsBytes, err := ctx.GetStub().GetState(prescriptionID)
		if err != nil {
			return `{"error": "failed to read from world state for ID ` + prescriptionID + `"}`, err
		}
		if existingPrescriptionAsBytes == nil {
			return `{"error": "prescription does not exist for ID ` + prescriptionID + `"}`, errors.New("prescription does not exist for ID " + prescriptionID)
		}

		err = ctx.GetStub().DelState(prescriptionID)
		if err != nil {
			return `{"error": "failed to delete state for ID ` + prescriptionID + `"}`, err
		}
	}

	return `{"message": "Prescriptions deleted successfully"}`, nil
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
