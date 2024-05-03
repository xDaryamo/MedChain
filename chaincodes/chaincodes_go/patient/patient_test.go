package patient

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

func generatePatientJSON(id string) string {
	patient := Patient{
		ID:        Identifier{Value: id},
		Name:      HumanName{Family: "Smith", Given: []string{"John"}},
		Gender:    Code{Coding: []Coding{{System: "http://hl7.org/fhir/ValueSet/administrative-gender", Code: "male", Display: "Male"}}},
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

	contract := PatientContract{}
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

	contract := PatientContract{}
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

	contract := PatientContract{}
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

	contract := PatientContract{}
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

	contract := PatientContract{}
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

	contract := PatientContract{}
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

	contract := PatientContract{}
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

	contract := PatientContract{}
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

	contract := PatientContract{}
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

	contract := PatientContract{}
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

	contract := PatientContract{}
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

	contract := PatientContract{}
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

	contract := PatientContract{}
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

	contract := PatientContract{}
	err := contract.DeletePatient(mockCtx, patientID)

	assert.NotNil(t, err)
	assert.Equal(t, "failed to get patient: ledger error", err.Error())
	mockStub.AssertExpectations(t)
}
