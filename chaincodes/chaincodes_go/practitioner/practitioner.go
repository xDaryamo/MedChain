package main

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// PractitionerContract represents the smart contract for managing practitioners
type PractitionerContract struct {
	contractapi.Contract
}

type FollowedPatients struct {
	Patients map[string]bool `json:"patients"` // Mappa dei pazienti seguiti
}

// CreatePractitioner adds a new practitioner record to the ledger
func (c *PractitionerContract) CreatePractitioner(ctx contractapi.TransactionContextInterface, practitionerJSON string) (string, error) {
	var practitioner Practitioner
	err := json.Unmarshal([]byte(practitionerJSON), &practitioner)
	if err != nil {
		return `{"error": "failed to unmarshal practitioner: ` + err.Error() + `"}`, err
	}

	if practitioner.ID.Value == "" {
		return `{"error": "practitioner request ID is required"}`, errors.New("practitioner request ID is required")
	}

	existingPractitioner, err := ctx.GetStub().GetState(practitioner.ID.Value)
	if err != nil {
		return `{"error": "failed to get practitioner: ` + practitioner.ID.Value + ` from world state: ` + err.Error() + `"}`, err
	}
	if existingPractitioner != nil {
		return `{"error": "practitioner already exists: ` + practitioner.ID.Value + `"}`, errors.New("practitioner already exists")
	}

	practitionerJSONBytes, err := json.Marshal(practitioner)
	if err != nil {
		return `{"error": "failed to marshal practitioner: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(practitioner.ID.Value, practitionerJSONBytes)
	if err != nil {
		return `{"error": "failed to put practitioner in world state: ` + err.Error() + `"}`, err
	}

	log.Printf("Practitioner with ID: %s created successfully", practitioner.ID.Value)
	return `{"message": "Practitioner created successfully"}`, nil
}

// ReadPractitioner retrieves a practitioner record from the ledger
func (c *PractitionerContract) ReadPractitioner(ctx contractapi.TransactionContextInterface, practitionerID string) (string, error) {
	practitionerJSON, err := ctx.GetStub().GetState(practitionerID)
	if err != nil {
		return `{"error": "failed to read practitioner: ` + err.Error() + `"}`, err
	}
	if practitionerJSON == nil {
		return `{"error": "practitioner does not exist: ` + practitionerID + `"}`, errors.New("practitioner does not exist")
	}

	log.Printf("Practitioner JSON from ledger: %s", string(practitionerJSON))

	var practitioner Practitioner
	err = json.Unmarshal(practitionerJSON, &practitioner)
	if err != nil {
		return `{"error": "failed to unmarshal practitioner: ` + err.Error() + `"}`, err
	}

	log.Printf("Practitioner object: %+v", practitioner)

	return string(practitionerJSON), nil
}

// UpdatePractitioner updates an existing practitioner record in the ledger
func (c *PractitionerContract) UpdatePractitioner(ctx contractapi.TransactionContextInterface, practitionerID string, practitionerJSON string) (string, error) {
	exists, err := ctx.GetStub().GetState(practitionerID)
	if err != nil {
		return `{"error": "failed to get practitioner: ` + err.Error() + `"}`, err
	}
	if exists == nil {
		return `{"error": "practitioner does not exist: ` + practitionerID + `"}`, errors.New("practitioner does not exist")
	}

	var practitioner Practitioner
	err = json.Unmarshal([]byte(practitionerJSON), &practitioner)
	if err != nil {
		return `{"error": "failed to unmarshal practitioner: ` + err.Error() + `"}`, err
	}

	practitionerJSONBytes, err := json.Marshal(practitioner)
	if err != nil {
		return `{"error": "failed to marshal practitioner: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(practitionerID, practitionerJSONBytes)
	if err != nil {
		return `{"error": "failed to update practitioner: ` + err.Error() + `"}`, err
	}

	return `{"message": "Practitioner updated successfully"}`, nil
}

// DeletePractitioner removes a practitioner record from the ledger
func (c *PractitionerContract) DeletePractitioner(ctx contractapi.TransactionContextInterface, practitionerID string) (string, error) {
	exists, err := ctx.GetStub().GetState(practitionerID)
	if err != nil {
		return `{"error": "failed to get practitioner: ` + err.Error() + `"}`, err
	}
	if exists == nil {
		return `{"error": "practitioner does not exist: ` + practitionerID + `"}`, errors.New("practitioner does not exist")
	}

	err = ctx.GetStub().DelState(practitionerID)
	if err != nil {
		return `{"error": "failed to delete practitioner: ` + err.Error() + `"}`, err
	}

	return `{"message": "Practitioner deleted successfully"}`, nil
}

// ReadAnnotation retrieves an annotation record from the ledger
func (c *PractitionerContract) ReadAnnotation(ctx contractapi.TransactionContextInterface, procedureID string, annotationIndex int) (string, error) {
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return `{"error": "failed to read procedure: ` + err.Error() + `"}`, err
	}
	if procedureJSON == nil {
		return `{"error": "procedure does not exist: ` + procedureID + `"}`, errors.New("procedure does not exist")
	}

	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return `{"error": "failed to unmarshal procedure: ` + err.Error() + `"}`, err
	}

	if annotationIndex < 0 || annotationIndex >= len(procedure.Note) {
		return `{"error": "invalid annotation index"}`, errors.New("invalid annotation index")
	}

	annotationJSON, err := json.Marshal(procedure.Note[annotationIndex])
	if err != nil {
		return `{"error": "failed to marshal annotation: ` + err.Error() + `"}`, err
	}

	return string(annotationJSON), nil
}

// UpdateAnnotation updates an existing annotation record in the ledger
func (c *PractitionerContract) UpdateAnnotation(ctx contractapi.TransactionContextInterface, procedureID string, annotationIndex int, annotationJSON string) (string, error) {
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return `{"error": "failed to read procedure: ` + err.Error() + `"}`, err
	}
	if procedureJSON == nil {
		return `{"error": "procedure does not exist: ` + procedureID + `"}`, errors.New("procedure does not exist")
	}

	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return `{"error": "failed to unmarshal procedure: ` + err.Error() + `"}`, err
	}

	if annotationIndex < 0 || annotationIndex >= len(procedure.Note) {
		return `{"error": "invalid annotation index"}`, errors.New("invalid annotation index")
	}

	var updatedAnnotation Annotation
	err = json.Unmarshal([]byte(annotationJSON), &updatedAnnotation)
	if err != nil {
		return `{"error": "failed to unmarshal updated annotation: ` + err.Error() + `"}`, err
	}

	procedure.Note[annotationIndex] = updatedAnnotation

	updatedProcedureJSON, err := json.Marshal(procedure)
	if err != nil {
		return `{"error": "failed to marshal updated procedure: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(procedureID, updatedProcedureJSON)
	if err != nil {
		return `{"error": "failed to update procedure: ` + err.Error() + `"}`, err
	}

	return `{"message": "Annotation updated successfully"}`, nil
}

// DeleteAnnotation removes an annotation record from the ledger
func (c *PractitionerContract) DeleteAnnotation(ctx contractapi.TransactionContextInterface, procedureID string, annotationIndex int) (string, error) {
	procedureJSON, err := ctx.GetStub().GetState(procedureID)
	if err != nil {
		return `{"error": "failed to read procedure: ` + err.Error() + `"}`, err
	}
	if procedureJSON == nil {
		return `{"error": "procedure does not exist: ` + procedureID + `"}`, errors.New("procedure does not exist")
	}

	var procedure Procedure
	err = json.Unmarshal(procedureJSON, &procedure)
	if err != nil {
		return `{"error": "failed to unmarshal procedure: ` + err.Error() + `"}`, err
	}

	if annotationIndex < 0 || annotationIndex >= len(procedure.Note) {
		return `{"error": "invalid annotation index"}`, errors.New("invalid annotation index")
	}

	procedure.Note = append(procedure.Note[:annotationIndex], procedure.Note[annotationIndex+1:]...)

	updatedProcedureJSON, err := json.Marshal(procedure)
	if err != nil {
		return `{"error": "failed to marshal updated procedure: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState(procedureID, updatedProcedureJSON)
	if err != nil {
		return `{"error": "failed to update procedure: ` + err.Error() + `"}`, err
	}

	return `{"message": "Annotation deleted successfully"}`, nil
}

func (c *PractitionerContract) GrantAccess(ctx contractapi.TransactionContextInterface, patientID string, practitionerID string) (string, error) {
	// Recupera la lista dei pazienti seguiti dal practitioner
	followedPatientsAsBytes, err := ctx.GetStub().GetState("followedPatients_" + practitionerID)
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

	// Aggiungi il paziente alla mappa
	followedPatients.Patients[patientID] = true

	// Aggiorna lo stato nel ledger
	updatedFollowedPatientsAsBytes, err := json.Marshal(followedPatients)
	if err != nil {
		return `{"error": "failed to marshal followed patients: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState("followedPatients_"+practitionerID, updatedFollowedPatientsAsBytes)
	if err != nil {
		return `{"error": "failed to put state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Access granted"}`, nil
}

func (c *PractitionerContract) GetFollowedPatients(ctx contractapi.TransactionContextInterface, practitionerID string) ([]string, error) {
	followedPatientsAsBytes, err := ctx.GetStub().GetState("followedPatients_" + practitionerID)
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

	// Estrai la lista dei patientID
	patientIDs := make([]string, 0, len(followedPatients.Patients))
	for patientID := range followedPatients.Patients {
		patientIDs = append(patientIDs, patientID)
	}

	return patientIDs, nil
}

func (c *PractitionerContract) RevokeAccess(ctx contractapi.TransactionContextInterface, patientID string, practitionerID string) (string, error) {
	// Recupera la lista dei pazienti seguiti dal practitioner
	followedPatientsAsBytes, err := ctx.GetStub().GetState("followedPatients_" + practitionerID)
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

	// Rimuovi il paziente dalla mappa
	delete(followedPatients.Patients, patientID)

	// Aggiorna lo stato nel ledger
	updatedFollowedPatientsAsBytes, err := json.Marshal(followedPatients)
	if err != nil {
		return `{"error": "failed to marshal followed patients: ` + err.Error() + `"}`, err
	}

	err = ctx.GetStub().PutState("followedPatients_"+practitionerID, updatedFollowedPatientsAsBytes)
	if err != nil {
		return `{"error": "failed to put state: ` + err.Error() + `"}`, err
	}

	return `{"message": "Access revoked"}`, nil
}

// SearchPractitioners allows searching for practitioners based on a query string
func (c *PractitionerContract) SearchPractitioners(ctx contractapi.TransactionContextInterface, queryString string) (string, error) {
	log.Printf("Executing query: %s", queryString)

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return `{"error": "failed to execute query: ` + err.Error() + `"}`, err
	}
	defer resultsIterator.Close()

	var practitioners []Practitioner
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return `{"error": "failed to iterate query results: ` + err.Error() + `"}`, err
		}

		var practitioner Practitioner
		err = json.Unmarshal(queryResponse.Value, &practitioner)
		if err != nil {
			return `{"error": "failed to unmarshal query response: ` + err.Error() + `"}`, err
		}
		practitioners = append(practitioners, practitioner)
	}

	resultsJSON, err := json.Marshal(practitioners)
	if err != nil {
		return `{"error": "failed to encode results to JSON: ` + err.Error() + `"}`, err
	}

	return string(resultsJSON), nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(new(PractitionerContract))
	if err != nil {
		log.Panic("error creating practitioner chaincode: ", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panic("error starting practitioner chaincode: ", err)
	}
}
