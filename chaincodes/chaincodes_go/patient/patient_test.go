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
	patient := Patient{
		ID:        Identifier{Value: id},
		Name:      HumanName{Family: "Smith", Given: []string{"John"}},
		Gender:    Code{Coding: []Coding{{System: "http://hl7.org/fhir/ValueSet/administrative-gender", Code: "male", Display: "Male"}}},
		BirthDate: time.Now(),
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

    
    err := patientContract.CreatePatient(txContext, patientID, patientJSON)


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

    stub.On("GetState", patientID).Return([]byte("existing patient data"), nil)  // Simulate that the patient already exists

    err := patientContract.CreatePatient(txContext, patientID, patientJSON)

    assert.NotNil(t, err)
    assert.Equal(t, "patient already exists: "+patientID, err.Error())

    txContext.AssertExpectations(t)
    stub.AssertExpectations(t)
}

func TestCreatePatient_FailureJSONError(t *testing.T) {
    patientContract := new(PatientContract)

    stub := new(MockStub)
    txContext := new(MockTransactionContext)

    txContext.On("GetStub").Return(stub)
    patientID := "patient-001"
    invalidJSON := "{"  // Malformed JSON

    stub.On("GetState", patientID).Return(nil, nil)  
    err := patientContract.CreatePatient(txContext, patientID, invalidJSON)

    assert.NotNil(t, err)
    assert.Contains(t, err.Error(), "failed to unmarshal patient")

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

    patientID := "patient-001"
    patientJSON := generatePatientJSON(patientID)
    patientBytes := []byte(patientJSON)

    // Assuming GetX509Certificate is called when certain conditions are met
    dummyCert := &x509.Certificate{}  // Prepare a dummy certificate if needed

    // Mocking the conditions are met, if they depend on identity checks
    clientIdentity.On("GetID").Return(patientID, nil)
    // Only set this expectation if your chaincode logic definitely calls it under test conditions
    clientIdentity.On("GetX509Certificate").Maybe().Return(dummyCert, nil)  // Use Maybe() for conditional expectations

    stub.On("GetState", patientID).Return(patientBytes, nil)
    stub.On("PutState", patientID, mock.Anything).Return(nil)

    err := patientContract.UpdatePatient(txContext, patientID, patientJSON)

    assert.Nil(t, err)
    clientIdentity.AssertExpectations(t)
    stub.AssertExpectations(t)
}

func TestUpdatePatient_Unauthorized(t *testing.T) {
    patientContract := new(PatientContract)
    stub := new(MockStub)
    txContext := new(MockTransactionContext)
    clientIdentity := new(MockClientIdentity)

    txContext.On("GetStub").Return(stub)
    txContext.On("GetClientIdentity").Return(clientIdentity)

    patientID := "patient-001"
    unauthorizedID := "unauthorized-client"
    patientJSON := generatePatientJSON(patientID)
    patientBytes := []byte(patientJSON)

    // Mock setup to return patient data
    stub.On("GetState", patientID).Return(patientBytes, nil)

    // Set up mock for authorization data retrieval
    authKey := "auth_" + patientID
    stub.On("GetState", authKey).Return(nil, nil)  // Assuming no authorization data is found

    clientIdentity.On("GetID").Return(unauthorizedID, nil)

    err := patientContract.UpdatePatient(txContext, patientID, patientJSON)

    assert.NotNil(t, err)
    assert.Contains(t, err.Error(), "unauthorized to update patient records")
    stub.AssertExpectations(t)
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
    err := patientContract.DeletePatient(txContext, patientID)

    assert.Nil(t, err)
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

    err := patientContract.DeletePatient(txContext, nonExistentID)

    assert.NotNil(t, err)
    assert.Contains(t, err.Error(), "patient does not exist: "+nonExistentID)
    stub.AssertExpectations(t)
}


func TestReadPatient_SuccessByPatient(t *testing.T) {
    contract := new(PatientContract)
    stub := new(MockStub)
    ctx := new(MockTransactionContext)
    clientIdentity := new(MockClientIdentity)

    ctx.On("GetStub").Return(stub)
    ctx.On("GetClientIdentity").Return(clientIdentity)

    patientID := "patient-001"
    patientData := generatePatientJSON(patientID)
    patientBytes := []byte(patientData)

    stub.On("GetState", patientID).Return(patientBytes, nil)
    clientIdentity.On("GetID").Return(patientID, nil)

    patient, err := contract.ReadPatient(ctx, patientID)

    assert.Nil(t, err)
    assert.NotNil(t, patient)
    assert.Equal(t, "John", patient.Name.Given[0])  // Example of accessing nested fields
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
    clientIdentity.On("GetID").Return(clientID, nil)

    // Set up authorization data to indicate that the doctor is authorized
    authData := Authorization{PatientID: patientID, Authorized: map[string]bool{clientID: true}}
    authBytes, _ := json.Marshal(authData)
    stub.On("GetState", "auth_"+patientID).Return(authBytes, nil)

    // Attempt to read the patient data as an authorized user
    patient, err := contract.ReadPatient(ctx, patientID)

    assert.Nil(t, err)
    assert.NotNil(t, patient)
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

    stub.On("GetState", patientID).Return(patientBytes, nil)
    clientIdentity.On("GetID").Return(unauthorizedClientID, nil)
    stub.On("GetState", "auth_"+patientID).Return(nil, nil) // Nessuna autorizzazione trovata

    patient, err := contract.ReadPatient(ctx, patientID)

    assert.NotNil(t, err)
    assert.Nil(t, patient)
    assert.Equal(t, "unauthorized access: client is neither the patient nor an authorized entity", err.Error())
    stub.AssertExpectations(t)
    clientIdentity.AssertExpectations(t)
}

func TestReadPatient_NonExistentPatient(t *testing.T) {
    contract := new(PatientContract)
    stub := new(MockStub)
    ctx := new(MockTransactionContext)

    ctx.On("GetStub").Return(stub)

    nonExistentPatientID := "patient-999"

    stub.On("GetState", nonExistentPatientID).Return(nil, nil)

    patient, err := contract.ReadPatient(ctx, nonExistentPatientID)

    assert.NotNil(t, err)
    assert.Nil(t, patient)
    assert.Equal(t, "patient does not exist: "+nonExistentPatientID, err.Error())
    stub.AssertExpectations(t)
}

func TestRequestAccess_NewAuthorization(t *testing.T) {
    contract := new(PatientContract)
    stub := new(MockStub)
    ctx := new(MockTransactionContext)

    ctx.On("GetStub").Return(stub)
    patientID := "patient-001"
    requesterID := "doctor-001"

    // Assume no existing authorization record
    stub.On("GetState", "auth_"+patientID).Return(nil, nil)
    stub.On("PutState", "auth_"+patientID, mock.Anything).Return(nil)

    err := contract.RequestAccess(ctx, patientID, requesterID)

    assert.Nil(t, err)
    stub.AssertExpectations(t)
}

func TestRequestAccess_ExistingAuthorization(t *testing.T) {
    contract := new(PatientContract)
    stub := new(MockStub)
    ctx := new(MockTransactionContext)

    ctx.On("GetStub").Return(stub)
    patientID := "patient-001"
    requesterID := "doctor-001"

    existingAuth := Authorization{PatientID: patientID, Authorized: make(map[string]bool)}
    existingAuthBytes, _ := json.Marshal(existingAuth)
    stub.On("GetState", "auth_"+patientID).Return(existingAuthBytes, nil)
    stub.On("PutState", "auth_"+patientID, mock.Anything).Return(nil)

    err := contract.RequestAccess(ctx, patientID, requesterID)

    assert.Nil(t, err)
    stub.AssertExpectations(t)
}

func TestGrantAccess_Success(t *testing.T) {
    contract := new(PatientContract)
    stub := new(MockStub)
    ctx := new(MockTransactionContext)
    clientIdentity := new(MockClientIdentity)

    ctx.On("GetStub").Return(stub)
    ctx.On("GetClientIdentity").Return(clientIdentity)
    patientID := "patient-001"
    requesterID := "doctor-001"

    auth := Authorization{PatientID: patientID, Authorized: map[string]bool{requesterID: false}}
    authBytes, _ := json.Marshal(auth)
    stub.On("GetState", "auth_"+patientID).Return(authBytes, nil)
    stub.On("PutState", "auth_"+patientID, mock.Anything).Return(nil)
    clientIdentity.On("GetID").Return(patientID, nil)

    err := contract.GrantAccess(ctx, patientID, requesterID)

    assert.Nil(t, err)
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

    auth := Authorization{PatientID: patientID, Authorized: map[string]bool{requesterID: true}}
    authBytes, _ := json.Marshal(auth)
    stub.On("GetState", "auth_"+patientID).Return(authBytes, nil)
    stub.On("PutState", "auth_"+patientID, mock.Anything).Return(nil)
    clientIdentity.On("GetID").Return(patientID, nil)

    err := contract.RevokeAccess(ctx, patientID, requesterID)

    assert.Nil(t, err)
    stub.AssertExpectations(t)
    clientIdentity.AssertExpectations(t)
}
