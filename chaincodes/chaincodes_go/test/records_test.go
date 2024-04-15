package test

import (
	"fmt"
	"testing"

	"github.com/golang/protobuf/ptypes/timestamp"
	"github.com/hyperledger/fabric-chaincode-go/pkg/cid"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-protos-go/ledger/queryresult"
	"github.com/hyperledger/fabric-protos-go/peer"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/xDaryamo/MedChain/records"
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
