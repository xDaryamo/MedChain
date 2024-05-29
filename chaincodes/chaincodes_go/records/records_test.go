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

func TestCreateMedicalRecords(t *testing.T) {
	stub := new(MockStub)
	ctx := new(MockTransactionContext)
	mc := new(MedicalRecordsChaincode)

	stub.On("GetChannelID").Return("testchannel")
	ctx.On("GetStub").Return(stub)
	clientIdentity := new(MockClientIdentity)
	ctx.On("GetClientIdentity").Return(clientIdentity)

	clientIdentity.On("GetID").Return("testClientID", nil)
	clientIdentity.On("GetAttributeValue", "userId").Return("testUserId", true, nil)

	record := &MedicalRecords{
		RecordID: "record1",
		PatienID: "patient1",
		Allergies: []AllergyIntolerance{
			{
				ID: &Identifier{
					System: "system",
					Value:  "allergy1",
				},
				ClinicalStatus: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "sys",
							Code:    "code",
							Display: "display",
						},
					},
					Text: "allergycode",
				},
				VerificationStatus: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "sys",
							Code:    "code",
							Display: "display",
						},
					},
					Text: "allergyverification",
				},
				Type: "pollen",
				Category: []string{
					"common",
				},
				Criticality: "severe",
			},
		},
		Conditions: []Condition{
			{
				ID: &Identifier{
					System: "http://example.com/systems/patient",
					Value:  "condition1",
				},
			},
		},
		Procedures: []Procedure{
			{
				ID: &Identifier{
					System: "http://example.com/systems/practitioner",
					Value:  "procedure1",
				},
				Subject: &Reference{
					Reference: "practitioners/practitioner1",
					Display:   "practitioner1",
				},
				Code: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "http://example.com/codesystem",
							Code:    "procedure-code",
							Display: "pr-cd",
						},
					},
					Text: "English",
				},
				Status: &Code{
					Coding: []Coding{
						{
							System:  "useSystem",
							Code:    "useCode",
							Display: "executed",
						},
					},
				},
				Category: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "http://example.com/codesystem",
							Code:    "procedure-category",
							Display: "pr-ct",
						},
					},
					Text: "English",
				},
				Performer: &Reference{
					Reference: "practitioners/practitioner1",
					Display:   "practitioner1",
				},
				PartOf: &Reference{
					Reference: "procedures/emergency1",
					Display:   "emergency1",
				},
			},
		},
		Prescriptions: []MedicationRequest{
			{
				ID: &Identifier{
					System: "http://hospital.smarthealth.it/medicationrequests",
					Value:  "medication1",
				},
				Status: &Code{
					Coding: []Coding{
						{
							System:  "http://hl7.org/fhir/medicationrequest-status",
							Code:    "status",
							Display: "status",
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
			},
		},
		ServiceRequest: &Reference{
			Reference: "servicerquest1",
			Display:   "SerReq1",
		},
	}

	recordJSON, _ := json.Marshal(record)

	stub.On("GetState", "record1").Return(nil, nil)
	stub.On("PutState", "record1", recordJSON).Return(nil)

	invokeResponse := peer.Response{
		Status:  200,
		Payload: []byte(""),
	}
	stub.On("InvokeChaincode", "patient", mock.AnythingOfType("[][]uint8"), "testchannel").Return(invokeResponse, nil)

	err := mc.CreateMedicalRecords(ctx, string(recordJSON))
	assert.NoError(t, err)

	stub.AssertExpectations(t)
	ctx.AssertExpectations(t)
}

func TestReadMedicalRecords(t *testing.T) {
	cc := new(MedicalRecordsChaincode)
	ctx := new(MockTransactionContext)
	stub := new(MockStub)

	stub.On("GetChannelID").Return("testchannel")
	ctx.On("GetStub").Return(stub)
	clientIdentity := new(MockClientIdentity)
	ctx.On("GetClientIdentity").Return(clientIdentity)

	clientIdentity.On("GetAttributeValue", "userId").Return("testUserId", true, nil)

	recordID := "record1"
	recordJSON := []byte(`{
		"RecordID": "record1",
		"PatientID": "patient1",
		"Allergies": [
		  {
			"ID": {
			  "System": "system",
			  "Value": "allergy1"
			},
			"ClinicalStatus": {
			  "Coding": [
				{
				  "System": "sys",
				  "Code": "code",
				  "Display": "display"
				}
			  ],
			  "Text": "allergycode"
			},
			"VerificationStatus": {
			  "Coding": [
				{
				  "System": "sys",
				  "Code": "code",
				  "Display": "display"
				}
			  ],
			  "Text": "allergyverification"
			},
			"Type": "pollen",
			"Category": [
			  "common"
			],
			"Criticality": "severe"
		  }
		],
		"Conditions": [
		  {
			"ID": {
			  "System": "http://example.com/systems/patient",
			  "Value": "condition1"
			}
		  }
		],
		"Procedures": [
		  {
			"ID": {
			  "System": "http://example.com/systems/practitioner",
			  "Value": "procedure1"
			},
			"Subject": {
			  "Reference": "practitioners/practitioner1",
			  "Display": "practitioner1"
			},
			"Code": {
			  "Coding": [
				{
				  "System": "http://example.com/codesystem",
				  "Code": "procedure-code",
				  "Display": "pr-cd"
				}
			  ],
			  "Text": "English"
			},
			"Status": {
			  "Coding": [
				{
				  "System": "useSystem",
				  "Code": "useCode",
				  "Display": "executed"
				}
			  ]
			},
			"Category": {
			  "Coding": [
				{
				  "System": "http://example.com/codesystem",
				  "Code": "procedure-category",
				  "Display": "pr-ct"
				}
			  ],
			  "Text": "English"
			},
			"Performer": {
			  "Reference": "practitioners/practitioner1",
			  "Display": "practitioner1"
			},
			"PartOf": {
			  "Reference": "procedures/emergency1",
			  "Display": "emergency1"
			}
		  }
		],
		"Prescriptions": [
		  {
			"ID": {
			  "System": "http://hospital.smarthealth.it/medicationrequests",
			  "Value": "medication1"
			},
			"Status": {
			  "Coding": [
				{
				  "System": "http://hl7.org/fhir/medicationrequest-status",
				  "Code": "status",
				  "Display": "status"
				}
			  ]
			},
			"Intent": {
			  "Coding": [
				{
				  "System": "http://hl7.org/fhir/medication-request-intent",
				  "Code": "order",
				  "Display": "Order"
				}
			  ]
			},
			"MedicationCodeableConcept": {
			  "Coding": [
				{
				  "System": "http://www.nlm.nih.gov/research/umls/rxnorm",
				  "Code": "582620",
				  "Display": "Amoxicillin 250mg/5ml Suspension"
				}
			  ],
			  "Text": "Amoxicillin 250mg/5ml Suspension"
			},
			"Subject": {
			  "Reference": "Patient/example",
			  "Display": "John Doe"
			}
		  }
		],
		"ServiceRequest": {
		  "Reference": "servicerequest1",
		  "Display": "SerReq1"
		}
	  }`)

	stub.On("GetState", recordID).Return(recordJSON, nil)

	invokeResponse := peer.Response{
		Status:  200,
		Payload: nil,
	}
	stub.On("InvokeChaincode", "patient", mock.AnythingOfType("[][]uint8"), "testchannel").Return(invokeResponse, nil)

	resultJSON, err := cc.ReadMedicalRecords(ctx, recordID)
	assert.NoError(t, err)
	assert.Equal(t, string(recordJSON), resultJSON)

	stub.AssertExpectations(t)
	ctx.AssertExpectations(t)
}

func TestUpdateMedicalRecords(t *testing.T) {

	cc := new(MedicalRecordsChaincode)
	ctx := new(MockTransactionContext)
	stub := new(MockStub)

	stub.On("GetChannelID").Return("testchannel")
	ctx.On("GetStub").Return(stub)

	clientIdentity := new(MockClientIdentity)
	ctx.On("GetClientIdentity").Return(clientIdentity)
	clientIdentity.On("GetID").Return("testUserId", nil)

	recordID := "record1"
	updatedrecordJSON := []byte(`{
		"RecordID": "record1",
		"PatientID": "patient1",
		"Allergies": [
		  {
			"ID": {
			  "System": "system",
			  "Value": "allergy1"
			},
			"ClinicalStatus": {
			  "Coding": [
				{
				  "System": "sys",
				  "Code": "code",
				  "Display": "display"
				}
			  ],
			  "Text": "allergycode"
			},
			"VerificationStatus": {
			  "Coding": [
				{
				  "System": "sys",
				  "Code": "code",
				  "Display": "display"
				}
			  ],
			  "Text": "allergyverification"
			},
			"Type": "pollen",
			"Category": [
			  "common"
			],
			"Criticality": "severe"
		  }
		],
		"Conditions": [
		  {
			"ID": {
			  "System": "http://example.com/systems/patient",
			  "Value": "condition1"
			}
		  }
		],
		"Procedures": [
		  {
			"ID": {
			  "System": "http://example.com/systems/practitioner",
			  "Value": "procedure1"
			},
			"Subject": {
			  "Reference": "practitioners/practitioner1",
			  "Display": "practitioner1"
			},
			"Code": {
			  "Coding": [
				{
				  "System": "http://example.com/codesystem",
				  "Code": "procedure-code",
				  "Display": "pr-cd"
				}
			  ],
			  "Text": "English"
			},
			"Status": {
			  "Coding": [
				{
				  "System": "useSystem",
				  "Code": "useCode",
				  "Display": "executed"
				}
			  ]
			},
			"Category": {
			  "Coding": [
				{
				  "System": "http://example.com/codesystem",
				  "Code": "procedure-category",
				  "Display": "pr-ct"
				}
			  ],
			  "Text": "English"
			},
			"Performer": {
			  "Reference": "practitioners/practitioner1",
			  "Display": "practitioner1"
			},
			"PartOf": {
			  "Reference": "procedures/emergency1",
			  "Display": "emergency1"
			}
		  }
		],
		"Prescriptions": [
		  {
			"ID": {
			  "System": "http://hospital.smarthealth.it/medicationrequests",
			  "Value": "medication1"
			},
			"Status": {
			  "Coding": [
				{
				  "System": "http://hl7.org/fhir/medicationrequest-status",
				  "Code": "status",
				  "Display": "status"
				}
			  ]
			},
			"Intent": {
			  "Coding": [
				{
				  "System": "http://hl7.org/fhir/medication-request-intent",
				  "Code": "order",
				  "Display": "Order"
				}
			  ]
			},
			"MedicationCodeableConcept": {
			  "Coding": [
				{
				  "System": "http://www.nlm.nih.gov/research/umls/rxnorm",
				  "Code": "582620",
				  "Display": "Amoxicillin 250mg/5ml Suspension"
				}
			  ],
			  "Text": "Amoxicillin 250mg/5ml Suspension"
			},
			"Subject": {
			  "Reference": "Patient/example",
			  "Display": "John Doe"
			}
		  }
		],
		"ServiceRequest": {
		  "Reference": "servicerequest2",
		  "Display": "SerReq2"
		}
	  }`)

	stub.On("GetState", recordID).Return(updatedrecordJSON, nil)

	invokeResponse := peer.Response{
		Status:  200,
		Payload: nil,
	}
	stub.On("InvokeChaincode", "patient", mock.AnythingOfType("[][]uint8"), "testchannel").Return(invokeResponse, nil)

	stub.On("PutState", recordID, mock.AnythingOfType("[]uint8")).Return(nil)

	err := cc.UpdateMedicalRecords(ctx, recordID, string(updatedrecordJSON))
	assert.NoError(t, err)

	stub.AssertExpectations(t)
	ctx.AssertExpectations(t)
}

func TestDeleteMedicalRecords(t *testing.T) {

	cc := new(MedicalRecordsChaincode)
	ctx := new(MockTransactionContext)
	stub := new(MockStub)

	stub.On("GetChannelID").Return("testchannel")
	ctx.On("GetStub").Return(stub)
	clientIdentity := new(MockClientIdentity)
	ctx.On("GetClientIdentity").Return(clientIdentity)
	clientIdentity.On("GetID").Return("testUserId", nil)

	recordID := "record1"
	recordJSON := []byte(`{
		"RecordID": "record1",
		"PatientID": "patient1",
		"Allergies": [
		  {
			"ID": {
			  "System": "system",
			  "Value": "allergy1"
			},
			"ClinicalStatus": {
			  "Coding": [
				{
				  "System": "sys",
				  "Code": "code",
				  "Display": "display"
				}
			  ],
			  "Text": "allergycode"
			},
			"VerificationStatus": {
			  "Coding": [
				{
				  "System": "sys",
				  "Code": "code",
				  "Display": "display"
				}
			  ],
			  "Text": "allergyverification"
			},
			"Type": "pollen",
			"Category": [
			  "common"
			],
			"Criticality": "severe"
		  }
		],
		"Conditions": [
		  {
			"ID": {
			  "System": "http://example.com/systems/patient",
			  "Value": "condition1"
			}
		  }
		],
		"Procedures": [
		  {
			"ID": {
			  "System": "http://example.com/systems/practitioner",
			  "Value": "procedure1"
			},
			"Subject": {
			  "Reference": "practitioners/practitioner1",
			  "Display": "practitioner1"
			},
			"Code": {
			  "Coding": [
				{
				  "System": "http://example.com/codesystem",
				  "Code": "procedure-code",
				  "Display": "pr-cd"
				}
			  ],
			  "Text": "English"
			},
			"Status": {
			  "Coding": [
				{
				  "System": "useSystem",
				  "Code": "useCode",
				  "Display": "executed"
				}
			  ]
			},
			"Category": {
			  "Coding": [
				{
				  "System": "http://example.com/codesystem",
				  "Code": "procedure-category",
				  "Display": "pr-ct"
				}
			  ],
			  "Text": "English"
			},
			"Performer": {
			  "Reference": "practitioners/practitioner1",
			  "Display": "practitioner1"
			},
			"PartOf": {
			  "Reference": "procedures/emergency1",
			  "Display": "emergency1"
			}
		  }
		],
		"Prescriptions": [
		  {
			"ID": {
			  "System": "http://hospital.smarthealth.it/medicationrequests",
			  "Value": "medication1"
			},
			"Status": {
			  "Coding": [
				{
				  "System": "http://hl7.org/fhir/medicationrequest-status",
				  "Code": "status",
				  "Display": "status"
				}
			  ]
			},
			"Intent": {
			  "Coding": [
				{
				  "System": "http://hl7.org/fhir/medication-request-intent",
				  "Code": "order",
				  "Display": "Order"
				}
			  ]
			},
			"MedicationCodeableConcept": {
			  "Coding": [
				{
				  "System": "http://www.nlm.nih.gov/research/umls/rxnorm",
				  "Code": "582620",
				  "Display": "Amoxicillin 250mg/5ml Suspension"
				}
			  ],
			  "Text": "Amoxicillin 250mg/5ml Suspension"
			},
			"Subject": {
			  "Reference": "Patient/example",
			  "Display": "John Doe"
			}
		  }
		],
		"ServiceRequest": {
		  "Reference": "servicerequest1",
		  "Display": "SerReq1"
		}
	  }`)

	stub.On("GetState", recordID).Return(recordJSON, nil)
	// Mock behavior for InvokeChaincode (assuming it succeeds)
	invokeResponse := peer.Response{
		Status:  200,
		Payload: nil,
	}
	stub.On("InvokeChaincode", "patient", mock.AnythingOfType("[][]uint8"), "testchannel").Return(invokeResponse, nil)

	// Mock behavior for DelState to accept encounterID and succeed
	stub.On("DelState", recordID).Return(nil)

	// Invoke the DeleteEncounter function
	err := cc.DeleteMedicalRecords(ctx, recordID)
	assert.NoError(t, err)

	// Assert that all expected methods were called on the stub and context
	stub.AssertExpectations(t)
	ctx.AssertExpectations(t)
}
func TestSearchMedicalRecords(t *testing.T) {
	stub := new(MockStub)
	ctx := new(MockTransactionContext)
	mc := new(MedicalRecordsChaincode)

	clientIdentity := new(MockClientIdentity)
	ctx.On("GetClientIdentity").Return(clientIdentity)

	clientIdentity.On("GetID").Return("testClientID", nil)

	stub.On("GetChannelID").Return("testchannel")
	ctx.On("GetStub").Return(stub)

	query := "patient1"

	invokeResponse := peer.Response{
		Status:  200,
		Payload: []byte(""),
	}
	stub.On("InvokeChaincode", "patient", mock.AnythingOfType("[][]uint8"), "testchannel").Return(invokeResponse, nil)

	record := &MedicalRecords{
		RecordID: "record1",
		PatienID: "patient1",
		Allergies: []AllergyIntolerance{
			{
				ID: &Identifier{
					System: "system",
					Value:  "allergy1",
				},
				ClinicalStatus: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "sys",
							Code:    "code",
							Display: "display",
						},
					},
					Text: "allergycode",
				},
				VerificationStatus: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "sys",
							Code:    "code",
							Display: "display",
						},
					},
					Text: "allergyverification",
				},
				Type: "pollen",
				Category: []string{
					"common",
				},
				Criticality: "severe",
			},
		},
		Conditions: []Condition{
			{
				ID: &Identifier{
					System: "http://example.com/systems/patient",
					Value:  "condition1",
				},
			},
		},
		Procedures: []Procedure{
			{
				ID: &Identifier{
					System: "http://example.com/systems/practitioner",
					Value:  "procedure1",
				},
				Subject: &Reference{
					Reference: "practitioners/practitioner1",
					Display:   "practitioner1",
				},
				Code: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "http://example.com/codesystem",
							Code:    "procedure-code",
							Display: "pr-cd",
						},
					},
					Text: "English",
				},
				Status: &Code{
					Coding: []Coding{
						{
							System:  "useSystem",
							Code:    "useCode",
							Display: "executed",
						},
					},
				},
				Category: &CodeableConcept{
					Coding: []Coding{
						{
							System:  "http://example.com/codesystem",
							Code:    "procedure-category",
							Display: "pr-ct",
						},
					},
					Text: "English",
				},
				Performer: &Reference{
					Reference: "practitioners/practitioner1",
					Display:   "practitioner1",
				},
				PartOf: &Reference{
					Reference: "procedures/emergency1",
					Display:   "emergency1",
				},
			},
		},
		Prescriptions: []MedicationRequest{
			{
				ID: &Identifier{
					System: "http://hospital.smarthealth.it/medicationrequests",
					Value:  "medication1",
				},
				Status: &Code{
					Coding: []Coding{
						{
							System:  "http://hl7.org/fhir/medicationrequest-status",
							Code:    "status",
							Display: "status",
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
			},
		},
		ServiceRequest: &Reference{
			Reference: "servicerquest1",
			Display:   "SerReq1",
		},
	}
	recordJSON, _ := json.Marshal(record)

	iterator := &MockIterator{
		Records: []KVPair{
			{Key: "record1", Value: recordJSON},
		},
		CurrentIndex: 0,
	}

	stub.On("GetStateByRange", "", "").Return(iterator, nil)

	results, err := mc.SearchMedicalRecords(ctx, query)

	assert.NoError(t, err)
	assert.Len(t, results, 1)
	assert.JSONEq(t, string(recordJSON), results[0])

	stub.AssertExpectations(t)
	ctx.AssertExpectations(t)

}
