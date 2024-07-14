package main

import (
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"errors"
	"testing"

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

func (m *MockClientIdentity) GetID() (string, error) {
	args := m.Called()
	return args.String(0), args.Error(1)
}

func (m *MockClientIdentity) GetMSPID() (string, error) {
	args := m.Called()
	return args.String(0), args.Error(1)
}

func (m *MockClientIdentity) GetAttributeValue(attrName string) (string, bool, error) {
	args := m.Called(attrName)
	return args.String(0), args.Bool(1), args.Error(2)
}

func (m *MockClientIdentity) AssertAttributeValue(attrName, attrValue string) error {
	args := m.Called(attrName, attrValue)
	return args.Error(0)
}

func (m *MockClientIdentity) GetX509Certificate() (*x509.Certificate, error) {
	args := m.Called()
	certPEM := args.Get(0).([]byte)
	block, _ := pem.Decode(certPEM)
	if block == nil {
		return nil, errors.New("failed to decode PEM block containing the certificate")
	}
	cert, err := x509.ParseCertificate(block.Bytes)
	return cert, err
}

// Tests for CreatePractitioner function
func TestCreatePractitioner(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	//"date": "1990-01-01T00:00:00Z",

	practitioner := Practitioner{
		ID: &Identifier{
			System: "http://example.com/systems/practitioner",
			Value:  "practitioner1",
		},
		Active: true,
		Name:   []HumanName{{Family: "Doe", Given: []string{"John"}}},
		Telecom: &ContactPoint{
			System: &Code{
				Coding: []Coding{
					{
						System:  "exampleSystem",
						Code:    "email",
						Display: "jhnd",
					},
				},
			},
			Value: "123456789",
			Use: &Code{
				Coding: []Coding{
					{
						System:  "useSystem",
						Code:    "useCode",
						Display: "useDisplay",
					},
				},
			},
			Rank: 1,
		},
		Gender: &Code{
			Coding: []Coding{
				{
					System:  "http://hl7.org/fhir/agender",
					Code:    "M",
					Display: "Male",
				},
			},
		},
		Deceased: false,
		Address: &Address{
			Use: &Code{
				Coding: []Coding{
					{
						System:  "useSystem",
						Code:    "useCode",
						Display: "useDisplay",
					},
				},
			},
			Line:       "123 Main St",
			City:       "Anytown",
			State:      "ST",
			PostalCode: "12345",
			Country:    "US",
		},
		Photo: &Attachment{Url: "http://example.com/photo.jpg"},
		Qualification: []Qualification{
			{
				ID: &Identifier{
					System: "http://example.com/qualification",
					Value:  "MD",
				},
				Code: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "http://example.com/codesystem",
							Code:    "MD",
							Display: "Doctor of Medicine",
						},
					},
					Text: "Doctor of Medicine",
				},
				Issuer: &Reference{
					Reference: "Organization/org1",
				},
			},
		},
		Communication: []Communication{
			{
				Language: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "http://example.com/codesystem",
							Code:    "en",
							Display: "English",
						},
					},
					Text: "English",
				},
			},
		},
	}

	practitionerJSON, _ := json.Marshal(practitioner)

	mockCtx.On("GetStub").Return(stub)
	stub.On("GetState", "practitioner1").Return(nil, nil)
	stub.On("PutState", "practitioner1", practitionerJSON).Return(nil)

	msg, err := cc.CreatePractitioner(mockCtx, string(practitionerJSON))
	assert.NoError(t, err)
	assert.Equal(t, msg, `{"message": "Practitioner created successfully"}`)

	stub.AssertExpectations(t)
	mockCtx.AssertExpectations(t)
}

func TestCreatePractitioner_PractitionerExists(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	practitioner := Practitioner{
		ID: &Identifier{
			System: "http://example.com/systems/practitioner",
			Value:  "practitioner1",
		},
		Active: true,
		Name:   []HumanName{{Family: "Doe", Given: []string{"John"}}},
		Telecom: &ContactPoint{
			System: &Code{
				Coding: []Coding{
					{
						System:  "exampleSystem",
						Code:    "email",
						Display: "jhnd",
					},
				},
			},
			Value: "123456789",
			Use: &Code{
				Coding: []Coding{
					{
						System:  "useSystem",
						Code:    "useCode",
						Display: "useDisplay",
					},
				},
			},
			Rank: 1,
		},
		Gender: &Code{
			Coding: []Coding{
				{
					System:  "http://hl7.org/fhir/agender",
					Code:    "M",
					Display: "Male",
				},
			},
		},
		Deceased: false,
		Address: &Address{
			Use: &Code{
				Coding: []Coding{
					{
						System:  "useSystem",
						Code:    "useCode",
						Display: "useDisplay",
					},
				},
			},
			Line:       "123 Main St",
			City:       "Anytown",
			State:      "ST",
			PostalCode: "12345",
			Country:    "US",
		},
		Photo: &Attachment{Url: "http://example.com/photo.jpg"},
		Qualification: []Qualification{
			{
				ID: &Identifier{
					System: "http://example.com/qualification",
					Value:  "MD",
				},
				Code: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "http://example.com/codesystem",
							Code:    "MD",
							Display: "Doctor of Medicine",
						},
					},
					Text: "Doctor of Medicine",
				},
				Issuer: &Reference{
					Reference: "Organization/org1",
				},
			},
		},
		Communication: []Communication{
			{
				Language: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "http://example.com/codesystem",
							Code:    "en",
							Display: "English",
						},
					},
					Text: "English",
				},
			},
		},
	}

	practitionerJSON, _ := json.Marshal(practitioner)
	existingPractitionerJSON, _ := json.Marshal(practitioner)

	mockCtx.On("GetStub").Return(stub)
	stub.On("GetState", "practitioner1").Return(existingPractitionerJSON, nil)

	msg, err := cc.CreatePractitioner(mockCtx, string(practitionerJSON))
	assert.Error(t, err)
	assert.Equal(t, msg, `{"error": "practitioner already exists: `+practitioner.ID.Value+`"}`)

	stub.AssertExpectations(t)
	mockCtx.AssertExpectations(t)
}

func TestCreatePractitioner_InvalidJSON(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	// "Active" field should be a boolean, but here it's a string to simulate an error
	invalidJSON := `{
        "ID": {"System": "http://example.com/systems/practitioner", "Value": "practitioner1"},
        "Active": "true", 
        "Name": [{"Family": "Doe", "Given": ["John"]}],
        "Telecom": {
            "System": {"Coding": [{"System": "exampleSystem", "Code": "email", "Display": "jhnd"}]},
            "Value": "123456789",
            "Use": {"Coding": [{"System": "useSystem", "Code": "useCode", "Display": "useDisplay"}]},
            "Rank": 1
        },
        "Gender": {"Coding": [{"System": "http://hl7.org/fhir/agender", "Code": "M", "Display": "Male"}]},
        "Deceased": false,
        "Address": {
            "Use": {"Coding": [{"System": "useSystem", "Code": "useCode", "Display": "useDisplay"}]},
            "Line": "123 Main St",
            "City": "Anytown",
            "State": "ST",
            "PostalCode": "12345",
            "Country": "US"
        },
        "Photo": {"Url": "http://example.com/photo.jpg"},
        "Qualification": [{
            "ID": {"System": "http://example.com/qualification", "Value": "MD"},
            "Code": {"Coding": [{"System": "http://example.com/codesystem", "Code": "MD", "Display": "Doctor of Medicine"}], "Text": "Doctor of Medicine"},
            "Issuer": {"Reference": "Organization/org1"}
        }],
        "Communication": [{
            "Language": {"Coding": [{"System": "http://example.com/codesystem", "Code": "en", "Display": "English"}], "Text": "English"}
        }]
    }`

	mockCtx.On("GetStub").Return(stub)

	msg, err := cc.CreatePractitioner(mockCtx, invalidJSON)
	assert.Error(t, err)
	assert.Contains(t, msg, "cannot unmarshal string into Go struct field Practitioner.active of type bool")

	// No need to assert expectations on the stub or context as GetStub() is not called due to unmarshaling error
}

func TestReadPractitioner(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	practitionerID := "practitioner1"

	mockCtx.On("GetStub").Return(stub)

	existingPractitioner := Practitioner{
		ID: &Identifier{
			System: "http://example.com/systems/practitioner",
			Value:  practitionerID,
		},
		Active: true,
	}

	existingPractitionerJSON, _ := json.Marshal(existingPractitioner)

	stub.On("GetState", practitionerID).Return(existingPractitionerJSON, nil)

	returnedJSON, err := cc.ReadPractitioner(mockCtx, practitionerID)

	assert.NoError(t, err)
	assert.Equal(t, string(existingPractitionerJSON), returnedJSON)

	mockCtx.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestReadPractitioner_PractitionerNotFound(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	practitionerID := "nonexistent_practitioner"

	mockCtx.On("GetStub").Return(stub)

	stub.On("GetState", practitionerID).Return(nil, nil)

	_, err := cc.ReadPractitioner(mockCtx, practitionerID)

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "practitioner does not exist")

	mockCtx.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestUpdatePractitioner(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	practitionerID := "practitioner1"

	mockCtx.On("GetStub").Return(stub)

	updatedPractitioner := Practitioner{
		ID: &Identifier{
			System: "http://example.com/systems/practitioner",
			Value:  practitionerID,
		},
		Active: false, // Example of an update
	}

	updatedPractitionerJSON, _ := json.Marshal(updatedPractitioner)

	stub.On("GetState", practitionerID).Return([]byte("{}"), nil)

	stub.On("PutState", practitionerID, updatedPractitionerJSON).Return(nil)

	msg, err := cc.UpdatePractitioner(mockCtx, practitionerID, string(updatedPractitionerJSON))

	assert.NoError(t, err)
	assert.Equal(t, msg, `{"message": "Practitioner updated successfully"}`)

	mockCtx.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestUpdatePractitioner_PractitionerNotFound(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	practitionerID := "nonexistent_practitioner"

	mockCtx.On("GetStub").Return(stub)

	stub.On("GetState", practitionerID).Return(nil, nil)

	msg, err := cc.UpdatePractitioner(mockCtx, practitionerID, "{}")

	assert.Error(t, err)
	assert.Equal(t, msg, `{"error": "practitioner does not exist: `+practitionerID+`"}`)

	mockCtx.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestDeletePractitioner(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	practitionerID := "practitioner1"

	mockCtx.On("GetStub").Return(stub)

	stub.On("GetState", practitionerID).Return([]byte("{}"), nil)

	stub.On("DelState", practitionerID).Return(nil)

	msg, err := cc.DeletePractitioner(mockCtx, practitionerID)

	assert.NoError(t, err)
	assert.Equal(t, msg, `{"message": "Practitioner deleted successfully"}`)
	mockCtx.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestDeletePractitioner_PractitionerNotFound(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	practitionerID := "nonexistent_practitioner"

	mockCtx.On("GetStub").Return(stub)

	stub.On("GetState", practitionerID).Return(nil, nil)

	msg, err := cc.DeletePractitioner(mockCtx, practitionerID)

	assert.Error(t, err)
	assert.Equal(t, msg, `{"error": "practitioner does not exist: `+practitionerID+`"}`)
	mockCtx.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestGrantAccess(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	patientID := "patient1"
	practitionerID := "practitioner1"
	followedPatientsKey := "followedPatients_" + practitionerID

	mockCtx.On("GetStub").Return(stub)
	stub.On("GetState", followedPatientsKey).Return(nil, nil)
	stub.On("PutState", followedPatientsKey, mock.Anything).Return(nil)

	msg, err := cc.GrantAccess(mockCtx, patientID, practitionerID)

	assert.NoError(t, err)
	assert.Equal(t, `{"message": "Access granted"}`, msg)
	mockCtx.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestGetFollowedPatients(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	practitionerID := "practitioner1"
	followedPatientsKey := "followedPatients_" + practitionerID

	followedPatients := FollowedPatients{
		Patients: map[string]bool{"patient1": true, "patient2": true},
	}
	followedPatientsJSON, _ := json.Marshal(followedPatients)

	mockCtx.On("GetStub").Return(stub)
	stub.On("GetState", followedPatientsKey).Return(followedPatientsJSON, nil)

	patientIDs, err := cc.GetFollowedPatients(mockCtx, practitionerID)
	expectedPatientIDs := []string{"patient1", "patient2"}

	assert.NoError(t, err)
	assert.ElementsMatch(t, expectedPatientIDs, patientIDs)
	mockCtx.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestRevokeAccess(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	patientID := "patient1"
	practitionerID := "practitioner1"
	followedPatientsKey := "followedPatients_" + practitionerID

	followedPatients := FollowedPatients{
		Patients: map[string]bool{"patient1": true, "patient2": true},
	}
	followedPatientsJSON, _ := json.Marshal(followedPatients)

	mockCtx.On("GetStub").Return(stub)
	stub.On("GetState", followedPatientsKey).Return(followedPatientsJSON, nil)
	stub.On("PutState", followedPatientsKey, mock.Anything).Return(nil)

	msg, err := cc.RevokeAccess(mockCtx, patientID, practitionerID)

	assert.NoError(t, err)
	assert.Equal(t, `{"message": "Access revoked"}`, msg)
	mockCtx.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestSearchPractitioners(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	// Sample practitioners
	practitioner1 := Practitioner{
		ID: &Identifier{
			System: "http://example.com/systems/practitioner",
			Value:  "practitioner1",
		},
		Active: true,
	}
	practitioner2 := Practitioner{
		ID: &Identifier{
			System: "http://example.com/systems/practitioner",
			Value:  "practitioner2",
		},
		Active: false,
	}

	practitioner1JSON, _ := json.Marshal(practitioner1)
	practitioner2JSON, _ := json.Marshal(practitioner2)

	// Create a mock iterator and add sample practitioners
	mockIterator := new(MockIterator)
	mockIterator.AddRecord("practitioner1", practitioner1JSON)
	mockIterator.AddRecord("practitioner2", practitioner2JSON)

	mockStub.On("GetQueryResult", mock.Anything).Return(mockIterator, nil)

	resultsJSON, err := cc.SearchPractitioners(mockCtx, `{
		"selector": {
			"type": "practitioner"
		}
	}`)
	assert.NoError(t, err)

	var practitioners []Practitioner
	err = json.Unmarshal([]byte(resultsJSON), &practitioners)
	assert.NoError(t, err)

	assert.Len(t, practitioners, 2, "There should be two practitioners in the results.")

	mockStub.AssertExpectations(t)
	mockCtx.AssertExpectations(t)
}
