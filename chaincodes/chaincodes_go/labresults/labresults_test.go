package labresults

import (
	"encoding/json"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Tests

// Helper function to create a sample observation JSON
func sampleObservationJSON(id string) string {
	observation := Observation{
		ID:     id,
		Status: "final",
		Code: CodeableConcept{
			Text: "Blood Test",
		},
	}
	bytes, _ := json.Marshal(observation)
	return string(bytes)
}

// Helper function to create a sample observation JSON that includes patient data
func sampleObservationJSONWithPatient(id string, patientID string) string {
	observation := Observation{
		ID:     id,
		Status: "final",
		Code: CodeableConcept{
			Text: "Blood Test",
		},
		Subject: &Reference{
			Reference: "Patient/" + patientID,
		},
	}
	bytes, _ := json.Marshal(observation)
	return string(bytes)
}

func TestCreateLabResult_Successful(t *testing.T) {
	labChaincode := new(LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	observationJSON := sampleObservationJSON("obs1")
	mockStub.On("GetState", "obs1").Return(nil, nil) // Simulate that "obs1" does not exist
	mockStub.On("PutState", "obs1", mock.Anything).Return(nil)

	err := labChaincode.CreateLabResult(mockCtx, observationJSON)
	assert.NoError(t, err)
}

func TestCreateLabResult_FailureDueToExistingID(t *testing.T) {
	labChaincode := new(LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	observationJSON := sampleObservationJSON("obs1")
	mockStub.On("GetState", "obs1").Return([]byte(observationJSON), nil) // Simulate that "obs1" exists

	err := labChaincode.CreateLabResult(mockCtx, observationJSON)
	assert.Error(t, err, "expected an error when creating a lab result with an existing ID")
}

func TestUpdateLabResult_Successful(t *testing.T) {
	labChaincode := new(LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	originalObservationJSON := sampleObservationJSON("obs1")
	var originalObservation Observation
	json.Unmarshal([]byte(originalObservationJSON), &originalObservation)

	updatedObservation := originalObservation
	updatedObservation.Status = "amended"
	updatedObservationJSON, _ := json.Marshal(updatedObservation)

	mockStub.On("GetState", "obs1").Return([]byte(originalObservationJSON), nil)
	mockStub.On("PutState", "obs1", mock.Anything).Return(nil)

	err := labChaincode.UpdateLabResult(mockCtx, "obs1", string(updatedObservationJSON))
	assert.NoError(t, err)
}

func TestUpdateLabResult_NonExistentResult(t *testing.T) {
	labChaincode := new(LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	updatedObservationJSON := sampleObservationJSON("obs2")

	mockStub.On("GetState", "obs2").Return(nil, nil)

	err := labChaincode.UpdateLabResult(mockCtx, "obs2", string(updatedObservationJSON))
	assert.Error(t, err)
}

func TestUpdateLabResult_DecodingError(t *testing.T) {
	labChaincode := new(LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	originalObservationJSON := sampleObservationJSON("obs1")
	invalidJSON := `{"ID":"obs1","Status":"invalid JSON"`

	mockStub.On("GetState", "obs1").Return([]byte(originalObservationJSON), nil)

	err := labChaincode.UpdateLabResult(mockCtx, "obs1", invalidJSON)
	assert.Error(t, err)
}

func TestGetLabResult_Successful(t *testing.T) {
	labChaincode := new(LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	observationJSON := sampleObservationJSON("obs1")
	mockStub.On("GetState", "obs1").Return([]byte(observationJSON), nil)

	result, err := labChaincode.GetLabResult(mockCtx, "obs1")
	assert.NoError(t, err)
	assert.Equal(t, observationJSON, result, "The retrieved lab result should match the stored one.")
}

func TestGetLabResult_NonExistentResult(t *testing.T) {
	labChaincode := new(LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	mockStub.On("GetState", "obs2").Return(nil, nil)

	result, err := labChaincode.GetLabResult(mockCtx, "obs2")
	assert.Error(t, err)
	assert.Equal(t, "", result, "The result should be an empty string when the lab result does not exist.")
	assert.Contains(t, err.Error(), "the lab result does not exist", "Error message should indicate that the lab result does not exist.")
}

func TestGetLabResult_AccessError(t *testing.T) {
	labChaincode := new(LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	mockStub.On("GetState", "obs3").Return(nil, errors.New("ledger access error"))

	result, err := labChaincode.GetLabResult(mockCtx, "obs3")
	assert.Error(t, err)
	assert.Equal(t, "", result, "The result should be an empty string when there is an error accessing the world state.")
	assert.Contains(t, err.Error(), "failed to read from world state", "Error message should indicate a failure to read from the world state.")
}

func TestLabResultExists_Exists(t *testing.T) {
	labChaincode := new(LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	mockStub.On("GetState", "existingID").Return([]byte("some data"), nil)
	exists, err := labChaincode.LabResultExists(mockCtx, "existingID")
	assert.NoError(t, err)
	assert.True(t, exists, "Lab result should exist when data is returned.")
}

func TestLabResultExists_DoesNotExist(t *testing.T) {
	labChaincode := new(LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	mockStub.On("GetState", "nonExistingID").Return(nil, nil)
	exists, err := labChaincode.LabResultExists(mockCtx, "nonExistingID")
	assert.NoError(t, err)
	assert.False(t, exists, "Lab result should not exist when no data is returned.")
}

func TestLabResultExists_WorldStateAccessError(t *testing.T) {
	labChaincode := new(LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	mockStub.On("GetState", "errorID").Return(nil, errors.New("ledger access error"))
	exists, err := labChaincode.LabResultExists(mockCtx, "errorID")
	assert.Error(t, err)
	assert.False(t, exists, "Lab result should not exist when an error occurs accessing the world state.")
	assert.Contains(t, err.Error(), "failed to read from world state", "Error message should indicate a failure to read from the world state.")
}

func TestQueryLabResults_Successful(t *testing.T) {
	labChaincode := new(LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	observation1 := sampleObservationJSONWithPatient("obs1", "patient1")
	observation2 := sampleObservationJSONWithPatient("obs2", "patient1")
	mockIterator := &MockIterator{}
	mockIterator.AddRecord("obs1", []byte(observation1))
	mockIterator.AddRecord("obs2", []byte(observation2))
	mockStub.On("GetQueryResult", mock.Anything).Return(mockIterator, nil)

	results, err := labChaincode.QueryLabResults(mockCtx, "patient1")
	assert.NoError(t, err)
	assert.Len(t, results, 2, "There should be two observations for the patient.")
}

func TestQueryLabResults_NoResults(t *testing.T) {
	labChaincode := new(LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	mockStub.On("GetQueryResult", mock.Anything).Return(&MockIterator{}, nil)

	results, err := labChaincode.QueryLabResults(mockCtx, "patient2")
	assert.NoError(t, err)
	assert.Len(t, results, 0, "There should be no observations for the patient.")
}

func TestQueryLabResults_ErrorHandling(t *testing.T) {
	labChaincode := new(LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	mockStub.On("GetQueryResult", mock.Anything).Return(nil, errors.New("failed to execute query"))

	results, err := labChaincode.QueryLabResults(mockCtx, "patient3")
	assert.Error(t, err)
	assert.Nil(t, results, "Results should be nil when an error occurs.")
}
