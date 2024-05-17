package main

import (
	"time"
)

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

// Ratio represents a relationship between two quantities.
type Ratio struct {
	Numerator   *Quantity `json:"numerator"`   // The value of the numerator
	Denominator *Quantity `json:"denominator"` // The value of the denominator
}

// Annotation represents a comment or explanatory note
type Annotation struct {
	AuthorReference *Reference `json:"authorReference,omitempty"` // Reference to who made the note
	AuthorString    string     `json:"authorString,omitempty"`    // String identifying who made the note
	Time            *time.Time  `json:"time,omitempty"`            // Time the note was made
	Text            string     `json:"text"`                      // The content of the note
}

// Range specifies a range of values
type Range struct {
	Low  *Quantity `json:"low,omitempty"`  // Low limit
	High *Quantity `json:"high,omitempty"` // High limit
}

// ObservationComponent represents a component of the observation
type ObservationComponent struct {
	Code                 *CodeableConcept   `json:"code"`                           // Describes what was observed
	ValueQuantity        *Quantity          `json:"valueQuantity,omitempty"`        // The result of the component
	ValueCodeableConcept *CodeableConcept   `json:"valueCodeableConcept,omitempty"` // The result of the component
	ValueString          string            `json:"valueString,omitempty"`          // The result of the component
	ValueBoolean         bool              `json:"valueBoolean,omitempty"`         // The result of the component
	ValueInteger         int               `json:"valueInteger,omitempty"`         // The result of the component
	ValueRange           *Range             `json:"valueRange,omitempty"`           // The result of the component
	ValueRatio           *Ratio             `json:"valueRatio,omitempty"`           // The result of the component
	Interpretation       []CodeableConcept `json:"interpretation,omitempty"`       // Interpretation of the component
}

// Observation represents measurements or simple assertions made about a patient
type Observation struct {
	ID              string                 `json:"id"`                        // Unique identifier for this Observation
	Status          string                 `json:"status"`                    // The status of the observation (registered | preliminary | final | amended +)
	Category        []CodeableConcept      `json:"category,omitempty"`        // Classification of the observation (e.g., laboratory, vital signs)
	Code            *CodeableConcept        `json:"code"`                      // Describes what was observed
	Subject         *Reference             `json:"subject"`                   // Who and/or what the observation is about
	Encounter       *Reference             `json:"encounter,omitempty"`       // The healthcare event (e.g., a patient encounter) during which the observation was made
	EffectivePeriod *Period                 `json:"effectivePeriod,omitempty"` // A period of time during which the observation was made
	Issued          *time.Time              `json:"issued,omitempty"`          // The date and time this observation was made available
	Performer       []Reference            `json:"performer,omitempty"`       // Who made the observation
	Interpretation  []CodeableConcept      `json:"interpretation,omitempty"`  // High-level interpretation of observation
	Note            []Annotation           `json:"note,omitempty"`            // Comments about the observation
	Component       []ObservationComponent `json:"component,omitempty"`       // Provides a specific result
}
