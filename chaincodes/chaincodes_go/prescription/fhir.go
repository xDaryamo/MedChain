package main

import (
	"time"
)

// Identifier is used to identify a specific instance of a resource
type Identifier struct {
	System string `json:"system,omitempty"` // The namespace for the identifier
	Value  string `json:"value,omitempty"`  // The value of the identifier
}

// Code represents a coded value following a coding system like LOINC or SNOMED CT
type Code struct {
	Coding []Coding `json:"coding"` // A reference to a code defined by a terminology system
}

// Coding provides reference information to a coding system and a code within that system
type Coding struct {
	System  string `json:"system,omitempty"`  // The identification of the code system that defines the meaning of the symbol in the code
	Code    string `json:"code,omitempty"`    // The symbol in syntax defined by the system.
	Display string `json:"display,omitempty"` // The representation of the code that can be displayed to a human
}

// CodeableConcept provides a text description and optional coding for the concept
type CodeableConcept struct {
	Coding []Coding `json:"coding,omitempty"` // A reference to a code defined by a terminology system
	Text   string   `json:"text,omitempty"`   // A human language representation of the concept as seen/selected/uttered by the user who entered the data
}

// Reference is a reference from one resource to another
type Reference struct {
	Reference string `json:"reference,omitempty"` // A reference to a location at which the other resource is found
	Display   string `json:"display,omitempty"`
}

// Period represents a start and an end time
type Period struct {
	Start *time.Time `json:"start,omitempty"` // The start of the period
	End   *time.Time `json:"end,omitempty"`   // The end of the period
}

// Quantity represents the amount of medication.
type Quantity struct {
	Value  float64 `json:"value"`            // The numeric value of the quantity.
	Unit   string  `json:"unit,omitempty"`   // The unit of measurement for the quantity, e.g., mg for milligrams.
	System string  `json:"system,omitempty"` // The system that the unit is derived from.
}

// Dosage represents how the medication is/was taken or should be taken by the patient
type Dosage struct {
	Text         string          `json:"text,omitempty"`         // Free text dosage instructions e.g. "Take one tablet daily"
	Timing       *Timing          `json:"timing,omitempty"`       // When the medication should be taken
	Route        *CodeableConcept `json:"route,omitempty"`        // How the medication enters the body, e.g., oral, injection
	DoseQuantity *Quantity        `json:"doseQuantity,omitempty"` // The amount of medication taken at one time
}

// Timing represents the timing of medication intake
type Timing struct {
	Repeat *Repeat `json:"repeat,omitempty"` // Codified representation of the schedule
}

// Repeat defines frequency and duration of the medication intake
type Repeat struct {
	Frequency  int     `json:"frequency,omitempty"`  // The number of times the medication is to be taken every
	Period     float64 `json:"period,omitempty"`     // The period over which the medication is to be taken
	PeriodUnit string  `json:"periodUnit,omitempty"` // The unit of time for the period, e.g., days, weeks, months
}

// DispenseRequest contains details about the dispensing of a prescribed medication
type DispenseRequest struct {
	ValidityPeriod         *Period     `json:"validityPeriod,omitempty"`         // The period during which the prescription is valid
	NumberOfRepeatsAllowed int        `json:"numberOfRepeatsAllowed,omitempty"` // The number of times the medication can be dispensed
	Quantity               *Quantity   `json:"quantity,omitempty"`               // The quantity of medication to dispense
	ExpectedSupplyDuration *Duration   `json:"expectedSupplyDuration,omitempty"` // The expected duration for which the supplied medication should last
	Performer              *Reference `json:"performer,omitempty"`              // The designated pharmacy to dispense the medication
}

// Duration represents a length of time
type Duration struct {
	Value  float64 `json:"value"`            // The numeric value of the duration
	Unit   string  `json:"unit,omitempty"`   // The unit of measurement for the duration, e.g., days, weeks
	System string  `json:"system,omitempty"` // The system that the unit is derived from
}

// MedicationRequest represents a request for prescribing medication to a patient
type MedicationRequest struct {
	ID                        *Identifier       `json:"identifier"`                  // Unique identifier for this medication request
	Status                    *Code             `json:"status"`                      // The status of the prescription (e.g., active, cancelled, completed)
	Intent                    *Code             `json:"intent"`                      // The intention behind the prescription order (e.g., order, proposal, plan)
	MedicationCodeableConcept *CodeableConcept  `json:"medicationCodeableConcept"`   // The medication to be prescribed
	Subject                   *Reference       `json:"subject"`                     // The patient to whom the medication is prescribed
	Encounter                 *Reference       `json:"encounter,omitempty"`         // The encounter during which the prescription was made
	AuthoredOn                *time.Time        `json:"authoredOn,omitempty"`        // The date and time when the prescription was authored
	Requester                 *Reference       `json:"requester,omitempty"`         // The healthcare professional who requested the prescription
	DosageInstruction         []Dosage         `json:"dosageInstruction,omitempty"` // Instructions for dosing of the medication
	DispenseRequest           *DispenseRequest `json:"dispenseRequest,omitempty"`   // Details on how the medication should be dispensed to the patient
}
