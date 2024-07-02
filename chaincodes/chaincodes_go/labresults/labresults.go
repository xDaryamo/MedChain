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
	// Deserialize JSON data into a Go data structure
	var labResult Observation
	err := json.Unmarshal([]byte(labResultJSON), &labResult)
	if err != nil {
		return `{"error": "failed to unmarshal lab result: ` + err.Error() + `"}`, err
	}

	// Check if the lab result request ID is provided and if it already exists
	if labResult.ID == nil || labResult.ID.Value == "" {
		return `{"error": "lab result ID is required"}`, errors.New("lab result ID is required")
	}

	existingLabResult, err := ctx.GetStub().GetState(labResult.ID.Value)
	if err != nil {
		return `{"error": "failed to get lab result ` + labResult.ID.Value + ` from world state"}`, err
	}
	if existingLabResult != nil {
		return `{"error": "lab result already exists: ` + labResult.ID.Value + `"}`, errors.New("lab result already exists")
	}

	err = ctx.GetStub().PutState(labResult.ID.Value, []byte(labResultJSON))
	if err != nil {
		return `{"error": "failed to put lab result in world state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Lab result created successfully"}`, nil
}

// UpdateLabResult aggiorna un risultato di laboratorio esistente sulla blockchain
func (t *LabResultsChaincode) UpdateLabResult(ctx contractapi.TransactionContextInterface, labResultID string, labResultJSON string) (string, error) {
	labResultAsBytes, err := ctx.GetStub().GetState(labResultID)
	if err != nil {
		return `{"error": "failed to read from world state"}`, err
	}
	if labResultAsBytes == nil {
		return `{"error": "the lab result does not exist"}`, errors.New("the lab result does not exist")
	}

	var labResult Observation
	err = json.Unmarshal([]byte(labResultJSON), &labResult)
	if err != nil {
		return `{"error": "failed to decode JSON: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(labResultID, []byte(labResultJSON))
	if err != nil {
		return `{"error": "failed to put lab result in world state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Lab result updated successfully"}`, nil
}

// GetLabResult recupera uno specifico risultato di laboratorio dalla blockchain
func (t *LabResultsChaincode) ReadLabResult(ctx contractapi.TransactionContextInterface, labResultID string) (string, error) {
	labResultAsBytes, err := ctx.GetStub().GetState(labResultID)
	if err != nil {
		return `{"error": "failed to read from world state"}`, err
	}
	if labResultAsBytes == nil {
		return `{"error": "the lab result does not exist"}`, errors.New("the lab result does not exist")
	}

	return string(labResultAsBytes), nil
}

// SearchLabResults esegue una ricerca dei risultati di laboratorio sulla blockchain
func (t *LabResultsChaincode) SearchLabResults(ctx contractapi.TransactionContextInterface, queryString string) (string, error) {
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return `{"error": "failed to execute query: ` + err.Error() + `"}`, err
	}
	defer resultsIterator.Close()

	var labResults []Observation
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return `{"error": "failed to iterate query results: ` + err.Error() + `"}`, err
		}

		var labResult Observation
		err = json.Unmarshal(queryResponse.Value, &labResult)
		if err != nil {
			return `{"error": "failed to unmarshal query response: ` + err.Error() + `"}`, err
		}
		labResults = append(labResults, labResult)
	}

	resultsJSON, err := json.Marshal(labResults)
	if err != nil {
		return `{"error": "failed to encode results to JSON: ` + err.Error() + `"}`, err
	}

	return string(resultsJSON), nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(LabResultsChaincode))
	if err != nil {
		log.Panic("Error creating lab results chaincode: ", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panic("Error starting lab results chaincode: ", err)
	}
}
