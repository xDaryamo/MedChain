package fhir

import (
	"encoding/base64"
	"time"
)

// Base struct for all resources
type Resource struct {
	ResourceType Code       `json:"resourceType"`
	ID           Identifier `json:"identifier,omitempty"`
	Meta         *Meta      `json:"meta,omitempty"`
}

// Metadata associated with a resource
type Meta struct {
	VersionID   Identifier `json:"identifier,omitempty"`
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

// Patient
type Patient struct {
	Resource             `json:",inline"`
	ID                   Identifier      `json:"identifier"`
	Active               bool            `json:"active,omitempty"`
	Name                 HumanName       `json:"name,omitempty"`
	Telecom              ContactPoint    `json:"telecom,omitempty"`
	Gender               Code            `json:"gender,omitempty"`
	BirthDate            Date            `json:"date,omitempty"`
	Deceased             bool            `json:"deceased,omitempty"`
	Address              Address         `json:"adress,omitempty"`
	MaritalStatus        CodeableConcept `json:"maritalstatus,omitempty"`
	MultipleBirth        []int           `json:"multiplebirth,omitempty"`
	Photo                Attachment      `json:"photo,omitempty"`
	Contact              []Contact       `json:"contact,omitempty"`
	Communication        []Communication `json:"commutication,omitempty"`
	GeneralPractitioner  *Reference      `json:"generalpractitioner,omitempty"`
	ManagingOrganization *Reference      `json:"managingorganization,omitempty"`
}

// ContactPoint
type ContactPoint struct {
	System Code   `json:"system,omitempty"`
	Value  string `json:"value,omitempty"`
	Use    Code   `json:"use,omitempty"`
	Rank   uint   `json:"rank,omitempty"`
	Period Period `json:"period,omitempty"`
}

// Address
type Address struct {
	Use        Code   `json:"use,omitempty"`
	Type       Code   `json:"type,omitempty"`
	Text       string `json:"text,omitempty"`
	Line       string `json:"line,omitempty"`
	City       string `json:"city,omitempty"`
	District   string `json:"district,omitempty"`
	State      string `json:"state,omitempty"`
	PostalCode string `json:"postalcode,omitempty"`
	Country    string `json:"country,omitempty"`
	Period     Period `json:"period,omitempty"`
}

// Attachment
type Attachment struct {
	ContentType Code            `json:"type,omitempty"`
	Language    Code            `json:"language,omitempty"`
	Data        base64.Encoding `json:"data,omitempty"`
	Url         string          `json:"url,omitempty"`
	Size        int64           `json:"size,omitempty"`
	Hash        base64.Encoding `json:"hash,omitempty"`
	Title       string          `json:"title,omitempty"`
	Creation    Date            `json:"creation,omitempty"`
	Height      uint64          `json:"height,omitempty"`
	Width       uint64          `json:"width,omitempty"`
	Frames      uint64          `json:"frames,omitempty"`
	Duration    float64         `json:"duration,omitempty"`
	Pages       uint64          `json:"pages,omitempty"`
}

// Contact
type Contact struct {
	Relationship CodeableConcept `json:"relationship,omitempty"`
	Name         HumanName       `json:"name,omitempty"`
	Telecom      ContactPoint    `json:"telecom,omitempty"`
	Address      Address         `json:"adress,omitempty"`
	Gender       Code            `json:"gender,omitempty"`
	Organization *Reference      `json:"organization,omitempty"`
	Period       Period          `json:"period,omitempty"`
}

// Communication
type Communication struct {
	Language  CodeableConcept `json:"language,omitempty"`
	Preferred bool            `json:"preferred,omitempty"`
}

// Organization
type Organization struct {
	Resource      `json:",inline"`
	ID            Identifier            `json:"identifier"`
	Active        bool                  `json:"active,omitempty"`
	Type          CodeableConcept       `json:"type,omitempty"`
	Name          string                `json:"name,omitempty"`
	Alias         string                `json:"alias,omitempty"`
	Description   string                `json:"description,omitempty"`
	Contact       ExtendedContactDetail `json:"contact,omitempty"`
	PartOf        *Reference            `json:"partof,omitempty"`
	EndPoint      *Reference            `json:"endpoint,omitempty"`
	Qualification []Qualification       `json:"qualification,omitempty"`
}

// Qualification
type Qualification struct {
	ID     Identifier      `json:"identifier"`
	Code   CodeableConcept `json:"code,omitempty"`
	Status CodeableConcept `json:"status,omitempty"`
	Period Period          `json:"period,omitempty"`
	Issuer *Reference      `json:"issuer,omitempty"`
}

// ExtendedContactDetail
type ExtendedContactDetail struct {
	Purpose      CodeableConcept `json:"purpose,omitempty"`
	Name         HumanName       `json:"name,omitempty"`
	Telecom      ContactPoint    `json:"telecom,omitempty"`
	Address      Address         `json:"adress,omitempty"`
	Organization *Reference      `json:"organization,omitempty"`
	Period       Period          `json:"period,omitempty"`
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
	Period Period   `json:"period,omitempty"`
}

// Encounter
type Encounter struct {
	Resource      `json:",inline"`
	ID            Identifier      `json:"identifier"`
	Status        Code            `json:"status,omitempty"`
	Priority      CodeableConcept `json:"priority,omitempty"`
	Type          CodeableConcept `json:"type,omitempty"`
	Subject       *Reference      `json:"subject,omitempty"`
	SubjectStatus CodeableConcept `json:"subjectstatus,omitempty"`
	Participant   []Reference     `json:"participant,omitempty"`
	Diagnosis     []Reference     `json:"diagnosis,omitempty"`
	Performed     Instant         `json:"performed,omitempty"`
	Reason        CodeableConcept `json:"reason,omitempty"`
	Location      []Location      `json:"location,omitempty"`
	Admission     []Admission     `json:"admission,omitempty"`
}

// Diagnosis
type Diagnosis struct {
	Condition *Reference      `json:"condition,omitempty"`
	Use       CodeableConcept `json:"use,omitempty"`
}

// Location
type Location struct {
	ID                   Identifier            `json:"identifier"`
	Status               Code                  `json:"status,omitempty"`
	Name                 string                `json:"name,omitempty"`
	Alias                string                `json:"alias,omitempty"`
	Description          string                `json:"description,omitempty"`
	Type                 CodeableConcept       `json:"type,omitempty"`
	Mode                 Code                  `json:"mode,omitempty"`
	Contact              ExtendedContactDetail `json:"contact,omitempty"`
	Address              Address               `json:"address,omitempty"`
	ManagingOrganization *Reference            `json:"managedby,omitempty"`
	HoursOfOperation     Availability          `json:"available,omitempty"`
}

// Availability
type Availability struct {
	Period         Period        `json:"period,omitempty"`
	DaysOfWeek     []Code        `json:"days,omitempty"`
	AllDay         bool          `json:"allday,omitempty"`
	StartTime      time.Duration `json:"start,omitempty"`
	EndTime        time.Duration `json:"end,omitempty"`
	Unavailability Period        `json:"unavailability,omitempty"`
}

// Admission
type Admission struct {
	ID                   Identifier      `json:"identifier"`
	Origin               *Reference      `json:"origin,omitempty"`
	Destination          *Reference      `json:"destination,omitempty"`
	DischargeDisposition CodeableConcept `json:"discharge,omitempty"`
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
	ID            Identifier      `json:"identifier"`
	Active        bool            `json:"active,omitempty"`
	Name          []HumanName     `json:"name,omitempty"`
	Telecom       ContactPoint    `json:"telecom,omitempty"`
	Gender        Code            `json:"gender,omitempty"`
	BirthDate     Date            `json:"date,omitempty"`
	Deceased      bool            `json:"deceased,omitempty"`
	Address       Address         `json:"adress,omitempty"`
	Photo         Attachment      `json:"photo,omitempty"`
	Qualification []Qualification `json:"qualification,omitempty"`
	Communication []Communication `json:"communication,omitempty"`
}

// AllergyIntolerance
type AllergyIntolerance struct {
	Resource           `json:",inline"`
	ID                 Identifier          `json:"identifier"`
	ClinicalStatus     CodeableConcept     `json:"clinicalStatus,omitempty"`
	VerificationStatus CodeableConcept     `json:"verificationStatus,omitempty"`
	Type               string              `json:"type,omitempty"`        // "allergy" | "intolerance"
	Category           []string            `json:"category,omitempty"`    // ["food", "medication", "environment", "biologic"]
	Criticality        string              `json:"criticality,omitempty"` // "low", "high", "unable-to-assess"
	Patient            *Reference          `json:"patient,omitempty"`
	Code               CodeableConcept     `json:"code,omitempty"`
	Reaction           []ReactionComponent `json:"reaction,omitempty"`
}

// ReactionComponent represents detailed information about a patient's reaction to a substance
type ReactionComponent struct {
	Substance     CodeableConcept   `json:"substance,omitempty"` // What caused the reaction
	Manifestation []CodeableConcept `json:"manifestation"`       // Clinical symptoms/signs associated with the event
	Severity      string            `json:"severity,omitempty"`  // "mild" | "moderate" | "severe"
	ExposureRoute CodeableConcept   `json:"exposureRoute,omitempty"`
	Note          []Annotation      `json:"note,omitempty"`
}

// Annotation is a text note which also contains optional reference to the source of the annotation.
type Annotation struct {
	AuthorReference *Reference `json:"authorReference,omitempty"` // Who made the annotation.
	AuthorString    string     `json:"authorString,omitempty"`    // Who made the annotation in string form.
	Time            Instant    `json:"time,omitempty"`            // When the annotation was made.
	Text            string     `json:"text"`                      // The text of the annotation.
}

// Observation
type Observation struct {
	Resource       `json:",inline"`
	ID             Identifier        `json:"identifier"`
	Subject        *Reference        `json:"subject,omitempty"`
	Code           CodeableConcept   `json:"code,omitempty"`
	Status         Code              `json:"status,omitempty"`
	Category       CodeableConcept   `json:"category,omitempty"` // Type of observation performed
	Value          []CodeableConcept `json:"value,omitempty"`
	Onset          Instant           `json:"onset,omitempty"`
	TriggeredBy    *Reference        `json:"triggeredby,omitempty"`
	PartOf         *Reference        `json:"partof,omitempty"`
	Encounter      *Reference        `json:"encounter,omitempty"`
	Issued         Instant           `json:"issued,omitempty"`
	Performer      *Reference        `json:"performer,omitempty"`
	Interpretation CodeableConcept   `json:"interpretation,omitempty"`
	Note           []Annotation      `json:"note,omitempty"`
	Method         CodeableConcept   `json:"method,omitempty"`
}

// Procedure
type Procedure struct {
	Resource          `json:",inline"`
	ID                Identifier      `json:"identifier"`
	Subject           *Reference      `json:"subject,omitempty"`
	Code              CodeableConcept `json:"code,omitempty"`
	Status            Code            `json:"status,omitempty"`
	Category          CodeableConcept `json:"category,omitempty"`
	Performer         *Reference      `json:"performed,omitempty"`
	PartOf            *Reference      `json:"contained,omitempty"`
	BasedOn           *Reference      `json:"basedon,omitempty"`
	Reason            CodeableConcept `json:"reason,omitempty"`
	Encounter         *Reference      `json:"encounter,omitempty"`
	Note              []Annotation    `json:"note,omitempty"`
	Reported          bool            `json:"reported,omitempty"`
	ReportedReference *Reference      `json:"reportedby,omitempty"`
}

// Immunization
type Immunization struct {
	Resource            `json:",inline"`
	ID                  Identifier          `json:"identifier"`
	Patient             *Reference          `json:"patient,omitempty"`
	VaccineCode         CodeableConcept     `json:"vaccineCode,omitempty"`
	Occurrence          Instant             `json:"occurrence,omitempty"`
	Location            *Reference          `json:"location,omitempty"`
	Status              Code                `json:"status,omitempty"`
	Reason              CodeableConcept     `json:"reason,omitempty"`
	Manufacturer        Organization        `json:"manufacturer,omitempty"`
	LotNumber           string              `json:"lotnumber,omitempty"`
	ExpirationDate      Date                `json:"expiration,omitempty"`
	Encounter           *Reference          `json:"encounter,omitempty"`
	AdministeredProduct MedicationStatement `json:"product,omitempty"`
	Site                CodeableConcept     `json:"site,omitempty"`
	Note                []Annotation        `json:"note,omitempty"`
	Reaction            []ReactionComponent `json:"reaction,omitempty"`
}

// Condition
type Condition struct {
	Resource           `json:",inline"`    // Inherit ID, Meta, etc. from base Resource.
	ID                 Identifier          `json:"id"`                           // Unique identifier for the condition instance.
	ClinicalStatus     CodeableConcept     `json:"clinicalStatus,omitempty"`     // The clinical status of the condition (active, remission, resolved, etc.).
	VerificationStatus CodeableConcept     `json:"verificationStatus,omitempty"` // Indicates whether the condition is confirmed, differential, provisional, or refuted.
	Category           []CodeableConcept   `json:"category,omitempty"`           // Categorizes the condition for searching, sorting, and display purposes (problem-list-item, encounter-diagnosis).
	Severity           CodeableConcept     `json:"severity,omitempty"`           // A subjective assessment of the severity of the condition as observed by the clinician.
	Code               []CodeableConcept   `json:"code,omitempty"`               // Identification of the condition, problem or diagnosis through codes (e.g., SNOMED CT).
	Subject            *Reference          `json:"subject,omitempty"`            // Who the condition is about (the patient).
	OnsetDateTime      string              `json:"onsetDateTime,omitempty"`      // The estimated or actual date the condition began, in a specific patient.
	AbatementDateTime  string              `json:"abatementDateTime,omitempty"`  // The date on which the condition significantly improved or was resolved.
	RecordedDate       string              `json:"recordedDate,omitempty"`       // Date and time the condition was first recorded.
	Recorder           *Reference          `json:"recorder,omitempty"`           // Who recorded the condition (e.g., a clinician).
	Asserter           *Reference          `json:"asserter,omitempty"`           // Individual who is making the condition statement.
	Evidence           []ConditionEvidence `json:"evidence,omitempty"`           // Supporting evidence / manifestations that are the basis of the Condition's verification status, such as symptoms, signs, diagnostic tests, etc.
}

type ConditionEvidence struct {
	Code   CodeableConcept `json:"code,omitempty"`   // A manifestation or symptom that led to the recording of this condition.
	Detail []Reference     `json:"detail,omitempty"` // Links to other relevant information, including diagnostic reports, observations documenting symptoms, or other conditions that are due to the same underlying cause.
}

// MedicationStatement represents information about medication that is being consumed by a patient.
type MedicationStatement struct {
	Resource                  `json:",inline"`  // Inherits the common fields from Resource, such as ID and Meta.
	ID                        string            `json:"id"`                                  // Unique identifier for this particular MedicationStatement.
	Status                    string            `json:"status"`                              // Medication status (active, completed, entered-in-error, intended, stopped, on-hold).
	MedicationCodeableConcept CodeableConcept   `json:"medicationCodeableConcept,omitempty"` // Identifies the medication being administered. This should be a codified drug name.
	Subject                   *Reference        `json:"subject"`                             // The patient or group who is taking the medication.
	Context                   *Reference        `json:"context,omitempty"`                   // The encounter or episode of care that establishes the context for this MedicationStatement.
	EffectiveDateTime         string            `json:"effectiveDateTime,omitempty"`         // The date/time when the medication was taken.
	EffectivePeriod           Period            `json:"effectivePeriod,omitempty"`           // The period over which the medication was taken.
	DateAsserted              string            `json:"dateAsserted,omitempty"`              // The date when the medication statement was asserted by the information source.
	InformationSource         *Reference        `json:"informationSource,omitempty"`         // The person or organization that provided the information about the taking of this medication.
	ReasonCode                []CodeableConcept `json:"reasonCode,omitempty"`                // Reason for why the medication is being/was taken.
	Dosage                    []Dosage          `json:"dosage,omitempty"`                    // Details of how the medication was taken.
}

// Dosage represents how the medication is/was taken or should be taken by the patient.
type Dosage struct {
	Text         string          `json:"text,omitempty"`         // Free text dosage instructions e.g. "Take one tablet daily".
	Timing       Timing          `json:"timing,omitempty"`       // When the medication should be taken.
	Route        CodeableConcept `json:"route,omitempty"`        // How the medication enters the body, e.g., oral, injection.
	DoseQuantity Quantity        `json:"doseQuantity,omitempty"` // The amount of medication taken at one time.
}

// Timing represents the timing of medication intake.
type Timing struct {
	Repeat Repeat `json:"repeat,omitempty"` // Codified representation of the schedule.
}

// Repeat defines frequency and duration of the medication intake.
type Repeat struct {
	Frequency  int     `json:"frequency,omitempty"`  // The number of times the medication is to be taken every.
	Period     float64 `json:"period,omitempty"`     // The period over which the medication is to be taken.
	PeriodUnit string  `json:"periodUnit,omitempty"` // The unit of time for the period, e.g., days, weeks, months.
}

// Insurance
type Insurance struct {
	Resource     `json:",inline"`
	ID           Identifier      `json:"identifier"`
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
	ID          Identifier    `json:"identifier"`
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
