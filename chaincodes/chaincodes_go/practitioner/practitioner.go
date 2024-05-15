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
	// Deserialize JSON data into a Go data structure
	var practitioner Practitioner
	err := json.Unmarshal([]byte(practitionerJSON), &practitioner)
	if err != nil {
		return errors.New("failed to unmarshal practitioner: " + err.Error())
	}

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

	return ctx.GetStub().PutState(practitioner.ID.Value, practitionerJSONBytes)
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
func (c *PractitionerContract) CreateAnnotation(ctx contractapi.TransactionContextInterface, annotationID string, annotationJSON string) error {
	exists, err := ctx.GetStub().GetState(annotationID)
	if err != nil {
		return errors.New("failed to get annotation: " + err.Error())
	}
	if exists != nil {
		return errors.New("annotation already exists: " + annotationID)
	}

	var annotation Annotation
	err = json.Unmarshal([]byte(annotationJSON), &annotation)
	if err != nil {
		return errors.New("failed to unmarshal annotation: " + err.Error())
	}

	annotationJSONBytes, err := json.Marshal(annotation)
	if err != nil {
		return errors.New("failed to marshal annotation: " + err.Error())
	}

	// Save the new annotation to the ledger
	return ctx.GetStub().PutState(annotationID, annotationJSONBytes)
}

// ReadAnnotation retrieves an annotation record from the ledger
func (c *PractitionerContract) ReadAnnotation(ctx contractapi.TransactionContextInterface, annotationID string) (*Annotation, error) {
	annotationJSON, err := ctx.GetStub().GetState(annotationID)
	if err != nil {
		return nil, errors.New("failed to read annotation: " + err.Error())
	}
	if annotationJSON == nil {
		return nil, errors.New("annotation does not exist: " + annotationID)
	}

	var annotation Annotation
	err = json.Unmarshal(annotationJSON, &annotation)
	if err != nil {
		return nil, errors.New("failed to unmarshal annotation: " + err.Error())
	}

	return &annotation, nil
}

// UpdateAnnotation updates an existing annotation record in the ledger
func (c *PractitionerContract) UpdateAnnotation(ctx contractapi.TransactionContextInterface, annotationID string, annotationJSON string) error {
	exists, err := ctx.GetStub().GetState(annotationID)
	if err != nil {
		return errors.New("failed to get annotation: " + err.Error())
	}
	if exists == nil {
		return errors.New("annotation does not exist: " + annotationID)
	}

	var annotation Annotation
	err = json.Unmarshal([]byte(annotationJSON), &annotation)
	if err != nil {
		return errors.New("failed to unmarshal annotation: " + err.Error())
	}

	annotationJSONBytes, err := json.Marshal(annotation)
	if err != nil {
		return errors.New("failed to marshal annotation: " + err.Error())
	}

	// Update the annotation record in the ledger
	return ctx.GetStub().PutState(annotationID, annotationJSONBytes)
}

// DeleteAnnotation removes an annotation record from the ledger
func (c *PractitionerContract) DeleteAnnotation(ctx contractapi.TransactionContextInterface, annotationID string) error {
	exists, err := ctx.GetStub().GetState(annotationID)
	if err != nil {
		return errors.New("failed to get annotation: " + err.Error())
	}
	if exists == nil {
		return errors.New("annotation does not exist: " + annotationID)
	}

	// Remove the annotation record
	return ctx.GetStub().DelState(annotationID)
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
