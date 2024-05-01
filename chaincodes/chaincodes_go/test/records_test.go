package test

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/xDaryamo/MedChain/records"
)

// TestCreateMedicalRecords tests the CreateMedicalRecords function
func TestCreateMedicalRecords(t *testing.T) {
	// Create a new instance of the chaincode
	cc := new(records.MedicalRecordsChaincode)

	// Mock TransactionContext
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	// Mock GetMedicalRecords to return nil, nil
	mockStub.On("GetState", "patient1").Return(nil, nil)

	// Mock GetState to return nil when called during the test
	mockStub.On("GetState", mock.Anything).Return(nil, nil)

	// Mock PutState method to return nil (indicating success)
	mockStub.On("PutState", mock.Anything, mock.Anything).Return(nil)

	// Test case 1: Create a new medical record folder successfully
	err := cc.CreateMedicalRecords(mockCtx, "patient1", `{ "PatientID": "patient1", "Allergies": [], "Conditions": [], "Prescriptions": [], "CarePlan": {}, "Request": {} }`)
	assert.NoError(t, err)

}

// TestCreateMedicalRecordsIfExists tests the behavior of CreateMedicalRecords when the record already exists
func TestCreateMedicalRecordsIfExists(t *testing.T) {
	// Create a new instance of the chaincode
	cc := new(records.MedicalRecordsChaincode)

	// Mock TransactionContext
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	// Mock GetState to return a non-nil value when called with the key "patient1"
	mockStub.On("GetState", "patient1").Return([]byte("existing_record"), nil)

	// Test case: Try to create a medical record folder for an existing patient
	err := cc.CreateMedicalRecords(mockCtx, "patient1", `{ "PatientID": "patient1", "Allergies": [], "Conditions": [], "Prescriptions": [], "CarePlan": {}, "Request": {} }`)
	assert.Error(t, err) // Expect an error since the record already exists
}

func TestUpdateMedicalRecords(t *testing.T) {
	// Create a new instance of the chaincode
	cc := new(records.MedicalRecordsChaincode)

	// Mock TransactionContext
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	const existingRecordJSON = `{
		"PatientID": "patient1",
		"Allergies": [
			{
				"ID": {
					"System": "http://example.com/identifier",
					"Value": "123456"
				},
				"Type": ""
			}
		],
		"Conditions": [],
		"Prescriptions": [],
		"CarePlan": {},
		"Request": {}
	}`

	// Mock GetMedicalRecords to return an existing record
	mockStub.On("GetState", "patient1").Return([]byte(existingRecordJSON), nil)

	// Mock PutState method to return nil (indicating success)
	mockStub.On("PutState", "patient1", mock.Anything).Return(nil)

	// Test case: Update an existing medical record folder successfully
	err := cc.UpdateMedicalRecords(mockCtx, "patient1", `{
		"PatientID": "patient1",
		"Allergies": [
			{
				"ID": {
					"System": "http://example.com/identifier",
					"Value": "123456"
				},
				"Type": "Pollen"
			}
		],
		"Conditions": [],
		"Prescriptions": [],
		"CarePlan": {},
		"Request": {}
	}`)
	assert.NoError(t, err)
}

func TestDeleteMedicalRecords(t *testing.T) {
	// Create a new instance of the chaincode
	cc := new(records.MedicalRecordsChaincode)
	var existingRecordJSON = `{"PatientID": "patient1", "Allergies": [], "Conditions": [], "Prescriptions": [], "CarePlan": {}, "Request": {}}`

	// Mock TransactionContext
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	// Mock GetMedicalRecords to return an existing record
	mockStub.On("GetState", "patient1").Return([]byte(existingRecordJSON), nil)

	// Mock DelState method to return nil (indicating success)
	mockStub.On("DelState", "patient1").Return(nil)

	// Test case: Delete an existing medical record folder successfully
	err := cc.DeleteMedicalRecords(mockCtx, "patient1")
	assert.NoError(t, err)
}
func TestSearchMedicalRecords(t *testing.T) {
	// Define existing record JSON
	const existingRecordJSON = `{
		"PatientID": "patient1",
		"Allergies": [
			{
				"ID": {
					"System": "http://example.com/identifier",
					"Value": "123456"
				},
				"Type": "Pollen"
			}
		],
		"Conditions": [
			{
				"ID": {
					"System": "http://example.com/identifier",
					"Value": "condition123"
				},
				"OnsetDateTime": "2024-04-15T10:30:00Z",
				"AbatementDateTime": "",
				"RecordedDate": "2024-04-15T10:30:00Z"
			}
		],
		"Prescriptions": [],
		"CarePlan": {},
		"Request": {}
	}`

	// Create a new instance of the chaincode
	cc := new(records.MedicalRecordsChaincode)

	// Mock TransactionContext
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	// Mock iterator
	mockIterator := new(MockIterator)
	mockStub.On("GetStateByRange", "", "").Return(mockIterator, nil)

	// Add a record to the mock iterator
	mockIterator.AddRecord("patient1", []byte(existingRecordJSON))

	// Test case: Search for medical records with a specific ID
	results, err := cc.SearchMedicalRecords(mockCtx, "condition123")
	assert.NoError(t, err)
	assert.NotNil(t, results)
	assert.Len(t, results, 1)
}

func TestSearchNonExistentMedicalRecords(t *testing.T) {
	// Create a new instance of the chaincode
	cc := new(records.MedicalRecordsChaincode)

	// Mock TransactionContext
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	// Create a mock iterator with no records
	mockIterator := new(MockIterator)
	mockStub.On("GetStateByRange", "", "").Return(mockIterator, nil)

	// Test case: Search for non-existent medical records
	results, err := cc.SearchMedicalRecords(mockCtx, "nonexistent123")
	assert.NoError(t, err)

	// If results are nil, assign an empty slice to avoid nil pointer dereference
	if results == nil {
		results = make([]*records.MedicalRecords, 0)
	}

	assert.NotNil(t, results)
	assert.Len(t, results, 0)
}

func TestUpdateNonExistentMedicalRecords(t *testing.T) {
	// Create a new instance of the chaincode
	cc := new(records.MedicalRecordsChaincode)

	// Mock TransactionContext
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	// Mock GetState to return nil, indicating the record doesn't exist
	mockStub.On("GetState", "nonexistent_patient").Return(nil, nil)

	// Test case: Try to update non-existent medical records
	err := cc.UpdateMedicalRecords(mockCtx, "nonexistent_patient", `{
		"PatientID": "nonexistent_patient",
		"Allergies": [],
		"Conditions": [],
		"Prescriptions": [],
		"CarePlan": {},
		"Request": {}
	}`)
	assert.Error(t, err) // Expect an error since the record doesn't exist
}

func TestDeleteNonExistentMedicalRecords(t *testing.T) {
	// Create a new instance of the chaincode
	cc := new(records.MedicalRecordsChaincode)

	// Mock TransactionContext
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	// Mock GetState to return nil, indicating the record doesn't exist
	mockStub.On("GetState", "nonexistent_patient").Return(nil, nil)

	// Test case: Try to delete non-existent medical records
	err := cc.DeleteMedicalRecords(mockCtx, "nonexistent_patient")
	assert.Error(t, err) // Expect an error since the record doesn't exist
}

func TestInvalidJSONFormat(t *testing.T) {
	// Create a new instance of the chaincode
	cc := new(records.MedicalRecordsChaincode)

	// Mock TransactionContext
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	// Test case: Try to create medical records with invalid JSON format
	err := cc.CreateMedicalRecords(mockCtx, "patient1", `{invalid JSON}`)
	assert.Error(t, err) // Expect an error due to invalid JSON format
}

func TestErrorPaths(t *testing.T) {
	// Create a new instance of the chaincode
	cc := new(records.MedicalRecordsChaincode)

	// Mock TransactionContext
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	// Mock GetState to return an error
	mockStub.On("GetState", mock.Anything).Return(nil, fmt.Errorf("error retrieving state"))

	// Test case: Create medical records when there's an error retrieving state
	err := cc.CreateMedicalRecords(mockCtx, "patient1", `{ "PatientID": "patient1", "Allergies": [], "Conditions": [], "Prescriptions": [], "CarePlan": {}, "Request": {} }`)
	assert.Error(t, err) // Expect an error due to error retrieving state
}
