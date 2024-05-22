package main

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// PractitionerContract represents the smart contract for managing practitioners
type PractitionerContract struct {
	contractapi.Contract
}

// CreatePractitioner adds a new practitioner record to the ledger
func (c *PractitionerContract) CreatePractitioner(ctx contractapi.TransactionContextInterface, practitionerJSON string) (string, error) {
	// Deserialize JSON data into a Go data structure
	var practitioner Practitioner
	err := json.Unmarshal([]byte(practitionerJSON), &practitioner)
	if err != nil {
		return "", errors.New("failed to unmarshal practitioner: " + err.Error())
	}

	// Check if the practitioner request ID is provided and if it already exists
	if practitioner.ID.Value == "" {
		return "", errors.New("practitioner request ID is required")
	}

	existingPractitioner, err := ctx.GetStub().GetState(practitioner.ID.Value)
	if err != nil {
		return "", errors.New("failed to get practitioner: " + practitioner.ID.Value + " from world state")
	}
	if existingPractitioner != nil {
		return "", errors.New("practitioner already exists: " + practitioner.ID.Value)
	}

	// Serialize the practitioner and save it on the blockchain
	practitionerJSONBytes, err := json.Marshal(practitioner)
	if err != nil {
		return "", errors.New("failed to marshal practitioner: " + err.Error())
	}

	err = ctx.GetStub().PutState(practitioner.ID.Value, practitionerJSONBytes)
	if err != nil {
		return "", errors.New("failed to put lab result in world state: " + err.Error())
	}

	log.Printf("Practitioner with ID: %s created successfully", practitioner.ID.Value)
	return `{"message": "Practitioner created successfully"}`, nil
}

// ReadPractitioner retrieves a practitioner record from the ledger
func (c *PractitionerContract) ReadPractitioner(ctx contractapi.TransactionContextInterface, practitionerID string) (string, error) {
	practitionerJSON, err := ctx.GetStub().GetState(practitionerID)
	if err != nil {
		return "", errors.New("failed to read practitioner: " + err.Error())
	}
	if practitionerJSON == nil {
		return "", errors.New("practitioner does not exist: " + practitionerID)
	}

	return string(practitionerJSON), nil
}

// UpdatePractitioner updates an existing practitioner record in the ledger
func (c *PractitionerContract) UpdatePractitioner(ctx contractapi.TransactionContextInterface, practitionerID string, practitionerJSON string) (string, error) {
	exists, err := ctx.GetStub().GetState(practitionerID)
	if err != nil {
		return "", errors.New("failed to get practitioner: " + err.Error())
	}
	if exists == nil {
		return "", errors.New("practitioner does not exist: " + practitionerID)
	}

	var practitioner Practitioner
	err = json.Unmarshal([]byte(practitionerJSON), &practitioner)
	if err != nil {
		return "", errors.New("failed to unmarshal practitioner: " + err.Error())
	}

	practitionerJSONBytes, err := json.Marshal(practitioner)
	if err != nil {
		return "", errors.New("failed to marshal practitioner: " + err.Error())
	}

	// Update the practitioner record in the ledger
	err = ctx.GetStub().PutState(practitionerID, practitionerJSONBytes)
	if err != nil {
		return "", errors.New("failed to update practitioner: " + err.Error())
	}

	return `{"message": "Practitioner updated successfully"}`, nil
}

// DeletePractitioner removes a practitioner record from the ledger
func (c *PractitionerContract) DeletePractitioner(ctx contractapi.TransactionContextInterface, practitionerID string) (string, error) {
	exists, err := ctx.GetStub().GetState(practitionerID)
	if err != nil {
		return "", errors.New("failed to get practitioner: " + err.Error())
	}
	if exists == nil {
		return "", errors.New("practitioner does not exist: " + practitionerID)
	}

	// Remove the practitioner record
	err = ctx.GetStub().DelState(practitionerID)
	if err != nil {
		return "", errors.New("failed to delete practitioner: " + err.Error())
	}

	return `{"message": "Practitioner deleted successfully"}`, nil
}

// CreateCondition adds a new condition record to the ledger
func (c *PractitionerContract) CreateCondition(ctx contractapi.TransactionContextInterface, conditionID string, conditionJSON string) (string, error) {
	exists, err := ctx.GetStub().GetState(conditionID)
	if err != nil {
		return "", errors.New("failed to get condition: " + err.Error())
	}
	if exists != nil {
		return "", errors.New("condition already exists: " + conditionID)
	}

	var condition Condition
	err = json.Unmarshal([]byte(conditionJSON), &condition)
	if err != nil {
		return "", errors.New("failed to unmarshal condition: " + err.Error())
	}

	conditionJSONBytes, err := json.Marshal(condition)
	if err != nil {
		return "", errors.New("failed to marshal condition: " + err.Error())
	}

	// Save the new condition to the ledger
	err = ctx.GetStub().PutState(conditionID, conditionJSONBytes)
	if err != nil {
		return "", errors.New("failed to put condition in world state: " + err.Error())
	}

	return `{"message": "Condition created successfully"}`, nil
}

// ReadCondition retrieves a condition record from the ledger
func (c *PractitionerContract) ReadCondition(ctx contractapi.TransactionContextInterface, conditionID string) (string, error) {
	conditionJSON, err := ctx.GetStub().GetState(conditionID)
	if err != nil {
		return "", errors.New("failed to read condition: " + err.Error())
	}
	if conditionJSON == nil {
		return "", errors.New("condition does not exist: " + conditionID)
	}

	return string(conditionJSON), nil
}

// UpdateCondition updates an existing condition record in the ledger
func (c *PractitionerContract) UpdateCondition(ctx contractapi.TransactionContextInterface, conditionID string, conditionJSON string) (string, error) {
	exists, err := ctx.GetStub().GetState(conditionID)
	if err != nil {
		return "", errors.New("failed to get condition: " + err.Error())
	}
	if exists == nil {
		return "", errors.New("condition does not exist: " + conditionID)
	}

	var condition Condition
	err = json.Unmarshal([]byte(conditionJSON), &condition)
	if err != nil {
		return "", errors.New("failed to unmarshal condition: " + err.Error())
	}

	conditionJSONBytes, err := json.Marshal(condition)
	if err != nil {
		return "", errors.New("failed to marshal condition: " + err.Error())
	}

	// Update the condition record in the ledger
	err = ctx.GetStub().PutState(conditionID, conditionJSONBytes)
	if err != nil {
		return "", errors.New("failed to update condition: " + err.Error())
	}

	return `{"message": "Condition updated successfully"}`, nil
}

// DeleteCondition removes a condition record from the ledger
func (c *PractitionerContract) DeleteCondition(ctx contractapi.TransactionContextInterface, conditionID string) (string, error) {
	exists, err := ctx.GetStub().GetState(conditionID)
	if err != nil {
		return "", errors.New("failed to get condition: " + err.Error())
	}
	if exists == nil {
		return "", errors.New("condition does not exist: " + conditionID)
	}

	// Remove the condition record
	err = ctx.GetStub().DelState(conditionID)
	if err != nil {
		return "", errors.New("failed to delete condition: " + err.Error())
	}

	return `{"message": "Condition deleted successfully"}`, nil
}

// CreateProcedure adds a new procedure record to the ledger
func (c *PractitionerContract) CreateProcedure(ctx contractapi.TransactionContextInterface, procedureID string, procedureJSON string) (string, error) {
	exists, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return "", errors.New("failed to get procedure: " + err.Error())
	}
	if exists != nil {
		return "", errors.New("procedure already exists: " + procedureID)
	}

	var procedure Procedure
	err = json.Unmarshal([]byte(procedureJSON), &procedure)
	if err != nil {
		return "", errors.New("failed to unmarshal procedure: " + err.Error())
	}

	procedureJSONBytes, err := json.Marshal(procedure)
	if err != nil {
		return "", errors.New("failed to marshal procedure: " + err.Error())
	}

	// Save the new procedure to the ledger
	err = ctx.GetStub().PutState(procedureID, procedureJSONBytes)
	if err != nil {
		return "", errors.New("failed to put procedure in world state: " + err.Error())
	}

	return `{"message": "Procedure created successfully"}`, nil
}

// ReadProcedure retrieves a procedure record from the ledger
func (c *PractitionerContract) ReadProcedure(ctx contractapi.TransactionContextInterface, procedureID string) (string, error) {
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return "", errors.New("failed to read procedure: " + err.Error())
	}
	if procedureJSON == nil {
		return "", errors.New("procedure does not exist: " + procedureID)
	}

	return string(procedureJSON), nil
}

// UpdateProcedure updates an existing procedure record in the ledger
func (c *PractitionerContract) UpdateProcedure(ctx contractapi.TransactionContextInterface, procedureID string, procedureJSON string) (string, error) {
	exists, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return "", errors.New("failed to get procedure: " + err.Error())
	}
	if exists == nil {
		return "", errors.New("procedure does not exist: " + procedureID)
	}

	var procedure Procedure
	err = json.Unmarshal([]byte(procedureJSON), &procedure)
	if err != nil {
		return "", errors.New("failed to unmarshal procedure: " + err.Error())
	}

	procedureJSONBytes, err := json.Marshal(procedure)
	if err != nil {
		return "", errors.New("failed to marshal procedure: " + err.Error())
	}

	// Update the procedure record in the ledger
	err = ctx.GetStub().PutState(procedureID, procedureJSONBytes)
	if err != nil {
		return "", errors.New("failed to update procedure: " + err.Error())
	}

	return `{"message": "Procedure updated successfully"}`, nil
}

// DeleteProcedure removes a procedure record from the ledger
func (c *PractitionerContract) DeleteProcedure(ctx contractapi.TransactionContextInterface, procedureID string) (string, error) {
	exists, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return "", errors.New("failed to get procedure: " + err.Error())
	}
	if exists == nil {
		return "", errors.New("procedure does not exist: " + procedureID)
	}

	// Remove the procedure record
	err = ctx.GetStub().DelState(procedureID)
	if err != nil {
		return "", errors.New("failed to delete procedure: " + err.Error())
	}

	return `{"message": "Procedure deleted successfully"}`, nil
}

// CreateAnnotation adds a new annotation record to the ledger
func (c *PractitionerContract) CreateAnnotation(ctx contractapi.TransactionContextInterface, procedureID string, annotationJSON string) (string, error) {
	// Check if the procedure exists
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return "", errors.New("failed to get procedure: " + err.Error())
	}
	if procedureJSON == nil {
		return "", errors.New("procedure does not exist: " + procedureID)
	}

	// Retrieve the procedure from the ledger
	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return "", errors.New("failed to unmarshal procedure: " + err.Error())
	}

	// Unmarshal the annotation JSON into a struct
	var annotation Annotation
	err = json.Unmarshal([]byte(annotationJSON), &annotation)
	if err != nil {
		return "", errors.New("failed to unmarshal annotation: " + err.Error())
	}

	// Add the annotation to the procedure
	procedure.Note = append(procedure.Note, annotation)

	// Marshal the updated procedure back to JSON
	updatedProcedureJSON, err := json.Marshal(procedure)
	if err != nil {
		return "", errors.New("failed to marshal updated procedure: " + err.Error())
	}

	// Update the procedure record in the ledger
	err = ctx.GetStub().PutState(procedureID, updatedProcedureJSON)
	if err != nil {
		return "", errors.New("failed to update procedure: " + err.Error())
	}

	return `{"message": "Annotation created successfully"}`, nil
}

// ReadAnnotation retrieves an annotation record from the ledger
func (c *PractitionerContract) ReadAnnotation(ctx contractapi.TransactionContextInterface, procedureID string, annotationIndex int) (string, error) {
	// Retrieve the procedure from the ledger
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return "", errors.New("failed to read procedure: " + err.Error())
	}
	if procedureJSON == nil {
		return "", errors.New("procedure does not exist: " + procedureID)
	}

	// Unmarshal the procedure JSON into a struct
	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return "", errors.New("failed to unmarshal procedure: " + err.Error())
	}

	// Check if the annotation index is valid
	if annotationIndex < 0 || annotationIndex >= len(procedure.Note) {
		return "", errors.New("invalid annotation index")
	}

	// Retrieve the annotation from the procedure
	annotationJSON, err := json.Marshal(procedure.Note[annotationIndex])
	if err != nil {
		return "", errors.New("failed to marshal annotation: " + err.Error())
	}

	return string(annotationJSON), nil
}

// UpdateAnnotation updates an existing annotation record in the ledger
func (c *PractitionerContract) UpdateAnnotation(ctx contractapi.TransactionContextInterface, procedureID string, annotationIndex int, annotationJSON string) (string, error) {
	// Retrieve the procedure from the ledger
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return "", errors.New("failed to read procedure: " + err.Error())
	}
	if procedureJSON == nil {
		return "", errors.New("procedure does not exist: " + procedureID)
	}

	// Unmarshal the procedure JSON into a struct
	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return "", errors.New("failed to unmarshal procedure: " + err.Error())
	}

	// Check if the annotation index is valid
	if annotationIndex < 0 || annotationIndex >= len(procedure.Note) {
		return "", errors.New("invalid annotation index")
	}

	// Unmarshal the updated annotation JSON into a struct
	var updatedAnnotation Annotation
	err = json.Unmarshal([]byte(annotationJSON), &updatedAnnotation)
	if err != nil {
		return "", errors.New("failed to unmarshal updated annotation: " + err.Error())
	}

	// Update the annotation in the procedure
	procedure.Note[annotationIndex] = updatedAnnotation

	// Marshal the updated procedure back to JSON
	updatedProcedureJSON, err := json.Marshal(procedure)
	if err != nil {
		return "", errors.New("failed to marshal updated procedure: " + err.Error())
	}

	// Update the procedure record in the ledger
	err = ctx.GetStub().PutState(procedureID, updatedProcedureJSON)
	if err != nil {
		return "", errors.New("failed to update procedure: " + err.Error())
	}

	return `{"message": "Annotation updated successfully"}`, nil
}

// DeleteAnnotation removes an annotation record from the ledger
func (c *PractitionerContract) DeleteAnnotation(ctx contractapi.TransactionContextInterface, procedureID string, annotationIndex int) (string, error) {
	// Retrieve the procedure from the ledger
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return "", errors.New("failed to read procedure: " + err.Error())
	}
	if procedureJSON == nil {
		return "", errors.New("procedure does not exist: " + procedureID)
	}

	// Unmarshal the procedure JSON into a struct
	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return "", errors.New("failed to unmarshal procedure: " + err.Error())
	}

	// Check if the annotation index is valid
	if annotationIndex < 0 || annotationIndex >= len(procedure.Note) {
		return "", errors.New("invalid annotation index")
	}

	procedure.Note = append(procedure.Note[:annotationIndex], procedure.Note[annotationIndex+1:]...)

	updatedProcedureJSON, err := json.Marshal(procedure)
	if err != nil {
		return "", errors.New("failed to marshal updated procedure: " + err.Error())
	}

	err = ctx.GetStub().PutState(procedureID, updatedProcedureJSON)
	if err != nil {
		return "", errors.New("failed to update procedure: " + err.Error())
	}

	return `{"message": "Annotation deleted successfully"}`, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(PractitionerContract))
	if err != nil {
		log.Panic(errors.New("error creating practitioner chaincode: " + err.Error()))
	}

	if err := chaincode.Start(); err != nil {
		log.Panic(errors.New("error starting practitioner chaincode: " + err.Error()))
	}
}
