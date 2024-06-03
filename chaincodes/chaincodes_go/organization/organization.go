package main

import (
	"encoding/json"
	"errors"
	"log"
	"strings"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// OrganizationChaincode represents the contract for managing organizations on the blockchain
type OrganizationChaincode struct {
	contractapi.Contract
}

type FollowedPatients struct {
	Patients map[string]bool `json:"patients"`
}

// CreateOrganization creates a new organization
func (oc *OrganizationChaincode) CreateOrganization(ctx contractapi.TransactionContextInterface, organizationJSON string) (string, error) {

	// Deserialize JSON data into a Go data structure
	var organization Organization
	err := json.Unmarshal([]byte(organizationJSON), &organization)
	if err != nil {
		return `{"error": "failed to unmarshal organization: ` + err.Error() + `"}`, err
	}


	// Check if the organization request ID is provided and if it already exists
	if organization.ID.Value == "" {
		return `{"error": "organization request ID is required"}`, errors.New("organization request ID is required")
	}

	existingOrganization, err := ctx.GetStub().GetState(organization.ID.Value)
	if err != nil {
		return `{"error": "failed to retrieve organization: ` + err.Error() + `"}`, err
	}
	if existingOrganization != nil {
		return `{"error": "organization already exists: ` + organization.ID.Value + `"}`, errors.New("organization already exists")
	}

	// Serialize the organization and save it on the blockchain
	organizationJSONBytes, err := json.Marshal(organization)
	if err != nil {
		return `{"error": "failed to marshal organization: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(organization.ID.Value, organizationJSONBytes)
	if err != nil {
		return `{"error": "failed to put organization in world state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Organization created successfully"}`, nil
}

// ReadOrganization retrieves an organization from the blockchain
func (oc *OrganizationChaincode) ReadOrganization(ctx contractapi.TransactionContextInterface, organizationID string) (string, error) {
	// Retrieve the organization from the blockchain
	organizationJSON, err := ctx.GetStub().GetState(organizationID)
	if err != nil {
		return `{"error": "failed to read organization: ` + err.Error() + `"}`, err
	}
	if organizationJSON == nil {
		return `{"error": "organization does not exist: ` + organizationID + `"}`, errors.New("organization does not exist")
	}

	// Deserialize the organization
	var organization Organization
	err = json.Unmarshal(organizationJSON, &organization)
	if err != nil {
		return `{"error": "failed to unmarshal organization: ` + err.Error() + `"}`, err
	}


	return string(organizationJSON), nil
}

// UpdateOrganization updates an existing organization
func (oc *OrganizationChaincode) UpdateOrganization(ctx contractapi.TransactionContextInterface, organizationID string, updatedOrganizationJSON string) (string, error) {
	// Retrieve the existing organization
	existingOrganization, err := ctx.GetStub().GetState(organizationID)
	if err != nil {
		return `{"error": "failed to get organization: ` + err.Error() + `"}`, err
	}
	if existingOrganization == nil {
		return `{"error": "organization does not exist: ` + organizationID + `"}`, errors.New("organization does not exist")
	}

	// Deserialize the updated JSON data into a Go data structure
	var updatedOrganization Organization
	if err := json.Unmarshal([]byte(updatedOrganizationJSON), &updatedOrganization); err != nil {
		return `{"error": "failed to unmarshal organization: ` + err.Error() + `"}`, err
	}

	organizationJSONBytes, err := json.Marshal(updatedOrganization)
	if err != nil {
		return `{"error": "failed to marshal organization: ` + err.Error() + `"}`, err
	}

	if err := ctx.GetStub().PutState(organizationID, organizationJSONBytes); err != nil {
		return `{"error": "failed to put state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Organization updated successfully"}`, nil
}

// DeleteOrganization removes an existing organization
func (oc *OrganizationChaincode) DeleteOrganization(ctx contractapi.TransactionContextInterface, organizationID string) (string, error) {
	// Check if the organization exists
	existingOrganization, err := ctx.GetStub().GetState(organizationID)
	if err != nil {
		return `{"error": "failed to get organization: ` + err.Error() + `"}`, err
	}
	if existingOrganization == nil {
		return `{"error": "organization does not exist: ` + organizationID + `"}`, errors.New("organization does not exist")
	}

	// Remove the organization record
	err = ctx.GetStub().DelState(organizationID)
	if err != nil {
		return `{"error": "failed to delete organization: ` + err.Error() + `"}`, err
	}

	return `{"message": "Organization deleted successfully"}`, nil
}

// SearchOrganizationsByType allows searching for organizations based on type
func (oc *OrganizationChaincode) SearchOrganizationsByType(ctx contractapi.TransactionContextInterface, query string) ([]string, error) {
	var results []string

	// Retrieve all organizations stored on the blockchain
	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, errors.New("failed to retrieve organizations: " + err.Error())
	}
	defer iterator.Close()

	// Iterate through all records and filter those that match the query
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return nil, errors.New("failed to iterate through organizations: " + err.Error())
		}
		var organization Organization
		err = json.Unmarshal(result.Value, &organization)
		if err != nil {
			return nil, errors.New("failed to unmarshal organization: " + err.Error())
		}

		// Check if the value of the organization's type matches the query
		if strings.Compare(organization.Type.Text, query) == 0 {
			resultsJSON, err := json.Marshal(organization)
			if err != nil {
				return nil, errors.New("failed to marshal organization: " + err.Error())
			}
			results = append(results, string(resultsJSON))
		}
	}

	return results, nil
}

// SearchOrganizationByName allows searching for an organization based on name
func (oc *OrganizationChaincode) SearchOrganizationByName(ctx contractapi.TransactionContextInterface, query string) (string, error) {
	// Retrieve all organizations stored on the blockchain
	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return "", errors.New("failed to retrieve organizations: " + err.Error())
	}
	defer iterator.Close()

	// Iterate through all records and filter those that match the query
	for iterator.HasNext() {
		record, err := iterator.Next()
		if err != nil {
			return "", errors.New("failed to iterate through organizations: " + err.Error())
		}
		var organization Organization
		err = json.Unmarshal(record.Value, &organization)
		if err != nil {
			return "", errors.New("failed to unmarshal organization: " + err.Error())
		}

		// Check if the value of the organization's name matches the query
		if strings.Compare(organization.Name, query) == 0 {
			result, err := json.Marshal(organization)
			if err != nil {
				return "", errors.New("failed to marshal organization: " + err.Error())
			}
			return string(result), nil
		}
	}

	return "", errors.New("organization not found")
}

// GetAllOrganizations retrieves all organizations from the ledger and returns them as JSON
func (oc *OrganizationChaincode) GetAllOrganizations(ctx contractapi.TransactionContextInterface) (string, error) {
	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return "", errors.New("failed to retrieve organizations: " + err.Error())
	}
	defer iterator.Close()

	var organizations []Organization
	for iterator.HasNext() {
		queryResponse, err := iterator.Next()
		if err != nil {
			return "", errors.New("failed to iterate through organizations: " + err.Error())
		}

		var organization Organization
		err = json.Unmarshal(queryResponse.Value, &organization)
		if err != nil {
			return "", errors.New("failed to unmarshal organization: " + err.Error())
		}
		organizations = append(organizations, organization)
	}

	organizationsJSON, err := json.Marshal(organizations)
	if err != nil {
		return "", errors.New("failed to marshal organizations: " + err.Error())
	}

	return string(organizationsJSON), nil
}

func (c *OrganizationChaincode) GrantAccess(ctx contractapi.TransactionContextInterface, patientID string, orgID string) (string, error) {
	// Retrieve the list of patients followed by the organization
	followedPatientsAsBytes, err := ctx.GetStub().GetState("followedPatients_" + orgID)
	if err != nil {
		return `{"error": "failed to get followed patients: ` + err.Error() + `"}`, err
	}

	var followedPatients FollowedPatients
	if followedPatientsAsBytes != nil {
		err = json.Unmarshal(followedPatientsAsBytes, &followedPatients)
		if err != nil {
			return `{"error": "failed to unmarshal followed patients: ` + err.Error() + `"}`, err
		}
	} else {
		followedPatients = FollowedPatients{Patients: make(map[string]bool)}
	}

	followedPatients.Patients[patientID] = true
	updatedFollowedPatientsAsBytes, err := json.Marshal(followedPatients)
	if err != nil {
		return `{"error": "failed to marshal followed patients: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState("followedPatients_"+orgID, updatedFollowedPatientsAsBytes)
	if err != nil {
		return `{"error": "failed to put state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Access granted"}`, nil
}

func (c *OrganizationChaincode) GetFollowedPatients(ctx contractapi.TransactionContextInterface, orgID string) ([]string, error) {
	// Retrieve the list of patients followed by the organization
	followedPatientsAsBytes, err := ctx.GetStub().GetState("followedPatients_" + orgID)
	if err != nil {
		return nil, errors.New("failed to get followed patients: " + err.Error())
	}
	if followedPatientsAsBytes == nil {
		return nil, errors.New("no followed patients found")
	}

	var followedPatients FollowedPatients
	err = json.Unmarshal(followedPatientsAsBytes, &followedPatients)
	if err != nil {
		return nil, errors.New("failed to unmarshal followed patients: " + err.Error())
	}

	// Extract the list of patientIDs
	patientIDs := make([]string, 0, len(followedPatients.Patients))
	for patientID := range followedPatients.Patients {
		patientIDs = append(patientIDs, patientID)
	}

	return patientIDs, nil
}

func (c *OrganizationChaincode) RevokeAccess(ctx contractapi.TransactionContextInterface, patientID string, orgID string) (string, error) {
	// Retrieve the list of patients followed by the organization
	followedPatientsAsBytes, err := ctx.GetStub().GetState("followedPatients_" + orgID)
	if err != nil {
		return `{"error": "failed to get followed patients: ` + err.Error() + `"}`, err
	}
	if followedPatientsAsBytes == nil {
		return `{"error": "no followed patients found"}`, errors.New("no followed patients found")
	}

	var followedPatients FollowedPatients
	err = json.Unmarshal(followedPatientsAsBytes, &followedPatients)
	if err != nil {
		return `{"error": "failed to unmarshal followed patients: ` + err.Error() + `"}`, err
	}

	// Remove the patient from the map
	delete(followedPatients.Patients, patientID)

	// Update the state in the ledger
	updatedFollowedPatientsAsBytes, err := json.Marshal(followedPatients)
	if err != nil {
		return `{"error": "failed to marshal followed patients: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState("followedPatients_"+orgID, updatedFollowedPatientsAsBytes)
	if err != nil {
		return `{"error": "failed to put state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Access revoked"}`, nil
}

func (oc *OrganizationChaincode) InitLedger(ctx contractapi.TransactionContextInterface) (string, error) {
	organizations := []Organization{
		{
			ID:          &Identifier{System: "http://example.org/ids", Value: "ospedale-maresca"},
			Active:      true,
			Type:        &CodeableConcept{Text: "Hospital"},
			Name:        "Ospedale Maresca",
			Description: "Ospedale Maresca",
		},
		{
			ID:          &Identifier{System: "http://example.org/ids", Value: "ospedale-del-mare"},
			Active:      true,
			Type:        &CodeableConcept{Text: "Hospital"},
			Name:        "Ospedale Del Mare",
			Description: "Ospedale Del Mare",
		},
		{
			ID:          &Identifier{System: "http://example.org/ids", Value: "ospedale-sgiuliano"},
			Active:      true,
			Type:        &CodeableConcept{Text: "Hospital"},
			Name:        "Ospedale San Giuliano",
			Description: "Ospedale San Giuliano",
		},
		{
			ID:          &Identifier{System: "http://example.org/ids", Value: "medicina-generale-napoli"},
			Active:      true,
			Type:        &CodeableConcept{Text: "General Medicine"},
			Name:        "Medicina Generale Napoli",
			Description: "Medicina Generale Napoli",
		},
		{
			ID:          &Identifier{System: "http://example.org/ids", Value: "neurologia-napoli"},
			Active:      true,
			Type:        &CodeableConcept{Text: "Neurology"},
			Name:        "Neurologia Napoli",
			Description: "Neurologia Napoli",
		},
		{
			ID:          &Identifier{System: "http://example.org/ids", Value: "farmacia-petrone"},
			Active:      true,
			Type:        &CodeableConcept{Text: "Pharmacy"},
			Name:        "Farmacia Petrone",
			Description: "Farmacia Petrone",
		},
		{
			ID:          &Identifier{System: "http://example.org/ids", Value: "farmacia-carbone"},
			Active:      true,
			Type:        &CodeableConcept{Text: "Pharmacy"},
			Name:        "Farmacia Carbone",
			Description: "Farmacia Carbone",
		},
		{
			ID:          &Identifier{System: "http://example.org/ids", Value: "laboratorio-analisi-cmo"},
			Active:      true,
			Type:        &CodeableConcept{Text: "Laboratory"},
			Name:        "Laboratorio Analisi CMO",
			Description: "Laboratorio Analisi CMO",
		},
		{
			ID:          &Identifier{System: "http://example.org/ids", Value: "laboratorio-analisi-sdn"},
			Active:      true,
			Type:        &CodeableConcept{Text: "Laboratory"},
			Name:        "Laboratorio Analisi SDN",
			Description: "Laboratorio Analisi SDN",
		},
		{
			ID:          &Identifier{System: "http://example.org/ids", Value: "patients"},
			Active:      true,
			Type:        &CodeableConcept{Text: "Patients"},
			Name:        "Patients",
			Description: "Patients",
		},
	}

	for _, organization := range organizations {
		log.Printf("Organization: %s", organization.Name)
		organizationJSON, err := json.Marshal(organization)
		if err != nil {
			return `{"error": "failed to marshal organization: ` + err.Error() + `"}`, err
		}

		err = ctx.GetStub().PutState(organization.ID.Value, organizationJSON)
		if err != nil {
			return `{"error": "failed to put organization in world state: ` + err.Error() + `"}`, err
		}
	}

	return `{"message": "Ledger initialized successfully"}`, nil
}


func (oc *OrganizationChaincode) SearchOrganizations(ctx contractapi.TransactionContextInterface, queryString string) (string, error) {
	log.Printf("Executing query: %s", queryString)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return `{"error": "failed to execute query: ` + err.Error() + `"}`, err
	}
	defer resultsIterator.Close()

	var organizations []Organization
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return `{"error": "failed to iterate query results: ` + err.Error() + `"}`, err
		}

		var organization Organization
		err = json.Unmarshal(queryResponse.Value, &organization)
		if err != nil {
			return `{"error": "failed to unmarshal query response: ` + err.Error() + `"}`, err
		}
		organizations = append(organizations, organization)
	}

	resultsJSON, err := json.Marshal(organizations)
	if err != nil {
		return `{"error": "failed to encode results to JSON: ` + err.Error() + `"}`, err
	}

	return string(resultsJSON), nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(OrganizationChaincode))
	if err != nil {
		log.Panic("Error creating organization chaincode: ", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panic("Error starting organization chaincode: ", err)
	}
}
