package test

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"github.com/xDaryamo/MedChain/fhir"
	"github.com/xDaryamo/MedChain/organization"
)

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
