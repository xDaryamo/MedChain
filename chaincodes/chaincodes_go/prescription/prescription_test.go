package prescription

import (
	"encoding/json"
	"errors"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// Tests

func generateMedicationRequestJSON(id string, status string) string {
	// Create a simple MedicationRequest struct
	medicationRequest := MedicationRequest{
		ID: Identifier{
			System: "http://hospital.smarthealth.it/medicationrequests",
			Value:  id,
		},
		Status: Code{
			Coding: []Coding{
				{
					System:  "http://hl7.org/fhir/medicationrequest-status",
					Code:    status,
					Display: status,
				},
			},
		},
		Intent: Code{
			Coding: []Coding{
				{
					System:  "http://hl7.org/fhir/medication-request-intent",
					Code:    "order",
					Display: "Order",
				},
			},
		},
		MedicationCodeableConcept: CodeableConcept{
			Coding: []Coding{
				{
					System:  "http://www.nlm.nih.gov/research/umls/rxnorm",
					Code:    "582620",
					Display: "Amoxicillin 250mg/5ml Suspension",
				},
			},
			Text: "Amoxicillin 250mg/5ml Suspension",
		},
		Subject: &Reference{
			Reference: "Patient/example",
			Display:   "John Doe",
		},
		AuthoredOn: time.Now(),
		Requester: &Reference{
			Reference: "Practitioner/example",
			Display:   "Dr. Jane Smith",
		},
		DosageInstruction: []Dosage{
			{
				Text: "Take one teaspoonful by mouth three times daily",
			},
		},
		DispenseRequest: &DispenseRequest{
			Performer: &Reference{
				Reference: "Organization/pharmacy",
			},
			Quantity: Quantity{
				Value: 15,
				Unit:  "teaspoonful",
			},
			ExpectedSupplyDuration: Duration{
				Value: 10,
				Unit:  "days",
			},
		},
	}

	// Marshal the MedicationRequest struct to JSON
	medicationRequestJSON, err := json.Marshal(medicationRequest)
	if err != nil {
		panic("Failed to marshal MedicationRequest: " + err.Error())
	}

	return string(medicationRequestJSON)
}

func TestCreateMedicationRequest_Success(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	medicationRequestID := "medReq123"
	medicationRequestJSON := generateMedicationRequestJSON(medicationRequestID, "active")

	mockStub.On("GetState", medicationRequestID).Return(nil, nil)           // Medication request does not exist
	mockStub.On("PutState", medicationRequestID, mock.Anything).Return(nil) // Expect the put to succeed

	chaincode := PrescriptionChaincode{}
	err := chaincode.CreateMedicationRequest(mockCtx, medicationRequestJSON)

	assert.Nil(t, err)
	mockStub.AssertExpectations(t)
}

func TestCreateMedicationRequest_AlreadyExists(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	medicationRequestID := "medReq123"
	medicationRequestJSON := generateMedicationRequestJSON(medicationRequestID, "active")

	mockStub.On("GetState", medicationRequestID).Return([]byte("existing medication request"), nil) // Medication request already exists

	chaincode := PrescriptionChaincode{}
	err := chaincode.CreateMedicationRequest(mockCtx, medicationRequestJSON)

	assert.NotNil(t, err)
	assert.Equal(t, "the prescription already exists", err.Error())
	mockStub.AssertExpectations(t)
}

func TestCreateMedicationRequest_InvalidJSON(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	invalidJSON := "{this is not valid JSON"

	chaincode := PrescriptionChaincode{}
	err := chaincode.CreateMedicationRequest(mockCtx, invalidJSON)

	assert.NotNil(t, err)
	assert.Contains(t, err.Error(), "failed to decode JSON")
	mockStub.AssertExpectations(t)
}

func TestCreateMedicationRequest_NoID(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	medicationRequestJSON := generateMedicationRequestJSON("", "active")

	chaincode := PrescriptionChaincode{}
	err := chaincode.CreateMedicationRequest(mockCtx, medicationRequestJSON)

	assert.NotNil(t, err)
	assert.Equal(t, "medication request ID is required", err.Error())
	mockStub.AssertExpectations(t)
}

func TestVerifyPrescription_Success(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	prescriptionID := "prescription123"
	pharmacyID := "pharmacyXYZ"
	activePrescriptionJSON := generateMedicationRequestJSON(prescriptionID, "active")

	mockStub.On("GetState", prescriptionID).Return([]byte(activePrescriptionJSON), nil)
	mockStub.On("PutState", prescriptionID, mock.Anything).Return(nil)

	chaincode := PrescriptionChaincode{}
	err := chaincode.VerifyPrescription(mockCtx, prescriptionID, pharmacyID)

	assert.Nil(t, err)
	mockStub.AssertExpectations(t)
}

func TestVerifyPrescription_NotFound(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	prescriptionID := "nonexistent"
	pharmacyID := "pharmacyXYZ"

	mockStub.On("GetState", prescriptionID).Return(nil, nil)

	chaincode := PrescriptionChaincode{}
	err := chaincode.VerifyPrescription(mockCtx, prescriptionID, pharmacyID)

	assert.NotNil(t, err)
	assert.Equal(t, "the prescription does not exist", err.Error())
	mockStub.AssertExpectations(t)
}

func TestVerifyPrescription_NotActive(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	prescriptionID := "prescription123"
	pharmacyID := "pharmacyXYZ"
	inactivePrescriptionJSON := generateMedicationRequestJSON(prescriptionID, "completed")

	mockStub.On("GetState", prescriptionID).Return([]byte(inactivePrescriptionJSON), nil)

	chaincode := PrescriptionChaincode{}
	err := chaincode.VerifyPrescription(mockCtx, prescriptionID, pharmacyID)

	assert.NotNil(t, err)
	assert.Equal(t, "prescription is not active or no status code available", err.Error())
	mockStub.AssertExpectations(t)
}

func TestVerifyPrescription_StubFailure(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	prescriptionID := "prescription123"
	pharmacyID := "pharmacyXYZ"

	mockStub.On("GetState", prescriptionID).Return(nil, errors.New("ledger error"))

	chaincode := PrescriptionChaincode{}
	err := chaincode.VerifyPrescription(mockCtx, prescriptionID, pharmacyID)

	assert.NotNil(t, err)
	assert.Equal(t, "failed to read from world state", err.Error())
	mockStub.AssertExpectations(t)
}

func TestGetMedicationRequest_Success(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	medicationRequestID := "medReq123"
	medicationRequestJSON := generateMedicationRequestJSON(medicationRequestID, "active")

	mockStub.On("GetState", medicationRequestID).Return([]byte(medicationRequestJSON), nil)

	chaincode := PrescriptionChaincode{}
	result, err := chaincode.GetMedicationRequest(mockCtx, medicationRequestID)

	assert.Nil(t, err)
	assert.Equal(t, medicationRequestJSON, result)
	mockStub.AssertExpectations(t)
}

func TestGetMedicationRequest_NotFound(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	medicationRequestID := "nonexistent"

	mockStub.On("GetState", medicationRequestID).Return(nil, nil)

	chaincode := PrescriptionChaincode{}
	result, err := chaincode.GetMedicationRequest(mockCtx, medicationRequestID)

	assert.NotNil(t, err)
	assert.Equal(t, "", result)
	assert.Equal(t, "the prescription does not exist", err.Error())
	mockStub.AssertExpectations(t)
}

func TestGetMedicationRequest_LedgerError(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	medicationRequestID := "medReq123"

	mockStub.On("GetState", medicationRequestID).Return(nil, errors.New("ledger error"))

	chaincode := PrescriptionChaincode{}
	result, err := chaincode.GetMedicationRequest(mockCtx, medicationRequestID)

	assert.NotNil(t, err)
	assert.Equal(t, "", result)
	assert.Equal(t, "failed to read from world state", err.Error())
	mockStub.AssertExpectations(t)
}

func TestPrescriptionExists_Exists(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	prescriptionID := "prescription123"

	// Simulate finding the prescription in the blockchain
	mockStub.On("GetState", prescriptionID).Return([]byte("prescription data"), nil)

	chaincode := PrescriptionChaincode{}
	exists, err := chaincode.PrescriptionExists(mockCtx, prescriptionID)

	assert.Nil(t, err)
	assert.True(t, exists)
	mockStub.AssertExpectations(t)
}

func TestPrescriptionExists_DoesNotExist(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	prescriptionID := "nonexistent"

	// Simulate the prescription not being found in the blockchain
	mockStub.On("GetState", prescriptionID).Return(nil, nil)

	chaincode := PrescriptionChaincode{}
	exists, err := chaincode.PrescriptionExists(mockCtx, prescriptionID)

	assert.Nil(t, err)
	assert.False(t, exists)
	mockStub.AssertExpectations(t)
}

func TestPrescriptionExists_LedgerError(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	prescriptionID := "prescription123"

	// Simulate an error accessing the ledger
	mockStub.On("GetState", prescriptionID).Return(nil, errors.New("ledger access error"))

	chaincode := PrescriptionChaincode{}
	exists, err := chaincode.PrescriptionExists(mockCtx, prescriptionID)

	assert.NotNil(t, err)
	assert.False(t, exists)
	assert.Equal(t, "failed to read from world state", err.Error())
	mockStub.AssertExpectations(t)
}
