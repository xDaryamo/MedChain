package main

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type ObservationChaincode struct {
	contractapi.Contract
}

/*
================================
	CRUD OPERATIONS
================================
*/

func (t *ObservationChaincode) CreateObservation(ctx contractapi.TransactionContextInterface, observationJSON string) (string, error) {
	var observation Observation
	err := json.Unmarshal([]byte(observationJSON), &observation)
	if err != nil {
		return `{"error": "failed to decode JSON"}`, err
	}

	if observation.ID.Value == "" {
		return `{"error": "observation ID is required"}`, errors.New("observation ID is required")
	}

	// Check if the observation already exists
	existingobservationAsBytes, err := ctx.GetStub().GetState(observation.ID.Value)
	if err != nil {
		return `{"error": "failed to read from world state"}`, err
	}
	if existingobservationAsBytes != nil {
		return `{"error": "the observation already exists"}`, errors.New("the observation already exists")
	}

	observationAsBytes, err := json.Marshal(observation)
	if err != nil {
		return `{"error": "failed to marshal observation"}`, err
	}

	err = ctx.GetStub().PutState(observation.ID.Value, observationAsBytes)
	if err != nil {
		return `{"error": "failed to put state"}`, err
	}

	return `{"message": "observation created successfully"}`, nil
}

func (t *ObservationChaincode) ReadObservation(ctx contractapi.TransactionContextInterface, observationID string) (string, error) {
	observationAsBytes, err := ctx.GetStub().GetState(observationID)
	if err != nil {
		return `{"error": "failed to read from world state"}`, err
	}
	if observationAsBytes == nil {
		return `{"error": "the observation does not exist"}`, errors.New("the observation does not exist")
	}

	return string(observationAsBytes), nil
}

func (t *ObservationChaincode) UpdateObservation(ctx contractapi.TransactionContextInterface, observationJSON string) (string, error) {
	var updatedobservation Observation
	err := json.Unmarshal([]byte(observationJSON), &updatedobservation)
	if err != nil {
		return `{"error": "failed to decode JSON"}`, err
	}

	if updatedobservation.ID.Value == "" {
		return `{"error": "observation ID is required"}`, errors.New("observation ID is required")
	}

	existingobservationAsBytes, err := ctx.GetStub().GetState(updatedobservation.ID.Value)
	if err != nil {
		return `{"error": "failed to read from world state"}`, err
	}
	if existingobservationAsBytes == nil {
		return `{"error": "the observation does not exist"}`, errors.New("the observation does not exist")
	}

	updatedobservationAsBytes, err := json.Marshal(updatedobservation)
	if err != nil {
		return `{"error": "failed to marshal updated observation"}`, err
	}

	err = ctx.GetStub().PutState(updatedobservation.ID.Value, updatedobservationAsBytes)
	if err != nil {
		return `{"error": "failed to put state"}`, err
	}

	return `{"message": "observation updated successfully"}`, nil
}

func (t *ObservationChaincode) Deleteobservation(ctx contractapi.TransactionContextInterface, observationID string) (string, error) {
	existingobservationAsBytes, err := ctx.GetStub().GetState(observationID)
	if err != nil {
		return `{"error": "failed to read from world state"}`, err
	}
	if existingobservationAsBytes == nil {
		return `{"error": "the observation does not exist"}`, errors.New("the observation does not exist")
	}

	err = ctx.GetStub().DelState(observationID)
	if err != nil {
		return `{"error": "failed to delete state"}`, err
	}

	return `{"message": "observation deleted successfully"}`, nil
}

func (t *ObservationChaincode) SearchObservations(ctx contractapi.TransactionContextInterface, queryString string) (string, error) {
	log.Printf("Executing query: %s", queryString)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return `{"error": "failed to execute query"}`, err
	}
	defer resultsIterator.Close()

	var observations []Observation
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return `{"error": "failed to iterate query results"}`, err
		}

		log.Printf("Query response: %s", string(queryResponse.Value))

		var observation Observation
		err = json.Unmarshal(queryResponse.Value, &observation)
		if err != nil {
			return `{"error": "failed to unmarshal query response"}`, err
		}
		observations = append(observations, observation)
	}

	resultsJSON, err := json.Marshal(observations)
	if err != nil {
		return `{"error": "failed to encode results to JSON"}`, err
	}

	log.Printf("Query results JSON: %s", string(resultsJSON))
	return string(resultsJSON), nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(ObservationChaincode))
	if err != nil {
		log.Panic("Error creating observation chaincode: ", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panic("Error starting observation chaincode: ", err)
	}
}
