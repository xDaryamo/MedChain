package main

import (
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"errors"
	"fmt"
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

// TestCreateEncounter tests the CreateEncounter function
func TestCreateEncounter(t *testing.T) {
	chaincode := new(EncounterChaincode)
	ctx := new(MockTransactionContext)
	stub := new(MockStub)

	ctx.On("GetStub").Return(stub)

	encounter := Encounter{
		ID: &Identifier{
			System: "http://example.com/systems/encounter",
			Value:  "encounter1",
		},
		Status: &Code{
			Coding: []Coding{
				{
					System:  "http://hl7.org/fhir/ValueSet/encounter-status",
					Code:    "in-progress",
					Display: "In Progress",
				},
			},
		},
		Class: &Coding{
			System:  "http://hl7.org/fhir/ValueSet/v3-ActEncounterCode",
			Code:    "AMB",
			Display: "ambulatory",
		},
		Type: []CodeableConcept{
			{
				Coding: []Coding{
					{
						System:  "http://hl7.org/fhir/ValueSet/encounter-type",
						Code:    "consult",
						Display: "Consultation",
					},
				},
				Text: "Consultation encounter",
			},
		},
		ServiceType: &CodeableConcept{
			Coding: []Coding{
				{
					System:  "http://hl7.org/fhir/ValueSet/service-type",
					Code:    "primary",
					Display: "Primary Care",
				},
			},
			Text: "Primary Care",
		},
		Priority: &CodeableConcept{
			Coding: []Coding{
				{
					System:  "http://terminology.hl7.org/ValueSet/v3-ActPriority",
					Code:    "R",
					Display: "Routine",
				},
			},
			Text: "Routine Priority",
		},
		Subject: &Reference{
			Reference: "Patient/example",
			Display:   "Jane Doe",
		},
		BasedOn: []Reference{
			{
				Reference: "ServiceRequest/example",
				Display:   "Consultation request",
			},
		},
		Participant: []EncounterParticipant{
			{
				Type: []CodeableConcept{
					{
						Coding: []Coding{
							{
								System:  "http://hl7.org/fhir/v3/ParticipationType",
								Code:    "PPRF",
								Display: "Primary performer",
							},
						},
						Text: "Primary Healthcare Provider",
					},
				},

				Individual: &Reference{
					Reference: "Practitioner/example",
					Display:   "Dr. John Smith",
				},
			},
		},
		Appointment: &Reference{
			Reference: "Appointment/example",
			Display:   "Consultation appointment",
		},
		ReasonCode: &CodeableConcept{
			Coding: []Coding{
				{
					System:  "http://snomed.info/sct",
					Code:    "123456789",
					Display: "Chief Complaint",
				},
			},
			Text: "Patient complaint of headache",
		},
		ReasonReference: []Reference{
			{
				Reference: "123456789",
				Display:   "123456789",
			},
		},
		Diagnosis: []EncounterDiagnosis{
			{
				Condition: &Reference{
					Reference: "Condition/example",
					Display:   "Headache",
				},
				Use: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "http://terminology.hl7.org/CodeSystem/diagnosis-role",
							Code:    "AD",
							Display: "Admission diagnosis",
						},
					},
					Text: "Admission Diagnosis",
				},
				Rank: 1,
			},
		},
		Location: []Location{
			{
				ID: &Identifier{
					System: "http://example.com/location",
					Value:  "loc-1",
				},
				Status: &Code{
					Coding: []Coding{
						{
							System:  "http://terminology.hl7.org/CodeSystem/location-status",
							Code:    "active",
							Display: "Active",
						},
					},
				},
				Name:        "Hospital A",
				Description: "Main Hospital Building",
				Type: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
							Code:    "HOSP",
							Display: "Hospital",
						},
					},
					Text: "Hospital",
				},
				ManagingOrganization: &Reference{
					Reference: "Organization/example",
					Display:   "Hospital A Organization",
				},
			},
		},
		ServiceProvider: &Reference{
			Reference: "Organization/hospital-a",
			Display:   "Hospital A",
		},
		PartOf: &Reference{
			Reference: "Encounter/prior-encounter",
			Display:   "Previous Encounter",
		},
	}

	encounterJSON, _ := json.Marshal(encounter)

	stub.On("GetState", "encounter1").Return(nil, nil)
	stub.On("PutState", "encounter1", encounterJSON).Return(nil)

	msg, err := chaincode.CreateEncounter(ctx, string(encounterJSON))
	assert.NoError(t, err)
	assert.Equal(t, msg, `{"message": "Encounter created successfully"}`)

	stub.AssertExpectations(t)
	ctx.AssertExpectations(t)
}

// TestReadEncounter tests the ReadEncounter function
func TestReadEncounter(t *testing.T) {
	chaincode := new(EncounterChaincode)
	ctx := new(MockTransactionContext)
	stub := new(MockStub)

	ctx.On("GetStub").Return(stub)

	// Mock an encounter ID to read
	encounterID := "encounter1"
	encounterJSON := []byte(`{
		"id": {
		  "system": "http://example.com/systems/encounter",
		  "value": "encounter1"
		},
		"status": {
		  "coding": [
			{
			  "system": "http://hl7.org/fhir/ValueSet/encounter-status",
			  "code": "in-progress",
			  "display": "In Progress"
			}
		  ]
		},
		"class": {
		  "system": "http://hl7.org/fhir/ValueSet/v3-ActEncounterCode",
		  "code": "AMB",
		  "display": "ambulatory"
		},
		"type": [
		  {
			"coding": [
			  {
				"system": "http://hl7.org/fhir/ValueSet/encounter-type",
				"code": "consult",
				"display": "Consultation"
			  }
			],
			"text": "Consultation encounter"
		  }
		],
		"serviceType": {
		  "coding": [
			{
			  "system": "http://hl7.org/fhir/ValueSet/service-type",
			  "code": "primary",
			  "display": "Primary Care"
			}
		  ],
		  "text": "Primary Care"
		},
		"priority": {
		  "coding": [
			{
			  "system": "http://terminology.hl7.org/ValueSet/v3-ActPriority",
			  "code": "R",
			  "display": "Routine"
			}
		  ],
		  "text": "Routine Priority"
		},
		"subject": {
		  "reference": "Patient/example",
		  "display": "Jane Doe"
		},
		"basedOn": [
		  {
			"reference": "ServiceRequest/example",
			"display": "Consultation request"
		  }
		],
		"participant": [
		  {
			"type": [
			  {
				"coding": [
				  {
					"system": "http://hl7.org/fhir/v3/ParticipationType",
					"code": "PPRF",
					"display": "Primary performer"
				  }
				],
				"text": "Primary Healthcare Provider"
			  }
			],
			"individual": {
			  "reference": "Practitioner/example",
			  "display": "Dr. John Smith"
			}
		  }
		],
		"appointment": {
		  "reference": "Appointment/example",
		  "display": "Consultation appointment"
		},
		"reasonCode": {
		  "coding": [
			{
			  "system": "http://snomed.info/sct",
			  "code": "123456789",
			  "display": "Chief Complaint"
			}
		  ],
		  "text": "Patient complaint of headache"
		},
		"reasonReference": [
		  {
			{
				Reference: "123456789",
				Display:   "123456789"
		  	}
		],
		"diagnosis": [
		  {
			"condition": {
			  "reference": "Condition/example",
			  "display": "Headache"
			},
			"use": {
			  "coding": [
				{
				  "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
				  "code": "AD",
				  "display": "Admission diagnosis"
				}
			  ],
			  "text": "Admission Diagnosis"
			},
			"rank": 1
		  }
		],
		"location": [
		  {
			"id": {
			  "system": "http://example.com/location",
			  "value": "loc-1"
			},
			"status": {
			  "coding": [
				{
				  "system": "http://terminology.hl7.org/CodeSystem/location-status",
				  "code": "active",
				  "display": "Active"
				}
			  ]
			},
			"name": "Hospital A",
			"description": "Main Hospital Building",
			"type": {
			  "coding": [
				{
				  "system": "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
				  "code": "HOSP",
				  "display": "Hospital"
				}
			  ],
			  "text": "Hospital"
			},
			"managingOrganization": {
			  "reference": "Organization/example",
			  "display": "Hospital A Organization"
			}
		  }
		],
		"serviceProvider": {
		  "reference": "Organization/hospital-a",
		  "display": "Hospital A"
		},
		"partOf": {
		  "reference": "Encounter/prior-encounter",
		  "display": "Previous Encounter"
		}
	  }`)

	// Mock behavior for GetState to return the encounter JSON
	stub.On("GetState", encounterID).Return(encounterJSON, nil)

	// Invoke the ReadEncounter function
	resultJSON, err := chaincode.ReadEncounter(ctx, encounterID)
	assert.NoError(t, err)
	assert.Equal(t, string(encounterJSON), resultJSON)

	stub.AssertExpectations(t)
	ctx.AssertExpectations(t)
}

// TestUpdateEncounter tests the UpdateEncounter function
func TestUpdateEncounter(t *testing.T) {
	// Create new instances of mocks
	chaincode := new(EncounterChaincode)
	ctx := new(MockTransactionContext)
	stub := new(MockStub)

	// Mock behavior for GetStub to return the mock stub instance
	ctx.On("GetStub").Return(stub)

	// Mock an existing encounter ID to update
	encounterID := "encounter1"
	existingEncounterJSON := []byte(`{
		"id": {
		  "system": "http://example.com/systems/encounter",
		  "value": "encounter1"
		},
		"status": {
		  "coding": [
			{
			  "system": "http://hl7.org/fhir/ValueSet/encounter-status",
			  "code": "in-progress",
			  "display": "In Progress"
			}
		  ]
		},
		"class": {
		  "system": "http://hl7.org/fhir/ValueSet/v3-ActEncounterCode",
		  "code": "AMB",
		  "display": "ambulatory"
		},
		"type": [
		  {
			"coding": [
			  {
				"system": "http://hl7.org/fhir/ValueSet/encounter-type",
				"code": "consult",
				"display": "Consultation"
			  }
			],
			"text": "Consultation encounter"
		  }
		],
		"serviceType": {
		  "coding": [
			{
			  "system": "http://hl7.org/fhir/ValueSet/service-type",
			  "code": "primary",
			  "display": "Primary Care"
			}
		  ],
		  "text": "Primary Care"
		},
		"priority": {
		  "coding": [
			{
			  "system": "http://terminology.hl7.org/ValueSet/v3-ActPriority",
			  "code": "R",
			  "display": "Routine"
			}
		  ],
		  "text": "Routine Priority"
		},
		"subject": {
		  "reference": "Patient/example",
		  "display": "Jane Doe"
		},
		"basedOn": [
		  {
			"reference": "ServiceRequest/example",
			"display": "Consultation request"
		  }
		],
		"participant": [
		  {
			"type": [
			  {
				"coding": [
				  {
					"system": "http://hl7.org/fhir/v3/ParticipationType",
					"code": "PPRF",
					"display": "Primary performer"
				  }
				],
				"text": "Primary Healthcare Provider"
			  }
			],
			"individual": {
			  "reference": "Practitioner/example",
			  "display": "Dr. John Smith"
			}
		  }
		],
		"appointment": {
		  "reference": "Appointment/example",
		  "display": "Consultation appointment"
		},
		"reasonCode": {
		  "coding": [
			{
			  "system": "http://snomed.info/sct",
			  "code": "123456789",
			  "display": "Chief Complaint"
			}
		  ],
		  "text": "Patient complaint of headache"
		},
		"reasonReference": [
			{
				"reference": "123456789",
				"display":   "123456789"
		  	}
		],
		"diagnosis": [
		  {
			"condition": {
			  "reference": "Condition/example",
			  "display": "Headache"
			},
			"use": {
			  "coding": [
				{
				  "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
				  "code": "AD",
				  "display": "Admission diagnosis"
				}
			  ],
			  "text": "Admission Diagnosis"
			},
			"rank": 1
		  }
		],
		"location": [
		  {
			"id": {
			  "system": "http://example.com/location",
			  "value": "loc-1"
			},
			"status": {
			  "coding": [
				{
				  "system": "http://terminology.hl7.org/CodeSystem/location-status",
				  "code": "active",
				  "display": "Active"
				}
			  ]
			},
			"name": "Hospital A",
			"description": "Main Hospital Building",
			"type": {
			  "coding": [
				{
				  "system": "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
				  "code": "HOSP",
				  "display": "Hospital"
				}
			  ],
			  "text": "Hospital"
			},
			"managingOrganization": {
			  "reference": "Organization/example",
			  "display": "Hospital A Organization"
			}
		  }
		],
		"serviceProvider": {
		  "reference": "Organization/hospital-a",
		  "display": "Hospital A"
		},
		"partOf": {
		  "reference": "Encounter/prior-encounter",
		  "display": "Previous Encounter"
		}
	  }`)

	// Mock behavior for GetState to return the existing encounter JSON
	stub.On("GetState", encounterID).Return(existingEncounterJSON, nil)

	// Mock behavior for PutState to accept any byte array and succeed
	stub.On("PutState", encounterID, mock.AnythingOfType("[]uint8")).Return(nil)

	// Invoke the UpdateEncounter function with updated JSON
	msg, err := chaincode.UpdateEncounter(ctx, encounterID, string(existingEncounterJSON))
	assert.NoError(t, err)
	assert.Equal(t, msg, `{"message": "Encounter updated successfully"}`)

	// Assert that all expected methods were called on the stub and context

	stub.AssertExpectations(t)
	ctx.AssertExpectations(t)
}

// TestDeleteEncounter tests the DeleteEncounter function
func TestDeleteEncounter(t *testing.T) {
	// Create new instances of mocks
	chaincode := new(EncounterChaincode)
	ctx := new(MockTransactionContext)
	stub := new(MockStub)

	// Mock behavior for GetStub to return the mock stub instance
	ctx.On("GetStub").Return(stub)

	// Mock an existing encounter ID to delete
	encounterID := "encounter1"
	existingEncounterJSON := []byte(`{
		"id": {
		  "system": "http://example.com/systems/encounter",
		  "value": "encounter1"
		},
		"status": {
		  "coding": [
			{
			  "system": "http://hl7.org/fhir/ValueSet/encounter-status",
			  "code": "in-progress",
			  "display": "In Progress"
			}
		  ]
		},
		"class": {
		  "system": "http://hl7.org/fhir/ValueSet/v3-ActEncounterCode",
		  "code": "AMB",
		  "display": "ambulatory"
		},
		"type": [
		  {
			"coding": [
			  {
				"system": "http://hl7.org/fhir/ValueSet/encounter-type",
				"code": "consult",
				"display": "Consultation"
			  }
			],
			"text": "Consultation encounter"
		  }
		],
		"serviceType": {
		  "coding": [
			{
			  "system": "http://hl7.org/fhir/ValueSet/service-type",
			  "code": "primary",
			  "display": "Primary Care"
			}
		  ],
		  "text": "Primary Care"
		},
		"priority": {
		  "coding": [
			{
			  "system": "http://terminology.hl7.org/ValueSet/v3-ActPriority",
			  "code": "R",
			  "display": "Routine"
			}
		  ],
		  "text": "Routine Priority"
		},
		"subject": {
		  "reference": "Patient/example",
		  "display": "Jane Doe"
		},
		"basedOn": [
		  {
			"reference": "ServiceRequest/example",
			"display": "Consultation request"
		  }
		],
		"participant": [
		  {
			"type": [
			  {
				"coding": [
				  {
					"system": "http://hl7.org/fhir/v3/ParticipationType",
					"code": "PPRF",
					"display": "Primary performer"
				  }
				],
				"text": "Primary Healthcare Provider"
			  }
			],
			"individual": {
			  "reference": "Practitioner/example",
			  "display": "Dr. John Smith"
			}
		  }
		],
		"appointment": {
		  "reference": "Appointment/example",
		  "display": "Consultation appointment"
		},
		"reasonCode": {
		  "coding": [
			{
			  "system": "http://snomed.info/sct",
			  "code": "123456789",
			  "display": "Chief Complaint"
			}
		  ],
		  "text": "Patient complaint of headache"
		},
		"reasonReference": [
			{
				"reference": "123456789",
				"display":   "123456789"
		  	}
		],
		"diagnosis": [
		  {
			"condition": {
			  "reference": "Condition/example",
			  "display": "Headache"
			},
			"use": {
			  "coding": [
				{
				  "system": "http://terminology.hl7.org/CodeSystem/diagnosis-role",
				  "code": "AD",
				  "display": "Admission diagnosis"
				}
			  ],
			  "text": "Admission Diagnosis"
			},
			"rank": 1
		  }
		],
		"location": [
		  {
			"id": {
			  "system": "http://example.com/location",
			  "value": "loc-1"
			},
			"status": {
			  "coding": [
				{
				  "system": "http://terminology.hl7.org/CodeSystem/location-status",
				  "code": "active",
				  "display": "Active"
				}
			  ]
			},
			"name": "Hospital A",
			"description": "Main Hospital Building",
			"type": {
			  "coding": [
				{
				  "system": "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
				  "code": "HOSP",
				  "display": "Hospital"
				}
			  ],
			  "text": "Hospital"
			},
			"managingOrganization": {
			  "reference": "Organization/example",
			  "display": "Hospital A Organization"
			}
		  }
		],
		"serviceProvider": {
		  "reference": "Organization/hospital-a",
		  "display": "Hospital A"
		},
		"partOf": {
		  "reference": "Encounter/prior-encounter",
		  "display": "Previous Encounter"
		}
	  }`)

	// Mock behavior for GetState to return the existing encounter JSON
	stub.On("GetState", encounterID).Return(existingEncounterJSON, nil)

	// Mock behavior for DelState to accept encounterID and succeed
	stub.On("DelState", encounterID).Return(nil)

	// Invoke the DeleteEncounter function
	msg, err := chaincode.DeleteEncounter(ctx, encounterID)
	assert.NoError(t, err)
	assert.Equal(t, msg, `{"message": "Encounter deleted successfully"}`)

	// Assert that all expected methods were called on the stub and context
	stub.AssertExpectations(t)
	ctx.AssertExpectations(t)
}

// TestSearchEncountersByType tests the SearchEncountersByType function
func TestSearchEncountersByType(t *testing.T) {
	chaincode := new(EncounterChaincode)
	ctx := new(MockTransactionContext)
	stub := new(MockStub)

	ctx.On("GetStub").Return(stub)

	typeCode := "consult"

	queryString := fmt.Sprintf(`{"selector":{"type":{"coding":{"code":"%s"}}}}`, typeCode)

	mockEncounters := []Encounter{
		{
			ID: &Identifier{
				System: "http://example.com/systems/encounter",
				Value:  "encounter1",
			},
			Status: &Code{
				Coding: []Coding{
					{
						System:  "http://hl7.org/fhir/ValueSet/encounter-status",
						Code:    "in-progress",
						Display: "In Progress",
					},
				},
			},
			Class: &Coding{
				System:  "http://hl7.org/fhir/ValueSet/v3-ActEncounterCode",
				Code:    "AMB",
				Display: "ambulatory",
			},
			Type: []CodeableConcept{
				{
					Coding: []Coding{
						{
							System:  "http://hl7.org/fhir/ValueSet/encounter-type",
							Code:    "consult",
							Display: "Consultation",
						},
					},
					Text: "Consultation encounter",
				},
			},
			ServiceType: &CodeableConcept{
				Coding: []Coding{
					{
						System:  "http://hl7.org/fhir/ValueSet/service-type",
						Code:    "primary",
						Display: "Primary Care",
					},
				},
				Text: "Primary Care",
			},
			Priority: &CodeableConcept{
				Coding: []Coding{
					{
						System:  "http://terminology.hl7.org/ValueSet/v3-ActPriority",
						Code:    "R",
						Display: "Routine",
					},
				},
				Text: "Routine Priority",
			},
			Subject: &Reference{
				Reference: "Patient/example",
				Display:   "Jane Doe",
			},
			BasedOn: []Reference{
				{
					Reference: "ServiceRequest/example",
					Display:   "Consultation request",
				},
			},
			Participant: []EncounterParticipant{
				{
					Type: []CodeableConcept{
						{
							Coding: []Coding{
								{
									System:  "http://hl7.org/fhir/v3/ParticipationType",
									Code:    "PPRF",
									Display: "Primary performer",
								},
							},
							Text: "Primary Healthcare Provider",
						},
					},

					Individual: &Reference{
						Reference: "Practitioner/example",
						Display:   "Dr. John Smith",
					},
				},
			},
			Appointment: &Reference{
				Reference: "Appointment/example",
				Display:   "Consultation appointment",
			},
			ReasonCode: &CodeableConcept{
				Coding: []Coding{
					{
						System:  "http://snomed.info/sct",
						Code:    "123456789",
						Display: "Chief Complaint",
					},
				},
				Text: "Patient complaint of headache",
			},
			ReasonReference: []Reference{
				{
					Reference: "123456789",
					Display:   "123456789",
				},
			},
			Diagnosis: []EncounterDiagnosis{
				{
					Condition: &Reference{
						Reference: "Condition/example",
						Display:   "Headache",
					},
					Use: &CodeableConcept{
						Coding: []Coding{
							{
								System:  "http://terminology.hl7.org/CodeSystem/diagnosis-role",
								Code:    "AD",
								Display: "Admission diagnosis",
							},
						},
						Text: "Admission Diagnosis",
					},
					Rank: 1,
				},
			},
			Location: []Location{
				{
					ID: &Identifier{
						System: "http://example.com/location",
						Value:  "loc-1",
					},
					Status: &Code{
						Coding: []Coding{
							{
								System:  "http://terminology.hl7.org/CodeSystem/location-status",
								Code:    "active",
								Display: "Active",
							},
						},
					},
					Name:        "Hospital A",
					Description: "Main Hospital Building",
					Type: &CodeableConcept{
						Coding: []Coding{
							{
								System:  "http://terminology.hl7.org/CodeSystem/v3-RoleCode",
								Code:    "HOSP",
								Display: "Hospital",
							},
						},
						Text: "Hospital",
					},
					ManagingOrganization: &Reference{
						Reference: "Organization/example",
						Display:   "Hospital A Organization",
					},
				},
			},
			ServiceProvider: &Reference{
				Reference: "Organization/hospital-a",
				Display:   "Hospital A",
			},
			PartOf: &Reference{
				Reference: "Encounter/prior-encounter",
				Display:   "Previous Encounter",
			},
		},
	}

	mockEncountersJSON, err := json.Marshal(mockEncounters)
	assert.NoError(t, err)

	mockIterator := new(MockIterator)
	for _, encounter := range mockEncounters {
		encounterJSON, err := json.Marshal(encounter)
		assert.NoError(t, err)
		mockIterator.AddRecord(encounter.ID.Value, encounterJSON)
	}

	stub.On("GetQueryResult", queryString).Return(mockIterator, nil)

	resultJSON, err := chaincode.SearchEncounters(ctx, queryString)
	assert.NoError(t, err)
	assert.Equal(t, string(mockEncountersJSON), resultJSON)

	stub.AssertExpectations(t)
	ctx.AssertExpectations(t)
}
