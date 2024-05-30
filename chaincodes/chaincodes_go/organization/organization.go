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

	log.Printf("Organization JSON from param: %s", string(organizationJSON))

	// Deserialize JSON data into a Go data structure
	var organization Organization
	err := json.Unmarshal([]byte(organizationJSON), &organization)

	if err != nil {
		return "", errors.New("failed to unmarshal organization: " + err.Error())
	}

	log.Printf("Organization struct unmarshalled: %+v", organization)

	// Check if the organization request ID is provided and if it already exists
	if organization.ID.Value == "" {
		return "", errors.New("organization request ID is required")
	}

	existingOrganization, err := ctx.GetStub().GetState(organization.ID.Value)

	if err != nil {
		return "", errors.New("failed to retrieve organization " + organization.ID.Value + " from world state")
	}

	if existingOrganization != nil {
		return "", errors.New("organization already exists: " + organization.ID.Value)
	}

	// Serialize the organization and save it on the blockchain
	organizationJSONBytes, err := json.Marshal(organization)
	if err != nil {
		return "", errors.New("failed to marshal organization: " + err.Error())
	}

	err = ctx.GetStub().PutState(organization.ID.Value, organizationJSONBytes)
	if err != nil {
		return "", errors.New("failed to put organization in world state: " + err.Error())
	}

	log.Printf("Organization with ID: %s created successfully", organization.ID.Value)
	return `{"message": "Organization created successfully"}`, nil
}

// ReadOrganization retrieves an organization from the blockchain
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
func (oc *OrganizationChaincode) UpdateOrganization(ctx contractapi.TransactionContextInterface, organizationID string, updatedOrganizationJSON string) (string, error) {
	// Retrieve the existing organization
	existingOrganization, err := ctx.GetStub().GetState(organizationID)
	if err != nil {
		return "", errors.New("failed to get organization: " + err.Error())
	}
	if existingOrganization == nil {
		return "", errors.New("organization does not exist: " + organizationID)
	}

	// Deserialize the updated JSON data into a Go data structure
	var updatedOrganization Organization
	if err := json.Unmarshal([]byte(updatedOrganizationJSON), &updatedOrganization); err != nil {
		return "", err
	}

	organizationJSONBytes, err := json.Marshal(updatedOrganization)
	if err != nil {
		return "", errors.New("failed to marshal organization: " + err.Error())
	}

	if err := ctx.GetStub().PutState(organizationID, organizationJSONBytes); err != nil {
		return "", errors.New("failed to put state: " + err.Error())
	}

	return `{"message": "Organization updated successfully"}`, nil
}

// DeleteOrganization removes an existing organization
func (oc *OrganizationChaincode) DeleteOrganization(ctx contractapi.TransactionContextInterface, organizationID string) (string, error) {
	// Check if the organization exists
	existingOrganization, err := ctx.GetStub().GetState(organizationID)
	if err != nil {
		return "", errors.New("failed to get organization: " + err.Error())
	}
	if existingOrganization == nil {
		return "", errors.New("organization does not exist: " + organizationID)
	}

	// Remove the practitioner record
	err = ctx.GetStub().DelState(organizationID)
	if err != nil {
		return "", errors.New("failed to delete organization: " + err.Error())
	}

	return `{"message": "Organization deleted successfully"}`, nil
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
		if strings.Compare(organization.Type.Text, query) == 0 {
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
		if strings.Compare(organization.Name, query) == 0 {
			result, err := json.Marshal(organization)

			if err != nil {
				return "", err
			}

			return string(result), nil
		}
	}

	return "", err
}

func (c *OrganizationChaincode) GrantAccess(ctx contractapi.TransactionContextInterface, patientID string, orgID string) (string, error) {
	// Recupera la lista dei pazienti seguiti dall'organizzazione
	followedPatientsAsBytes, err := ctx.GetStub().GetState("followedPatients_" + orgID)
	if err != nil {
		return "", err
	}

	var followedPatients FollowedPatients
	if followedPatientsAsBytes != nil {
		err = json.Unmarshal(followedPatientsAsBytes, &followedPatients)
		if err != nil {
			return "", err
		}
	} else {
		followedPatients = FollowedPatients{Patients: make(map[string]bool)}
	}

	followedPatients.Patients[patientID] = true
	updatedFollowedPatientsAsBytes, err := json.Marshal(followedPatients)
	if err != nil {
		return "", err
	}

	err = ctx.GetStub().PutState("followedPatients_"+orgID, updatedFollowedPatientsAsBytes)
	if err != nil {
		return "", err
	}

	return `{"message": "Access granted"}`, nil
}

func (c *OrganizationChaincode) GetFollowedPatients(ctx contractapi.TransactionContextInterface, orgID string) ([]string, error) {
	// Recupera la lista dei pazienti seguiti dall'organizzazione
	followedPatientsAsBytes, err := ctx.GetStub().GetState("followedPatients_" + orgID)
	if err != nil {
		return nil, err
	}
	if followedPatientsAsBytes == nil {
		return nil, errors.New("no followed patients found")
	}

	var followedPatients FollowedPatients
	err = json.Unmarshal(followedPatientsAsBytes, &followedPatients)
	if err != nil {
		return nil, err
	}

	// Estrai la lista dei patientID
	patientIDs := make([]string, 0, len(followedPatients.Patients))
	for patientID := range followedPatients.Patients {
		patientIDs = append(patientIDs, patientID)
	}

	return patientIDs, nil
}
func (c *OrganizationChaincode) RevokeAccess(ctx contractapi.TransactionContextInterface, patientID string, orgID string) (string, error) {
	// Recupera la lista dei pazienti seguiti dall'organizzazione
	followedPatientsAsBytes, err := ctx.GetStub().GetState("followedPatients_" + orgID)
	if err != nil {
		return "", err
	}
	if followedPatientsAsBytes == nil {
		return "", errors.New("no followed patients found")
	}

	var followedPatients FollowedPatients
	err = json.Unmarshal(followedPatientsAsBytes, &followedPatients)
	if err != nil {
		return "", err
	}

	// Rimuovi il paziente dalla mappa
	delete(followedPatients.Patients, patientID)

	// Aggiorna lo stato nel ledger
	updatedFollowedPatientsAsBytes, err := json.Marshal(followedPatients)
	if err != nil {
		return "", err
	}

	err = ctx.GetStub().PutState("followedPatients_"+orgID, updatedFollowedPatientsAsBytes)
	if err != nil {
		return "", err
	}

	return `{"message": "Access revoked"}`, nil
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
