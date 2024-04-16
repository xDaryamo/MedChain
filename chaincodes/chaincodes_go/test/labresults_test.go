package test

import (
	"encoding/json"
	"errors"
	"testing"

	"github.com/golang/protobuf/ptypes/timestamp"
	"github.com/hyperledger/fabric-chaincode-go/pkg/cid"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-protos-go/ledger/queryresult"
	"github.com/hyperledger/fabric-protos-go/peer"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/xDaryamo/MedChain/fhir"
	"github.com/xDaryamo/MedChain/labresults"
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

// Helper function to create a sample observation JSON
func sampleObservationJSON(id string) string {
	observation := fhir.Observation{
		ID:     id,
		Status: "final",
		Code: fhir.CodeableConcept{
			Text: "Blood Test",
		},
	}
	bytes, _ := json.Marshal(observation)
	return string(bytes)
}

// Helper function to create a sample observation JSON that includes patient data
func sampleObservationJSONWithPatient(id string, patientID string) string {
	observation := fhir.Observation{
		ID:     id,
		Status: "final",
		Code: fhir.CodeableConcept{
			Text: "Blood Test",
		},
		Subject: &fhir.Reference{
			Reference: "Patient/" + patientID,
		},
	}
	bytes, _ := json.Marshal(observation)
	return string(bytes)
}

func TestCreateLabResult_Successful(t *testing.T) {
	labChaincode := new(labresults.LabResultsChaincode)
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
	labChaincode := new(labresults.LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	observationJSON := sampleObservationJSON("obs1")
	mockStub.On("GetState", "obs1").Return([]byte(observationJSON), nil) // Simulate that "obs1" exists

	err := labChaincode.CreateLabResult(mockCtx, observationJSON)
	assert.Error(t, err, "expected an error when creating a lab result with an existing ID")
}

func TestUpdateLabResult_Successful(t *testing.T) {
	labChaincode := new(labresults.LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	originalObservationJSON := sampleObservationJSON("obs1")
	var originalObservation fhir.Observation
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
	labChaincode := new(labresults.LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	updatedObservationJSON := sampleObservationJSON("obs2")

	mockStub.On("GetState", "obs2").Return(nil, nil)

	err := labChaincode.UpdateLabResult(mockCtx, "obs2", string(updatedObservationJSON))
	assert.Error(t, err)
}

func TestUpdateLabResult_DecodingError(t *testing.T) {
	labChaincode := new(labresults.LabResultsChaincode)
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
	labChaincode := new(labresults.LabResultsChaincode)
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
	labChaincode := new(labresults.LabResultsChaincode)
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
	labChaincode := new(labresults.LabResultsChaincode)
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
	labChaincode := new(labresults.LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	mockStub.On("GetState", "existingID").Return([]byte("some data"), nil)
	exists, err := labChaincode.LabResultExists(mockCtx, "existingID")
	assert.NoError(t, err)
	assert.True(t, exists, "Lab result should exist when data is returned.")
}

func TestLabResultExists_DoesNotExist(t *testing.T) {
	labChaincode := new(labresults.LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	mockStub.On("GetState", "nonExistingID").Return(nil, nil)
	exists, err := labChaincode.LabResultExists(mockCtx, "nonExistingID")
	assert.NoError(t, err)
	assert.False(t, exists, "Lab result should not exist when no data is returned.")
}

func TestLabResultExists_WorldStateAccessError(t *testing.T) {
	labChaincode := new(labresults.LabResultsChaincode)
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
	labChaincode := new(labresults.LabResultsChaincode)
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
	labChaincode := new(labresults.LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	mockStub.On("GetQueryResult", mock.Anything).Return(&MockIterator{}, nil)

	results, err := labChaincode.QueryLabResults(mockCtx, "patient2")
	assert.NoError(t, err)
	assert.Len(t, results, 0, "There should be no observations for the patient.")
}

func TestQueryLabResults_ErrorHandling(t *testing.T) {
	labChaincode := new(labresults.LabResultsChaincode)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	mockStub.On("GetQueryResult", mock.Anything).Return(nil, errors.New("failed to execute query"))

	results, err := labChaincode.QueryLabResults(mockCtx, "patient3")
	assert.Error(t, err)
	assert.Nil(t, results, "Results should be nil when an error occurs.")
}
