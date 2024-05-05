package main

import (
	"encoding/json"
	"errors"
	"log"
	"strings"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// EncounterChaincode represents the Chaincode for managing Encounters on the blockchain
type EncounterChaincode struct {
	contractapi.Contract
}

// CreateEncounter creates a new Encounter
func (ec *EncounterChaincode) CreateEncounter(ctx contractapi.TransactionContextInterface, encounterID string, encounterJSON string) error {
	// Deserialize JSON data into a Go data structure
	var encounter Encounter
	if err := json.Unmarshal([]byte(encounterJSON), &encounter); err != nil {
		return err
	}

	// Check if the Encounter record already exists
	existingEncounter, err := ec.GetEncounter(ctx, encounterID)
	if err != nil {
		return err
	}
	if existingEncounter != nil {
		return errors.New("encounter record already exists")
	}

	// Serialize the Encounter record and save it on the blockchain
	encounterJSONBytes, err := json.Marshal(encounter)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(encounterID, encounterJSONBytes)
}

// GetEncounter retrieves an Encounter from the blockchain
func (ec *EncounterChaincode) GetEncounter(ctx contractapi.TransactionContextInterface, encounterID string) (*Encounter, error) {
	// Retrieve the Encounter record from the blockchain
	encounterJSON, err := ctx.GetStub().GetState(encounterID)
	if err != nil {
		return nil, err
	}
	if encounterJSON == nil {
		return nil, nil
	}

	// Deserialize the Encounter record
	var encounter Encounter
	err = json.Unmarshal(encounterJSON, &encounter)
	if err != nil {
		return nil, err
	}

	return &encounter, nil
}

// UpdateEncounter updates an existing Encounter
func (ec *EncounterChaincode) UpdateEncounter(ctx contractapi.TransactionContextInterface, encounterID string, updatedEncounterJSON string) error {
	// Retrieve the existing Encounter record
	existingEncounter, err := ec.GetEncounter(ctx, encounterID)
	if err != nil {
		return err
	}
	if existingEncounter == nil {
		return errors.New("encounter record not found")
	}

	// Deserialize the updated JSON data into a Go data structure
	var updatedEncounter Encounter
	if err := json.Unmarshal([]byte(updatedEncounterJSON), &updatedEncounter); err != nil {
		return err
	}

	// Update the existing Encounter record with the new data
	// (you may need to implement your own logic for updating specific fields)
	*existingEncounter = updatedEncounter

	// Serialize the updated Encounter record and save it on the blockchain
	updatedEncounterJSONBytes, err := json.Marshal(existingEncounter)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(encounterID, updatedEncounterJSONBytes)
}

// DeleteEncounter removes an existing Encounter
func (ec *EncounterChaincode) DeleteEncounter(ctx contractapi.TransactionContextInterface, encounterID string) error {
	// Check if the Encounter record exists
	existingEncounter, err := ec.GetEncounter(ctx, encounterID)
	if err != nil {
		return err
	}
	if existingEncounter == nil {
		return errors.New("encounter record not found")
	}

	// Remove the Encounter record from the blockchain
	return ctx.GetStub().DelState(encounterID)
}

// SearchEncounter allows searching for Encounter based on certain criteria
func (ec *EncounterChaincode) SearchEncounter(ctx contractapi.TransactionContextInterface, query string) ([]*Encounter, error) {
	var results []*Encounter

	// Retrieve all Encounter records stored on the blockchain
	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer iterator.Close()

	// Iterate through all records and filter those that match the query
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return nil, err
		}
		var encounter Encounter
		err = json.Unmarshal(result.Value, &encounter)
		if err != nil {
			return nil, err
		}

		// Add Encounter records that match the query to the results
		if strings.Contains(encounter.ID.Value, query) {
			results = append(results, &encounter)
		}
	}

	return results, nil
}

// GetEncountersByPatientID retrieves all Encounters associated with a specific patient ID
func (ec *EncounterChaincode) GetEncountersByPatientID(ctx contractapi.TransactionContextInterface, patientID string) ([]*Encounter, error) {
	var results []*Encounter

	// Retrieve all Encounter records stored on the blockchain
	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer iterator.Close()

	// Iterate through all records and filter those associated with the specified patient ID
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return nil, err
		}
		var encounter Encounter
		err = json.Unmarshal(result.Value, &encounter)
		if err != nil {
			return nil, err
		}

		// Check if the Encounter record is associated with the specified patient ID
		if encounter.Subject != nil && encounter.Subject.Reference == patientID {
			results = append(results, &encounter)
		}
	}

	return results, nil
}

// GetEncountersByDateRange retrieves all Encounters that occurred within a specified date range
func (ec *EncounterChaincode) GetEncountersByDateRange(ctx contractapi.TransactionContextInterface, startDate time.Time, endDate time.Time) ([]*Encounter, error) {
	var results []*Encounter

	// Retrieve all Encounter records stored on the blockchain
	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer iterator.Close()

	// Iterate through all records and filter those that occurred within the specified date range
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return nil, err
		}
		var encounter Encounter
		err = json.Unmarshal(result.Value, &encounter)
		if err != nil {
			return nil, err
		}

		// Check if the Encounter record occurred within the specified date range
		if encounter.Period.Start.After(startDate) && encounter.Period.End.Before(endDate) {
			results = append(results, &encounter)
		}
	}

	return results, nil
}

// GetEncountersByType retrieves all Encounters of a specific type
func (ec *EncounterChaincode) GetEncountersByType(ctx contractapi.TransactionContextInterface, encounterType string) ([]*Encounter, error) {
	var results []*Encounter

	// Retrieve all Encounter records stored on the blockchain
	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer iterator.Close()

	// Iterate through all records and filter those of the specified type
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return nil, err
		}
		var encounter Encounter
		err = json.Unmarshal(result.Value, &encounter)
		if err != nil {
			return nil, err
		}

		// Check if the Encounter record has the specified type
		for _, eType := range encounter.Type {
			if eType.Text == encounterType {
				results = append(results, &encounter)
				break
			}
		}
	}

	return results, nil
}

// GetEncountersByLocation retrieves all Encounters that occurred at a specific location
func (ec *EncounterChaincode) GetEncountersByLocation(ctx contractapi.TransactionContextInterface, locationID string) ([]*Encounter, error) {
	var results []*Encounter

	// Retrieve all Encounter records stored on the blockchain
	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer iterator.Close()

	// Iterate through all records and filter those that occurred at the specified location
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return nil, err
		}
		var encounter Encounter
		err = json.Unmarshal(result.Value, &encounter)
		if err != nil {
			return nil, err
		}

		// Check if the Encounter record occurred at the specified location
		for _, loc := range encounter.Location {
			if loc.ID.Value == locationID {
				results = append(results, &encounter)
				break
			}
		}
	}

	return results, nil
}

// GetEncountersByPractitioner retrieves all Encounters involving a specific practitioner
func (ec *EncounterChaincode) GetEncountersByPractitioner(ctx contractapi.TransactionContextInterface, practitionerID string) ([]*Encounter, error) {
	var results []*Encounter

	// Retrieve all Encounter records stored on the blockchain
	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer iterator.Close()

	// Iterate through all records and filter those involving the specified practitioner
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return nil, err
		}
		var encounter Encounter
		err = json.Unmarshal(result.Value, &encounter)
		if err != nil {
			return nil, err
		}

		// Check if the Encounter record involves the specified practitioner
		for _, participant := range encounter.Participant {
			if participant.Individual != nil && participant.Individual.Reference == practitionerID {
				results = append(results, &encounter)
				break
			}
		}
	}

	return results, nil
}

// UpdateEncounterStatus updates the status of an existing Encounter
func (ec *EncounterChaincode) UpdateEncounterStatus(ctx contractapi.TransactionContextInterface, encounterID string, newStatus Code) error {
	// Retrieve the existing Encounter record
	existingEncounter, err := ec.GetEncounter(ctx, encounterID)
	if err != nil {
		return err
	}
	if existingEncounter == nil {
		return errors.New("encounter not found")
	}

	// Update the status of the existing Encounter record
	existingEncounter.Status = newStatus

	// Serialize the updated Encounter record and save it on the blockchain
	updatedEncounterJSONBytes, err := json.Marshal(existingEncounter)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(encounterID, updatedEncounterJSONBytes)
}

// AddDiagnosisToEncounter adds a new diagnosis to an existing Encounter
func (ec *EncounterChaincode) AddDiagnosisToEncounter(ctx contractapi.TransactionContextInterface, encounterID string, diagnosis EncounterDiagnosis) error {
	// Retrieve the existing Encounter record
	existingEncounter, err := ec.GetEncounter(ctx, encounterID)
	if err != nil {
		return err
	}
	if existingEncounter == nil {
		return errors.New("encounter not found")
	}

	// Add the new diagnosis to the existing Encounter record
	existingEncounter.Diagnosis = append(existingEncounter.Diagnosis, diagnosis)

	// Serialize the updated Encounter record and save it on the blockchain
	updatedEncounterJSONBytes, err := json.Marshal(existingEncounter)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(encounterID, updatedEncounterJSONBytes)
}

// AddParticipantToEncounter adds a new participant to an existing Encounter
func (ec *EncounterChaincode) AddParticipantToEncounter(ctx contractapi.TransactionContextInterface, encounterID string, participant EncounterParticipant) error {
	// Retrieve the existing Encounter record
	existingEncounter, err := ec.GetEncounter(ctx, encounterID)
	if err != nil {
		return err
	}
	if existingEncounter == nil {
		return errors.New("encounter not found")
	}

	// Add the new participant to the existing Encounter record
	existingEncounter.Participant = append(existingEncounter.Participant, participant)

	// Serialize the updated Encounter record and save it on the blockchain
	updatedEncounterJSONBytes, err := json.Marshal(existingEncounter)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(encounterID, updatedEncounterJSONBytes)
}

// RemoveParticipantFromEncounter removes a participant from an existing Encounter
func (ec *EncounterChaincode) RemoveParticipantFromEncounter(ctx contractapi.TransactionContextInterface, encounterID string, participantIndex int) error {
	// Retrieve the existing Encounter record
	existingEncounter, err := ec.GetEncounter(ctx, encounterID)
	if err != nil {
		return err
	}
	if existingEncounter == nil {
		return errors.New("encounter not found")
	}

	// Remove the participant from the existing Encounter record
	if participantIndex < 0 || participantIndex >= len(existingEncounter.Participant) {
		return errors.New("invalid participant index")
	}
	existingEncounter.Participant = append(existingEncounter.Participant[:participantIndex], existingEncounter.Participant[participantIndex+1:]...)

	// Serialize the updated Encounter record and save it on the blockchain
	updatedEncounterJSONBytes, err := json.Marshal(existingEncounter)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(encounterID, updatedEncounterJSONBytes)
}

// AddLocationToEncounter adds a new location to an existing Encounter
func (ec *EncounterChaincode) AddLocationToEncounter(ctx contractapi.TransactionContextInterface, encounterID string, location Location) error {
	// Retrieve the existing Encounter record
	existingEncounter, err := ec.GetEncounter(ctx, encounterID)
	if err != nil {
		return err
	}
	if existingEncounter == nil {
		return errors.New("encounter not found")
	}

	// Add the new location to the existing Encounter record
	existingEncounter.Location = append(existingEncounter.Location, location)

	// Serialize the updated Encounter record and save it on the blockchain
	updatedEncounterJSONBytes, err := json.Marshal(existingEncounter)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(encounterID, updatedEncounterJSONBytes)
}

// RemoveLocationFromEncounter removes a location from an existing Encounter
func (ec *EncounterChaincode) RemoveLocationFromEncounter(ctx contractapi.TransactionContextInterface, encounterID string, locationIndex int) error {
	// Retrieve the existing Encounter record
	existingEncounter, err := ec.GetEncounter(ctx, encounterID)
	if err != nil {
		return err
	}
	if existingEncounter == nil {
		return errors.New("encounter not found")
	}

	// Remove the location from the existing Encounter record
	if locationIndex < 0 || locationIndex >= len(existingEncounter.Location) {
		return errors.New("invalid location index")
	}
	existingEncounter.Location = append(existingEncounter.Location[:locationIndex], existingEncounter.Location[locationIndex+1:]...)

	// Serialize the updated Encounter record and save it on the blockchain
	updatedEncounterJSONBytes, err := json.Marshal(existingEncounter)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(encounterID, updatedEncounterJSONBytes)
}

// GetEncountersByReason retrieves all Encounters with a specific reason for the encounter
func (ec *EncounterChaincode) GetEncountersByReason(ctx contractapi.TransactionContextInterface, reason string) ([]*Encounter, error) {
	var results []*Encounter

	// Retrieve all Encounter records stored on the blockchain
	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer iterator.Close()

	// Iterate through all records and filter those with the specified reason
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return nil, err
		}
		var encounter Encounter
		err = json.Unmarshal(result.Value, &encounter)
		if err != nil {
			return nil, err
		}

		// Check if the Encounter record has the specified reason
		for _, r := range encounter.ReasonReference {
			for _, coding := range r.Coding {
				if coding.Display == reason {
					results = append(results, &encounter)
					break
				}
			}
		}
	}

	return results, nil
}

// GetEncountersByServiceProvider retrieves all Encounters provided by a specific healthcare service provider
func (ec *EncounterChaincode) GetEncountersByServiceProvider(ctx contractapi.TransactionContextInterface, serviceProviderID string) ([]*Encounter, error) {
	var results []*Encounter

	// Retrieve all Encounter records stored on the blockchain
	iterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer iterator.Close()

	// Iterate through all records and filter those provided by the specified service provider
	for iterator.HasNext() {
		result, err := iterator.Next()
		if err != nil {
			return nil, err
		}
		var encounter Encounter
		err = json.Unmarshal(result.Value, &encounter)
		if err != nil {
			return nil, err
		}

		// Check if the Encounter record is provided by the specified service provider
		if encounter.ServiceProvider != nil && encounter.ServiceProvider.Reference == serviceProviderID {
			results = append(results, &encounter)
		}
	}

	return results, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(EncounterChaincode))
	if err != nil {
		log.Panic(errors.New("Error creating encounter chaincode: " + err.Error()))
	}

	if err := chaincode.Start(); err != nil {
		log.Panic(errors.New("Error starting encounter chaincode: " + err.Error()))
	}
}
