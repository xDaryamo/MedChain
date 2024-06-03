package main

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// EncounterChaincode represents the Chaincode for managing Encounters on the blockchain
type EncounterChaincode struct {
	contractapi.Contract
}

/*
================================
	CRUD OPERATIONS
================================
*/

func (ec *EncounterChaincode) CreateEncounter(ctx contractapi.TransactionContextInterface, encounterJSON string) (string, error) {
	// Deserialize JSON data into a Go data structure
	var encounter Encounter
	err := json.Unmarshal([]byte(encounterJSON), &encounter)
	if err != nil {
		return `{"error": "failed to unmarshal encounter: ` + err.Error() + `"}`, err
	}

	if encounter.ID.Value == "" {
		return `{"error": "encounter ID is required"}`, errors.New("encounter ID is required")
	}

	// Check if the Encounter record already exists
	existingEncounter, err := ctx.GetStub().GetState(encounter.ID.Value)
	if err != nil {
		return `{"error": "failed to get encounter: ` + err.Error() + `"}`, err
	}
	if existingEncounter != nil {
		return `{"error": "encounter record already exists: ` + encounter.ID.Value + `"}`, errors.New("encounter record already exists")
	}

	// Serialize the Encounter record and save it on the blockchain
	encounterJSONBytes, err := json.Marshal(encounter)
	if err != nil {
		return `{"error": "failed to marshal encounter: ` + err.Error() + `"}`, err
	}

	if err := ctx.GetStub().PutState(encounter.ID.Value, encounterJSONBytes); err != nil {
		return `{"error": "failed to put state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Encounter created successfully"}`, nil
}

func (ec *EncounterChaincode) ReadEncounter(ctx contractapi.TransactionContextInterface, encounterID string) (string, error) {
	// Retrieve the Encounter record from the blockchain
	encounterJSON, err := ctx.GetStub().GetState(encounterID)
	if err != nil {
		return `{"error": "failed to read encounter: ` + err.Error() + `"}`, err
	}
	if encounterJSON == nil {
		return `{"error": "encounter does not exist: ` + encounterID + `"}`, errors.New("encounter does not exist")
	}

	return string(encounterJSON), nil
}

func (ec *EncounterChaincode) UpdateEncounter(ctx contractapi.TransactionContextInterface, encounterID string, updatedEncounterJSON string) (string, error) {
	// Retrieve the existing Encounter record
	existingEncounter, err := ctx.GetStub().GetState(encounterID)
	if err != nil {
		return `{"error": "failed to get encounter: ` + err.Error() + `"}`, err
	}
	if existingEncounter == nil {
		return `{"error": "encounter does not exist: ` + encounterID + `"}`, errors.New("encounter does not exist")
	}

	// Deserialize the updated JSON data into a Go data structure
	var updatedEncounter Encounter
	if err := json.Unmarshal([]byte(updatedEncounterJSON), &updatedEncounter); err != nil {
		return `{"error": "failed to unmarshal encounter: ` + err.Error() + `"}`, err
	}

	// Serialize the updated Encounter record and save it on the blockchain
	updatedEncounterJSONBytes, err := json.Marshal(updatedEncounter)
	if err != nil {
		return `{"error": "failed to marshal encounter: ` + err.Error() + `"}`, err
	}

	if err := ctx.GetStub().PutState(encounterID, updatedEncounterJSONBytes); err != nil {
		return `{"error": "failed to put state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Encounter updated successfully"}`, nil
}

func (ec *EncounterChaincode) DeleteEncounter(ctx contractapi.TransactionContextInterface, encounterID string) (string, error) {
	// Check if the Encounter record exists
	existingEncounter, err := ctx.GetStub().GetState(encounterID)
	if err != nil {
		return `{"error": "failed to get encounter: ` + err.Error() + `"}`, err
	}
	if existingEncounter == nil {
		return `{"error": "encounter not found"}`, errors.New("encounter not found")
	}

	if err := ctx.GetStub().DelState(encounterID); err != nil {
		return `{"error": "failed to delete encounter: ` + err.Error() + `"}`, err
	}

	return `{"message": "Encounter deleted successfully"}`, nil
}

func (ec *EncounterChaincode) SearchEncounters(ctx contractapi.TransactionContextInterface, queryString string) (string, error) {
	log.Printf("Executing query: %s", queryString)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return `{"error": "failed to execute query: ` + err.Error() + `"}`, err
	}
	defer resultsIterator.Close()

	var encounters []Encounter
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return `{"error": "failed to iterate query results: ` + err.Error() + `"}`, err
		}

		var encounter Encounter
		err = json.Unmarshal(queryResponse.Value, &encounter)
		if err != nil {
			return `{"error": "failed to unmarshal query response: ` + err.Error() + `"}`, err
		}
		encounters = append(encounters, encounter)
	}

	resultsJSON, err := json.Marshal(encounters)
	if err != nil {
		return `{"error": "failed to encode results to JSON: ` + err.Error() + `"}`, err
	}

	return string(resultsJSON), nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(EncounterChaincode))
	if err != nil {
		log.Panic("Error creating encounter chaincode: ", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panic("Error starting encounter chaincode: ", err)
	}
}
