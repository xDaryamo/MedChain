package main

import (
	"encoding/json"
	"errors"
	"fmt"
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

// CreateEncounter creates a new Encounter
func (ec *EncounterChaincode) CreateEncounter(ctx contractapi.TransactionContextInterface, encounterJSON string) (string, error) {

	log.Printf("Encounter JSON from param: %s", string(encounterJSON))

	// Deserialize JSON data into a Go data structure
	var encounter Encounter
	err := json.Unmarshal([]byte(encounterJSON), &encounter)

	if err != nil {
		return "", errors.New("failed to unmarshal encounter: " + err.Error())
	}

	log.Printf("Encounter struct unmarshalled: %+v", encounter)

	if encounter.ID.Value == "" {
		return "", errors.New("encounter ID is required")
	}

	// Check if the Encounter record already exists
	existingEncounter, err := ctx.GetStub().GetState(encounter.ID.Value)
	if err != nil {
		return "", errors.New("failed to get encounter " + encounter.ID.Value + " from world state")
	}
	if existingEncounter != nil {
		return "", errors.New("encounter record already exists " + encounter.ID.Value)
	}

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return "", errors.New("failed to get client ID attribute: " + err.Error())
	}
	if !exists {
		return "", errors.New("client ID attribute does not exist")
	}
	patientref := encounter.Subject.Reference
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return "", errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	// Serialize the Encounter record and save it on the blockchain
	encounterJSONBytes, err := json.Marshal(encounter)
	if err != nil {
		return "", errors.New("failed to marshal encounter: " + err.Error())
	}

	log.Printf("Encounter with ID: %s created successfully", encounter.ID.Value)
	log.Printf("Serialized Encounter JSON: %s", string(encounterJSONBytes))

	if err := ctx.GetStub().PutState(encounter.ID.Value, encounterJSONBytes); err != nil {
		return "", errors.New("failed to put state: " + err.Error())
	}

	return `{"message": "Encounter created successfully"}`, nil
}

// GetEncounter retrieves an Encounter from the blockchain
func (ec *EncounterChaincode) ReadEncounter(ctx contractapi.TransactionContextInterface, encounterID string) (string, error) {
	// Retrieve the Encounter record from the blockchain
	encounterJSON, err := ctx.GetStub().GetState(encounterID)
	if err != nil {
		return "", errors.New("failed to read encounter: " + err.Error())
	}
	if encounterJSON == nil {
		return "", errors.New("encounter does not exist: " + encounterID)
	}

	log.Printf("Encounter JSON from ledger: %s", string(encounterJSON))

	// Deserialize the Encounter record
	var encounter Encounter
	err = json.Unmarshal(encounterJSON, &encounter)
	if err != nil {
		return "", errors.New("failed to unmarshal encounter: " + err.Error())
	}

	log.Printf("Encounter object: %+v", encounter)

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return "", errors.New("failed to get client ID attribute: " + err.Error())
	}
	if !exists {
		return "", errors.New("client ID attribute does not exist")
	}

	patientref := encounter.Subject.Reference
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return "", errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	return string(encounterJSON), nil

}

// UpdateEncounter updates an existing Encounter
func (ec *EncounterChaincode) UpdateEncounter(ctx contractapi.TransactionContextInterface, encounterID string, updatedEncounterJSON string) (string, error) {
	// Retrieve the existing Encounter record
	existingEncounter, err := ctx.GetStub().GetState(encounterID)
	if err != nil {
		return "", errors.New("failed to get encounter: " + err.Error())
	}
	if existingEncounter == nil {
		return "", errors.New("encounter does not exist: " + encounterID)
	}

	// Deserialize the Encounter record
	var encounter Encounter
	err = json.Unmarshal(existingEncounter, &encounter)
	if err != nil {
		return "", errors.New("failed to unmarshal encounter: " + err.Error())
	}

	// Ottieni l'ID del client che effettua la richiesta
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return "", errors.New("failed to get client ID")
	}

	patientref := encounter.Subject.Reference
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return "", errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	// Deserialize the updated JSON data into a Go data structure
	var updatedEncounter Encounter
	if err := json.Unmarshal([]byte(updatedEncounterJSON), &updatedEncounter); err != nil {
		return "", errors.New("failed to unmarshal encounter: " + err.Error())
	}

	// Serialize the updated Encounter record and save it on the blockchain
	updatedEncounterJSONBytes, err := json.Marshal(existingEncounter)
	if err != nil {
		return "", errors.New("failed to marshal encounter: " + err.Error())
	}

	if err := ctx.GetStub().PutState(encounter.ID.Value, updatedEncounterJSONBytes); err != nil {
		return "", errors.New("failed to put state: " + err.Error())
	}

	return `{"message": "Encounter updated successfully"}`, nil
}

// DeleteEncounter removes an existing Encounter
func (ec *EncounterChaincode) DeleteEncounter(ctx contractapi.TransactionContextInterface, encounterID string) (string, error) {
	// Check if the Encounter record exists
	existingEncounter, err := ctx.GetStub().GetState(encounterID)
	if err != nil {
		return "", errors.New("failed to get encounter: " + err.Error())
	}
	if existingEncounter == nil {
		return "", errors.New("encounter not found")
	}

	// Deserialize the Encounter record
	var encounter Encounter
	err = json.Unmarshal(existingEncounter, &encounter)
	if err != nil {
		return "", errors.New("failed to unmarshal encounter: " + err.Error())
	}

	// Ottieni l'ID del client che effettua la richiesta
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return "", errors.New("failed to get client ID")
	}

	patientref := encounter.Subject.Reference
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return "", errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	if err := ctx.GetStub().DelState(encounter.ID.Value); err != nil {
		return "", errors.New("failed to delete encounter: " + err.Error())
	}

	return `{"message": "Encounter updated successfully"}`, nil
}

// SearchEncountersByStatus allows searching for encounters based on their status
func (ec *EncounterChaincode) SearchEncountersByStatus(ctx contractapi.TransactionContextInterface, status string) ([]string, error) {
	queryString := fmt.Sprintf(`{"selector":{"status":{"coding":{"code":"%s"}}}}`, status)
	return ec.queryEncounters(ctx, queryString)
}

// SearchEncountersByType allows searching for encounters based on their type
func (ec *EncounterChaincode) SearchEncountersByType(ctx contractapi.TransactionContextInterface, typeCode string) ([]string, error) {
	queryString := fmt.Sprintf(`{"selector":{"type":{"coding":{"code":"%s"}}}}`, typeCode)
	return ec.queryEncounters(ctx, queryString)
}

// queryEncounters executes a CouchDB query and returns the results as a JSON string
func (ec *EncounterChaincode) queryEncounters(ctx contractapi.TransactionContextInterface, queryString string) ([]string, error) {

	var encounters []string
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return encounters, err
	}
	defer resultsIterator.Close()

	// Ottieni l'ID del client che effettua la richiesta
	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return encounters, errors.New("failed to get client ID")
	}

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return encounters, err
		}

		var encounter Encounter
		err = json.Unmarshal(queryResponse.Value, &encounter)
		if err != nil {
			return encounters, err
		}

		patientref := encounter.Subject.Reference
		chaincodeName := "patient"
		functionName := "IsAuthorized"

		invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

		response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
		if response.Status != 200 {
			return encounters, errors.New("failed to invoke chaincode: " + response.Message)
		}

		log.Printf("Client ID: %s", clientID)
		log.Printf("Patient ID: %s", patientref)

		encounterJSON, err := json.Marshal(encounter)
		if err != nil {
			return encounters, err
		}

		encounters = append(encounters, string(encounterJSON))
	}

	return encounters, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(EncounterChaincode))
	if err != nil {
		log.Panic(errors.New("Error creating encounter chaincode: " + err.Error()))
	}

	if err := chaincode.Start(); err != nil {
		log.Panic(errors.New("Error starting encounter chaincode: " + err.Error()))
	}
}
