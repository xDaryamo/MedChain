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

// CreateLabResult crea un nuovo risultato di laboratorio sulla blockchain
func (t *LabResultsChaincode) CreateLabResult(ctx contractapi.TransactionContextInterface, labResultJSON string) error {
	var labResult Observation
	err := json.Unmarshal([]byte(labResultJSON), &labResult)
	if err != nil {
		return errors.New("failed to decode JSON")
	}

	if labResult.ID == "" {
		return errors.New("lab result ID is required")
	}
	exists, err := t.LabResultExists(ctx, labResult.ID)
	if err != nil {
		return err
	}
	if exists {
		return errors.New("the lab result already exists")
	}

	labResultAsBytes, err := json.Marshal(labResult)
	if err != nil {
		return errors.New("failed to encode JSON")
	}
	return ctx.GetStub().PutState(labResult.ID, labResultAsBytes)
}

// UpdateLabResult aggiorna un risultato di laboratorio esistente sulla blockchain
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

	updatedLabResultAsBytes, err := json.Marshal(labResult)
	if err != nil {
		return errors.New("failed to encode JSON")
	}
	return ctx.GetStub().PutState(labResultID, updatedLabResultAsBytes)
}

// GetLabResult recupera uno specifico risultato di laboratorio dalla blockchain
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

// LabResultExists verifica se un risultato di laboratorio esiste nella blockchain
func (t *LabResultsChaincode) LabResultExists(ctx contractapi.TransactionContextInterface, labResultID string) (bool, error) {
	labResultAsBytes, err := ctx.GetStub().GetState(labResultID)
	if err != nil {
		return false, errors.New("failed to read from world state")
	}
	return labResultAsBytes != nil, nil
}

// QueryLabResults recupera i risultati di laboratorio per un paziente specifico utilizzando la struttura Observation
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