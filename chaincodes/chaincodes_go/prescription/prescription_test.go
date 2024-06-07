package main

import (
	"encoding/json"
	"errors"
	"testing"
	"time"

	"github.com/golang/protobuf/ptypes/timestamp"
	"github.com/hyperledger/fabric-chaincode-go/pkg/cid"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-protos-go/ledger/queryresult"
	"github.com/hyperledger/fabric-protos-go/peer"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockStub is a mock implementation of the ChaincodeStubInterface
type MockStub struct {
	mock.Mock
}

func (m *MockStub) CreateCompositeKey(objectType string, attributes []string) (string, error) {
	args := m.Called(objectType, attributes)
	return args.String(0), args.Error(1)
}

func (m *MockStub) DelPrivateData(collection string, key string) error {
	args := m.Called(collection, key)
	return args.Error(0)
}

func (m *MockStub) DelState(key string) error {
	args := m.Called(key)
	return args.Error(0)
}

func (m *MockStub) GetArgs() [][]byte {
	args := m.Called()
	return args.Get(0).([][]byte)
}

func (m *MockStub) GetArgsSlice() ([]byte, error) {
	args := m.Called()
	return args.Get(0).([]byte), args.Error(1)
}

func (m *MockStub) GetBinding() ([]byte, error) {
	args := m.Called()
	return args.Get(0).([]byte), args.Error(1)
}

func (m *MockStub) GetChannelID() string {
	args := m.Called()
	return args.String(0)
}

func (m *MockStub) GetCreator() ([]byte, error) {
	args := m.Called()
	return args.Get(0).([]byte), args.Error(1)
}

func (m *MockStub) GetDecorations() map[string][]byte {
	args := m.Called()
	return args.Get(0).(map[string][]byte)
}

func (m *MockStub) GetFunctionAndParameters() (string, []string) {
	args := m.Called()
	return args.String(0), args.Get(1).([]string)
}

func (m *MockStub) GetHistoryForKey(key string) (shim.HistoryQueryIteratorInterface, error) {
	args := m.Called(key)
	return args.Get(0).(shim.HistoryQueryIteratorInterface), args.Error(1)
}

func (m *MockStub) GetPrivateData(collection string, key string) ([]byte, error) {
	args := m.Called(collection, key)
	return args.Get(0).([]byte), args.Error(1)
}

func (m *MockStub) GetPrivateDataByPartialCompositeKey(collection, objectType string, attributes []string) (shim.StateQueryIteratorInterface, error) {
	args := m.Called(collection, objectType, attributes)
	return args.Get(0).(shim.StateQueryIteratorInterface), args.Error(1)
}

func (m *MockStub) GetPrivateDataByRange(collection, startKey, endKey string) (shim.StateQueryIteratorInterface, error) {
	args := m.Called(collection, startKey, endKey)
	return args.Get(0).(shim.StateQueryIteratorInterface), args.Error(1)
}

func (m *MockStub) GetPrivateDataHash(collection string, key string) ([]byte, error) {
	args := m.Called(collection, key)
	return args.Get(0).([]byte), args.Error(1)
}

func (m *MockStub) GetPrivateDataQueryResult(collection, query string) (shim.StateQueryIteratorInterface, error) {
	args := m.Called(collection, query)
	return args.Get(0).(shim.StateQueryIteratorInterface), args.Error(1)
}

func (m *MockStub) GetPrivateDataValidationParameter(collection, key string) ([]byte, error) {
	args := m.Called(collection, key)
	return args.Get(0).([]byte), args.Error(1)
}

func (m *MockStub) GetQueryResult(query string) (shim.StateQueryIteratorInterface, error) {
	args := m.Called(query)
	// Check if the first argument is nil
	if args.Get(0) == nil {
		// Return a properly initialized MockIterator along with a nil error
		return new(MockIterator), args.Error(1)
	}
	// Otherwise, return the mock iterator and the error as usual
	return args.Get(0).(shim.StateQueryIteratorInterface), args.Error(1)
}

func (m *MockStub) GetQueryResultWithPagination(query string, pageSize int32, bookmark string) (shim.StateQueryIteratorInterface, *peer.QueryResponseMetadata, error) {
	args := m.Called(query, pageSize, bookmark)
	return args.Get(0).(shim.StateQueryIteratorInterface), args.Get(1).(*peer.QueryResponseMetadata), args.Error(2)
}

func (m *MockStub) GetSignedProposal() (*peer.SignedProposal, error) {
	args := m.Called()
	return args.Get(0).(*peer.SignedProposal), args.Error(1)
}

func (m *MockStub) GetState(key string) ([]byte, error) {
	args := m.Called(key)
	// Check if the first argument is nil
	if args.Get(0) == nil {
		// Return nil along with the error
		return nil, args.Error(1)
	}
	// Otherwise, return the byte slice and the error as usual
	return args.Get(0).([]byte), args.Error(1)
}

func (m *MockStub) GetStateByPartialCompositeKey(objectType string, attributes []string) (shim.StateQueryIteratorInterface, error) {
	args := m.Called(objectType, attributes)
	return args.Get(0).(shim.StateQueryIteratorInterface), args.Error(1)
}

func (m *MockStub) GetStateByPartialCompositeKeyWithPagination(objectType string, keys []string, pageSize int32, bookmark string) (shim.StateQueryIteratorInterface, *peer.QueryResponseMetadata, error) {
	args := m.Called(objectType, keys, pageSize, bookmark)
	return args.Get(0).(shim.StateQueryIteratorInterface), args.Get(1).(*peer.QueryResponseMetadata), args.Error(2)
}

func (m *MockStub) GetStateByRange(startKey, endKey string) (shim.StateQueryIteratorInterface, error) {
	args := m.Called(startKey, endKey)
	return args.Get(0).(shim.StateQueryIteratorInterface), args.Error(1)
}

func (m *MockStub) GetStateByRangeWithPagination(startKey, endKey string, pageSize int32, bookmark string) (shim.StateQueryIteratorInterface, *peer.QueryResponseMetadata, error) {
	args := m.Called(startKey, endKey, pageSize, bookmark)
	return args.Get(0).(shim.StateQueryIteratorInterface), args.Get(1).(*peer.QueryResponseMetadata), args.Error(2)
}

func (m *MockStub) GetStateValidationParameter(key string) ([]byte, error) {
	args := m.Called(key)
	return args.Get(0).([]byte), args.Error(1)
}

func (m *MockStub) GetStringArgs() []string {
	args := m.Called()
	return args.Get(0).([]string)
}

func (m *MockStub) GetTransient() (map[string][]byte, error) {
	args := m.Called()
	return args.Get(0).(map[string][]byte), args.Error(1)
}

func (m *MockStub) GetTxID() string {
	args := m.Called()
	return args.String(0)
}

func (m *MockStub) GetTxTimestamp() (*timestamp.Timestamp, error) {
	args := m.Called()
	return args.Get(0).(*timestamp.Timestamp), args.Error(1)
}

func (m *MockStub) InvokeChaincode(chaincodeName string, args [][]byte, channel string) peer.Response {
	callArgs := m.Called(chaincodeName, args, channel)
	return callArgs.Get(0).(peer.Response)
}

func (m *MockStub) PurgePrivateData(collection string, key string) error {
	args := m.Called(collection, key)
	return args.Error(0)
}

func (m *MockStub) PutPrivateData(collection string, key string, value []byte) error {
	args := m.Called(collection, key, value)
	return args.Error(0)
}

func (m *MockStub) PutState(key string, value []byte) error {
	args := m.Called(key, value)
	return args.Error(0)
}

func (m *MockStub) SetEvent(name string, payload []byte) error {
	args := m.Called(name, payload)
	return args.Error(0)
}

func (m *MockStub) SetPrivateDataValidationParameter(collection, key string, ep []byte) error {
	args := m.Called(collection, key, ep)
	return args.Error(0)
}

func (m *MockStub) SetStateValidationParameter(key string, ep []byte) error {
	args := m.Called(key, ep)
	return args.Error(0)
}

func (m *MockStub) SplitCompositeKey(compositeKey string) (string, []string, error) {
	args := m.Called(compositeKey)
	return args.String(0), args.Get(1).([]string), args.Error(2)
}

type MockTransactionContext struct {
	mock.Mock
}

func (m *MockTransactionContext) GetStub() shim.ChaincodeStubInterface {
	args := m.Called()
	return args.Get(0).(shim.ChaincodeStubInterface)
}

func (m *MockTransactionContext) GetClientIdentity() cid.ClientIdentity {
	args := m.Called()
	return args.Get(0).(cid.ClientIdentity)
}

// KVPair represents a key-value pair for testing purposes
type KVPair struct {
	Key   string
	Value []byte
}

// MockIterator is a mock implementation of the StateQueryIteratorInterface
type MockIterator struct {
	Records      []KVPair // Slice to hold the records for iteration
	CurrentIndex int      // Index to keep track of the current position
}

// HasNext returns true if the iterator has more items to iterate over
func (m *MockIterator) HasNext() bool {
	return m.CurrentIndex < len(m.Records)
}

// Next returns the next key and value in the iterator
func (m *MockIterator) Next() (*queryresult.KV, error) {
	if m.CurrentIndex >= len(m.Records) {
		return nil, nil
	}
	result := m.Records[m.CurrentIndex]
	m.CurrentIndex++
	kv := &queryresult.KV{
		Key:   result.Key,
		Value: result.Value,
	}
	return kv, nil
}

// AddRecord adds a key-value pair to the mock iterator
func (m *MockIterator) AddRecord(key string, value []byte) {
	m.Records = append(m.Records, KVPair{Key: key, Value: value})
}

// Close closes the mock iterator (implements shim.StateQueryIteratorInterface)
func (m *MockIterator) Close() error {
	// No action needed for a mock iterator, return nil
	return nil
}

// Tests

func generateMedicationRequestJSON(id string, status string) string {
	// Create a simple MedicationRequest struct
	now := time.Now() // Creare il valore time.Time
	medicationRequest := MedicationRequest{
		ID: &Identifier{
			System: "http://hospital.smarthealth.it/medicationrequests",
			Value:  id,
		},
		Status: &Code{
			Coding: []Coding{
				{
					System:  "http://hl7.org/fhir/medicationrequest-status",
					Code:    status,
					Display: status,
				},
			},
		},
		Intent: &Code{
			Coding: []Coding{
				{
					System:  "http://hl7.org/fhir/medication-request-intent",
					Code:    "order",
					Display: "Order",
				},
			},
		},
		MedicationCodeableConcept: &CodeableConcept{
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
		AuthoredOn: &now, // Usare l'indirizzo del valore time.Time
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
			Quantity: &Quantity{
				Value: 15,
				Unit:  "teaspoonful",
			},
			ExpectedSupplyDuration: &Duration{
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

func TestCreatePrescription_Success(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	medicationRequestID := "medReq123"
	medicationRequestJSON := generateMedicationRequestJSON(medicationRequestID, "active")

	mockStub.On("GetState", medicationRequestID).Return(nil, nil)           // Medication request does not exist
	mockStub.On("PutState", medicationRequestID, mock.Anything).Return(nil) // Expect the put to succeed

	chaincode := PrescriptionChaincode{}
	msg, err := chaincode.CreatePrescription(mockCtx, medicationRequestJSON)

	assert.Nil(t, err)
	assert.Equal(t, msg, `{"message": "Prescription created successfully"}`)
	mockStub.AssertExpectations(t)
}

func TestCreatePrescription_AlreadyExists(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	medicationRequestID := "medReq123"
	medicationRequestJSON := generateMedicationRequestJSON(medicationRequestID, "active")

	mockStub.On("GetState", medicationRequestID).Return([]byte("existing medication request"), nil) // Medication request already exists

	chaincode := PrescriptionChaincode{}
	msg, err := chaincode.CreatePrescription(mockCtx, medicationRequestJSON)

	assert.NotNil(t, err)
	assert.Equal(t, "the prescription already exists", err.Error())
	assert.Equal(t, msg, `{"error": "the prescription already exists"}`)
	mockStub.AssertExpectations(t)
}

func TestCreatePrescription_InvalidJSON(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	invalidJSON := "{this is not valid JSON"

	chaincode := PrescriptionChaincode{}
	msg, err := chaincode.CreatePrescription(mockCtx, invalidJSON)

	assert.NotNil(t, err)
	assert.Equal(t, msg, `{"error": "failed to decode JSON"}`)
	mockStub.AssertExpectations(t)
}

func TestCreatePrescription_NoID(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	medicationRequestJSON := generateMedicationRequestJSON("", "active")

	chaincode := PrescriptionChaincode{}
	msg, err := chaincode.CreatePrescription(mockCtx, medicationRequestJSON)

	assert.NotNil(t, err)
	assert.Equal(t, msg, "{\"error\": \"medication request ID is required\"}")
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
	msg, err := chaincode.VerifyPrescription(mockCtx, prescriptionID, pharmacyID)

	assert.Nil(t, err)
	assert.Equal(t, msg, `{"message": "prescription verified successfully"}`)
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
	msg, err := chaincode.VerifyPrescription(mockCtx, prescriptionID, pharmacyID)

	assert.NotNil(t, err)
	assert.Equal(t, msg, `{"error": "the prescription does not exist"}`)
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
	msg, err := chaincode.VerifyPrescription(mockCtx, prescriptionID, pharmacyID)

	assert.NotNil(t, err)
	assert.Equal(t, msg, `{"error": "prescription is not active or no status code available"}`)
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
	msg, err := chaincode.VerifyPrescription(mockCtx, prescriptionID, pharmacyID)

	assert.NotNil(t, err)
	assert.Equal(t, msg, `{"error": "failed to read from world state"}`)
	mockStub.AssertExpectations(t)
}

func TestReadPrescription_Success(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	medicationRequestID := "medReq123"
	medicationRequestJSON := generateMedicationRequestJSON(medicationRequestID, "active")

	mockStub.On("GetState", medicationRequestID).Return([]byte(medicationRequestJSON), nil)

	chaincode := PrescriptionChaincode{}
	result, err := chaincode.ReadPrescription(mockCtx, medicationRequestID)

	assert.Nil(t, err)
	assert.Equal(t, medicationRequestJSON, result)
	mockStub.AssertExpectations(t)
}

func TestReadPrescription_NotFound(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	medicationRequestID := "nonexistent"

	mockStub.On("GetState", medicationRequestID).Return(nil, nil)

	chaincode := PrescriptionChaincode{}
	result, err := chaincode.ReadPrescription(mockCtx, medicationRequestID)

	assert.NotNil(t, err)
	assert.Equal(t, "{\"error\": \"the prescription does not exist\"}", result)
	assert.Equal(t, "the prescription does not exist", err.Error())
	mockStub.AssertExpectations(t)
}

func TestReadPrescription_LedgerError(t *testing.T) {
	mockStub := new(MockStub)
	mockCtx := new(MockTransactionContext)
	mockCtx.On("GetStub").Return(mockStub)

	medicationRequestID := "medReq123"

	mockStub.On("GetState", medicationRequestID).Return(nil, errors.New("failed to read from world state"))

	chaincode := PrescriptionChaincode{}
	result, err := chaincode.ReadPrescription(mockCtx, medicationRequestID)

	assert.NotNil(t, err)
	assert.Equal(t, "{\"error\": \"failed to read from world state\"}", result)
	assert.Equal(t, "failed to read from world state", err.Error())
	mockStub.AssertExpectations(t)
}
