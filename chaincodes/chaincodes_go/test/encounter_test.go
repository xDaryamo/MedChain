package test

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/stretchr/testify/mock"
	"github.com/xDaryamo/MedChain/encounter"
	"github.com/xDaryamo/MedChain/fhir"

	"github.com/stretchr/testify/assert"
)

func TestCreateEncounter(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	mockStub = new(MockStub)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking the input parameters
	encounterID := "enc1"

	encounterJSON := `{"ID":{"system":"http://example.com/enc1","value":"123456"},
	"status":{"coding":[{"system":"http://example.com/encounter/status","code":"in-progress","display":"In Progress"}]},
	"class":{"system":"http://example.com/encounter/class","code":"outpatient","display":"Outpatient"},
	"subject":{"reference":"Patient/123"},
	"participant":[{"type":[{"coding":[{"system":"http://example.com/encounter/participantType","code":"primary","display":"Primary"}],"text":"Primary"}],
	"individual":{"reference":"Practitioner/456"}}],"period":{"start":"2024-04-15T10:00:00Z","end":"2024-04-15T11:00:00Z"},
	"reasonReference":[{"coding":[{"system":"http://example.com/encounter/reasonReference","code":"diabetes","display":"Diabetes"}],"text":"Diabetes"}]
	}`

	// Mocking GetState method to return nil for encounterID
	mockStub.On("GetState", mock.Anything).Return(nil, nil)

	// Mocking PutState method to return nil
	mockStub.On("PutState", mock.Anything, mock.Anything).Return(nil)

	// Call the function under test
	err := ec.CreateEncounter(mockCtx, encounterID, encounterJSON)

	assert.NoError(t, err)

}

func TestGetEncounter(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking the input parameters
	encounterID := "enc1"

	// Define a sample encounter JSON
	encounterJSON := `{"ID":{"system":"http://example.com/enc1","value":"123456"},
	"status":{"coding":[{"system":"http://example.com/encounter/status","code":"in-progress","display":"In Progress"}]},
	"class":{"system":"http://example.com/encounter/class","code":"outpatient","display":"Outpatient"},
	"subject":{"reference":"Patient/123"},
	"participant":[{"type":[{"coding":[{"system":"http://example.com/encounter/participantType","code":"primary","display":"Primary"}],"text":"Primary"}],
	"individual":{"reference":"Practitioner/456"}}],"period":{"start":"2024-04-15T10:00:00Z","end":"2024-04-15T11:00:00Z"},
	"reasonReference":[{"coding":[{"system":"http://example.com/encounter/reasonReference","code":"diabetes","display":"Diabetes"}],"text":"Diabetes"}]
	}`

	// Mocking GetState method to return the sample encounter JSON
	mockStub.On("GetState", encounterID).Return([]byte(encounterJSON), nil)

	// Call the function under test
	resultEncounter, err := ec.GetEncounter(mockCtx, encounterID)

	// Verify that the result is as expected
	assert.NoError(t, err)
	assert.NotNil(t, resultEncounter)

	// Deserialize the expected encounter JSON
	var expectedEncounter fhir.Encounter
	err = json.Unmarshal([]byte(encounterJSON), &expectedEncounter)
	assert.NoError(t, err)

	// Check if the result encounter matches the expected encounter
	assert.Equal(t, &expectedEncounter, resultEncounter)
}

func TestSearchEncounter(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Define sample encounter data
	encounter1 := fhir.Encounter{ID: fhir.Identifier{System: "http://example.com/enc1", Value: "123456"}}
	encounter2 := fhir.Encounter{ID: fhir.Identifier{System: "http://example.com/enc2", Value: "789012"}}
	encounter3 := fhir.Encounter{ID: fhir.Identifier{System: "http://example.com/enc3", Value: "345678"}}

	// Serialize sample encounters to JSON
	encounter1JSON, _ := json.Marshal(encounter1)
	encounter2JSON, _ := json.Marshal(encounter2)
	encounter3JSON, _ := json.Marshal(encounter3)

	// Mocking GetStateByRange method to return sample encounter data
	mockStub.On("GetStateByRange", "", "").Return(&MockIterator{
		Records: []KVPair{
			{Key: "enc1", Value: encounter1JSON},
			{Key: "enc2", Value: encounter2JSON},
			{Key: "enc3", Value: encounter3JSON},
		},
	}, nil)

	// Call the function under test with a query
	query := "789012" // Search for encounters containing "enc2" in the ID
	resultEncounters, err := ec.SearchEncounter(mockCtx, query)

	// Verify that the result is as expected
	assert.NoError(t, err)
	assert.NotNil(t, resultEncounters)
	assert.Len(t, resultEncounters, 1)

	// Ensure that the returned encounter matches the expected encounter
	assert.Equal(t, encounter2, *resultEncounters[0])
}

func TestUpdateEncounter(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Define sample encounter data
	existingEncounter := fhir.Encounter{ID: fhir.Identifier{System: "http://example.com/enc1", Value: "123456"}}
	updatedEncounter := fhir.Encounter{ID: fhir.Identifier{System: "http://example.com/enc1", Value: "123456"} /* Add any updates */}

	// Serialize sample encounters to JSON
	existingEncounterJSON, _ := json.Marshal(existingEncounter)
	updatedEncounterJSON, _ := json.Marshal(updatedEncounter)

	// Mocking GetEncounter method to return existing encounter data
	mockStub.On("GetState", "123456").Return(existingEncounterJSON, nil)

	// Mocking PutState method to ensure the updated encounter is saved
	mockStub.On("PutState", "123456", updatedEncounterJSON).Return(nil)

	// Call the function under test
	err := ec.UpdateEncounter(mockCtx, "123456", string(updatedEncounterJSON))

	// Verify that the result is as expected
	assert.NoError(t, err, "UpdateEncounter should not return an error")
}

func TestDeleteEncounter(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Define sample encounter data
	existingEncounter := fhir.Encounter{ID: fhir.Identifier{System: "http://example.com/enc1", Value: "123456"}}

	// Serialize sample encounter to JSON
	existingEncounterJSON, _ := json.Marshal(existingEncounter)

	// Mocking GetEncounter method to return existing encounter data
	mockStub.On("GetState", "123456").Return(existingEncounterJSON, nil)

	// Mocking DelState method to ensure the encounter is deleted
	mockStub.On("DelState", "123456").Return(nil)

	// Call the function under test
	err := ec.DeleteEncounter(mockCtx, "123456")

	// Verify that the result is as expected
	assert.NoError(t, err, "DeleteEncounter should not return an error")
}

func TestGetEncountersByPatientID(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking GetStateByRange to return a range of encounter data
	mockStub.On("GetStateByRange", "", "").Return(&MockIterator{}, nil)

	// Call the function under test
	results, err := ec.GetEncountersByPatientID(mockCtx, "patientID")

	// Verify that the result is as expected
	assert.NoError(t, err, "GetEncountersByPatientID should not return an error")
	assert.Empty(t, results, "GetEncountersByPatientID should return empty results as no encounters are stored")
}

func TestGetEncountersByDateRange(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking GetStateByRange to return a range of encounter data
	mockStub.On("GetStateByRange", "", "").Return(&MockIterator{}, nil)

	// Define sample start and end dates
	startDate := time.Now().AddDate(0, -1, 0) // 1 month ago
	endDate := time.Now()

	// Call the function under test
	results, err := ec.GetEncountersByDateRange(mockCtx, startDate, endDate)

	// Verify that the result is as expected
	assert.NoError(t, err, "GetEncountersByDateRange should not return an error")
	assert.Empty(t, results, "GetEncountersByDateRange should return empty results as no encounters are stored")
}

func TestGetEncountersByType(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking GetStateByRange to return a range of encounter data
	mockStub.On("GetStateByRange", "", "").Return(&MockIterator{}, nil)

	// Call the function under test
	results, err := ec.GetEncountersByType(mockCtx, "emergency")

	// Verify that the result is as expected
	assert.NoError(t, err, "GetEncountersByType should not return an error")
	assert.Empty(t, results, "GetEncountersByType should return empty results as no encounters are stored")
}

func TestGetEncountersByLocation(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking GetStateByRange to return a range of encounter data
	mockStub.On("GetStateByRange", "", "").Return(&MockIterator{}, nil)

	// Call the function under test
	results, err := ec.GetEncountersByLocation(mockCtx, "locationID")

	// Verify that the result is as expected
	assert.NoError(t, err, "GetEncountersByLocation should not return an error")
	assert.Empty(t, results, "GetEncountersByLocation should return empty results as no encounters are stored")
}

func TestGetEncountersByPractitioner(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking GetStateByRange to return a range of encounter data
	mockStub.On("GetStateByRange", "", "").Return(&MockIterator{}, nil)

	// Call the function under test
	results, err := ec.GetEncountersByPractitioner(mockCtx, "practitionerID")

	// Verify that the result is as expected
	assert.NoError(t, err, "GetEncountersByPractitioner should not return an error")
	assert.Empty(t, results, "GetEncountersByPractitioner should return empty results as no encounters are stored")
}

func TestUpdateEncounterStatus(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Define sample encounter data
	encounter := fhir.Encounter{ID: fhir.Identifier{System: "http://example.com/enc1", Value: "123456"}}

	// Serialize sample encounters to JSON
	encounterJSON, _ := json.Marshal(encounter)

	mockIterator := &MockIterator{
		Records: []KVPair{
			{Key: "encounterID", Value: encounterJSON},
		},
	}

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking GetStateByRange to return a query result containing the desired encounter
	mockStub.On("GetStateByRange", "", "").Return(mockIterator)

	mockStub.On("GetState", mock.Anything).Return(mockIterator.Records[0].Value, nil)

	mockStub.On("PutState", mock.Anything, mock.Anything).Return(nil)

	// Create a sample fhir.Coding struct
	coding := fhir.Coding{
		System:  "http://example.com/coding/system",
		Code:    "12345",
		Display: "Sample Coding",
	}

	// Create a sample fhir.Code struct with the coding
	statusCode := fhir.Code{Coding: []fhir.Coding{coding}}

	// Call the function under test
	err := ec.UpdateEncounterStatus(mockCtx, "encounterID", statusCode)

	// Verify that the result is as expected
	assert.NoError(t, err, "UpdateEncounterStatus should not return an error")
}

func TestAddDiagnosisToEncounter(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking GetState to return a sample encounter
	mockStub.On("GetState", mock.Anything).Return([]byte(`{"ID":{"System":"http://example.com/enc1","Value":"123456"}}`), nil)

	mockStub.On("PutState", mock.Anything, mock.Anything).Return(nil)

	// Call the function under test
	err := ec.AddDiagnosisToEncounter(mockCtx, "encounterID", fhir.EncounterDiagnosis{})

	// Verify that the result is as expected
	assert.NoError(t, err, "AddDiagnosisToEncounter should not return an error")
}

func TestAddParticipantToEncounter(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking GetState to return a sample encounter
	mockStub.On("GetState", mock.Anything).Return([]byte(`{"ID":{"System":"http://example.com/enc1","Value":"123456"}}`), nil)

	mockStub.On("PutState", mock.Anything, mock.Anything).Return(nil)

	// Call the function under test
	err := ec.AddParticipantToEncounter(mockCtx, "encounterID", fhir.EncounterParticipant{})

	// Verify that the result is as expected
	assert.NoError(t, err, "AddParticipantToEncounter should not return an error")
}

func TestRemoveParticipantFromEncounter(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking GetState to return a sample encounter
	mockStub.On("GetState", mock.Anything).Return([]byte(`{"ID":{"System":"http://example.com/enc1","Value":"123456"},
	"Participant":[{"Type":[{"Coding":[{"System":"http://example.com/coding/system","Code":"12345","Display":"Sample Coding"}]}],
	"Period":{"Start":"2024-04-17T08:00:00Z","End":"2024-04-17T12:00:00Z"},
	"Individual":{"Reference":"http://example.com/individual/123"}}]}`), nil)

	mockStub.On("PutState", mock.Anything, mock.Anything).Return(nil)

	// Call the function under test
	err := ec.RemoveParticipantFromEncounter(mockCtx, "encounterID", 0)

	// Verify that the result is as expected
	assert.NoError(t, err, "RemoveParticipantFromEncounter should not return an error")
}

func TestAddLocationToEncounter(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking GetState to return a sample encounter
	mockStub.On("GetState", mock.Anything).Return([]byte(`{"ID":{"System":"http://example.com/enc1","Value":"123456"}}`), nil)

	mockStub.On("PutState", mock.Anything, mock.Anything).Return(nil)

	// Call the function under test
	err := ec.AddLocationToEncounter(mockCtx, "encounterID", fhir.Location{})

	// Verify that the result is as expected
	assert.NoError(t, err, "AddLocationToEncounter should not return an error")
}

func TestRemoveLocationFromEncounter(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking GetState to return a sample encounter
	mockStub.On("GetState", mock.Anything).Return([]byte(`{"ID":{"System":"http://example.com/enc1","Value":"123456"}, "Location":[{"Name":"Location1"},{"Name":"Location2"}]}`), nil)

	mockStub.On("PutState", mock.Anything, mock.Anything).Return(nil)

	// Call the function under test
	err := ec.RemoveLocationFromEncounter(mockCtx, "encounterID", 0)

	// Verify that the result is as expected
	assert.NoError(t, err, "RemoveLocationFromEncounter should not return an error")
}

func TestGetEncountersByReason(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking GetStateByRange to return a range of encounter data
	mockStub.On("GetStateByRange", "", "").Return(&MockIterator{}, nil)

	// Call the function under test
	results, err := ec.GetEncountersByReason(mockCtx, "reason")

	// Verify that the result is as expected
	assert.NoError(t, err, "GetEncountersByReason should not return an error")
	assert.Empty(t, results, "GetEncountersByReason should return empty results as no encounters are stored")
}

func TestGetEncountersByServiceProvider(t *testing.T) {

	var mockStub *MockStub

	// Mocking the TransactionContextInterface
	mockCtx := new(MockTransactionContext)

	// Creating an instance of EncounterChaincode
	ec := new(encounter.EncounterChaincode)

	mockStub = new(MockStub)

	// Ensure GetStub returns the same instance of mockStub
	mockCtx.On("GetStub").Return(mockStub)

	// Mocking GetStateByRange to return a range of encounter data
	mockStub.On("GetStateByRange", "", "").Return(&MockIterator{}, nil)

	// Call the function under test
	results, err := ec.GetEncountersByServiceProvider(mockCtx, "serviceProviderID")

	// Verify that the result is as expected
	assert.NoError(t, err, "GetEncountersByServiceProvider should not return an error")
	assert.Empty(t, results, "GetEncountersByServiceProvider should return empty results as no encounters are stored")
}
