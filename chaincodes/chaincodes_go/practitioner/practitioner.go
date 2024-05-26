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
func (c *PractitionerContract) CreatePractitioner(ctx contractapi.TransactionContextInterface, practitionerJSON string) error {

	log.Printf("Practitioner JSON from param: %s", string(practitionerJSON))

	// Deserialize JSON data into a Go data structure
	var practitioner Practitioner
	err := json.Unmarshal([]byte(practitionerJSON), &practitioner)
	if err != nil {
		return errors.New("failed to unmarshal practitioner: " + err.Error())
	}

	log.Printf("Practitioner struct unmarshalled: %+v", practitioner)

	// Check if the practitioner request ID is provided and if it already exists
	if practitioner.ID.Value == "" {
		return errors.New("practitioner request ID is required")
	}

	existingPractitioner, err := ctx.GetStub().GetState(practitioner.ID.Value)
	if err != nil {
		return errors.New("failed to get practitioner: " + practitioner.ID.Value + " from world state")
	}
	if existingPractitioner != nil {
		return errors.New("practitioner already exists: " + practitioner.ID.Value)
	}

	// Serialize the practitioner and save it on the blockchain
	practitionerJSONBytes, err := json.Marshal(practitioner)
	if err != nil {
		return errors.New("failed to marshal practitioner: " + err.Error())
	}

	err = ctx.GetStub().PutState(practitioner.ID.Value, practitionerJSONBytes)
	if err != nil {
		return errors.New("failed to put practitioner in world state: " + err.Error())
	}

	log.Printf("Practitioner with ID: %s created successfully", practitioner.ID.Value)
	return nil
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

	log.Printf("Practitioner JSON from ledger: %s", string(practitionerJSON))

	var practitioner Practitioner
	err = json.Unmarshal(practitionerJSON, &practitioner)
	if err != nil {
		return "", errors.New("failed to unmarshal practitioner: " + err.Error())
	}

	log.Printf("Practitioner object: %+v", practitioner)

	return string(practitionerJSON), nil
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

	if err := ctx.GetStub().PutState(practitionerID, practitionerJSONBytes); err != nil {
		return errors.New("failed to put state: " + err.Error())
	}

	return nil
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
	err = ctx.GetStub().DelState(practitionerID)
	if err != nil {
		return errors.New("failed to delete practitioner: " + err.Error())
	}

	return nil
}

// CreateCondition adds a new condition record to the ledger
func (c *PractitionerContract) CreateCondition(ctx contractapi.TransactionContextInterface, conditionID string, conditionJSON string) error {

	log.Printf("Condition JSON from param: %s", string(conditionJSON))

	existingCondition, err := ctx.GetStub().GetState(conditionID)
	if err != nil {
		return errors.New("failed to get condition: " + err.Error())
	}
	if existingCondition != nil {
		return errors.New("condition already exists: " + conditionID)
	}

	var condition Condition
	err = json.Unmarshal([]byte(conditionJSON), &condition)
	if err != nil {
		return errors.New("failed to unmarshal condition: " + err.Error())
	}

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return errors.New("failed to get client ID attribute: " + err.Error())
	}
	if !exists {
		return errors.New("client ID attribute does not exist")
	}
	patientref := condition.Subject.Reference
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	conditionJSONBytes, err := json.Marshal(condition)
	if err != nil {
		return errors.New("failed to marshal condition: " + err.Error())
	}

	log.Printf("Condition with ID: %s created successfully", condition.ID.Value)
	log.Printf("Serialized Encounter JSON: %s", string(conditionJSONBytes))

	// Save the new condition to the ledger
	err = ctx.GetStub().PutState(conditionID, conditionJSONBytes)
	if err != nil {
		return errors.New("failed to put condition in world state: " + err.Error())
	}

	return nil
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

	log.Printf("Condtion JSON from ledger: %s", string(conditionJSON))

	var condition Condition
	err = json.Unmarshal(conditionJSON, &condition)
	if err != nil {
		return "", errors.New("failed to unmarshal condition: " + err.Error())
	}

	log.Printf("Encounter object: %+v", condition)

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return "", errors.New("failed to get client ID attribute: " + err.Error())
	}
	if !exists {
		return "", errors.New("client ID attribute does not exist")
	}
	patientref := condition.Subject.Reference
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return "", errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	return string(conditionJSON), nil
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

	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return errors.New("failed to get client ID")
	}

	patientref := condition.Subject.Reference
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	conditionJSONBytes, err := json.Marshal(condition)
	if err != nil {
		return errors.New("failed to marshal condition: " + err.Error())
	}

	// Update the condition record in the ledger
	if err := ctx.GetStub().PutState(conditionID, conditionJSONBytes); err != nil {
		return errors.New("failed to put state: " + err.Error())
	}

	return nil
}

// DeleteCondition removes a condition record from the ledger
func (c *PractitionerContract) DeleteCondition(ctx contractapi.TransactionContextInterface, conditionID string) error {
	existingCondition, err := ctx.GetStub().GetState(conditionID)
	if err != nil {
		return errors.New("failed to get condition: " + err.Error())
	}
	if existingCondition == nil {
		return errors.New("condition does not exist: " + conditionID)
	}

	var condition Condition
	err = json.Unmarshal([]byte(existingCondition), &condition)
	if err != nil {
		return errors.New("failed to unmarshal condition: " + err.Error())
	}

	clientID, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return errors.New("failed to get client ID")
	}

	patientref := condition.Subject.Reference
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	// Remove the condition record
	err = ctx.GetStub().DelState(conditionID)
	if err != nil {
		return errors.New("failed to delete condition: " + err.Error())
	}

	return nil
}

// CreateProcedure adds a new procedure record to the ledger
func (c *PractitionerContract) CreateProcedure(ctx contractapi.TransactionContextInterface, procedureJSON string) error {

	log.Printf("ProcedureJSON from param: %s", string(procedureJSON))

	var procedure Procedure
	err := json.Unmarshal([]byte(procedureJSON), &procedure)
	if err != nil {
		return errors.New("failed to unmarshal procedure: " + err.Error())
	}

	// Check if the practitioner request ID is provided and if it already exists
	if procedure.ID.Value == "" {
		return errors.New("procedure request ID is required")
	}

	log.Printf("Procedure struct unmarshalled: %+v", procedure)

	existingProcedure, err := ctx.GetStub().GetState(procedure.ID.Value)
	if err != nil {
		return errors.New("failed to get procedure: " + err.Error())
	}
	if existingProcedure != nil {
		return errors.New("procedure already exists: " + procedure.ID.Value)
	}

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return errors.New("failed to get client ID attribute: " + err.Error())
	}
	if !exists {
		return errors.New("client ID attribute does not exist")
	}
	patientref := procedure.Subject.Reference
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	procedureJSONBytes, err := json.Marshal(procedure)
	if err != nil {
		return errors.New("failed to marshal procedure: " + err.Error())
	}

	// Save the new procedure to the ledger
	return ctx.GetStub().PutState(procedure.ID.Value, procedureJSONBytes)
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

	log.Printf("Procedure JSON from ledger: %s", string(procedureJSON))

	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return "", errors.New("failed to unmarshal procedure: " + err.Error())
	}

	log.Printf("Procedure object: %+v", procedure)

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return "", errors.New("failed to get client ID attribute: " + err.Error())
	}
	if !exists {
		return "", errors.New("client ID attribute does not exist")
	}

	patientref := procedure.Subject.Reference
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return "", errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	return string(procedureJSON), nil
}

// UpdateProcedure updates an existing procedure record in the ledger
func (c *PractitionerContract) UpdateProcedure(ctx contractapi.TransactionContextInterface, procedureID string, procedureJSON string) error {
	existingProcedure, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return errors.New("failed to get procedure: " + err.Error())
	}
	if existingProcedure == nil {
		return errors.New("procedure does not exist: " + procedureID)
	}

	var procedure Procedure
	err = json.Unmarshal([]byte(procedureJSON), &procedure)
	if err != nil {
		return errors.New("failed to unmarshal procedure: " + err.Error())
	}

	log.Printf("Procedure object: %+v", procedure)

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return errors.New("failed to get client ID attribute: " + err.Error())
	}
	if !exists {
		return errors.New("client ID attribute does not exist")
	}

	patientref := procedure.Subject.Reference
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	procedureJSONBytes, err := json.Marshal(procedure)
	if err != nil {
		return errors.New("failed to marshal procedure: " + err.Error())
	}

	// Update the procedure record in the ledger
	err = ctx.GetStub().PutState(procedureID, procedureJSONBytes)
	if err != nil {
		return errors.New("failed to update procedure: " + err.Error())
	}

	return nil
}

// DeleteProcedure removes a procedure record from the ledger
func (c *PractitionerContract) DeleteProcedure(ctx contractapi.TransactionContextInterface, procedureID string) error {
	existingProcedure, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return errors.New("failed to get procedure: " + err.Error())
	}
	if existingProcedure == nil {
		return errors.New("procedure does not exist: " + procedureID)
	}

	var procedure Procedure
	err = json.Unmarshal([]byte(existingProcedure), &procedure)
	if err != nil {
		return errors.New("failed to unmarshal procedure: " + err.Error())
	}

	log.Printf("Procedure object: %+v", procedure)

	clientID, exists, err := ctx.GetClientIdentity().GetAttributeValue("userId")
	if err != nil {
		return errors.New("failed to get client ID attribute: " + err.Error())
	}
	if !exists {
		return errors.New("client ID attribute does not exist")
	}

	patientref := procedure.Subject.Reference
	chaincodeName := "patient"
	functionName := "IsAuthorized"

	invokeArgs := [][]byte{[]byte(functionName), []byte(patientref), []byte(clientID)}

	response := ctx.GetStub().InvokeChaincode(chaincodeName, invokeArgs, ctx.GetStub().GetChannelID())
	if response.Status != 200 {
		return errors.New("failed to invoke chaincode: " + response.Message)
	}

	log.Printf("Client ID: %s", clientID)
	log.Printf("Patient ID: %s", patientref)

	// Remove the procedure record
	err = ctx.GetStub().DelState(procedureID)
	if err != nil {
		return errors.New("failed to delete procedure: " + err.Error())
	}

	return nil
}

// CreateAnnotation adds a new annotation record to the ledger
func (c *PractitionerContract) CreateAnnotation(ctx contractapi.TransactionContextInterface, procedureID string, annotationJSON string) error {
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

	return c.UpdateProcedure(ctx, procedureID, string(updatedProcedureJSON))
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

	return c.UpdateProcedure(ctx, procedureID, string(updatedProcedureJSON))
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

	procedure.Note = append(procedure.Note[:annotationIndex], procedure.Note[annotationIndex+1:]...)

	updatedProcedureJSON, err := json.Marshal(procedure)
	if err != nil {
		return errors.New("failed to marshal updated procedure: " + err.Error())
	}

	return c.UpdateProcedure(ctx, procedureID, string(updatedProcedureJSON))
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
