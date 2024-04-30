package test

import (
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
	"github.com/stretchr/testify/require"
	organization "github.com/xDaryamo/MedChain"
	"github.com/xDaryamo/MedChain/fhir"
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

func TestCreateOrganization(t *testing.T) {
	// Create a new instance of the organization chaincode
	cc := new(organization.OrganizationChaincode)

	// Create a new mock transaction context
	mockCtx := new(MockTransactionContext)

	// Mock organization data
	organizationID := "org1"
	organizationJSON := `{
		"ID": {
			"System": "http://example.com/identifier",
			"Value": "org1"
		},
		"name": "Hospital A",
		"type": {
			"coding": [
				{
					"system": "http://example.com/codesystem",
					"code": "Hospital",
					"display": "Hospital"
				}
			],
			"text": "Hospital"
		}
	}`

	// Mock the GetStub method to return a new MockStub
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	// Mock GetState to return nil when called during the test
	mockStub.On("GetState", mock.Anything).Return(nil, nil)

	// Mock PutState method to return nil (indicating success)
	mockStub.On("PutState", mock.Anything, mock.Anything).Return(nil)

	// Call the CreateOrganization function with the mocked context and organization data
	err := cc.CreateOrganization(mockCtx, organizationID, organizationJSON)
	assert.NoError(t, err) // Expect an error since organization already exists
}

func TestCreateOrganization_OrganizationExists(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization data
	organizationID := "org1"
	organizationJSON := `{
		"ID": {
			"System": "http://example.com/identifier",
			"Value": "org1"
		},
		"name": "Hospital A",
		"type": {
			"coding": [
				{
					"system": "http://example.com/codesystem",
					"code": "Hospital",
					"display": "Hospital"
				}
			],
			"text": "Hospital"
		}
	}`

	// Mock the GetStub method to return a new MockStub
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)

	// Mock GetState to return existing organization
	existingOrganizationJSON := []byte(organizationJSON)
	mockStub.On("GetState", organizationID).Return(existingOrganizationJSON, nil)

	err := cc.CreateOrganization(mockCtx, organizationID, organizationJSON)
	assert.Error(t, err)
	assert.Equal(t, "organization already exists", err.Error())
}

func TestCreateOrganization_InvalidJSON(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization data with invalid JSON
	organizationID := "org1"
	organizationJSON := `{
		"ID": {
			"System": "http://example.com/identifier",
			"Value": "org1"
		},
		"name": "Hospital A",
		"type": {
			"coding": [
				{
					"system": "http://example.com/codesystem",
					"code": "Hospital",
					"display": "Hospital"
				}
			],
			"text": "Hospital"
		}
	,}` // Invalid JSON with trailing comma

	// Mock GetState method to return nil, indicating organization does not exist
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", organizationID).Return(nil, nil)

	err := cc.CreateOrganization(mockCtx, organizationID, organizationJSON)
	assert.Error(t, err)
}

func TestGetOrganization(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization data
	organizationID := "org1"
	organizationJSON := `{
		"ID": {
			"System": "http://example.com/identifier",
			"Value": "org1"
		},
		"name": "Hospital A",
		"type": {
			"coding": [
				{
					"system": "http://example.com/codesystem",
					"code": "Hospital",
					"display": "Hospital"
				}
			],
			"text": "Hospital"
		}
	}`
	organizationBytes := []byte(organizationJSON)

	// Mock GetState method to return organization data
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", organizationID).Return(organizationBytes, nil)

	// Call GetOrganization
	result, err := cc.GetOrganization(mockCtx, organizationID)

	assert.NoError(t, err)
	assert.NotNil(t, result)

	var expectedOrganization fhir.Organization
	err = json.Unmarshal(organizationBytes, &expectedOrganization)
	assert.NoError(t, err)

	assert.Equal(t, &expectedOrganization, result)
}

func TestGetOrganization_OrganizationNotFound(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization ID
	organizationID := "org1"

	// Mock GetState method to return nil, indicating organization not found
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", organizationID).Return(nil, nil)

	// Call GetOrganization
	result, err := cc.GetOrganization(mockCtx, organizationID)

	assert.NoError(t, err)
	assert.Nil(t, result)
}

func TestSearchOrganizationsByType(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization data
	organizationID := fhir.Identifier{System: "exampleSystem", Value: "org1"}
	organization1 := &fhir.Organization{ID: organizationID, Name: "Hospital A", Type: fhir.CodeableConcept{Text: "Hospital"}}

	organizationID2 := fhir.Identifier{System: "exampleSystem", Value: "org2"}
	organization2 := fhir.Organization{ID: organizationID2, Name: "Clinic B", Type: fhir.CodeableConcept{Text: "Clinic"}}

	organizationBytes1, _ := json.Marshal(&organization1)
	organizationBytes2, _ := json.Marshal(&organization2)

	// Mock GetStateByRange method to return organization data
	mockIterator := &MockIterator{}
	mockIterator.AddRecord("org1", organizationBytes1)
	mockIterator.AddRecord("org2", organizationBytes2)
	mockIterator.CurrentIndex = 0

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetStateByRange", "", "").Return(mockIterator, nil)

	// Call SearchOrganizationsByType
	results, err := cc.SearchOrganizationsByType(mockCtx, "Hospital")

	assert.NoError(t, err)
	assert.Len(t, results, 1)

	assert.Equal(t, *organization1, *results[0])
}

func TestSearchOrganizationByName(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization data

	organizationID := fhir.Identifier{System: "exampleSystem", Value: "org1"}
	organization1 := &fhir.Organization{ID: organizationID, Name: "Hospital A", Type: fhir.CodeableConcept{Text: "Hospital"}}

	organizationID2 := fhir.Identifier{System: "exampleSystem", Value: "org2"}
	organization2 := fhir.Organization{ID: organizationID2, Name: "Clinic B", Type: fhir.CodeableConcept{Text: "Clinic"}}

	organizationBytes1, _ := json.Marshal(&organization1)
	organizationBytes2, _ := json.Marshal(&organization2)

	// Mock GetStateByRange method to return organization data
	mockIterator := &MockIterator{}
	mockIterator.AddRecord("org1", organizationBytes1)
	mockIterator.AddRecord("org2", organizationBytes2)
	mockIterator.CurrentIndex = 0

	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetStateByRange", "", "").Return(mockIterator, nil)

	// Call SearchOrganizationByName
	result, err := cc.SearchOrganizationByName(mockCtx, "Hospital A")

	assert.NoError(t, err)
	assert.NotNil(t, result)

	assert.Equal(t, *organization1, *result)
}

func TestSearchOrganizationByName_OrganizationNotFound(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization name
	organizationName := "Hospital A"

	// Mock GetStateByRange method to return nil, indicating no organizations found
	mockIterator := new(MockIterator)
	mockIterator.Records = []KVPair{}
	mockStub := new(MockStub)
	mockStub.On("GetStateByRange", "", "").Return(mockIterator, nil)
	mockCtx.On("GetStub").Return(mockStub)

	// Call SearchOrganizationByName
	result, err := cc.SearchOrganizationByName(mockCtx, organizationName)

	assert.NoError(t, err)
	assert.Nil(t, result)
}

func TestAddEndpoint(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization data
	organizationID := fhir.Identifier{System: "exampleSystem", Value: "org1"}
	organization := &fhir.Organization{ID: organizationID, Name: "Hospital A"}
	endpoint := fhir.Reference{Reference: "http://hospital-a.com/api"}

	// Mock GetOrganization method to return existing organization
	organizationBytes, _ := json.Marshal(organization)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", organizationID.Value).Return(organizationBytes, nil)

	// Mock PutState method to return success
	updatedOrganization := *organization
	updatedOrganization.EndPoint = &endpoint
	updatedOrganizationBytes, _ := json.Marshal(&updatedOrganization)
	mockStub.On("PutState", organizationID.Value, updatedOrganizationBytes).Return(nil)

	err := cc.AddEndpoint(mockCtx, organizationID.Value, endpoint)
	assert.NoError(t, err)
}

func TestAddEndpoint_OrganizationNotFound(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization ID
	organizationID := "org1"
	endpoint := fhir.Reference{Reference: "http://hospital-a.com/api"}

	// Mock GetOrganization method to return nil, indicating organization not found
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", organizationID).Return(nil, nil)

	err := cc.AddEndpoint(mockCtx, organizationID, endpoint)
	assert.Error(t, err)
	assert.Equal(t, "organization not found", err.Error())
}

func TestRemoveEndpoint(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization data
	organizationID := fhir.Identifier{System: "exampleSystem", Value: "org1"}
	organization := &fhir.Organization{ID: organizationID, Name: "Hospital A", Type: fhir.CodeableConcept{Text: "Hospital"},
		EndPoint: &fhir.Reference{Reference: "http://hospital-a.com/api"}}

	// Mock GetOrganization method to return existing organization
	organizationBytes, _ := json.Marshal(organization)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", organizationID.Value).Return(organizationBytes, nil)

	// Mock PutState method to return success
	updatedOrganization := *organization
	updatedOrganization.EndPoint = nil
	updatedOrganizationBytes, _ := json.Marshal(&updatedOrganization)
	mockStub.On("PutState", organizationID.Value, updatedOrganizationBytes).Return(nil)

	err := cc.RemoveEndpoint(mockCtx, organizationID.Value)
	assert.NoError(t, err)
}

func TestRemoveEndpoint_OrganizationNotFound(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization ID
	organizationID := fhir.Identifier{System: "exampleSystem", Value: "org1"}

	// Mock GetOrganization method to return nil, indicating organization not found
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", organizationID.Value).Return(nil, nil)

	err := cc.RemoveEndpoint(mockCtx, organizationID.Value)
	assert.Error(t, err)
	assert.Equal(t, "organization not found", err.Error())
}

func TestGetParentOrganization(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization data
	organizationID := fhir.Identifier{System: "exampleSystem", Value: "org1"}
	parentOrganization := fhir.Reference{Reference: "http://parent-organization.com/api"}

	// Mock GetOrganization method to return existing organization
	organization := &fhir.Organization{
		ID:     fhir.Identifier{System: "exampleSystem", Value: organizationID.Value},
		Name:   "Hospital A",
		PartOf: &parentOrganization,
	}
	organizationBytes, _ := json.Marshal(organization)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", organizationID.Value).Return(organizationBytes, nil)

	// Call GetParentOrganization
	result, err := cc.GetParentOrganization(mockCtx, organizationID.Value)
	assert.NoError(t, err)
	assert.Equal(t, &parentOrganization, result)
}

func TestUpdateParentOrganization(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization data
	organizationID := fhir.Identifier{System: "exampleSystem", Value: "org1"}
	parentOrganization := fhir.Reference{Reference: "http://parent-organization.com/api"}

	// Mock GetOrganization method to return existing organization
	organization := &fhir.Organization{
		ID:     fhir.Identifier{System: "exampleSystem", Value: organizationID.Value},
		Name:   "Hospital A",
		PartOf: &parentOrganization,
	}
	organizationBytes, _ := json.Marshal(organization)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", organizationID.Value).Return(organizationBytes, nil)

	// Mock PutState method to return success
	updatedOrganization := *organization
	updatedOrganization.PartOf = &parentOrganization
	updatedOrganizationBytes, _ := json.Marshal(&updatedOrganization)
	mockStub.On("PutState", organizationID.Value, updatedOrganizationBytes).Return(nil)

	// Call UpdateParentOrganization
	err := cc.UpdateParentOrganization(mockCtx, organizationID.Value, parentOrganization)
	assert.NoError(t, err)
}

func TestAddQualification(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization data
	organizationID := fhir.Identifier{System: "exampleSystem", Value: "org1"}
	organization := &fhir.Organization{ID: organizationID, Name: "Hospital A"}
	qualification := fhir.Qualification{
		ID:     fhir.Identifier{System: "exampleSystem", Value: "qualification1"},
		Code:   fhir.CodeableConcept{Text: "Qualification Code", Coding: []fhir.Coding{{System: "exampleSystem", Code: "code1", Display: "Display 1"}}},
		Status: fhir.CodeableConcept{Text: "Active", Coding: []fhir.Coding{{System: "exampleSystem", Code: "active", Display: "Active"}}},
		Issuer: &fhir.Reference{Reference: "http://issuer.com"},
	}

	// Mock GetOrganization method to return existing organization
	organizationBytes, _ := json.Marshal(organization)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", organizationID.Value).Return(organizationBytes, nil)

	// Mock PutState method to return success
	updatedOrganization := *organization
	updatedOrganization.Qualification = append(updatedOrganization.Qualification, qualification)
	updatedOrganizationBytes, _ := json.Marshal(&updatedOrganization)
	mockStub.On("PutState", organizationID.Value, updatedOrganizationBytes).Return(nil)

	err := cc.AddQualification(mockCtx, organizationID.Value, qualification)
	assert.NoError(t, err)
}

func TestRemoveQualification(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization data
	organizationID := fhir.Identifier{System: "exampleSystem", Value: "org1"}
	qualificationID := fhir.Identifier{System: "exampleSystem", Value: "qual1"}
	qualification := fhir.Qualification{
		ID:     qualificationID,
		Code:   fhir.CodeableConcept{Text: "Qualification Code"},
		Status: fhir.CodeableConcept{Text: "Active"},
		Issuer: &fhir.Reference{Reference: "http://issuer.com"},
	}
	organization := &fhir.Organization{
		ID:            organizationID,
		Name:          "Hospital A",
		Qualification: []fhir.Qualification{qualification},
	}

	// Mock GetOrganization method to return existing organization
	organizationBytes, _ := json.Marshal(organization)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", organizationID.Value).Return(organizationBytes, nil)

	// Mock PutState method to return success
	mockStub.On("PutState", organizationID.Value, mock.Anything).Return(nil).Run(func(args mock.Arguments) {
		arg := args.Get(1).([]byte)
		var updatedOrganization fhir.Organization
		err := json.Unmarshal(arg, &updatedOrganization)
		require.NoError(t, err)
		assert.Len(t, updatedOrganization.Qualification, 0) // Qualification should be removed
	})

	err := cc.RemoveQualification(mockCtx, organizationID.Value, 0)
	assert.NoError(t, err)
}

func TestUpdateQualification(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization data
	organizationID := fhir.Identifier{System: "exampleSystem", Value: "org1"}
	qualificationID := fhir.Identifier{System: "exampleSystem", Value: "qual1"}
	qualification := fhir.Qualification{
		ID:     qualificationID,
		Code:   fhir.CodeableConcept{Text: "Qualification Code"},
		Status: fhir.CodeableConcept{Text: "Active"},
		Issuer: &fhir.Reference{Reference: "http://issuer.com"},
	}
	organization := &fhir.Organization{
		ID:            organizationID,
		Name:          "Hospital A",
		Qualification: []fhir.Qualification{qualification},
	}
	qualificationIndex := 0
	updatedQualification := fhir.Qualification{
		ID:     fhir.Identifier{System: "exampleSystem", Value: "updatedQualification"},
		Code:   fhir.CodeableConcept{Text: "Updated Qualification Code", Coding: []fhir.Coding{{System: "exampleSystem", Code: "updatedCode", Display: "Updated Display"}}},
		Status: fhir.CodeableConcept{Text: "Inactive", Coding: []fhir.Coding{{System: "exampleSystem", Code: "inactive", Display: "Inactive"}}},
		Issuer: &fhir.Reference{Reference: "http://updatedIssuer.com"},
	}

	// Mock GetOrganization method to return existing organization
	organizationBytes, _ := json.Marshal(organization)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", organizationID.Value).Return(organizationBytes, nil)

	// Mock PutState method to return success
	mockStub.On("PutState", organizationID.Value, mock.Anything).Return(nil).Run(func(args mock.Arguments) {
		arg := args.Get(1).([]byte)
		var updatedOrganization fhir.Organization
		err := json.Unmarshal(arg, &updatedOrganization)
		require.NoError(t, err)
		assert.Equal(t, updatedQualification, updatedOrganization.Qualification[qualificationIndex]) // Updated qualification should match
	})

	err := cc.UpdateQualification(mockCtx, organizationID.Value, updatedQualification, qualificationIndex)
	assert.NoError(t, err)
}

func TestUpdateContact(t *testing.T) {
	cc := new(organization.OrganizationChaincode)
	mockCtx := new(MockTransactionContext)

	// Mock organization data
	organizationID := "org1"
	organization := &fhir.Organization{
		ID:   fhir.Identifier{System: "exampleSystem", Value: organizationID},
		Name: "Hospital A",
		Contact: fhir.ExtendedContactDetail{
			Name: fhir.HumanName{
				Text: "John Doe",
			},
			Telecom: fhir.ContactPoint{
				System: fhir.Code{Coding: []fhir.Coding{{System: "exampleSystem", Code: "email", Display: "jhnd"}}},
				Value:  "123456789",
				Use:    fhir.Code{Coding: []fhir.Coding{{System: "useSystem", Code: "useCode", Display: "useDisplay"}}},
				Rank:   1,
			},
			Address: fhir.Address{
				City:    "New York",
				Country: "USA",
			},
			Organization: &fhir.Reference{
				Reference: "http://example.com/organization",
			},
			Period: fhir.Period{
				Start: time.Now(),
				End:   time.Now().AddDate(1, 0, 0),
			},
		},
	}
	updatedTelecom := fhir.ContactPoint{
		System: fhir.Code{Coding: []fhir.Coding{{System: "exampleSystem", Code: "email", Display: "johndoe"}}},
		Value:  "jane@example.com",
		Use:    fhir.Code{Coding: []fhir.Coding{{System: "newUseSystem", Code: "newUseCode", Display: "newUseDisplay"}}},
		Rank:   2, // Set the Rank field to the expected value
	}
	updatedContact := fhir.ExtendedContactDetail{
		Name:         organization.Contact.Name,
		Telecom:      updatedTelecom,
		Address:      organization.Contact.Address,
		Organization: organization.Contact.Organization,
		Period:       organization.Contact.Period,
	}

	// Mock GetOrganization method to return existing organization
	organizationBytes, _ := json.Marshal(organization)
	mockStub := new(MockStub)
	mockCtx.On("GetStub").Return(mockStub)
	mockStub.On("GetState", organizationID).Return(organizationBytes, nil)

	// Mock PutState method to return success
	mockStub.On("PutState", organizationID, mock.Anything).Return(nil).Run(func(args mock.Arguments) {
		arg := args.Get(1).([]byte)
		var updatedOrganization fhir.Organization
		err := json.Unmarshal(arg, &updatedOrganization)
		require.NoError(t, err)
		assert.Equal(t, updatedTelecom, updatedOrganization.Contact.Telecom) // Updated telecom should match
	})

	err := cc.UpdateContact(mockCtx, organizationID, updatedContact)
	assert.NoError(t, err)
}
