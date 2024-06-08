package main

import (
	"encoding/json"
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

func TestCreateOrganization(t *testing.T) {
	// Create a new instance of the organization chaincode
	cc := new(OrganizationChaincode)

	// Create a new mock transaction context
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	// Mock organization data
	organization := &Organization{
		ID: &Identifier{
			System: "exampleSys",
			Value:  "org1",
		},
		Active: true,
		Type: &CodeableConcept{
			Coding: []Coding{
				{
					System:  "http://example.com/codesystem",
					Code:    "gnrl",
					Display: "general",
				},
			},
		},
		Alias: "gen_org",
		Contact: &ExtendedContactDetail{
			Name: &HumanName{Family: "Doe", Given: []string{"John"}},
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
			Organization: &Reference{
				Reference: "gen_org",
			},
		},
		Description: "",
		PartOf: &Reference{
			Reference: "organizations/main_org",
		},
		EndPoint: &Reference{
			Reference: "gen_org_endpoint",
		},
		Qualification: []Qualification{
			{
				ID: &Identifier{
					System: "http://example.com/qualification",
					Value:  "MC",
				},
				Code: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "http://example.com/codesystem",
							Code:    "MC",
							Display: "Medicine and Care",
						},
					},
					Text: "Medicine and Care",
				},
				Issuer: &Reference{
					Reference: "Organization/org1",
				},
			},
		},
	}

	organizationJSON, _ := json.Marshal(organization)

	mockCtx.On("GetStub").Return(stub)
	stub.On("GetState", "org1").Return(nil, nil)
	stub.On("PutState", "org1", organizationJSON).Return(nil)

	msg, err := cc.CreateOrganization(mockCtx, string(organizationJSON))
	assert.NoError(t, err)
	assert.Equal(t, msg, `{"message": "Organization created successfully"}`)
	stub.AssertExpectations(t)
	mockCtx.AssertExpectations(t)
}

func TestCreateOrganization_OrganizationExists(t *testing.T) {
	// Create a new instance of the organization chaincode
	cc := new(OrganizationChaincode)

	// Create a new mock transaction context
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	// Mock organization data
	organization := &Organization{
		ID: &Identifier{
			System: "exampleSys",
			Value:  "org1",
		},
		Active: true,
		Type: &CodeableConcept{
			Coding: []Coding{
				{
					System:  "http://example.com/codesystem",
					Code:    "gnrl",
					Display: "general",
				},
			},
		},
		Alias: "gen_org",
		Contact: &ExtendedContactDetail{
			Name: &HumanName{Family: "Doe", Given: []string{"John"}},
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
			Organization: &Reference{
				Reference: "gen_org",
			},
		},
		Description: "",
		PartOf: &Reference{
			Reference: "organizations/main_org",
		},
		EndPoint: &Reference{
			Reference: "gen_org_endpoint",
		},
		Qualification: []Qualification{
			{
				ID: &Identifier{
					System: "http://example.com/qualification",
					Value:  "MC",
				},
				Code: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "http://example.com/codesystem",
							Code:    "MC",
							Display: "Medicine and Care",
						},
					},
					Text: "Medicine and Care",
				},
				Issuer: &Reference{
					Reference: "Organization/org1",
				},
			},
		},
	}

	organizationJSON, _ := json.Marshal(organization)

	mockCtx.On("GetStub").Return(stub)
	stub.On("GetState", "org1").Return(organizationJSON, nil)

	msg, err := cc.CreateOrganization(mockCtx, string(organizationJSON))
	assert.Error(t, err)
	assert.Equal(t, msg, "{\"error\": \"organization already exists: org1\"}")

	stub.AssertExpectations(t)
	mockCtx.AssertExpectations(t)
}

func TestCreateOrganization_InvalidJSON(t *testing.T) {
	cc := new(OrganizationChaincode)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	// Intentionally corrupted JSON data
	organizationJSON := `{
		"ID": {
			"System": "exampleSys",
			"Value": "org1"
		},
		"Active": "notABoolean",  
		"Type": {
			"Coding": [
				{
					"System": "http://example.com/codesystem",
					"Code": "gnrl",
					"Display": "general"
				}
			]
		},
		"Alias": "gen_org",
		"Contact": {
			"Name": {
				"Family": "Doe",
				"Given": ["John"]
			},
			"Telecom": {
				"System": {
					"Coding": [
						{
							"System": "exampleSystem",
							"Code": "email",
							"Display": "jhnd"
						}
					]
				},
				"Value": "123456789",
				"Use": {
					"Coding": [
						{
							"System": "useSystem",
							"Code": "useCode",
							"Display": "useDisplay"
						}
					]
				},
				"Rank": 1
			},
			"Address": {
				"Use": {
					"Coding": [
						{
							"System": "useSystem",
							"Code": "useCode",
							"Display": "useDisplay"
						}
					]
				},
				"Line": "123 Main St",
				"City": "Anytown",
				"State": "ST",
				"PostalCode": "12345",
				"Country": "US"
			},
			"Organization": {
				"Reference": "gen_org"
			}
		},
		"Description": "",
		"PartOf": {
			"Reference": "organizations/main_org"
		},
		"EndPoint": {
			"Reference": "gen_org_endpoint"
		},
		"Qualification": [
			{
				"ID": {
					"System": "http://example.com/qualification",
					"Value": "MC"
				},
				"Code": {
					"Coding": [
						{
							"System": "http://example.com/codesystem",
							"Code": "MC",
							"Display": "Medicine and Care"
						}
					],
					"Text": "Medicine and Care"
				},
				"Issuer": {
					"Reference": "Organization/org1"
				}
			}
		]
	}`

	msg, err := cc.CreateOrganization(mockCtx, organizationJSON)
	assert.Error(t, err)
	assert.Equal(t, msg, "{\"error\": \"failed to unmarshal organization: json: cannot unmarshal string into Go struct field Organization.active of type bool\"}")
	stub.AssertExpectations(t)
	mockCtx.AssertExpectations(t)
}

func TestReadOrganization(t *testing.T) {
	cc := new(OrganizationChaincode)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	organizationID := "org1"

	mockCtx.On("GetStub").Return(stub)

	existingOrganization := Organization{
		ID: &Identifier{
			System: "http://example.com/systems/organizations",
			Value:  organizationID,
		},
		Active: true,
	}

	existingOrganizationJSON, _ := json.Marshal(existingOrganization)

	stub.On("GetState", organizationID).Return(existingOrganizationJSON, nil)

	returnedJSON, err := cc.ReadOrganization(mockCtx, organizationID)

	assert.NoError(t, err)
	assert.Equal(t, string(existingOrganizationJSON), returnedJSON)

	mockCtx.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestGetOrganization_OrganizationNotFound(t *testing.T) {
	cc := new(OrganizationChaincode)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	organizationID := "nonexistent_org"

	mockCtx.On("GetStub").Return(stub)

	stub.On("GetState", organizationID).Return(nil, nil)

	_, err := cc.ReadOrganization(mockCtx, organizationID)

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "organization does not exist")

	mockCtx.AssertExpectations(t)
	stub.AssertExpectations(t)
}

func TestSearchOrganizationByName(t *testing.T) {
	cc := new(OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	organizationID2 := &Identifier{System: "exampleSystem", Value: "org2"}
	organization2 := &Organization{ID: organizationID2, Name: "Clinic B", Type: &CodeableConcept{Text: "Clinic"}}

	organizationBytes2, _ := json.Marshal(organization2)

	mockIterator := &MockIterator{
		Records: []KVPair{
			{Key: "org2", Value: organizationBytes2},
		},
		CurrentIndex: 0,
	}

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetQueryResult", mock.Anything).Return(mockIterator, nil)

	resultJSON, err := cc.SearchOrganizations(mockCtx, `{
        "selector": {
            "name": "Clinic B"
        }
    }`)

	assert.NoError(t, err)
	assert.NotNil(t, resultJSON)

	var result []Organization
	err = json.Unmarshal([]byte(resultJSON), &result)
	assert.NoError(t, err)

	assert.Len(t, result, 1)

	mockCtx.AssertExpectations(t)
	mockStub.AssertExpectations(t)
}

func TestUpdateOrganization(t *testing.T) {

	cc := new(OrganizationChaincode)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	organizationID := "org1"
	updatedOrganizationJSON := `{
		"ID": {
			"System": "exampleSys",
			"Value": "org1"
		},
		"Active": true,  
		"Type": {
			"Coding": [
				{
					"System": "http://example.com/codesystem",
					"Code": "gnrl",
					"Display": "general"
				}
			]
		},
		"Alias": "gen_org",
		"Contact": {
			"Name": {
				"Family": "Doe",
				"Given": ["John"]
			},
			"Telecom": {
				"System": {
					"Coding": [
						{
							"System": "exampleSystem",
							"Code": "email",
							"Display": "jhnd"
						}
					]
				},
				"Value": "123456789",
				"Use": {
					"Coding": [
						{
							"System": "useSystem",
							"Code": "useCode",
							"Display": "useDisplay"
						}
					]
				},
				"Rank": 1
			},
			"Address": {
				"Use": {
					"Coding": [
						{
							"System": "useSystem",
							"Code": "useCode",
							"Display": "useDisplay"
						}
					]
				},
				"Line": "123 Main St",
				"City": "Anytown",
				"State": "ST",
				"PostalCode": "12345",
				"Country": "US"
			},
			"Organization": {
				"Reference": "gen_org"
			}
		},
		"Description": "",
		"PartOf": {
			"Reference": "organizations/main_org"
		},
		"EndPoint": {
			"Reference": "gen_org_endpoint"
		},
		"Qualification": [
			{
				"ID": {
					"System": "http://example.com/qualification",
					"Value": "MC"
				},
				"Code": {
					"Coding": [
						{
							"System": "http://example.com/codesystem",
							"Code": "MC",
							"Display": "Medicine and Care"
						}
					],
					"Text": "Medicine and Care"
				},
				"Issuer": {
					"Reference": "Organization/org1"
				}
			}
		]
	}`

	updatedOrganizationJSONBytes, _ := json.Marshal(updatedOrganizationJSON)

	mockCtx.On("GetStub").Return(stub)
	stub.On("GetState", organizationID).Return(updatedOrganizationJSONBytes, nil)
	stub.On("PutState", organizationID, mock.Anything).Return(nil)

	msg, err := cc.UpdateOrganization(mockCtx, organizationID, updatedOrganizationJSON)

	assert.NoError(t, err)
	assert.Equal(t, msg, `{"message": "Organization updated successfully"}`)

	mockCtx.AssertExpectations(t)
	stub.AssertExpectations(t)

}

func TestDeleteOrganization(t *testing.T) {
	cc := new(OrganizationChaincode)
	mockCtx := new(MockTransactionContext)
	stub := new(MockStub)

	organizationID := "org1"
	existingOrganizationJSON := `{
		"ID": {
			"System": "exampleSys",
			"Value": "org1"
		},
		"Active": true,  
		"Type": {
			"Coding": [
				{
					"System": "http://example.com/codesystem",
					"Code": "gnrl",
					"Display": "general"
				}
			]
		},
		"Alias": "gen_org",
		"Contact": {
			"Name": {
				"Family": "Doe",
				"Given": ["John"]
			},
			"Telecom": {
				"System": {
					"Coding": [
						{
							"System": "exampleSystem",
							"Code": "email",
							"Display": "jhnd"
						}
					]
				},
				"Value": "123456789",
				"Use": {
					"Coding": [
						{
							"System": "useSystem",
							"Code": "useCode",
							"Display": "useDisplay"
						}
					]
				},
				"Rank": 1
			},
			"Address": {
				"Use": {
					"Coding": [
						{
							"System": "useSystem",
							"Code": "useCode",
							"Display": "useDisplay"
						}
					]
				},
				"Line": "123 Main St",
				"City": "Anytown",
				"State": "ST",
				"PostalCode": "12345",
				"Country": "US"
			},
			"Organization": {
				"Reference": "gen_org"
			}
		},
		"Description": "",
		"PartOf": {
			"Reference": "organizations/main_org"
		},
		"EndPoint": {
			"Reference": "gen_org_endpoint"
		},
		"Qualification": [
			{
				"ID": {
					"System": "http://example.com/qualification",
					"Value": "MC"
				},
				"Code": {
					"Coding": [
						{
							"System": "http://example.com/codesystem",
							"Code": "MC",
							"Display": "Medicine and Care"
						}
					],
					"Text": "Medicine and Care"
				},
				"Issuer": {
					"Reference": "Organization/org1"
				}
			}
		]
	}`

	mockCtx.On("GetStub").Return(stub)

	stub.On("GetState", organizationID).Return([]byte(existingOrganizationJSON), nil)
	stub.On("DelState", organizationID).Return(nil)

	msg, err := cc.DeleteOrganization(mockCtx, organizationID)

	assert.NoError(t, err)
	assert.Equal(t, msg, `{"message": "Organization deleted successfully"}`)
	mockCtx.AssertExpectations(t)
	stub.AssertExpectations(t)
}
