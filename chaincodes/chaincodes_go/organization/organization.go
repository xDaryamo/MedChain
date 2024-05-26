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

// CreateOrganization creates a new organization
func (oc *OrganizationChaincode) CreateOrganization(ctx contractapi.TransactionContextInterface, organizationJSON string) error {

	log.Printf("Organization JSON from param: %s", string(organizationJSON))

	// Deserialize JSON data into a Go data structure
	var organization Organization
	err := json.Unmarshal([]byte(organizationJSON), &organization)

	if err != nil {
		return errors.New("failed to unmarshal organization: " + err.Error())
	}

	log.Printf("Organization struct unmarshalled: %+v", organization)

	// Check if the organization request ID is provided and if it already exists
	if organization.ID.Value == "" {
		return errors.New("organization request ID is required")
	}

	existingOrganization, err := ctx.GetStub().GetState(organization.ID.Value)

	if err != nil {
		return errors.New("failed to retrieve organization " + organization.ID.Value + " from world state")
	}

	if existingOrganization != nil {
		return errors.New("organization already exists: " + organization.ID.Value)
	}

	// Serialize the organization and save it on the blockchain
	organizationJSONBytes, err := json.Marshal(organization)
	if err != nil {
		return errors.New("failed to marshal organization: " + err.Error())
	}

	err = ctx.GetStub().PutState(organization.ID.Value, organizationJSONBytes)
	if err != nil {
		return errors.New("failed to put organization in world state: " + err.Error())
	}

	log.Printf("Organization with ID: %s created successfully", organization.ID.Value)
	return nil
}

// GetOrganization retrieves an organization from the blockchain
func (oc *OrganizationChaincode) ReadOrganization(ctx contractapi.TransactionContextInterface, organizationID string) (string, error) {
	// Retrieve the organization from the blockchain
	organizationJSON, err := ctx.GetStub().GetState(organizationID)
	if err != nil {
		return "", errors.New("failed to read organization: " + err.Error())
	}
	if organizationJSON == nil {
		return "", errors.New("organization does not exist: " + organizationID)
	}

	log.Printf("Organization JSON from ledger: %s", string(organizationJSON))

	// Deserialize the organization
	var organization Organization
	err = json.Unmarshal(organizationJSON, &organization)
	if err != nil {
		return "", errors.New("failed to unmarshal organization: " + err.Error())
	}

	log.Printf("Organization object: %+v", organization)

	return string(organizationJSON), nil
}

// UpdateOrganization updates an existing organization
func (oc *OrganizationChaincode) UpdateOrganization(ctx contractapi.TransactionContextInterface, organizationID string, updatedOrganizationJSON string) error {
	// Retrieve the existing organization
	existingOrganization, err := ctx.GetStub().GetState(organizationID)
	if err != nil {
		return errors.New("failed to get organization: " + err.Error())
	}
	if existingOrganization == nil {
		return errors.New("organization does not exist: " + organizationID)
	}

	// Deserialize the updated JSON data into a Go data structure
	var updatedOrganization Organization
	if err := json.Unmarshal([]byte(updatedOrganizationJSON), &updatedOrganization); err != nil {
		return err
	}

	organizationJSONBytes, err := json.Marshal(updatedOrganization)
	if err != nil {
		return errors.New("failed to marshal organization: " + err.Error())
	}

	if err := ctx.GetStub().PutState(organizationID, organizationJSONBytes); err != nil {
		return errors.New("failed to put state: " + err.Error())
	}

	return nil
}

// DeleteOrganization removes an existing organization
func (oc *OrganizationChaincode) DeleteOrganization(ctx contractapi.TransactionContextInterface, organizationID string) error {
	// Check if the organization exists
	existingOrganization, err := ctx.GetStub().GetState(organizationID)
	if err != nil {
		return errors.New("failed to get organization: " + err.Error())
	}
	if existingOrganization == nil {
		return errors.New("organization does not exist: " + organizationID)
	}

	// Remove the practitioner record
	err = ctx.GetStub().DelState(organizationID)
	if err != nil {
		return errors.New("failed to delete organization: " + err.Error())
	}

	return nil
}

// SearchOrganizationsByType allows searching for organizations based on type
func (oc *OrganizationChaincode) SearchOrganizationsByType(ctx contractapi.TransactionContextInterface, query string) ([]string, error) {
	var results []string

	// Retrieve all organizations stored on the blockchain
	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return results, err
	}
	defer iterator.Close()

	// Iterate through all records and filter those that match the query
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return results, err
		}
		var organization Organization
		err = json.Unmarshal(result.Value, &organization)
		if err != nil {
			return results, err
		}

		// Check if the value of the organization's type matches the query
		if strings.Contains(organization.Type.Text, query) {
			resultsJSON, err := json.Marshal(organization)

			if err != nil {
				return results, err
			}
			results = append(results, string(resultsJSON))
		}
	}

	return results, nil
}

// SearchOrganizationByName allows searching for an organization based on name
func (oc *OrganizationChaincode) SearchOrganizationByName(ctx contractapi.TransactionContextInterface, query string) (string, error) {
	var result *Organization

	// Retrieve all organizations stored on the blockchain
	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return "", err
	}
	defer iterator.Close()

	// Iterate through all records and filter those that match the query
	for iterator.HasNext() {
		record, err := iterator.Next()
		if err != nil {
			return "", err
		}
		var organization Organization
		err = json.Unmarshal(record.Value, &organization)
		if err != nil {
			return "", err
		}

		// Check if the value of the organization's name matches the query
		if strings.Contains(organization.Name, query) {
			result = &organization
			break
		}
	}

	// Convert result to JSON
	if result != nil {
		resultJSON, err := json.Marshal(result)
		if err != nil {
			return "", err
		}
		return string(resultJSON), nil
	}

	return "", nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(OrganizationChaincode))
	if err != nil {
		log.Panic(errors.New("error creating organization chaincode: " + err.Error()))
	}

	if err := chaincode.Start(); err != nil {
		log.Panic(errors.New("error starting organization chaincode: " + err.Error()))
	}
}
