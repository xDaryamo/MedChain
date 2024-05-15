package main

import (
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

// Tests for CreatePractitioner function
func TestCreatePractitioner(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	practitionerID := "practitioner1"
	practitionerJSON := `{
		"identifier": {
			"system": "http://example.com/identifier",
			"value": "practitioner1"
		},
		"active": true,
		"name": [
			{
				"use": "official",
				"family": "Doe",
				"given": [
					"John"
				]
			}
		],
		"telecom": {
			"system": {
				"coding": [
					{
						"system": "exampleSystem",
						"code": "email",
						"display": "jhnd"
					}
				]
			},
			"value": "123456789",
			"use": {
				"coding": [
					{
						"system": "useSystem",
						"code": "useCode",
						"display": "useDisplay"
					}
				]
			},
			"rank": 1
		},
		"gender": {
			"coding": [
				{
					"system": "http://hl7.org/fhir/administrative-gender",
					"code": "male",
					"display": "Male"
				}
			]
		},
		"date": "1990-01-01T00:00:00Z",
		"deceased": false,
		"address": {
			"use": {
				"coding": [
					{
						"system": "useSystem",
						"code": "useCode",
						"display": "useDisplay"
					}
				]
			},
			"line": "123 Main St",
			"city": "Anytown",
			"state": "ST",
			"postalCode": "12345",
			"country": "US"
		},
		"photo": {
			"url": "http://example.com/photo.jpg"
		},
		"qualification": [
			{
				"identifier": {
					"system": "http://example.com/qualification",
					"value": "MD"
				},
				"code": {
					"coding": [
						{
							"system": "http://example.com/codesystem",
							"code": "MD",
							"display": "Doctor of Medicine"
						}
					],
					"text": "Doctor of Medicine"
				},
				"issuer": {
					"reference": "Organization/org1"
				}
			}
		],
		"communication": [
			{
				"language": {
					"coding": [
						{
							"system": "http://example.com/codesystem",
							"code": "en",
							"display": "English"
						}
					],
					"text": "English"
				}
			}
		]
	}`

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", practitionerID).Return(nil, nil)
	mockStub.On("PutState", practitionerID, mock.Anything).Return(nil)

	err := cc.CreatePractitioner(mockCtx, practitionerJSON)

	assert.NoError(t, err)
	mockStub.AssertExpectations(t)
}

func TestCreatePractitioner_PractitionerExists(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	practitionerID := "practitioner1"
	practitionerJSON := `{
		"identifier": {
			"system": "http://example.com/identifier",
			"value": "practitioner1"
		},
		"active": true,
		"name": [
			{
				"use": "official",
				"family": "Doe",
				"given": [
					"John"
				]
			}
		],
		"telecom": {
			"system": {
				"coding": [
					{
						"system": "exampleSystem",
						"code": "email",
						"display": "jhnd"
					}
				]
			},
			"value": "123456789",
			"use": {
				"coding": [
					{
						"system": "useSystem",
						"code": "useCode",
						"display": "useDisplay"
					}
				]
			},
			"rank": 1
		},
		"gender": {
			"coding": [
				{
					"system": "http://hl7.org/fhir/administrative-gender",
					"code": "male",
					"display": "Male"
				}
			]
		},
		"date": "1990-01-01T00:00:00Z",
		"deceased": false,
		"address": {
			"use": {
				"coding": [
					{
						"system": "useSystem",
						"code": "useCode",
						"display": "useDisplay"
					}
				]
			},
			"line": "123 Main St",
			"city": "Anytown",
			"state": "ST",
			"postalCode": "12345",
			"country": "US"
		},
		"photo": {
			"url": "http://example.com/photo.jpg"
		},
		"qualification": [
			{
				"identifier": {
					"system": "http://example.com/qualification",
					"value": "MD"
				},
				"code": {
					"coding": [
						{
							"system": "http://example.com/codesystem",
							"code": "MD",
							"display": "Doctor of Medicine"
						}
					],
					"text": "Doctor of Medicine"
				},
				"issuer": {
					"reference": "Organization/org1"
				}
			}
		],
		"communication": [
			{
				"language": {
					"coding": [
						{
							"system": "http://example.com/codesystem",
							"code": "en",
							"display": "English"
						}
					],
					"text": "English"
				}
			}
		]
	}`

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	// Mock GetState method to return existing practitioner
	existingPractitionerJSON := []byte(practitionerJSON)
	mockStub.On("GetState", practitionerID).Return(existingPractitionerJSON, nil)

	err := cc.CreatePractitioner(mockCtx, practitionerJSON)
	assert.Error(t, err)
	assert.Equal(t, "practitioner already exists: practitioner1", err.Error())
}

func TestCreatePractitioner_InvalidJSON(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	practitionerID := "practitioner1"
	practitionerJSON := `{...}` // Invalid JSON with syntax error

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", practitionerID).Return(nil, nil)

	err := cc.CreatePractitioner(mockCtx, practitionerJSON)
	assert.Error(t, err)
}

func TestReadPractitioner(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	practitionerID := "practitioner1"
	practitionerJSON := `{
		"identifier": {
			"system": "http://example.com/identifier",
			"value": "practitioner1"
		},
		"active": true,
		"name": [
			{
				"use": "official",
				"family": "Doe",
				"given": [
					"John"
				]
			}
		],
		"telecom": {
			"system": {
				"coding": [
					{
						"system": "exampleSystem",
						"code": "email",
						"display": "jhnd"
					}
				]
			},
			"value": "123456789",
			"use": {
				"coding": [
					{
						"system": "useSystem",
						"code": "useCode",
						"display": "useDisplay"
					}
				]
			},
			"rank": 1
		},
		"gender": {
			"coding": [
				{
					"system": "http://hl7.org/fhir/administrative-gender",
					"code": "male",
					"display": "Male"
				}
			]
		},
		"date": "1990-01-01T00:00:00Z",
		"deceased": false,
		"address": {
			"use": {
				"coding": [
					{
						"system": "useSystem",
						"code": "useCode",
						"display": "useDisplay"
					}
				]
			},
			"line": "123 Main St",
			"city": "Anytown",
			"state": "ST",
			"postalCode": "12345",
			"country": "US"
		},
		"photo": {
			"url": "http://example.com/photo.jpg"
		},
		"qualification": [
			{
				"identifier": {
					"system": "http://example.com/qualification",
					"value": "MD"
				},
				"code": {
					"coding": [
						{
							"system": "http://example.com/codesystem",
							"code": "MD",
							"display": "Doctor of Medicine"
						}
					],
					"text": "Doctor of Medicine"
				},
				"issuer": {
					"reference": "Organization/org1"
				}
			}
		],
		"communication": [
			{
				"language": {
					"coding": [
						{
							"system": "http://example.com/codesystem",
							"code": "en",
							"display": "English"
						}
					],
					"text": "English"
				}
			}
		]
	}`

	practitionerBytes := []byte(practitionerJSON)

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", practitionerID).Return(practitionerBytes, nil)

	result, err := cc.ReadPractitioner(mockCtx, practitionerID)

	assert.NoError(t, err)
	assert.NotNil(t, result)

}

func TestReadPractitioner_PractitionerNotFound(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	practitionerID := "practitioner1"

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", practitionerID).Return(nil, nil)

	result, err := cc.ReadPractitioner(mockCtx, practitionerID)

	assert.Error(t, err)
	assert.Nil(t, result)
}

func TestUpdatePractitioner(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	practitionerID := "practitioner1"
	practitionerJSON := `{
		"identifier": {
			"system": "http://example.com/identifier",
			"value": "practitioner1"
		},
		"active": true,
		"name": [
			{
				"use": "official",
				"family": "Doe",
				"given": [
					"John"
				]
			}
		],
		"telecom": {
			"system": {
				"coding": [
					{
						"system": "exampleSystem",
						"code": "email",
						"display": "jhnd"
					}
				]
			},
			"value": "123456789",
			"use": {
				"coding": [
					{
						"system": "useSystem",
						"code": "useCode",
						"display": "useDisplay"
					}
				]
			},
			"rank": 1
		},
		"gender": {
			"coding": [
				{
					"system": "http://hl7.org/fhir/administrative-gender",
					"code": "male",
					"display": "Male"
				}
			]
		},
		"date": "1990-01-01T00:00:00Z",
		"deceased": false,
		"address": {
			"use": {
				"coding": [
					{
						"system": "useSystem",
						"code": "useCode2",
						"display": "useDisplay"
					}
				]
			},
			"line": "123 Main St",
			"city": "Anytown",
			"state": "ST",
			"postalCode": "12345",
			"country": "US"
		},
		"photo": {
			"url": "http://example.com/photo.jpg"
		},
		"qualification": [
			{
				"identifier": {
					"system": "http://example.com/qualification",
					"value": "MD"
				},
				"code": {
					"coding": [
						{
							"system": "http://example.com/codesystem",
							"code": "MD",
							"display": "Doctor of Medicine"
						}
					],
					"text": "Doctor of Medicine"
				},
				"issuer": {
					"reference": "Organization/org1"
				}
			}
		],
		"communication": [
			{
				"language": {
					"coding": [
						{
							"system": "http://example.com/codesystem",
							"code": "en",
							"display": "English"
						}
					],
					"text": "English"
				}
			}
		]
	}`

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	existingPractitionerJSON := []byte(practitionerJSON)
	mockStub.On("GetState", practitionerID).Return(existingPractitionerJSON, nil)
	mockStub.On("PutState", practitionerID, mock.Anything).Return(nil)

	err := cc.UpdatePractitioner(mockCtx, practitionerID, practitionerJSON)

	assert.NoError(t, err)
	mockStub.AssertExpectations(t)
}

func TestUpdatePractitioner_PractitionerNotFound(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	practitionerID := "practitioner1"
	practitionerJSON := `{
		"identifier": {
			"system": "http://example.com/identifier",
			"value": "practitioner1"
		},
		"active": true,
		"name": [
			{
				"use": "official",
				"family": "Doe",
				"given": [
					"John"
				]
			}
		],
		"telecom": {
			"system": {
				"coding": [
					{
						"system": "exampleSystem",
						"code": "email",
						"display": "jhnd"
					}
				]
			},
			"value": "123456789",
			"use": {
				"coding": [
					{
						"system": "useSystem",
						"code": "useCode",
						"display": "useDisplay"
					}
				]
			},
			"rank": 1
		},
		"gender": {
			"coding": [
				{
					"system": "http://hl7.org/fhir/administrative-gender",
					"code": "male",
					"display": "Male"
				}
			]
		},
		"date": "1990-01-01T00:00:00Z",
		"deceased": false,
		"address": {
			"use": {
				"coding": [
					{
						"system": "useSystem",
						"code": "useCode",
						"display": "useDisplay"
					}
				]
			},
			"line": "123 Main St",
			"city": "Anytown",
			"state": "ST",
			"postalCode": "12345",
			"country": "US"
		},
		"photo": {
			"url": "http://example.com/photo.jpg"
		},
		"qualification": [
			{
				"identifier": {
					"system": "http://example.com/qualification",
					"value": "MD"
				},
				"code": {
					"coding": [
						{
							"system": "http://example.com/codesystem",
							"code": "MD",
							"display": "Doctor of Medicine"
						}
					],
					"text": "Doctor of Medicine"
				},
				"issuer": {
					"reference": "Organization/org1"
				}
			}
		],
		"communication": [
			{
				"language": {
					"coding": [
						{
							"system": "http://example.com/codesystem",
							"code": "en",
							"display": "English"
						}
					],
					"text": "English"
				}
			}
		]
	}`

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", practitionerID).Return(nil, nil)

	err := cc.UpdatePractitioner(mockCtx, practitionerID, practitionerJSON)

	assert.Error(t, err)
}

func TestDeletePractitioner(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	practitionerID := "practitioner1"

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", practitionerID).Return([]byte{}, nil)
	mockStub.On("DelState", practitionerID).Return(nil)

	err := cc.DeletePractitioner(mockCtx, practitionerID)

	assert.NoError(t, err)
	mockStub.AssertExpectations(t)
}

func TestDeletePractitioner_PractitionerNotFound(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	practitionerID := "practitioner1"

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", practitionerID).Return(nil, nil)

	err := cc.DeletePractitioner(mockCtx, practitionerID)

	assert.Error(t, err)
}

func TestCreateProcedure_ProcedureExists(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	procedureID := "procedure1"
	procedureJSON := `{
		"identifier": {
		  "system": "http://example.com/procedureID",
		  "value": "procedure123"
		},
		"subject": {
		  "reference": "Patient/patient123"
		},
		"code": {
		  "coding": [
			{
			  "system": "http://example.com/procedureCodes",
			  "code": "12345",
			  "display": "Procedure X"
			}
		  ],
		  "text": "Procedure X"
		},
		"status": {
			"coding": [
				{
					"system": "useSystem",
					"code": "cmpltd",
					"display": "completed"
				}
			]
		},
		"category": {
		  "coding": [
			{
			  "system": "http://example.com/procedureCategory",
			  "code": "surgical",
			  "display": "Surgical Procedure"
			}
		  ],
		  "text": "Surgical Procedure"
		},
		"performed": {
		  "reference": "Practitioner/practitioner123"
		},
		"partOf": {
		  "reference": "Encounter/encounter123"
		},
		"basedon": {
		  "reference": "ServiceRequest/servicerequest123"
		},
		"reason": {
		  "coding": [
			{
			  "system": "http://example.com/procedureReason",
			  "code": "45678",
			  "display": "Reason for Procedure"
			}
		  ],
		  "text": "Reason for Procedure"
		},
		"encounter": {
		  "reference": "Encounter/encounter123"
		},
		"note": [
		  {
			"authorReference": {
			  "reference": "Practitioner/practitioner123"
			},
			"text": "Additional notes about the procedure"
		  }
		],
		"reportedby": {
		  "reference": "Practitioner/practitioner123"
		}
	}`

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	// Mock GetState method to return existing procedure
	existingProcedureJSON := []byte(procedureJSON)
	mockStub.On("GetState", procedureID).Return(existingProcedureJSON, nil)

	err := cc.CreateProcedure(mockCtx, procedureID, procedureJSON)
	assert.Error(t, err)
	assert.Equal(t, "procedure already exists: procedure1", err.Error())
}

func TestCreateProcedure_InvalidJSON(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	procedureID := "procedure1"
	procedureJSON := `{...}` // Invalid JSON with syntax error

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", procedureID).Return(nil, nil)

	err := cc.CreateProcedure(mockCtx, procedureID, procedureJSON)
	assert.Error(t, err)
}

func TestReadProcedure(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	procedureID := "procedure1"
	procedureJSON := `{
		"identifier": {
			"system": "http://example.com/procedureID",
			"value": "procedure123"
		},
		"subject": {
			"reference": "Patient/patient123"
		},
		"code": {
			"coding": [
			{
				"system": "http://example.com/procedureCodes",
				"code": "12345",
				"display": "Procedure X"
			}
			],
			"text": "Procedure X"
		},
		"status": {
			"coding": [
				{
					"system": "useSystem",
					"code": "cmpltd",
					"display": "completed"
				}
			]
		},
		"category": {
			"coding": [
			{
				"system": "http://example.com/procedureCategory",
				"code": "surgical",
				"display": "Surgical Procedure"
			}
			],
			"text": "Surgical Procedure"
		},
		"performed": {
			"reference": "Practitioner/practitioner123"
		},
		"partOf": {
			"reference": "Encounter/encounter123"
		},
		"basedon": {
			"reference": "ServiceRequest/servicerequest123"
		},
		"reason": {
			"coding": [
			{
				"system": "http://example.com/procedureReason",
				"code": "45678",
				"display": "Reason for Procedure"
			}
			],
			"text": "Reason for Procedure"
		},
		"encounter": {
			"reference": "Encounter/encounter123"
		},
		"note": [
			{
			"authorReference": {
				"reference": "Practitioner/practitioner123"
			},
			"text": "Additional notes about the procedure"
			}
		],
		"reportedby": {
			"reference": "Practitioner/practitioner123"
		}
	}`

	procedureBytes := []byte(procedureJSON)

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", procedureID).Return(procedureBytes, nil)

	result, err := cc.ReadProcedure(mockCtx, procedureID)

	assert.NoError(t, err)
	assert.NotNil(t, result)

	// Additional assertions can be made to compare result with expected values
}

func TestReadProcedure_ProcedureNotFound(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	procedureID := "procedure1"

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", procedureID).Return(nil, nil)

	result, err := cc.ReadProcedure(mockCtx, procedureID)

	assert.Error(t, err)
	assert.Nil(t, result)
}

func TestUpdateProcedure(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	procedureID := "procedure1"
	procedureJSON := `{
		"identifier": {
		  "system": "http://example.com/procedureID",
		  "value": "procedure123"
		},
		"subject": {
		  "reference": "Patient/patient123"
		},
		"code": {
		  "coding": [
			{
			  "system": "http://example.com/procedureCodes",
			  "code": "123456",
			  "display": "Procedure Y"
			}
		  ],
		  "text": "Procedure Y"
		},
		"status": {
			"coding": [
				{
					"system": "useSystem",
					"code": "prgrss",
					"display": "in-progress"
				}
			]
		},
		"category": {
		  "coding": [
			{
			  "system": "http://example.com/procedureCategory",
			  "code": "surgical",
			  "display": "Surgical Procedure"
			}
		  ],
		  "text": "Surgical Procedure"
		},
		"performed": {
		  "reference": "Practitioner/practitioner123"
		},
		"partOf": {
		  "reference": "Encounter/encounter123"
		},
		"basedon": {
		  "reference": "ServiceRequest/servicerequest123"
		},
		"reason": {
		  "coding": [
			{
			  "system": "http://example.com/procedureReason",
			  "code": "45678",
			  "display": "Reason for Procedure"
			}
		  ],
		  "text": "Reason for Procedure"
		},
		"encounter": {
		  "reference": "Encounter/encounter123"
		},
		"note": [
		  {
			"authorReference": {
			  "reference": "Practitioner/practitioner123"
			},
			"text": "Additional notes about the procedure"
		  }
		],
		"reportedby": {
		  "reference": "Practitioner/practitioner123"
		}
	}`

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	existingProcedureJSON := []byte(procedureJSON)
	mockStub.On("GetState", procedureID).Return(existingProcedureJSON, nil)
	mockStub.On("PutState", procedureID, mock.Anything).Return(nil)

	err := cc.UpdateProcedure(mockCtx, procedureID, procedureJSON)

	assert.NoError(t, err)
	mockStub.AssertExpectations(t)
}

func TestUpdateProcedure_ProcedureNotFound(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	procedureID := "procedure1"
	procedureJSON := `{
		"identifier": {
		  "system": "http://example.com/procedureID",
		  "value": "procedure123"
		},
		"subject": {
		  "reference": "Patient/patient123"
		},
		"code": {
		  "coding": [
			{
			  "system": "http://example.com/procedureCodes",
			  "code": "123456",
			  "display": "Procedure Y"
			}
		  ],
		  "text": "Procedure Y"
		},
		"status": {
			"coding": [
				{
					"system": "useSystem",
					"code": "prgrss",
					"display": "in-progress"
				}
			]
		},
		"category": {
		  "coding": [
			{
			  "system": "http://example.com/procedureCategory",
			  "code": "surgical",
			  "display": "Surgical Procedure"
			}
		  ],
		  "text": "Surgical Procedure"
		},
		"performed": {
		  "reference": "Practitioner/practitioner123"
		},
		"partOf": {
		  "reference": "Encounter/encounter123"
		},
		"basedon": {
		  "reference": "ServiceRequest/servicerequest123"
		},
		"reason": {
		  "coding": [
			{
			  "system": "http://example.com/procedureReason",
			  "code": "45678",
			  "display": "Reason for Procedure"
			}
		  ],
		  "text": "Reason for Procedure"
		},
		"encounter": {
		  "reference": "Encounter/encounter123"
		},
		"note": [
		  {
			"authorReference": {
			  "reference": "Practitioner/practitioner123"
			},
			"text": "Additional notes about the procedure"
		  }
		],
		"reportedby": {
		  "reference": "Practitioner/practitioner123"
		}
	}`

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", procedureID).Return(nil, nil)

	err := cc.UpdateProcedure(mockCtx, procedureID, procedureJSON)

	assert.Error(t, err)
}

func TestDeleteProcedure(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	procedureID := "procedure1"

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", procedureID).Return([]byte{}, nil)
	mockStub.On("DelState", procedureID).Return(nil)

	err := cc.DeleteProcedure(mockCtx, procedureID)

	assert.NoError(t, err)
	mockStub.AssertExpectations(t)
}

func TestDeleteProcedure_ProcedureNotFound(t *testing.T) {
	cc := new(PractitionerContract)
	mockCtx := new(MockTransactionContext)

	procedureID := "procedure1"

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", procedureID).Return(nil, nil)

	err := cc.DeleteProcedure(mockCtx, procedureID)

	assert.Error(t, err)
}
