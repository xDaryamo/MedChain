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
	Allergies      []AllergyIntolerance  `json:"allergies,omitempty"`
	Conditions     []Condition          `json:"conditions,omitempty"`
	Procedures     []Procedure          `json:"procedures,omitempty"`
	Prescriptions  []MedicationRequest  `json:"prescriptions,omitempty"`
	LabResultsIDs  []string             `json:"labResultsIDs,omitempty"`
}

// CreateMedicalRecords creates a new medical record folder for a patient
func (mc *MedicalRecordsChaincode) CreateMedicalRecords(ctx contractapi.TransactionContextInterface, medicalRecordJSON string) (string, error) {
	log.Printf("Received record: " + medicalRecordJSON)
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

	var updatedRecord MedicalRecords
	err = json.Unmarshal([]byte(updatedMedicalRecordJSON), &updatedRecord)
	if err != nil {
		return `{"error": "failed to unmarshal record: ` + err.Error() + `"}`, err
	}

	updatedRecordJSONBytes, err := json.Marshal(updatedRecord)
	if err != nil {
		return `{"error": "failed to marshal record: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(recordID, updatedRecordJSONBytes)
	if err != nil {
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

// CreateConditionsBatch creates multiple condition records in a single transaction
func (mc *MedicalRecordsChaincode) CreateConditionsBatch(ctx contractapi.TransactionContextInterface, conditionsJSON string) (string, error) {
	log.Printf("Received conditions: " + conditionsJSON)

	var conditions []Condition
	err := json.Unmarshal([]byte(conditionsJSON), &conditions)
	if err != nil {
		return `{"error": "failed to unmarshal conditions: ` + err.Error() + `"}`, err
	}

	for _, condition := range conditions {
		conditionJSONBytes, err := json.Marshal(condition)
		if err != nil {
			return `{"error": "failed to marshal condition: ` + err.Error() + `"}`, err
		}

		err = ctx.GetStub().PutState(condition.ID.Value, conditionJSONBytes)
		if err != nil {
			return `{"error": "failed to put condition in world state: ` + err.Error() + `"}`, err
		}

		log.Printf("Condition created: %+v", condition)
	}

	return `{"message": "Conditions created successfully"}`, nil
}

// UpdateConditionsBatch updates multiple condition records in a single transaction
func (mc *MedicalRecordsChaincode) UpdateConditionsBatch(ctx contractapi.TransactionContextInterface, conditionsJSON string) (string, error) {
	log.Printf("Received conditions: " + conditionsJSON)

	var conditions []Condition
	err := json.Unmarshal([]byte(conditionsJSON), &conditions)
	if err != nil {
		return `{"error": "failed to unmarshal conditions: ` + err.Error() + `"}`, err
	}

	for _, condition := range conditions {
		conditionJSONBytes, err := json.Marshal(condition)
		if err != nil {
			return `{"error": "failed to marshal condition: ` + err.Error() + `"}`, err
		}

		err = ctx.GetStub().PutState(condition.ID.Value, conditionJSONBytes)
		if err != nil {
			return `{"error": "failed to put condition in world state: ` + err.Error() + `"}`, err
		}

		log.Printf("Condition updated: %+v", condition)
	}

	return `{"message": "Conditions updated successfully"}`, nil
}

// DeleteConditionsBatch deletes multiple condition records in a single transaction
func (mc *MedicalRecordsChaincode) DeleteConditionsBatch(ctx contractapi.TransactionContextInterface, conditionIDsJSON string) (string, error) {
	log.Printf("Received condition IDs: " + conditionIDsJSON)

	var conditionIDs []string
	err := json.Unmarshal([]byte(conditionIDsJSON), &conditionIDs)
	if err != nil {
		return `{"error": "failed to unmarshal condition IDs: ` + err.Error() + `"}`, err
	}

	for _, conditionID := range conditionIDs {
		err := ctx.GetStub().DelState(conditionID)
		if err != nil {
			return `{"error": "failed to delete condition: ` + err.Error() + `"}`, err
		}

		log.Printf("Condition deleted: %s", conditionID)
	}

	return `{"message": "Conditions deleted successfully"}`, nil
}

// CreateProceduresBatch creates multiple procedure records in a single transaction
func (mc *MedicalRecordsChaincode) CreateProceduresBatch(ctx contractapi.TransactionContextInterface, proceduresJSON string) (string, error) {
	log.Printf("Received procedures: " + proceduresJSON)

	var procedures []Procedure
	err := json.Unmarshal([]byte(proceduresJSON), &procedures)
	if err != nil {
		return `{"error": "failed to unmarshal procedures: ` + err.Error() + `"}`, err
	}

	for _, procedure := range procedures {
		procedureJSONBytes, err := json.Marshal(procedure)
		if err != nil {
			return `{"error": "failed to marshal procedure: ` + err.Error() + `"}`, err
		}

		err = ctx.GetStub().PutState(procedure.ID.Value, procedureJSONBytes)
		if err != nil {
			return `{"error": "failed to put procedure in world state: ` + err.Error() + `"}`, err
		}

		log.Printf("Procedure created: %+v", procedure)
	}

	return `{"message": "Procedures created successfully"}`, nil
}

// UpdateProceduresBatch updates multiple procedure records in a single transaction
func (mc *MedicalRecordsChaincode) UpdateProceduresBatch(ctx contractapi.TransactionContextInterface, proceduresJSON string) (string, error) {
	log.Printf("Received procedures: " + proceduresJSON)

	var procedures []Procedure
	err := json.Unmarshal([]byte(proceduresJSON), &procedures)
	if err != nil {
		return `{"error": "failed to unmarshal procedures: ` + err.Error() + `"}`, err
	}

	for _, procedure := range procedures {
		procedureJSONBytes, err := json.Marshal(procedure)
		if err != nil {
			return `{"error": "failed to marshal procedure: ` + err.Error() + `"}`, err
		}

		err = ctx.GetStub().PutState(procedure.ID.Value, procedureJSONBytes)
		if err != nil {
			return `{"error": "failed to put procedure in world state: ` + err.Error() + `"}`, err
		}

		log.Printf("Procedure updated: %+v", procedure)
	}

	return `{"message": "Procedures updated successfully"}`, nil
}

// DeleteProceduresBatch deletes multiple procedure records in a single transaction
func (mc *MedicalRecordsChaincode) DeleteProceduresBatch(ctx contractapi.TransactionContextInterface, procedureIDsJSON string) (string, error) {
	log.Printf("Received procedure IDs: " + procedureIDsJSON)

	var procedureIDs []string
	err := json.Unmarshal([]byte(procedureIDsJSON), &procedureIDs)
	if err != nil {
		return `{"error": "failed to unmarshal procedure IDs: ` + err.Error() + `"}`, err
	}

	for _, procedureID := range procedureIDs {
		err := ctx.GetStub().DelState(procedureID)
		if err != nil {
			return `{"error": "failed to delete procedure: ` + err.Error() + `"}`, err
		}

		log.Printf("Procedure deleted: %s", procedureID)
	}

	return `{"message": "Procedures deleted successfully"}`, nil
}

// CreateAllergiesBatch creates multiple allergy records in a single transaction
func (mc *MedicalRecordsChaincode) CreateAllergiesBatch(ctx contractapi.TransactionContextInterface, allergiesJSON string) (string, error) {
	log.Printf("Received allergies: " + allergiesJSON)

	var allergies []AllergyIntolerance
	err := json.Unmarshal([]byte(allergiesJSON), &allergies)
	if err != nil {
		return `{"error": "failed to unmarshal allergies: ` + err.Error() + `"}`, err
	}

	for _, allergy := range allergies {
		if allergy.ID.Value == "" {
			return `{"error": "allergy ID is required"}`, errors.New("allergy ID is required")
		}

		allergyJSONBytes, err := json.Marshal(allergy)
		if err != nil {
			return `{"error": "failed to marshal allergy: ` + err.Error() + `"}`, err
		}

		err = ctx.GetStub().PutState(allergy.ID.Value, allergyJSONBytes)
		if err != nil {
			return `{"error": "failed to put allergy in world state: ` + err.Error() + `"}`, err
		}

		log.Printf("Allergy created: %+v", allergy)
	}

	return `{"message": "Allergies created successfully"}`, nil
}

// UpdateAllergiesBatch updates multiple allergy records in a single transaction
func (mc *MedicalRecordsChaincode) UpdateAllergiesBatch(ctx contractapi.TransactionContextInterface, allergiesJSON string) (string, error) {
	log.Printf("Received allergies: " + allergiesJSON)

	var allergies []AllergyIntolerance
	err := json.Unmarshal([]byte(allergiesJSON), &allergies)
	if err != nil {
		return `{"error": "failed to unmarshal allergies: ` + err.Error() + `"}`, err
	}

	for _, allergy := range allergies {
		if allergy.ID.Value == "" {
			return `{"error": "allergy ID is required"}`, errors.New("allergy ID is required")
		}

		allergyJSONBytes, err := json.Marshal(allergy)
		if err != nil {
			return `{"error": "failed to marshal allergy: ` + err.Error() + `"}`, err
		}

		err = ctx.GetStub().PutState(allergy.ID.Value, allergyJSONBytes)
		if err != nil {
			return `{"error": "failed to put allergy in world state: ` + err.Error() + `"}`, err
		}

		log.Printf("Allergy updated: %+v", allergy)
	}

	return `{"message": "Allergies updated successfully"}`, nil
}

// DeleteAllergiesBatch deletes multiple allergy records in a single transaction
func (mc *MedicalRecordsChaincode) DeleteAllergiesBatch(ctx contractapi.TransactionContextInterface, allergyIDsJSON string) (string, error) {
	log.Printf("Received allergy IDs: " + allergyIDsJSON)

	var allergyIDs []string
	err := json.Unmarshal([]byte(allergyIDsJSON), &allergyIDs)
	if err != nil {
		return `{"error": "failed to unmarshal allergy IDs: ` + err.Error() + `"}`, err
	}

	for _, allergyID := range allergyIDs {
		err := ctx.GetStub().DelState(allergyID)
		if err != nil {
			return `{"error": "failed to delete allergy: ` + err.Error() + `"}`, err
		}

		log.Printf("Allergy deleted: %s", allergyID)
	}

	return `{"message": "Allergies deleted successfully"}`, nil
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
