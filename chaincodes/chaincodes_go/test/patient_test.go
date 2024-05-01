package test

import (
	"encoding/json"
	"errors"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/xDaryamo/MedChain/fhir"
	"github.com/xDaryamo/MedChain/patient"
)

// Tests

func generatePatientJSON(id string) string {
	patient := fhir.Patient{
		ID:        fhir.Identifier{Value: id},
		Name:      fhir.HumanName{Family: "Smith", Given: []string{"John"}},
		Gender:    fhir.Code{Coding: []fhir.Coding{{System: "http://hl7.org/fhir/ValueSet/administrative-gender", Code: "male", Display: "Male"}}},
		BirthDate: time.Now(),
	}
	patientJSON, _ := json.Marshal(patient)
	return string(patientJSON)
}

func TestCreatePatient_ValidInput(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	patientID := "12345"
	patientJSON := generatePatientJSON(patientID)

	mockStub.On("GetState", patientID).Return(nil, nil)           // Patient does not exist
	mockStub.On("PutState", patientID, mock.Anything).Return(nil) // Simulate successful write

	contract := patient.PatientContract{}
	err := contract.CreatePatient(mockCtx, patientID, patientJSON)

	assert.Nil(t, err)
	mockStub.AssertExpectations(t)
}

func TestCreatePatient_PatientExists(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	patientID := "12345"
	patientJSON := generatePatientJSON(patientID)

	mockStub.On("GetState", patientID).Return([]byte("existing patient data"), nil) // Patient exists

	contract := patient.PatientContract{}
	err := contract.CreatePatient(mockCtx, patientID, patientJSON)

	assert.NotNil(t, err)
	assert.Equal(t, "patient already exists: 12345", err.Error())
	mockStub.AssertExpectations(t)
}

func TestCreatePatient_InvalidJSON(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	patientID := "12345"
	patientJSON := "{invalid JSON"

	mockStub.On("GetState", patientID).Return(nil, nil) // No pre-existing patient

	contract := patient.PatientContract{}
	err := contract.CreatePatient(mockCtx, patientID, patientJSON)

	assert.NotNil(t, err)
	assert.Contains(t, err.Error(), "failed to unmarshal patient")
	mockStub.AssertExpectations(t)
}

func TestCreatePatient_StubFailure(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	patientID := "12345"
	patientJSON := generatePatientJSON(patientID)

	mockStub.On("GetState", patientID).Return(nil, errors.New("ledger error")) // Simulate a ledger error

	contract := patient.PatientContract{}
	err := contract.CreatePatient(mockCtx, patientID, patientJSON)

	assert.NotNil(t, err)
	assert.Equal(t, "failed to get patient: ledger error", err.Error())
	mockStub.AssertExpectations(t)
}

func TestReadPatient_Success(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	patientID := "12345"
	patientJSON := generatePatientJSON(patientID)

	mockStub.On("GetState", patientID).Return([]byte(patientJSON), nil) // Simulate existing patient data

	contract := patient.PatientContract{}
	result, err := contract.ReadPatient(mockCtx, patientID)

	assert.Nil(t, err)
	assert.NotNil(t, result)
	assert.Equal(t, "12345", result.ID.Value)
	mockStub.AssertExpectations(t)
}

func TestReadPatient_NotFound(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	patientID := "nonexistent"

	mockStub.On("GetState", patientID).Return(nil, nil) // No data for the patient

	contract := patient.PatientContract{}
	result, err := contract.ReadPatient(mockCtx, patientID)

	assert.NotNil(t, err)
	assert.Nil(t, result)
	assert.Equal(t, "patient does not exist: nonexistent", err.Error())
	mockStub.AssertExpectations(t)
}

func TestReadPatient_StubFailure(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	patientID := "12345"

	mockStub.On("GetState", patientID).Return(nil, errors.New("ledger error")) // Simulate a ledger error

	contract := patient.PatientContract{}
	result, err := contract.ReadPatient(mockCtx, patientID)

	assert.NotNil(t, err)
	assert.Nil(t, result)
	assert.Equal(t, "failed to read patient: ledger error", err.Error())
	mockStub.AssertExpectations(t)
}

func TestUpdatePatient_Success(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	patientID := "12345"
	updatedPatientJSON := generatePatientJSON(patientID)

	// Simulate that the patient already exists
	mockStub.On("GetState", patientID).Return([]byte("existing patient data"), nil)
	mockStub.On("PutState", patientID, mock.Anything).Return(nil) // Expect the update to succeed

	contract := patient.PatientContract{}
	err := contract.UpdatePatient(mockCtx, patientID, updatedPatientJSON)

	assert.Nil(t, err)
	mockStub.AssertExpectations(t)
}

func TestUpdatePatient_NotFound(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	patientID := "nonexistent"
	updatedPatientJSON := generatePatientJSON(patientID)

	mockStub.On("GetState", patientID).Return(nil, nil) // No data for the patient

	contract := patient.PatientContract{}
	err := contract.UpdatePatient(mockCtx, patientID, updatedPatientJSON)

	assert.NotNil(t, err)
	assert.Equal(t, "patient does not exist: nonexistent", err.Error())
	mockStub.AssertExpectations(t)
}

func TestUpdatePatient_InvalidJSON(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	patientID := "12345"
	invalidJSON := "{invalid JSON"

	// Simulate that the patient already exists
	mockStub.On("GetState", patientID).Return([]byte("existing patient data"), nil)

	contract := patient.PatientContract{}
	err := contract.UpdatePatient(mockCtx, patientID, invalidJSON)

	assert.NotNil(t, err)
	assert.Contains(t, err.Error(), "invalid character")
	mockStub.AssertExpectations(t)
}

func TestUpdatePatient_StubFailure(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	patientID := "12345"
	updatedPatientJSON := generatePatientJSON(patientID)

	mockStub.On("GetState", patientID).Return([]byte("existing patient data"), nil)
	mockStub.On("PutState", patientID, mock.Anything).Return(errors.New("ledger write error")) // Simulate a ledger write error

	contract := patient.PatientContract{}
	err := contract.UpdatePatient(mockCtx, patientID, updatedPatientJSON)

	assert.NotNil(t, err)
	assert.Equal(t, "failed to put state: ledger write error", err.Error())
	mockStub.AssertExpectations(t)
}

func TestDeletePatient_Success(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	patientID := "12345"

	// Simulate that the patient exists
	mockStub.On("GetState", patientID).Return([]byte("existing patient data"), nil)
	// Expect the delete to succeed
	mockStub.On("DelState", patientID).Return(nil)

	contract := patient.PatientContract{}
	err := contract.DeletePatient(mockCtx, patientID)

	assert.Nil(t, err)
	mockStub.AssertExpectations(t)
}

func TestDeletePatient_NotFound(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	patientID := "nonexistent"

	// Simulate that the patient does not exist
	mockStub.On("GetState", patientID).Return(nil, nil)

	contract := patient.PatientContract{}
	err := contract.DeletePatient(mockCtx, patientID)

	assert.NotNil(t, err)
	assert.Equal(t, "patient does not exist: "+patientID, err.Error())
	mockStub.AssertExpectations(t)
}

func TestDeletePatient_StubFailure(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	patientID := "12345"

	// Simulate a ledger error when checking if the patient exists
	mockStub.On("GetState", patientID).Return(nil, errors.New("ledger error"))

	contract := patient.PatientContract{}
	err := contract.DeletePatient(mockCtx, patientID)

	assert.NotNil(t, err)
	assert.Equal(t, "failed to get patient: ledger error", err.Error())
	mockStub.AssertExpectations(t)
}
