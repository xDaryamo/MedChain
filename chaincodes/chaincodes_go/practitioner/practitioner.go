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

/*
================================
		CRUD OPERATIONS
================================
*/

// CreatePractitioner adds a new practitioner record to the ledger
func (c *PractitionerContract) CreatePractitioner(ctx contractapi.TransactionContextInterface, practitionerID string, practitionerJSON string) error {
	exists, err := ctx.GetStub().GetState(practitionerID)
	if err != nil {
		return errors.New("failed to get practitioner: " + err.Error())
	}
	if exists != nil {
		return errors.New("practitioner already exists: " + practitionerID)
	}

	var practitioner Practitioner
	err = json.Unmarshal([]byte(practitionerJSON), &practitioner)
	if err != nil {
		return errors.New("failed to unmarshal practitioner: " + err.Error())
	}

	practitionerJSONBytes, err := json.Marshal(practitioner)
	if err != nil {
		return errors.New("failed to marshal practitioner: " + err.Error())
	}

	// Save the new practitioner to the ledger
	return ctx.GetStub().PutState(practitionerID, practitionerJSONBytes)
}

// ReadPractitioner retrieves a practitioner record from the ledger
func (c *PractitionerContract) ReadPractitioner(ctx contractapi.TransactionContextInterface, practitionerID string) (*Practitioner, error) {
	practitionerJSON, err := ctx.GetStub().GetState(practitionerID)
	if err != nil {
		return nil, errors.New("failed to read practitioner: " + err.Error())
	}
	if practitionerJSON == nil {
		return nil, errors.New("practitioner does not exist: " + practitionerID)
	}

	var practitioner Practitioner
	err = json.Unmarshal(practitionerJSON, &practitioner)
	if err != nil {
		return nil, errors.New("failed to unmarshal practitioner: " + err.Error())
	}

	return &practitioner, nil
}

// UpdatePractitioner updates an existing practitioner record in the ledger
func (c *PractitionerContract) UpdatePractitioner(ctx contractapi.TransactionContextInterface, practitionerID string, practitionerJSON string) error {
	exists, err := ctx.GetStub().GetState(practitionerID)
	if err != nil {
		return errors.New("failed to get practitioner: " + err.Error())
	}
	if exists == nil {
		return errors.New("practitioner does not exist: " + practitionerID)
	}

	var practitioner Practitioner
	err = json.Unmarshal([]byte(practitionerJSON), &practitioner)
	if err != nil {
		return errors.New("failed to unmarshal practitioner: " + err.Error())
	}

	practitionerJSONBytes, err := json.Marshal(practitioner)
	if err != nil {
		return errors.New("failed to marshal practitioner: " + err.Error())
	}

	// Update the practitioner record in the ledger
	return ctx.GetStub().PutState(practitionerID, practitionerJSONBytes)
}

// DeletePractitioner removes a practitioner record from the ledger
func (c *PractitionerContract) DeletePractitioner(ctx contractapi.TransactionContextInterface, practitionerID string) error {
	exists, err := ctx.GetStub().GetState(practitionerID)
	if err != nil {
		return errors.New("failed to get practitioner: " + err.Error())
	}
	if exists == nil {
		return errors.New("practitioner does not exist: " + practitionerID)
	}

	// Remove the practitioner record
	return ctx.GetStub().DelState(practitionerID)
}

// CreateCondition adds a new condition record to the ledger
func (c *PractitionerContract) CreateCondition(ctx contractapi.TransactionContextInterface, conditionID string, conditionJSON string) error {
	exists, err := ctx.GetStub().GetState(conditionID)
	if err != nil {
		return errors.New("failed to get condition: " + err.Error())
	}
	if exists != nil {
		return errors.New("condition already exists: " + conditionID)
	}

	var condition Condition
	err = json.Unmarshal([]byte(conditionJSON), &condition)
	if err != nil {
		return errors.New("failed to unmarshal condition: " + err.Error())
	}

	conditionJSONBytes, err := json.Marshal(condition)
	if err != nil {
		return errors.New("failed to marshal condition: " + err.Error())
	}

	// Save the new condition to the ledger
	return ctx.GetStub().PutState(conditionID, conditionJSONBytes)
}

// ReadCondition retrieves a condition record from the ledger
func (c *PractitionerContract) ReadCondition(ctx contractapi.TransactionContextInterface, conditionID string) (*Condition, error) {
	conditionJSON, err := ctx.GetStub().GetState(conditionID)
	if err != nil {
		return nil, errors.New("failed to read condition: " + err.Error())
	}
	if conditionJSON == nil {
		return nil, errors.New("condition does not exist: " + conditionID)
	}

	var condition Condition
	err = json.Unmarshal(conditionJSON, &condition)
	if err != nil {
		return nil, errors.New("failed to unmarshal condition: " + err.Error())
	}

	return &condition, nil
}

// UpdateCondition updates an existing condition record in the ledger
func (c *PractitionerContract) UpdateCondition(ctx contractapi.TransactionContextInterface, conditionID string, conditionJSON string) error {
	exists, err := ctx.GetStub().GetState(conditionID)
	if err != nil {
		return errors.New("failed to get condition: " + err.Error())
	}
	if exists == nil {
		return errors.New("condition does not exist: " + conditionID)
	}

	var condition Condition
	err = json.Unmarshal([]byte(conditionJSON), &condition)
	if err != nil {
		return errors.New("failed to unmarshal condition: " + err.Error())
	}

	conditionJSONBytes, err := json.Marshal(condition)
	if err != nil {
		return errors.New("failed to marshal condition: " + err.Error())
	}

	// Update the condition record in the ledger
	return ctx.GetStub().PutState(conditionID, conditionJSONBytes)
}

// DeleteCondition removes a condition record from the ledger
func (c *PractitionerContract) DeleteCondition(ctx contractapi.TransactionContextInterface, conditionID string) error {
	exists, err := ctx.GetStub().GetState(conditionID)
	if err != nil {
		return errors.New("failed to get condition: " + err.Error())
	}
	if exists == nil {
		return errors.New("condition does not exist: " + conditionID)
	}

	// Remove the condition record
	return ctx.GetStub().DelState(conditionID)
}

// CreateProcedure adds a new procedure record to the ledger
func (c *PractitionerContract) CreateProcedure(ctx contractapi.TransactionContextInterface, procedureID string, procedureJSON string) error {
	exists, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return errors.New("failed to get procedure: " + err.Error())
	}
	if exists != nil {
		return errors.New("procedure already exists: " + procedureID)
	}

	var procedure Procedure
	err = json.Unmarshal([]byte(procedureJSON), &procedure)
	if err != nil {
		return errors.New("failed to unmarshal procedure: " + err.Error())
	}

	procedureJSONBytes, err := json.Marshal(procedure)
	if err != nil {
		return errors.New("failed to marshal procedure: " + err.Error())
	}

	// Save the new procedure to the ledger
	return ctx.GetStub().PutState(procedureID, procedureJSONBytes)
}

// ReadProcedure retrieves a procedure record from the ledger
func (c *PractitionerContract) ReadProcedure(ctx contractapi.TransactionContextInterface, procedureID string) (*Procedure, error) {
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return nil, errors.New("failed to read procedure: " + err.Error())
	}
	if procedureJSON == nil {
		return nil, errors.New("procedure does not exist: " + procedureID)
	}

	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return nil, errors.New("failed to unmarshal procedure: " + err.Error())
	}

	return &procedure, nil
}

// UpdateProcedure updates an existing procedure record in the ledger
func (c *PractitionerContract) UpdateProcedure(ctx contractapi.TransactionContextInterface, procedureID string, procedureJSON string) error {
	exists, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return errors.New("failed to get procedure: " + err.Error())
	}
	if exists == nil {
		return errors.New("procedure does not exist: " + procedureID)
	}

	var procedure Procedure
	err = json.Unmarshal([]byte(procedureJSON), &procedure)
	if err != nil {
		return errors.New("failed to unmarshal procedure: " + err.Error())
	}

	procedureJSONBytes, err := json.Marshal(procedure)
	if err != nil {
		return errors.New("failed to marshal procedure: " + err.Error())
	}

	// Update the procedure record in the ledger
	return ctx.GetStub().PutState(procedureID, procedureJSONBytes)
}

// DeleteProcedure removes a procedure record from the ledger
func (c *PractitionerContract) DeleteProcedure(ctx contractapi.TransactionContextInterface, procedureID string) error {
	exists, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return errors.New("failed to get procedure: " + err.Error())
	}
	if exists == nil {
		return errors.New("procedure does not exist: " + procedureID)
	}

	// Remove the procedure record
	return ctx.GetStub().DelState(procedureID)
}

// CreateAnnotation adds a new annotation record to the ledger
func (c *PractitionerContract) CreateAnnotation(ctx contractapi.TransactionContextInterface, procedureID string, annotationID string, annotationJSON string) error {
	// Check if the procedure exists
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return errors.New("failed to get procedure: " + err.Error())
	}
	if procedureJSON == nil {
		return errors.New("procedure does not exist: " + procedureID)
	}

	// Retrieve the procedure from the ledger
	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return errors.New("failed to unmarshal procedure: " + err.Error())
	}

	// Unmarshal the annotation JSON into a struct
	var annotation Annotation
	err = json.Unmarshal([]byte(annotationJSON), &annotation)
	if err != nil {
		return errors.New("failed to unmarshal annotation: " + err.Error())
	}

	// Add the annotation to the procedure
	procedure.Note = append(procedure.Note, annotation)

	// Marshal the updated procedure back to JSON
	updatedProcedureJSON, err := json.Marshal(procedure)
	if err != nil {
		return errors.New("failed to marshal updated procedure: " + err.Error())
	}

	// Update the procedure record in the ledger
	err = ctx.GetStub().PutState(procedureID, updatedProcedureJSON)
	if err != nil {
		return errors.New("failed to update procedure: " + err.Error())
	}

	return nil
}

// ReadAnnotation retrieves an annotation record from the ledger
func (c *PractitionerContract) ReadAnnotation(ctx contractapi.TransactionContextInterface, procedureID string, annotationIndex int) (*Annotation, error) {
	// Retrieve the procedure from the ledger
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return nil, errors.New("failed to read procedure: " + err.Error())
	}
	if procedureJSON == nil {
		return nil, errors.New("procedure does not exist: " + procedureID)
	}

	// Unmarshal the procedure JSON into a struct
	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return nil, errors.New("failed to unmarshal procedure: " + err.Error())
	}

	// Check if the annotation index is valid
	if annotationIndex < 0 || annotationIndex >= len(procedure.Note) {
		return nil, errors.New("invalid annotation index")
	}

	// Retrieve the annotation from the procedure
	annotation := procedure.Note[annotationIndex]

	return &annotation, nil
}

// UpdateAnnotation updates an existing annotation record in the ledger
func (c *PractitionerContract) UpdateAnnotation(ctx contractapi.TransactionContextInterface, procedureID string, annotationIndex int, annotationJSON string) error {
	// Retrieve the procedure from the ledger
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return errors.New("failed to read procedure: " + err.Error())
	}
	if procedureJSON == nil {
		return errors.New("procedure does not exist: " + procedureID)
	}

	// Unmarshal the procedure JSON into a struct
	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return errors.New("failed to unmarshal procedure: " + err.Error())
	}

	// Check if the annotation index is valid
	if annotationIndex < 0 || annotationIndex >= len(procedure.Note) {
		return errors.New("invalid annotation index")
	}

	// Unmarshal the updated annotation JSON into a struct
	var updatedAnnotation Annotation
	err = json.Unmarshal([]byte(annotationJSON), &updatedAnnotation)
	if err != nil {
		return errors.New("failed to unmarshal updated annotation: " + err.Error())
	}

	// Update the annotation in the procedure
	procedure.Note[annotationIndex] = updatedAnnotation

	// Marshal the updated procedure back to JSON
	updatedProcedureJSON, err := json.Marshal(procedure)
	if err != nil {
		return errors.New("failed to marshal updated procedure: " + err.Error())
	}

	// Update the procedure record in the ledger
	err = ctx.GetStub().PutState(procedureID, updatedProcedureJSON)
	if err != nil {
		return errors.New("failed to update procedure: " + err.Error())
	}

	return nil
}

// DeleteAnnotation removes an annotation record from the ledger
func (c *PractitionerContract) DeleteAnnotation(ctx contractapi.TransactionContextInterface, procedureID string, annotationIndex int) error {
	// Retrieve the procedure from the ledger
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return errors.New("failed to read procedure: " + err.Error())
	}
	if procedureJSON == nil {
		return errors.New("procedure does not exist: " + procedureID)
	}

	// Unmarshal the procedure JSON into a struct
	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return errors.New("failed to unmarshal procedure: " + err.Error())
	}

	// Check if the annotation index is valid
	if annotationIndex < 0 || annotationIndex >= len(procedure.Note) {
		return errors.New("invalid annotation index")
	}

	// Remove the annotation from the procedure
	procedure.Note = append(procedure.Note[:annotationIndex], procedure.Note[annotationIndex+1:]...)

	// Marshal the updated procedure back to JSON
	updatedProcedureJSON, err := json.Marshal(procedure)
	if err != nil {
		return errors.New("failed to marshal updated procedure: " + err.Error())
	}

	// Update the procedure record in the ledger
	err = ctx.GetStub().PutState(procedureID, updatedProcedureJSON)
	if err != nil {
		return errors.New("failed to update procedure: " + err.Error())
	}

	return nil
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
