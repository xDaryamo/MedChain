package main

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// MedicalRecordsChaincode represents the Chaincode for managing medical records on the blockchain
type MedicalRecordsChaincode struct {
	contractapi.Contract
}

// MedicalRecords represents the data structure for a medical record folder
type MedicalRecords struct {
	RecordID       string               `json:"identifier,omitempty"`
	PatientID      string               `json:"patientID,omitempty"`
	Allergies      []AllergyIntolerance `json:"allergies,omitempty"`
	Conditions     []Condition          `json:"conditions,omitempty"`
	Procedures     []Procedure          `json:"procedures,omitempty"`
	Prescriptions  []MedicationRequest  `json:"prescriptions,omitempty"`
	ServiceRequest *Reference           `json:"serviceRequest,omitempty"`
	Attachments    []Attachment         `json:"attachments,omitempty"`
}


// CreateMedicalRecords creates a new medical record folder for a patient
func (mc *MedicalRecordsChaincode) CreateMedicalRecords(ctx contractapi.TransactionContextInterface, medicalRecordJSON string) (string, error) {
	log.Printf("Received record:" + medicalRecordJSON)
	var medicalRecord MedicalRecords
	err := json.Unmarshal([]byte(medicalRecordJSON), &medicalRecord)
	if err != nil {
		return `{"error": "failed to unmarshal medical record: ` + err.Error() + `"}`, err
	}
	log.Printf("Unmarshalled record: %+v", medicalRecord)

	if medicalRecord.RecordID == "" {
		return `{"error": "record ID is required"}`, errors.New("record ID is required")
	}

	existingRecord, err := ctx.GetStub().GetState(medicalRecord.RecordID)
	if err != nil {
		return `{"error": "failed to get medical record for patient ` + medicalRecord.PatientID + ` from world state: ` + err.Error() + `"}`, err
	}
	if existingRecord != nil {
		return `{"error": "medical records already exist for patient ` + medicalRecord.PatientID + `"}`, errors.New("medical records already exist")
	}

	medicalRecordJSONBytes, err := json.Marshal(medicalRecord)
	if err != nil {
		return `{"error": "failed to marshal medical record: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(medicalRecord.RecordID, medicalRecordJSONBytes)
	if err != nil {
		return `{"error": "failed to put medical record in world state: ` + err.Error() + `"}`, err
	}




	return `{"message": "Record created successfully"}`, nil
}

// ReadMedicalRecords retrieves a patient's medical record folder from the blockchain
func (mc *MedicalRecordsChaincode) ReadMedicalRecords(ctx contractapi.TransactionContextInterface, recordID string) (string, error) {
	recordJSON, err := ctx.GetStub().GetState(recordID)
	if err != nil {
		return `{"error": "failed to read medical record: ` + err.Error() + `"}`, err
	}
	if recordJSON == nil {
		return `{"error": "medical record does not exist: ` + recordID + `"}`, errors.New("medical record does not exist")
	}

	var record MedicalRecords
	err = json.Unmarshal(recordJSON, &record)
	if err != nil {
		return `{"error": "failed to unmarshal medical record: ` + err.Error() + `"}`, err
	}

	return string(recordJSON), nil
}

// UpdateMedicalRecords updates an existing medical record folder for a patient
func (mc *MedicalRecordsChaincode) UpdateMedicalRecords(ctx contractapi.TransactionContextInterface, recordID string, updatedMedicalRecordJSON string) (string, error) {
	existingRecord, err := ctx.GetStub().GetState(recordID)
	if err != nil {
		return `{"error": "failed to get record: ` + err.Error() + `"}`, err
	}
	if existingRecord == nil {
		return `{"error": "record does not exist: ` + recordID + `"}`, errors.New("record does not exist")
	}

	var record MedicalRecords
	err = json.Unmarshal(existingRecord, &record)
	if err != nil {
		return `{"error": "failed to unmarshal record: ` + err.Error() + `"}`, err
	}

	var updatedRecord MedicalRecords
	if err := json.Unmarshal([]byte(updatedMedicalRecordJSON), &updatedRecord); err != nil {
		return `{"error": "failed to unmarshal record: ` + err.Error() + `"}`, err
	}

	updatedRecordJSONBytes, err := json.Marshal(updatedRecord)
	if err != nil {
		return `{"error": "failed to marshal record: ` + err.Error() + `"}`, err
	}

	if err := ctx.GetStub().PutState(updatedRecord.RecordID, updatedRecordJSONBytes); err != nil {
		return `{"error": "failed to put state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Record updated successfully"}`, nil
}

// DeleteMedicalRecords removes an existing medical record folder for a patient
func (mc *MedicalRecordsChaincode) DeleteMedicalRecords(ctx contractapi.TransactionContextInterface, recordID string) (string, error) {
	existingRecord, err := ctx.GetStub().GetState(recordID)
	if err != nil {
		return `{"error": "failed to get record: ` + err.Error() + `"}`, err
	}
	if existingRecord == nil {
		return `{"error": "record not found: ` + recordID + `"}`, errors.New("record not found")
	}

	var record MedicalRecords
	err = json.Unmarshal(existingRecord, &record)
	if err != nil {
		return `{"error": "failed to unmarshal record: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().DelState(recordID)
	if err != nil {
		return `{"error": "failed to delete record: ` + err.Error() + `"}`, err
	}

	return `{"message": "Record deleted successfully"}`, nil
}

// SearchMedicalRecords executes a CouchDB query and returns the results as a JSON string
func (mc *MedicalRecordsChaincode) SearchMedicalRecords(ctx contractapi.TransactionContextInterface, queryString string) (string, error) {
    // Execute the query
    resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
    if err != nil {
        return `{"error": "failed to execute query: ` + err.Error() + `"}`, err
    }
    defer resultsIterator.Close()

    var medicalRecords []MedicalRecords

    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return `{"error": "failed to iterate query results: ` + err.Error() + `"}`, err
        }

        var medicalRecord MedicalRecords
        err = json.Unmarshal(queryResponse.Value, &medicalRecord)
        if err != nil {
            return `{"error": "failed to unmarshal query response: ` + err.Error() + `"}`, err
        }

        log.Printf("Found record: %+v", medicalRecord)

        medicalRecords = append(medicalRecords, medicalRecord)
    }

    resultsJSON, err := json.Marshal(medicalRecords)
    if err != nil {
        return `{"error": "failed to encode results to JSON: ` + err.Error() + `"}`, err
    }

    return string(resultsJSON), nil
}


// CreateCondition adds a new condition record to the ledger
func (c *MedicalRecordsChaincode) CreateCondition(ctx contractapi.TransactionContextInterface, conditionID string, conditionJSON string) (string, error) {
	log.Printf("Condition JSON from param: %s", conditionJSON)

	existingCondition, err := ctx.GetStub().GetState(conditionID)
	if err != nil {
		return `{"error": "failed to get condition: ` + err.Error() + `"}`, err
	}
	if existingCondition != nil {
		return `{"error": "condition already exists: ` + conditionID + `"}`, errors.New("condition already exists")
	}

	var condition Condition
	err = json.Unmarshal([]byte(conditionJSON), &condition)
	if err != nil {
		return `{"error": "failed to unmarshal condition: ` + err.Error() + `"}`, err
	}

	conditionJSONBytes, err := json.Marshal(condition)
	if err != nil {
		return `{"error": "failed to marshal condition: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(conditionID, conditionJSONBytes)
	if err != nil {
		return `{"error": "failed to put condition in world state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Condition created successfully"}`, nil
}

// ReadCondition retrieves a condition record from the ledger
func (c *MedicalRecordsChaincode) ReadCondition(ctx contractapi.TransactionContextInterface, conditionID string) (string, error) {
	conditionJSON, err := ctx.GetStub().GetState(conditionID)
	if err != nil {
		return `{"error": "failed to read condition: ` + err.Error() + `"}`, err
	}
	if conditionJSON == nil {
		return `{"error": "condition does not exist: ` + conditionID + `"}`, errors.New("condition does not exist")
	}

	log.Printf("Condition JSON from ledger: %s", string(conditionJSON))

	var condition Condition
	err = json.Unmarshal(conditionJSON, &condition)
	if err != nil {
		return `{"error": "failed to unmarshal condition: ` + err.Error() + `"}`, err
	}

	log.Printf("Condition object: %+v", condition)

	return string(conditionJSON), nil
}

// UpdateCondition updates an existing condition record in the ledger
func (c *MedicalRecordsChaincode) UpdateCondition(ctx contractapi.TransactionContextInterface, conditionID string, conditionJSON string) (string, error) {
	exists, err := ctx.GetStub().GetState(conditionID)
	if err != nil {
		return `{"error": "failed to get condition: ` + err.Error() + `"}`, err
	}
	if exists == nil {
		return `{"error": "condition does not exist: ` + conditionID + `"}`, errors.New("condition does not exist")
	}

	var condition Condition
	err = json.Unmarshal([]byte(conditionJSON), &condition)
	if err != nil {
		return `{"error": "failed to unmarshal condition: ` + err.Error() + `"}`, err
	}

	conditionJSONBytes, err := json.Marshal(condition)
	if err != nil {
		return `{"error": "failed to marshal condition: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(conditionID, conditionJSONBytes)
	if err != nil {
		return `{"error": "failed to update condition: ` + err.Error() + `"}`, err
	}

	return `{"message": "Condition updated successfully"}`, nil
}

// DeleteCondition removes a condition record from the ledger
func (c *MedicalRecordsChaincode) DeleteCondition(ctx contractapi.TransactionContextInterface, conditionID string) (string, error) {
	existingCondition, err := ctx.GetStub().GetState(conditionID)
	if err != nil {
		return `{"error": "failed to get condition: ` + err.Error() + `"}`, err
	}
	if existingCondition == nil {
		return `{"error": "condition does not exist: ` + conditionID + `"}`, errors.New("condition does not exist")
	}

	var condition Condition
	err = json.Unmarshal([]byte(existingCondition), &condition)
	if err != nil {
		return `{"error": "failed to unmarshal condition: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().DelState(conditionID)
	if err != nil {
		return `{"error": "failed to delete condition: ` + err.Error() + `"}`, err
	}

	return `{"message": "Condition deleted successfully"}`, nil
}

// SearchConditions executes a CouchDB query and returns the results as a JSON string
func (mc *MedicalRecordsChaincode) SearchConditions(ctx contractapi.TransactionContextInterface, queryString string) (string, error) {
    // Execute the query
    resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
    if err != nil {
        return `{"error": "failed to execute query: ` + err.Error() + `"}`, err
    }
    defer resultsIterator.Close()

    var conditions []Condition

    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return `{"error": "failed to iterate query results: ` + err.Error() + `"}`, err
        }

        var condition Condition
        err = json.Unmarshal(queryResponse.Value, &condition)
        if err != nil {
            return `{"error": "failed to unmarshal query response: ` + err.Error() + `"}`, err
        }

        log.Printf("Found condition: %+v", condition)

        conditions = append(conditions, condition)
    }

    resultsJSON, err := json.Marshal(conditions)
    if err != nil {
        return `{"error": "failed to encode results to JSON: ` + err.Error() + `"}`, err
    }

    return string(resultsJSON), nil
}

// CreateProcedure adds a new procedure record to the ledger
func (c *MedicalRecordsChaincode) CreateProcedure(ctx contractapi.TransactionContextInterface, procedureJSON string) (string, error) {
	log.Printf("Procedure JSON from param: %s", procedureJSON)

	var procedure Procedure
	err := json.Unmarshal([]byte(procedureJSON), &procedure)
	if err != nil {
		return `{"error": "failed to unmarshal procedure: ` + err.Error() + `"}`, err
	}

	if procedure.ID.Value == "" {
		return `{"error": "procedure request ID is required"}`, errors.New("procedure request ID is required")
	}

	log.Printf("Procedure struct unmarshalled: %+v", procedure)

	existingProcedure, err := ctx.GetStub().GetState(procedure.ID.Value)
	if err != nil {
		return `{"error": "failed to get procedure: ` + err.Error() + `"}`, err
	}
	if existingProcedure != nil {
		return `{"error": "procedure already exists: ` + procedure.ID.Value + `"}`, errors.New("procedure already exists")
	}

	procedureJSONBytes, err := json.Marshal(procedure)
	if err != nil {
		return `{"error": "failed to marshal procedure: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(procedure.ID.Value, procedureJSONBytes)
	if err != nil {
		return `{"error": "failed to put procedure in world state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Procedure created successfully"}`, nil
}

// ReadProcedure retrieves a procedure record from the ledger
func (c *MedicalRecordsChaincode) ReadProcedure(ctx contractapi.TransactionContextInterface, procedureID string) (string, error) {
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return `{"error": "failed to read procedure: ` + err.Error() + `"}`, err
	}
	if procedureJSON == nil {
		return `{"error": "procedure does not exist: ` + procedureID + `"}`, errors.New("procedure does not exist")
	}

	log.Printf("Procedure JSON from ledger: %s", string(procedureJSON))

	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return `{"error": "failed to unmarshal procedure: ` + err.Error() + `"}`, err
	}

	log.Printf("Procedure object: %+v", procedure)

	return string(procedureJSON), nil
}

// UpdateProcedure updates an existing procedure record in the ledger
func (c *MedicalRecordsChaincode) UpdateProcedure(ctx contractapi.TransactionContextInterface, procedureID string, procedureJSON string) (string, error) {
	existingProcedure, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return `{"error": "failed to get procedure: ` + err.Error() + `"}`, err
	}
	if existingProcedure == nil {
		return `{"error": "procedure does not exist: ` + procedureID + `"}`, errors.New("procedure does not exist")
	}

	var procedure Procedure
	err = json.Unmarshal([]byte(procedureJSON), &procedure)
	if err != nil {
		return `{"error": "failed to unmarshal procedure: ` + err.Error() + `"}`, err
	}

	log.Printf("Procedure object: %+v", procedure)

	procedureJSONBytes, err := json.Marshal(procedure)
	if err != nil {
		return `{"error": "failed to marshal procedure: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(procedureID, procedureJSONBytes)
	if err != nil {
		return `{"error": "failed to update procedure: ` + err.Error() + `"}`, err
	}

	return `{"message": "Procedure updated successfully"}`, nil
}

// DeleteProcedure removes a procedure record from the ledger
func (c *MedicalRecordsChaincode) DeleteProcedure(ctx contractapi.TransactionContextInterface, procedureID string) (string, error) {
	existingProcedure, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return `{"error": "failed to get procedure: ` + err.Error() + `"}`, err
	}
	if existingProcedure == nil {
		return `{"error": "procedure does not exist: ` + procedureID + `"}`, errors.New("procedure does not exist")
	}

	var procedure Procedure
	err = json.Unmarshal([]byte(existingProcedure), &procedure)
	if err != nil {
		return `{"error": "failed to unmarshal procedure: ` + err.Error() + `"}`, err
	}

	log.Printf("Procedure object: %+v", procedure)

	err = ctx.GetStub().DelState(procedureID)
	if err != nil {
		return `{"error": "failed to delete procedure: ` + err.Error() + `"}`, err
	}

	return `{"message": "Procedure deleted successfully"}`, nil
}

// SearchProcedures executes a CouchDB query and returns the results as a JSON string
func (mc *MedicalRecordsChaincode) SearchProcedures(ctx contractapi.TransactionContextInterface, queryString string) (string, error) {
    // Execute the query
    resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
    if err != nil {
        return `{"error": "failed to execute query: ` + err.Error() + `"}`, err
    }
    defer resultsIterator.Close()

    var procedures []Procedure

    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return `{"error": "failed to iterate query results: ` + err.Error() + `"}`, err
        }

        var procedure Procedure
        err = json.Unmarshal(queryResponse.Value, &procedure)
        if err != nil {
            return `{"error": "failed to unmarshal query response: ` + err.Error() + `"}`, err
        }

        log.Printf("Found procedure: %+v", procedure)

        procedures = append(procedures, procedure)
    }

    resultsJSON, err := json.Marshal(procedures)
    if err != nil {
        return `{"error": "failed to encode results to JSON: ` + err.Error() + `"}`, err
    }

    return string(resultsJSON), nil
}

// CreateAnnotation adds a new annotation to a procedure on the ledger
func (c *MedicalRecordsChaincode) CreateAnnotation(ctx contractapi.TransactionContextInterface, procedureID string, annotationJSON string) (string, error) {
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return `{"error": "failed to get procedure: ` + err.Error() + `"}`, err
	}
	if procedureJSON == nil {
		return `{"error": "procedure does not exist: ` + procedureID + `"}`, errors.New("procedure does not exist")
	}

	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return `{"error": "failed to unmarshal procedure: ` + err.Error() + `"}`, err
	}

	var annotation Annotation
	err = json.Unmarshal([]byte(annotationJSON), &annotation)
	if err != nil {
		return `{"error": "failed to unmarshal annotation: ` + err.Error() + `"}`, err
	}

	procedure.Note = append(procedure.Note, annotation)

	updatedProcedureJSON, err := json.Marshal(procedure)
	if err != nil {
		return `{"error": "failed to marshal updated procedure: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(procedureID, updatedProcedureJSON)
	if err != nil {
		return `{"error": "failed to update procedure: ` + err.Error() + `"}`, err
	}

	return `{"message": "Annotation created successfully"}`, nil
}

// CreateAllergy creates a new allergy 
func (mc *MedicalRecordsChaincode) CreateAllergy(ctx contractapi.TransactionContextInterface, allergyJSON string) (string, error) {
	log.Printf("Received allergy:" + allergyJSON)
	var allergy AllergyIntolerance
	err := json.Unmarshal([]byte(allergyJSON), &allergy)
	if err != nil {
		return `{"error": "failed to unmarshal allergy: ` + err.Error() + `"}`, err
	}
	log.Printf("Unmarshalled allergy: %+v", allergy)

	if allergy.ID.Value == "" {
		return `{"error": "allergy ID is required"}`, errors.New("allergy ID is required")
	}

	existingRecord, err := ctx.GetStub().GetState(allergy.ID.Value)
	if err != nil {
		return `{"error": "failed to get allergy for patient ` + allergy.ID.Value + ` from world state: ` + err.Error() + `"}`, err
	}
	if existingRecord != nil {
		return `{"error": "allergy already exist ` + allergy.ID.Value + `"}`, errors.New("allergy already exist")
	}

	allergyJSONBytes, err := json.Marshal(allergy)
	if err != nil {
		return `{"error": "failed to marshal allergy: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(allergy.ID.Value, allergyJSONBytes)
	if err != nil {
		return `{"error": "failed to put allergy in world state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Allergy created successfully"}`, nil
}

// ReadAllergy retrieves a patient's allergy from the blockchain
func (mc *MedicalRecordsChaincode) ReadAllergy(ctx contractapi.TransactionContextInterface, allergyID string) (string, error) {
	allergyJSON, err := ctx.GetStub().GetState(allergyID)
	if err != nil {
		return `{"error": "failed to read allergy: ` + err.Error() + `"}`, err
	}
	if allergyJSON == nil {
		return `{"error": "allergy does not exist: ` + allergyID + `"}`, errors.New("allergy does not exist")
	}

	var allergy AllergyIntolerance
	err = json.Unmarshal(allergyJSON, &allergy)
	if err != nil {
		return `{"error": "failed to unmarshal allergy: ` + err.Error() + `"}`, err
	}

	return string(allergyJSON), nil
}

// UpdateMedicalRecords updates an existing allergy for a patient
func (mc *MedicalRecordsChaincode) UpdateAllergy(ctx contractapi.TransactionContextInterface, allergyID string, updatedAllergyJSON string) (string, error) {
	existingAllergy, err := ctx.GetStub().GetState(allergyID)
	if err != nil {
		return `{"error": "failed to get allergy: ` + err.Error() + `"}`, err
	}
	if existingAllergy == nil {
		return `{"error": "allergy does not exist: ` + allergyID + `"}`, errors.New("allergy does not exist")
	}

	var updatedAllergy AllergyIntolerance
	if err := json.Unmarshal([]byte(updatedAllergyJSON), &updatedAllergy); err != nil {
		return `{"error": "failed to unmarshal allergy: ` + err.Error() + `"}`, err
	}

	updatedAllergyJSONBytes, err := json.Marshal(updatedAllergy)
	if err != nil {
		return `{"error": "failed to marshal allergy: ` + err.Error() + `"}`, err
	}

	if err := ctx.GetStub().PutState(updatedAllergy.ID.Value, updatedAllergyJSONBytes); err != nil {
		return `{"error": "failed to put state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Allergy updated successfully"}`, nil
}

// DeleteMedicalRecords removes an existing medical record folder for a patient
func (mc *MedicalRecordsChaincode) DeleteAllergy(ctx contractapi.TransactionContextInterface, allergyID string) (string, error) {
	existingAllergy, err := ctx.GetStub().GetState(allergyID)
	if err != nil {
		return `{"error": "failed to get allergy: ` + err.Error() + `"}`, err
	}
	if existingAllergy == nil {
		return `{"error": "allergy not found: ` + allergyID + `"}`, errors.New("allergy not found")
	}

	var allergy AllergyIntollerance
	err = json.Unmarshal(existingAllergy, &allergy)
	if err != nil {
		return `{"error": "failed to unmarshal allergy: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().DelState(allergyID)
	if err != nil {
		return `{"error": "failed to delete allergy: ` + err.Error() + `"}`, err
	}

	return `{"message": "Allergy deleted successfully"}`, nil
}

// SearchAllergies executes a CouchDB query and returns the results as a JSON string
func (mc *MedicalRecordsChaincode) SearchAllergies(ctx contractapi.TransactionContextInterface, queryString string) (string, error) {
    // Execute the query
    resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
    if err != nil {
        return `{"error": "failed to execute query: ` + err.Error() + `"}`, err
    }
    defer resultsIterator.Close()

    var allergies []AllergyIntolerance

    for resultsIterator.HasNext() {
        queryResponse, err := resultsIterator.Next()
        if err != nil {
            return `{"error": "failed to iterate query results: ` + err.Error() + `"}`, err
        }

        var allergy AllergyIntolerance
        err = json.Unmarshal(queryResponse.Value, &allergy)
        if err != nil {
            return `{"error": "failed to unmarshal query response: ` + err.Error() + `"}`, err
        }

        log.Printf("Found allergy: %+v", allergy)

        allergies = append(allergies, allergy)
    }

    resultsJSON, err := json.Marshal(allergies)
    if err != nil {
        return `{"error": "failed to encode results to JSON: ` + err.Error() + `"}`, err
    }

    return string(resultsJSON), nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(MedicalRecordsChaincode))
	if err != nil {
		log.Panic(errors.New("Error creating medical records chaincode: " + err.Error()))
	}

	if err := chaincode.Start(); err != nil {
		log.Panic(errors.New("Error starting medical records chaincode: " + err.Error()))
	}
}
