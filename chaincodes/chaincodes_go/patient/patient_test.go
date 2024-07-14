package main

import (
	"crypto/x509"
	"encoding/json"
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

type MockClientIdentity struct {
	mock.Mock
}

func (mci *MockClientIdentity) GetID() (string, error) {
	args := mci.Called()
	return args.String(0), args.Error(1)
}

func (mci *MockClientIdentity) GetMSPID() (string, error) {
	args := mci.Called()
	return args.String(0), args.Error(1)
}

func (mci *MockClientIdentity) GetAttributeValue(attrName string) (string, bool, error) {
	args := mci.Called(attrName)
	return args.String(0), args.Bool(1), args.Error(2)
}

func (mci *MockClientIdentity) HasAttribute(attrName string) (bool, error) {
	args := mci.Called(attrName)
	return args.Bool(0), args.Error(1)
}

func (mci *MockClientIdentity) AssertAttributeValue(attrName, attrValue string) error {
	args := mci.Called(attrName, attrValue)
	return args.Error(0)
}

func (mci *MockClientIdentity) GetX509Certificate() (*x509.Certificate, error) {
	args := mci.Called()
	return args.Get(0).(*x509.Certificate), args.Error(1)
}

// Tests

func generatePatientJSON(id string) string {
	now := time.Now()
	patient := Patient{
		ID:        &Identifier{Value: id},
		Name:      &HumanName{Family: "Smith", Given: []string{"John"}},
		Gender:    &Code{Coding: []Coding{{System: "http://hl7.org/fhir/ValueSet/administrative-gender", Code: "male", Display: "Male"}}},
		BirthDate: now,
	}
	patientJSON, _ := json.Marshal(patient)
	return string(patientJSON)
}

func TestCreatePatient_Success(t *testing.T) {
	patientContract := new(PatientContract)

	stub := new(MockStub)
	txContext := new(MockTransactionContext)

	txContext.On("GetStub").Return(stub)
	patientID := "patient-001"
	patientJSON := generatePatientJSON(patientID)

	stub.On("GetState", patientID).Return(nil, nil)
	stub.On("PutState", patientID, mock.Anything).Return(nil)

	msg, err := patientContract.CreatePatient(txContext, patientJSON)
	assert.Equal(t, msg, `{"message": "Patient created successfully"}`)
	assert.Nil(t, err)

	// Ensure all expectations on the mocks are met
	txContext.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestCreatePatient_FailureExists(t *testing.T) {
	patientContract := new(PatientContract)

	stub := new(MockStub)
	txContext := new(MockTransactionContext)

	txContext.On("GetStub").Return(stub)
	patientID := "patient-001"
	patientJSON := generatePatientJSON(patientID)

	stub.On("GetState", patientID).Return([]byte("existing patient data"), nil) // Simulate that the patient already exists

	msg, err := patientContract.CreatePatient(txContext, patientJSON)

	assert.NotNil(t, err)
	assert.Equal(t, msg, `{"error": "patient already exists: `+patientID+`"}`)

	txContext.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestCreatePatient_FailureJSONError(t *testing.T) {
	patientContract := new(PatientContract)

	stub := new(MockStub)
	txContext := new(MockTransactionContext)

	invalidJSON := "{" // Malformed JSON

	msg, err := patientContract.CreatePatient(txContext, invalidJSON)

	assert.Error(t, err)
	assert.Equal(t, msg, `{"error": "failed to unmarshal patient: `+err.Error()+`"}`)

	txContext.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestUpdatePatient_Success(t *testing.T) {
	patientContract := new(PatientContract)
	stub := new(MockStub)
	txContext := new(MockTransactionContext)
	clientIdentity := new(MockClientIdentity)

	txContext.On("GetStub").Return(stub)
	txContext.On("GetClientIdentity").Return(clientIdentity)
	clientIdentity.On("GetAttributeValue", "userId").Return("patient-001", true, nil)

	patientID := "patient-001"
	patientJSON := generatePatientJSON(patientID)
	patientBytes := []byte(patientJSON)

	// Assuming GetX509Certificate is called when certain conditions are met
	dummyCert := &x509.Certificate{} // Prepare a dummy certificate if needed

	// Only set this expectation if your chaincode logic definitely calls it under test conditions
	clientIdentity.On("GetX509Certificate").Maybe().Return(dummyCert, nil) // Use Maybe() for conditional expectations

	stub.On("GetState", patientID).Return(patientBytes, nil)
	stub.On("PutState", patientID, mock.Anything).Return(nil)

	msg, err := patientContract.UpdatePatient(txContext, patientJSON)

	assert.Nil(t, err)
	assert.Equal(t, msg, `{"message": "Patient updated successfully"}`)
	clientIdentity.AssertExpectations(t)
	txContext.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestUpdatePatient_Unauthorized(t *testing.T) {
	patientContract := new(PatientContract)
	stub := new(MockStub)
	txContext := new(MockTransactionContext)
	clientIdentity := new(MockClientIdentity)

	txContext.On("GetStub").Return(stub)
	txContext.On("GetClientIdentity").Return(clientIdentity)
	clientIdentity.On("GetAttributeValue", "userId").Return("unauthorized-client", true, nil)

	patientID := "patient-001"

	patientJSON := generatePatientJSON(patientID)
	patientBytes := []byte(patientJSON)

	// Mock setup to return patient data
	stub.On("GetState", patientID).Return(patientBytes, nil)

	// Set up mock for authorization data retrieval
	authKey := "auth_" + patientID
	stub.On("GetState", authKey).Return(nil, nil)

	msg, err := patientContract.UpdatePatient(txContext, patientJSON)

	assert.Error(t, err)
	assert.Equal(t, msg, "{\"error\": \"unauthorized to update patient records\"}")
	stub.AssertExpectations(t)
	txContext.AssertExpectations(t)
	clientIdentity.AssertExpectations(t)
}

func TestDeletePatient_Success(t *testing.T) {
	patientContract := new(PatientContract)
	stub := new(MockStub)
	txContext := new(MockTransactionContext)
	txContext.On("GetStub").Return(stub)

	patientID := "patient-001"
	patientBytes := []byte(generatePatientJSON(patientID))

	// Mock the ledger response for existing patient
	stub.On("GetState", patientID).Return(patientBytes, nil)
	stub.On("DelState", patientID).Return(nil)

	// Execute the DeletePatient function
	msg, err := patientContract.DeletePatient(txContext, patientID)

	assert.Nil(t, err)
	assert.Equal(t, msg, `{"message": "Patient deleted successfully"}`)
	txContext.AssertExpectations(t)
	stub.AssertExpectations(t) // Check if all stub expectations are met
}

func TestDeletePatient_NonExistent(t *testing.T) {
	patientContract := new(PatientContract)
	stub := new(MockStub)
	txContext := new(MockTransactionContext)
	txContext.On("GetStub").Return(stub)

	nonExistentID := "patient-999" // Assuming this ID does not exist in the ledger

	// Setup stub to simulate no patient found for this ID
	stub.On("GetState", nonExistentID).Return(nil, nil)

	msg, err := patientContract.DeletePatient(txContext, nonExistentID)

	assert.NotNil(t, err)
	assert.Equal(t, msg, `{"error": "patient does not exist: `+nonExistentID+`"}`)
	txContext.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestReadPatient_SuccessByPatient(t *testing.T) {
	contract := new(PatientContract)
	stub := new(MockStub)
	ctx := new(MockTransactionContext)
	clientIdentity := new(MockClientIdentity)

	// Set up the mock transaction context to return the mock stub and client identity
	ctx.On("GetStub").Return(stub)
	ctx.On("GetClientIdentity").Return(clientIdentity)

	patientID := "patient-001"
	patientData := generatePatientJSON(patientID)
	patientBytes := []byte(patientData)

	// Mock GetState to return the patient JSON data
	stub.On("GetState", patientID).Return(patientBytes, nil)

	// Mock GetAttributeValue to return the patient ID for the userId attribute
	clientIdentity.On("GetAttributeValue", "userId").Return(patientID, true, nil)

	// Call the ReadPatient method
	patientJSON, err := contract.ReadPatient(ctx, patientID)

	// Assert no error is returned
	assert.Nil(t, err)

	// Assert that patientJSON is not nil
	assert.NotNil(t, patientJSON)

	// Unmarshal the returned patient JSON
	var patient Patient
	err = json.Unmarshal([]byte(patientJSON), &patient)

	// Assert no error during unmarshaling
	assert.Nil(t, err)

	// Assert the expected patient details
	assert.Equal(t, "John", patient.Name.Given[0]) // Example of accessing nested fields

	// Verify that all expectations were met
	stub.AssertExpectations(t)
	clientIdentity.AssertExpectations(t)
}

func TestReadPatient_SuccessByAuthorizedUser(t *testing.T) {
	contract := new(PatientContract)
	stub := new(MockStub)
	ctx := new(MockTransactionContext)
	clientIdentity := new(MockClientIdentity)

	ctx.On("GetStub").Return(stub)
	ctx.On("GetClientIdentity").Return(clientIdentity)

	patientID := "patient-001"
	clientID := "doctor-002"
	patientData := generatePatientJSON(patientID)
	patientBytes := []byte(patientData)

	// Mock patient data retrieval
	stub.On("GetState", patientID).Return(patientBytes, nil)
	// Mock client identity retrieval
	clientIdentity.On("GetAttributeValue", "userId").Return(clientID, true, nil)

	// Set up authorization data to indicate that the doctor is authorized
	authData := Authorization{PatientID: patientID, Authorized: map[string]bool{clientID: true}}
	authBytes, _ := json.Marshal(authData)
	stub.On("GetState", "auth_"+patientID).Return(authBytes, nil)

	// Attempt to read the patient data as an authorized user
	patientJSON, err := contract.ReadPatient(ctx, patientID)

	assert.Nil(t, err)
	assert.NotNil(t, patientJSON)

	var patient Patient
	err = json.Unmarshal([]byte(patientJSON), &patient)
	assert.Nil(t, err)
	assert.Equal(t, "John", patient.Name.Given[0]) // Example of accessing nested fields

	stub.AssertExpectations(t)
	clientIdentity.AssertExpectations(t)
}

func TestReadPatient_UnauthorizedAccess(t *testing.T) {
	contract := new(PatientContract)
	stub := new(MockStub)
	ctx := new(MockTransactionContext)
	clientIdentity := new(MockClientIdentity)

	ctx.On("GetStub").Return(stub)
	ctx.On("GetClientIdentity").Return(clientIdentity)

	patientID := "patient-001"
	unauthorizedClientID := "client-999"
	patientData := generatePatientJSON(patientID)
	patientBytes := []byte(patientData)

	// Mock patient data retrieval
	stub.On("GetState", patientID).Return(patientBytes, nil)
	// Mock client identity retrieval
	clientIdentity.On("GetAttributeValue", "userId").Return(unauthorizedClientID, true, nil)
	// Mock authorization retrieval to return nil (no authorization found)
	stub.On("GetState", "auth_"+patientID).Return(nil, nil)

	// Attempt to read the patient data as an unauthorized user
	patientJSON, err := contract.ReadPatient(ctx, patientID)

	// Assert that an error is returned
	assert.NotNil(t, err)
	// Assert that the patient JSON is nil
	assert.Equal(t, patientJSON, "{\"error\": \"unauthorized access: client is neither the patient nor an authorized entity\"}")
	// Assert that the error message matches the expected unauthorized access error
	assert.Equal(t, "unauthorized access: client is neither the patient nor an authorized entity", err.Error())

	// Verify that all expectations were met
	stub.AssertExpectations(t)
	clientIdentity.AssertExpectations(t)
}

func TestReadPatient_NonExistentPatient(t *testing.T) {
	contract := new(PatientContract)
	stub := new(MockStub)
	ctx := new(MockTransactionContext)

	ctx.On("GetStub").Return(stub)

	nonExistentPatientID := "patient-999"

	// Mock GetState to return nil, indicating the patient does not exist
	stub.On("GetState", nonExistentPatientID).Return(nil, nil)

	// Attempt to read the non-existent patient data
	patientJSON, err := contract.ReadPatient(ctx, nonExistentPatientID)

	// Assert that an error is returned
	assert.NotNil(t, err)
	// Assert that the error message matches the expected error message
	assert.Equal(t, patientJSON, "{\"error\": \"patient does not exist: "+nonExistentPatientID+"\"}")

	// Verify that all expectations were met
	stub.AssertExpectations(t)
}

func TestRequestAccess_NewAuthorization(t *testing.T) {
	contract := new(PatientContract)
	stub := new(MockStub)
	ctx := new(MockTransactionContext)

	ctx.On("GetStub").Return(stub)
	patientID := "patient-001"
	requesterID := "doctor-001"

	// Assume the patient exists
	stub.On("GetState", patientID).Return([]byte(generatePatientJSON("patient-001")), nil)
	// Assume no existing authorization record
	stub.On("GetState", "auth_"+patientID).Return(nil, nil)
	stub.On("PutState", "auth_"+patientID, mock.Anything).Return(nil)

	msg, err := contract.RequestAccess(ctx, patientID, requesterID, false)

	assert.Nil(t, err)
	assert.Equal(t, msg, `{"message": "Access request recorded"}`)
	stub.AssertExpectations(t)
}

func TestRequestAccess_ExistingAuthorization(t *testing.T) {
	contract := new(PatientContract)
	stub := new(MockStub)
	ctx := new(MockTransactionContext)

	ctx.On("GetStub").Return(stub)
	patientID := "patient-001"
	requesterID := "doctor-001"

	// Assume the patient exists
	stub.On("GetState", patientID).Return([]byte(generatePatientJSON(patientID)), nil)

	// Existing authorization for the patient
	existingAuth := Authorization{
		PatientID:      patientID,
		Authorized:     make(map[string]bool),
		AuthorizedOrgs: make(map[string]bool),
	}
	existingAuthBytes, _ := json.Marshal(existingAuth)
	stub.On("GetState", "auth_"+patientID).Return(existingAuthBytes, nil)
	stub.On("PutState", "auth_"+patientID, mock.Anything).Return(nil)

	msg, err := contract.RequestAccess(ctx, patientID, requesterID, false)

	assert.Nil(t, err)
	assert.Equal(t, msg, `{"message": "Access request recorded"}`)
	stub.AssertExpectations(t)
}

func TestGrantAccess_Success(t *testing.T) {
	contract := new(PatientContract)
	stub := new(MockStub)
	ctx := new(MockTransactionContext)
	clientIdentity := new(MockClientIdentity)

	ctx.On("GetStub").Return(stub)
	ctx.On("GetClientIdentity").Return(clientIdentity)
	clientIdentity.On("GetAttributeValue", "userId").Return("patient-001", true, nil)
	patientID := "patient-001"
	requesterID := "doctor-001"

	auth := Authorization{PatientID: patientID, Authorized: map[string]bool{requesterID: false}}
	authBytes, _ := json.Marshal(auth)
	stub.On("GetState", "auth_"+patientID).Return(authBytes, nil)
	stub.On("PutState", "auth_"+patientID, mock.Anything).Return(nil)

	invokeResponse := peer.Response{
		Status:  200,
		Payload: []byte(""),
	}
	stub.On("InvokeChaincode", "practitioner", mock.AnythingOfType("[][]uint8"), "").Return(invokeResponse, nil)

	msg, err := contract.GrantAccess(ctx, patientID, requesterID, false)

	assert.Nil(t, err)
	assert.Equal(t, msg, `{"message": "Access granted"}`)
	stub.AssertExpectations(t)
	clientIdentity.AssertExpectations(t)
}

func TestRevokeAccess_Success(t *testing.T) {
	contract := new(PatientContract)
	stub := new(MockStub)
	ctx := new(MockTransactionContext)
	clientIdentity := new(MockClientIdentity)

	ctx.On("GetStub").Return(stub)
	ctx.On("GetClientIdentity").Return(clientIdentity)
	patientID := "patient-001"
	requesterID := "doctor-001"
	clientIdentity.On("GetAttributeValue", "userId").Return("patient-001", true, nil)

	auth := Authorization{PatientID: patientID, Authorized: map[string]bool{requesterID: true}}
	authBytes, _ := json.Marshal(auth)
	stub.On("GetState", "auth_"+patientID).Return(authBytes, nil)
	stub.On("PutState", "auth_"+patientID, mock.Anything).Return(nil)

	invokeResponse := peer.Response{
		Status:  200,
		Payload: []byte(""),
	}
	stub.On("InvokeChaincode", "practitioner", mock.AnythingOfType("[][]uint8"), "").Return(invokeResponse, nil)

	msg, err := contract.RevokeAccess(ctx, patientID, requesterID, false)

	assert.Nil(t, err)
	assert.Equal(t, msg, `{"message": "Access revoked"}`)
	stub.AssertExpectations(t)
	clientIdentity.AssertExpectations(t)
}

func TestSearchPatients(t *testing.T) {
	contract := new(PatientContract)
	stub := new(MockStub)
	ctx := new(MockTransactionContext)

	ctx.On("GetStub").Return(stub)

	queryString := `{"selector":{"type":"patient"}}`

	// Mock patients data
	patient1 := &Patient{ID: &Identifier{
		System: "http://example.com/systems/practitioner",
		Value:  "patient-001",
	}}
	patient2 := &Patient{ID: &Identifier{
		System: "http://example.com/systems/practitioner",
		Value:  "patient-002",
	}}

	patient1Bytes, _ := json.Marshal(patient1)
	patient2Bytes, _ := json.Marshal(patient2)

	mockIterator := new(MockIterator)
	mockIterator.AddRecord("patient-001", patient1Bytes)
	mockIterator.AddRecord("patient-002", patient2Bytes)

	stub.On("GetQueryResult", queryString).Return(mockIterator, nil)

	resultJSON, err := contract.SearchPatients(ctx, queryString)

	assert.Nil(t, err)

	var patients []Patient
	err = json.Unmarshal([]byte(resultJSON), &patients)
	assert.Nil(t, err)

	assert.Len(t, patients, 2)
	assert.Equal(t, "patient-001", patients[0].ID.Value)
	assert.Equal(t, "patient-002", patients[1].ID.Value)

	stub.AssertExpectations(t)
	ctx.AssertExpectations(t)
}

func TestGetAccessRequests(t *testing.T) {
	contract := new(PatientContract)
	stub := new(MockStub)
	ctx := new(MockTransactionContext)

	ctx.On("GetStub").Return(stub)
	patientID := "patient-001"

	// Mock authorization data
	auth := Authorization{
		PatientID:      patientID,
		Authorized:     map[string]bool{"doctor-001": true},
		AuthorizedOrgs: map[string]bool{"org1": true},
	}
	authBytes, _ := json.Marshal(auth)

	stub.On("GetState", "auth_"+patientID).Return(authBytes, nil)

	resultJSON, err := contract.GetAccessRequests(ctx, patientID)

	assert.Nil(t, err)

	expected := map[string]interface{}{
		"Authorized":     map[string]interface{}{"doctor-001": true},
		"AuthorizedOrgs": map[string]interface{}{"org1": true},
	}

	var result map[string]interface{}
	err = json.Unmarshal([]byte(resultJSON), &result)
	assert.Nil(t, err)

	assert.Equal(t, expected, result)
	stub.AssertExpectations(t)
	ctx.AssertExpectations(t)
}

func TestDeletePendingRequest(t *testing.T) {
	contract := new(PatientContract)
	stub := new(MockStub)
	ctx := new(MockTransactionContext)
	clientIdentity := new(MockClientIdentity)

	ctx.On("GetStub").Return(stub)
	ctx.On("GetClientIdentity").Return(clientIdentity)

	patientID := "patient-001"
	requesterID := "doctor-001"
	isOrg := false

	clientIdentity.On("GetAttributeValue", "userId").Return(patientID, true, nil)

	// Mock authorization data
	auth := Authorization{
		PatientID:  patientID,
		Authorized: map[string]bool{requesterID: true},
	}
	authBytes, _ := json.Marshal(auth)

	stub.On("GetState", "auth_"+patientID).Return(authBytes, nil)
	stub.On("PutState", "auth_"+patientID, mock.Anything).Return(nil)

	resultJSON, err := contract.DeletePendingRequest(ctx, patientID, requesterID, isOrg)

	assert.Nil(t, err)
	assert.Equal(t, `{"message": "Pending request deleted successfully"}`, resultJSON)

	var updatedAuth Authorization
	err = json.Unmarshal(stub.Calls[1].Arguments.Get(1).([]byte), &updatedAuth)
	assert.Nil(t, err)
	assert.NotContains(t, updatedAuth.Authorized, requesterID)

	stub.AssertExpectations(t)
	ctx.AssertExpectations(t)
	clientIdentity.AssertExpectations(t)
}
