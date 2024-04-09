package fhir

// Base struct for all resources
type Resource struct {
	ResourceType Code   `json:"resourceType"`
	ID           string `json:"id,omitempty"`
	Meta         *Meta  `json:"meta,omitempty"`
}

// Metadata associated with a resource
type Meta struct {
	VersionID   string     `json:"versionId,omitempty"`
	LastUpdated Instant    `json:"lastUpdated,omitempty"`
	Source      *Reference `json:"source,omitempty"`
}

// Coded value
type Code struct {
	Coding []Coding `json:"coding"`
}

// Reference to a coding system
type Coding struct {
	System  string `json:"system,omitempty"`  // The coding system (LOINC, SNOMED CT)
	Code    string `json:"code,omitempty"`    // The code within the system
	Display string `json:"display,omitempty"` // Human-readable representation of the code
}

// Concept with optional coding
type CodeableConcept struct {
	Coding []Coding `json:"coding,omitempty"`
	Text   string   `json:"text,omitempty"`
}

// Reference to another resource
type Reference struct {
	Reference string `json:"reference,omitempty"`
}

// Identifier for a resource
type Identifier struct {
	System string          `json:"system,omitempty"`
	Value  string          `json:"value,omitempty"`
	Period Period          `json:"period,omitempty"`
	Type   CodeableConcept `json:"type,omitempty"`
}

// Time range
type Period struct {
	Start Instant `json:"start,omitempty"`
	End   Instant `json:"end,omitempty"`
}

// Instant point in time
type Instant string

// Date without time
type Date string

// Human Name
type HumanName struct {
	Text   string   `json:"text,omitempty"`
	Family string   `json:"family,omitempty"`
	Given  []string `json:"given,omitempty"`
	Prefix []string `json:"prefix,omitempty"`
	Suffix []string `json:"suffix,omitempty"`
	Period *Period  `json:"period,omitempty"`
}

// Medication
type Medication struct {
	Resource     `json:",inline"`
	ID           string          `json:"id"`
	Code         CodeableConcept `json:"code,omitempty"`
	Product      *Reference      `json:"product,omitempty"`
	Subject      *Reference      `json:"subject,omitempty"`
	DoseQuantity Quantity        `json:"doseQuantity,omitempty"`
	//(route, dosageInstruction)
}

// Encounter
type Encounter struct {
	Resource    `json:",inline"`
	ID          string      `json:"id"`
	Subject     *Reference  `json:"subject,omitempty"`
	Participant []Reference `json:"participant,omitempty"`
	ReasonCode  []Coding    `json:"reasonCode,omitempty"`
	Diagnosis   []Reference `json:"diagnosis,omitempty"`
	Performed   Instant     `json:"performed,omitempty"`
	//(type, location, status)
}

// Diagnosis
type Diagnosis struct {
	Resource           `json:",inline"`
	ID                 string          `json:"id"`
	Subject            *Reference      `json:"subject,omitempty"`
	Code               CodeableConcept `json:"code,omitempty"`
	VerificationStatus Coding          `json:"verificationStatus"`
	OnsetInstant       Instant         `json:"onsetInstant,omitempty"`
	//(clinicalStatus, category)
}

// Quantity
type Quantity struct {
	Value  float64 `json:"value,omitempty"`
	Unit   string  `json:"unit,omitempty"`
	System string  `json:"system,omitempty"`
}

// Practitioner
type Practitioner struct {
	Resource      `json:",inline"`
	ID            string            `json:"id"`
	Name          []HumanName       `json:"name,omitempty"`
	Qualification []Reference       `json:"qualification,omitempty"`
	Communication []CodeableConcept `json:"communication,omitempty"`
}

// AllergyIntolerance
type AllergyIntolerance struct {
	Resource `json:",inline"`
	ID       string          `json:"id"`
	Patient  *Reference      `json:"patient,omitempty"`
	Code     CodeableConcept `json:"code,omitempty"` // Substance causing the allergy/intolerance
	Reaction []string        `json:"reaction,omitempty"`
	Onset    Instant         `json:"onset,omitempty"`
	Severity Coding          `json:"severity,omitempty"`
}

// Observation
type Observation struct {
	Resource      `json:",inline"`
	ID            string          `json:"id"`
	Subject       *Reference      `json:"subject,omitempty"`
	Code          CodeableConcept `json:"code,omitempty"` // Type of observation performed
	ValueQuantity Quantity        `json:"valueQuantity,omitempty"`
	Onset         Instant         `json:"onset,omitempty"`
	//(method, performer, interpretation)
}

// Procedure
type Procedure struct {
	Resource  `json:",inline"`
	ID        string          `json:"id"`
	Subject   *Reference      `json:"subject,omitempty"`
	Code      CodeableConcept `json:"code,omitempty"` // Type of procedure performed
	Performer *Reference      `json:"performed,omitempty"`
	Contained *Reference      `json:"contained,omitempty"` // Encounter/document the procedure is part of
	//(location, bodySite, outcome)
}

// Immunization
type Immunization struct {
	Resource    `json:",inline"`
	ID          string          `json:"id"`
	Patient     *Reference      `json:"patient,omitempty"`
	VaccineCode CodeableConcept `json:"vaccineCode,omitempty"`
	Occurrence  Instant         `json:"occurrence,omitempty"`
	Location    *Reference      `json:"location,omitempty"`
	//(manufacturer, lot number)
}

// Condition (more general than Diagnosis)
type Condition struct {
	Resource           `json:",inline"`
	ID                 string            `json:"id"`
	Subject            *Reference        `json:"subject,omitempty"`
	Code               []CodeableConcept `json:"code,omitempty"` // Diagnosis codes (SNOMED CT)
	VerificationStatus Coding            `json:"verificationStatus,omitempty"`
}

// Insurance
type Insurance struct {
	Resource     `json:",inline"`
	ID           string          `json:"id"`
	Status       Coding          `json:"status,omitempty"`
	Type         CodeableConcept `json:"type,omitempty"`
	Subject      *Reference      `json:"subject,omitempty"`
	SubscriberID []Identifier    `json:"subscriberId,omitempty"`
	Plan         *Reference      `json:"plan,omitempty"`
	Payor        []Reference     `json:"payor,omitempty"`
	Beneficiary  *Reference      `json:"beneficiary,omitempty"`
	Relationship *Reference      `json:"relationship,omitempty"`
	Period       Period          `json:"period,omitempty"`
}

// Appointment
type Appointment struct {
	Resource    `json:",inline"`
	ID          string        `json:"id"`
	Status      Coding        `json:"status,omitempty"`
	Subject     *Reference    `json:"subject,omitempty"`
	Participant []Participant `json:"participant,omitempty"`
	Start       Instant       `json:"start,omitempty"`
	End         Instant       `json:"end,omitempty"`
	Booked      Instant       `json:"booked,omitempty"`
}

// Participant
type Participant struct {
	Type     CodeableConcept `json:"type,omitempty"`
	Actor    *Reference      `json:"actor,omitempty"`
	Required bool            `json:"required,omitempty"`
	Status   Coding          `json:"status,omitempty"`
}
