package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type LabResultsChaincode struct {
	contractapi.Contract
}

// CreateLabResult creates a new laboratory result on the blockchain
func (t *LabResultsChaincode) CreateLabResult(ctx contractapi.TransactionContextInterface, labResultJSON string) error {
	// Deserialize JSON data into a Go data structure
	var labResult Observation
	err := json.Unmarshal([]byte(labResultJSON), &labResult)
	if err != nil {
		return errors.New("failed to unmarshal lab result: " + err.Error())
	}

	// Check if the lab result request ID is provided and if it already exists
	if labResult.ID == "" {
		return errors.New("lab result ID is required")
	}

	existingLabResult, err := ctx.GetStub().GetState(labResult.ID)
	if err != nil {
		return errors.New("failed to get lab result " + labResult.ID + " from world state")
	}
	if existingLabResult != nil {
		return errors.New("lab result already exists: " + labResult.ID)
	}

	// Serialize the patient and save it on the blockchain
	labResultAsBytes, err := json.Marshal(labResult)
	if err != nil {
		return errors.New("failed to marshal lab result: " + err.Error())
	}

	return ctx.GetStub().PutState(labResult.ID, labResultAsBytes)
}

// UpdateLabResult updates an existing laboratory result on the blockchain
func (t *LabResultsChaincode) UpdateLabResult(ctx contractapi.TransactionContextInterface, labResultID string, labResultJSON string) error {
	labResultAsBytes, err := ctx.GetStub().GetState(labResultID)
	if err != nil {
		return errors.New("failed to read from world state")
	}
	if labResultAsBytes == nil {
		return errors.New("the lab result does not exist")
	}

	var labResult Observation
	err = json.Unmarshal([]byte(labResultJSON), &labResult)
	if err != nil {
		return errors.New("failed to decode JSON")
	}

	updatedLabResultAsBytes, _ := json.Marshal(labResult)
	return ctx.GetStub().PutState(labResultID, updatedLabResultAsBytes)
}

// GetLabResult retrieves a specific laboratory result from the blockchain
func (t *LabResultsChaincode) GetLabResult(ctx contractapi.TransactionContextInterface, labResultID string) (string, error) {
	labResultAsBytes, err := ctx.GetStub().GetState(labResultID)
	if err != nil {
		return "", errors.New("failed to read from world state")
	}
	if labResultAsBytes == nil {
		return "", errors.New("the lab result does not exist")
	}

	return string(labResultAsBytes), nil
}

// QueryLabResults retrieves lab results for a specific patient using the Observation struct
func (t *LabResultsChaincode) QueryLabResults(ctx contractapi.TransactionContextInterface, patientID string) ([]Observation, error) {
	queryString := fmt.Sprintf(`{"selector":{"subject.reference":"%s", "category.text":"Laboratory"}}`, patientID)
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var results []Observation
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var observation Observation
		if err := json.Unmarshal(queryResponse.Value, &observation); err != nil {
			return nil, err
		}
		results = append(results, observation)
	}
	return results, nil
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
