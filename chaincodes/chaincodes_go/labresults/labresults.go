package main

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type LabResultsChaincode struct {
	contractapi.Contract
}

// CreateLabResult crea un nuovo risultato di laboratorio sulla blockchain
func (t *LabResultsChaincode) CreateLabResult(ctx contractapi.TransactionContextInterface, labResultJSON string) (string, error) {
	log.Printf("Creating lab result with JSON: %s", labResultJSON)

	// Deserialize JSON data into a Go data structure
	var labResult Observation
	err := json.Unmarshal([]byte(labResultJSON), &labResult)
	if err != nil {
		return "", errors.New("failed to unmarshal lab result: " + err.Error())
	}

	// Check if the lab result request ID is provided and if it already exists
	if labResult.ID == "" {
		return "", errors.New("lab result ID is required")
	}

	existingLabResult, err := ctx.GetStub().GetState(labResult.ID)
	if err != nil {
		return "", errors.New("failed to get lab result " + labResult.ID + " from world state")
	}
	if existingLabResult != nil {
		return "", errors.New("lab result already exists: " + labResult.ID)
	}

	err = ctx.GetStub().PutState(labResult.ID, []byte(labResultJSON))
	if err != nil {
		return "", errors.New("failed to put lab result in world state: " + err.Error())
	}

	log.Printf("Lab result with ID: %s created successfully", labResult.ID)
	return `{"message": "Lab result created successfully"}`, nil
}
// UpdateLabResult aggiorna un risultato di laboratorio esistente sulla blockchain
func (t *LabResultsChaincode) UpdateLabResult(ctx contractapi.TransactionContextInterface, labResultID string, labResultJSON string) (string, error) {
	log.Printf("Updating lab result with ID: %s using JSON: %s", labResultID, labResultJSON)

	labResultAsBytes, err := ctx.GetStub().GetState(labResultID)
	if err != nil {
		return "", errors.New("failed to read from world state")
	}
	if labResultAsBytes == nil {
		return "", errors.New("the lab result does not exist")
	}

	var labResult Observation
	err = json.Unmarshal([]byte(labResultJSON), &labResult)
	if err != nil {
		return "", errors.New("failed to decode JSON")
	}

	err = ctx.GetStub().PutState(labResultID, []byte(labResultJSON))
	if err != nil {
		return "", errors.New("failed to put lab result in world state: " + err.Error())
	}

	log.Printf("Lab result with ID: %s updated successfully", labResultID)
	return `{"message": "Lab result updated successfully"}`, nil
}

// GetLabResult recupera uno specifico risultato di laboratorio dalla blockchain
func (t *LabResultsChaincode) GetLabResult(ctx contractapi.TransactionContextInterface, labResultID string) (string, error) {
	log.Printf("Retrieving lab result with ID: %s", labResultID)

	labResultAsBytes, err := ctx.GetStub().GetState(labResultID)
	if err != nil {
		return "", errors.New("failed to read from world state")
	}
	if labResultAsBytes == nil {
		return "", errors.New("the lab result does not exist")
	}

	log.Printf("Lab result with ID: %s retrieved successfully", labResultID)
	return string(labResultAsBytes), nil
}


// QueryLabResultsByPatientID retrieves all lab results for a given patient ID
func (t *LabResultsChaincode) QueryLabResultsByPatientID(ctx contractapi.TransactionContextInterface, patientID string) (string, error) {
	log.Printf("Querying lab results for patient ID: %s", patientID)

	queryString := `{"selector":{"subject.reference":"` + patientID + `"}}`
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return "", errors.New("failed to query lab results: " + err.Error())
	}
	defer resultsIterator.Close()

	var results []Observation
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return "", errors.New("failed to iterate query results: " + err.Error())
		}

		var observation Observation
		err = json.Unmarshal(queryResponse.Value, &observation)
		if err != nil {
			return "", errors.New("failed to unmarshal query response: " + err.Error())
		}
		results = append(results, observation)
	}

	resultsJSON, err := json.Marshal(results)
	if err != nil {
		return "", errors.New("failed to encode results to JSON: " + err.Error())
	}

	log.Printf("Query for patient ID: %s returned %d results", patientID, len(results))
	return string(resultsJSON), nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(LabResultsChaincode))
	if err != nil {
		log.Panic(errors.New("Error creating lab results chaincode: " + err.Error()))
	}

	if err := chaincode.Start(); err != nil {
		log.Panic(errors.New("Error starting lab results chaincode: " + err.Error()))
	}
}
