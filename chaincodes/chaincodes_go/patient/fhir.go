package patient

import (
	"encoding/base64"
	"time"
)

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

// Identifier is used to identify a specific instance of a resource
type Identifier struct {
	System string `json:"system,omitempty"` // The namespace for the identifier
	Value  string `json:"value,omitempty"`  // The value of the identifier
}

// Patient represents a person receiving care or other health-related services
type Patient struct {
	ID                   Identifier      `json:"identifier"`                     // Unique identifier for individuals receiving care
	Active               bool            `json:"active,omitempty"`               // Whether the patient's record is in active use
	Name                 HumanName       `json:"name,omitempty"`                 // A name associated with the patient
	Telecom              []ContactPoint  `json:"telecom,omitempty"`              // A contact detail for the individual
	Gender               Code            `json:"gender,omitempty"`               // Gender of the patient
	BirthDate            time.Time       `json:"date,omitempty"`                 // The birth date for the patient
	Deceased             bool            `json:"deceased,omitempty"`             // Indicates if the patient is deceased
	Address              []Address       `json:"address,omitempty"`              // Addresses for the individual
	MaritalStatus        CodeableConcept `json:"maritalstatus,omitempty"`        // Marital (civil) status of a patient
	MultipleBirth        []int           `json:"multiplebirth,omitempty"`        // Indicates if the patient is part of a multiple birth
	Photo                Attachment      `json:"photo,omitempty"`                // Image of the patient
	Contact              []Contact       `json:"contact,omitempty"`              // A contact party (e.g., guardian, partner, friend) for the patient
	Communication        []Communication `json:"commutication,omitempty"`        // A list of Languages which may be used to communicate with the patient
	GeneralPractitioner  *Reference      `json:"generalpractitioner,omitempty"`  // Patient's primary care provider
	ManagingOrganization *Reference      `json:"managingorganization,omitempty"` // Organization that is the custodian of the patient record
}

// ContactPoint specifies contact information for a person or organization
type ContactPoint struct {
	System Code   `json:"system,omitempty"` // The system for the contact point, e.g., phone, email
	Value  string `json:"value,omitempty"`  // The actual contact point details
	Use    Code   `json:"use,omitempty"`    // The use of the contact point (e.g., home, work)
	Rank   uint   `json:"rank,omitempty"`   // Specifies a preference order for the contact points
	Period Period `json:"period,omitempty"` // The period during which the contact point is valid
}

// Address represents an address expressed using postal conventions
type Address struct {
	Use        Code   `json:"use,omitempty"`        // The use of the address (e.g., home, work)
	Type       Code   `json:"type,omitempty"`       // The type of address (e.g., postal, physical)
	Text       string `json:"text,omitempty"`       // A full text representation of the address
	Line       string `json:"line,omitempty"`       // Address line details (e.g., street, PO Box)
	City       string `json:"city,omitempty"`       // The city name.
	State      string `json:"state,omitempty"`      // State or province name
	PostalCode string `json:"postalcode,omitempty"` // Postal code
	Country    string `json:"country,omitempty"`    // Country name
}

// Attachment holds content in a variety of formats
type Attachment struct {
	ContentType Code            `json:"type,omitempty"`     // Mime type of the content
	Language    Code            `json:"language,omitempty"` // Human language of the content
	Data        base64.Encoding `json:"data,omitempty"`     // Data package (base64 encoded)
	Url         string          `json:"url,omitempty"`      // URL where the data can be found
	Size        int64           `json:"size,omitempty"`     // Number of bytes of content
	Hash        base64.Encoding `json:"hash,omitempty"`     // Hash of the data (SHA-1)
	IPFSHash    string          `json:"ipfsHash,omitempty"` // The IPFS CID for the content
	Title       string          `json:"title,omitempty"`    // Label to display in place of the data
	Creation    time.Time       `json:"creation,omitempty"` // Date attachment was first created
	Height      uint64          `json:"height,omitempty"`   // Height in pixels for images
	Width       uint64          `json:"width,omitempty"`    // Width in pixels for images
	Frames      uint64          `json:"frames,omitempty"`   // Number of frames for videos
	Duration    Duration        `json:"duration,omitempty"` // Length in seconds for audio/video
	Pages       uint64          `json:"pages,omitempty"`    // Number of pages for documents
}

// Contact details for a person or organization associated with the patient
type Contact struct {
	Relationship CodeableConcept `json:"relationship,omitempty"` // The kind of relationship
	Name         HumanName       `json:"name,omitempty"`         // A name associated with the contact person
	Telecom      ContactPoint    `json:"telecom,omitempty"`      // Contact details for the person
	Address      Address         `json:"address,omitempty"`      // Address for the contact person
	Gender       Code            `json:"gender,omitempty"`       // Gender of the contact person
	Organization *Reference      `json:"organization,omitempty"` // Organization that is associated with the contact
}

// Communication specifies a language which can be used to communicate with the patient
type Communication struct {
	Language  CodeableConcept `json:"language,omitempty"`  // The language which can be used
	Preferred bool            `json:"preferred,omitempty"` // True if this is the preferred language for communications
}

// Organization represents an organized group of people or entities formed for a purpose
type Organization struct {
	ID            Identifier            `json:"identifier"`              // Unique identifier for the organization
	Active        bool                  `json:"active,omitempty"`        // Whether the organization's record is still in active use
	Type          CodeableConcept       `json:"type,omitempty"`          // The kind of organization
	Name          string                `json:"name,omitempty"`          // A name given to the organization
	Alias         string                `json:"alias,omitempty"`         // A list of alternate names that the organization is known as
	Description   string                `json:"description,omitempty"`   // Additional details about the organization
	Contact       ExtendedContactDetail `json:"contact,omitempty"`       // Contact details for the organization
	PartOf        *Reference            `json:"partof,omitempty"`        // The parent of the organization
	EndPoint      *Reference            `json:"endpoint,omitempty"`      // Technical endpoints providing access to services operated for the organization
	Qualification []Qualification       `json:"qualification,omitempty"` // Qualifications that the organization has
}

// Qualification represents credentials a healthcare provider holds
type Qualification struct {
	ID     Identifier      `json:"identifier"`       // Unique identifier for the qualification
	Code   CodeableConcept `json:"code,omitempty"`   // Coded representation of the qualification
	Status CodeableConcept `json:"status,omitempty"` // Status of the qualification
	Issuer *Reference      `json:"issuer,omitempty"` // Organization that issued the qualification
}

// ExtendedContactDetail contains detailed contact information including addresses and telecom details
type ExtendedContactDetail struct {
	Name         HumanName    `json:"name,omitempty"`         // Human name associated with the contact
	Telecom      ContactPoint `json:"telecom,omitempty"`      // Contact details (phone, email, etc.)
	Address      Address      `json:"address,omitempty"`      // Address for the contact
	Organization *Reference   `json:"organization,omitempty"` // Organization associated with the contact
	Period       Period       `json:"period,omitempty"`       // The period during which this contact detail is valid
}

// Human Name
type HumanName struct {
	Text   string   `json:"text,omitempty"`
	Family string   `json:"family,omitempty"`
	Given  []string `json:"given,omitempty"`
	Prefix []string `json:"prefix,omitempty"`
	Suffix []string `json:"suffix,omitempty"`
}

// Encounter represents an interaction between a patient and healthcare provider(s) for the provision of healthcare service(s)
type Encounter struct {
	ID              Identifier             `json:"id"`                        // The logical id of the resource.
	Status          Code                   `json:"status"`                    // Current state of the encounter (e.g., planned, in-progress, onhold, completed, cancelled)
	Class           Coding                 `json:"class"`                     // Classification of the encounter (e.g., inpatient, outpatient, emergency)
	Type            []CodeableConcept      `json:"type,omitempty"`            // Specific type of the encounter (e.g., consultation, follow-up)
	ServiceType     CodeableConcept        `json:"serviceType,omitempty"`     // The broad type of service that is to be provided (e.g., primary care, surgical, rehabilitation)
	Priority        CodeableConcept        `json:"priority,omitempty"`        // Indicates the urgency of the encounter
	Subject         *Reference             `json:"subject"`                   // The patient or group present at the encounter
	BasedOn         []Reference            `json:"basedOn,omitempty"`         // The request that initiated this encounter
	Participant     []EncounterParticipant `json:"participant,omitempty"`     // Persons involved in the encounter other than the patient
	Appointment     *Reference             `json:"appointment,omitempty"`     // The appointment that scheduled this encounter
	Period          Period                 `json:"period,omitempty"`          // The start and end time of the encounter
	Length          Duration               `json:"length,omitempty"`          // Quantity of time the encounter lasted (in seconds)
	ReasonCode      CodeableConcept        `json:"reasonCode,omitempty"`      // Reason the encounter takes place, expressed as a code
	ReasonReference []CodeableConcept      `json:"reasonReference,omitempty"` // Reasons the encounter takes place, referenced as a resource
	Diagnosis       []EncounterDiagnosis   `json:"diagnosis,omitempty"`       // The list of diagnosis relevant to this encounter
	Location        []Location             `json:"location,omitempty"`        // List of locations where the encounter takes place
	ServiceProvider *Reference             `json:"serviceProvider,omitempty"` // The organization that is primarily responsible for this Encounter's services
	PartOf          *Reference             `json:"partOf,omitempty"`          // Another Encounter of which this encounter is a part of (e.g., follow-up)
}

// EncounterParticipant represents individuals involved in the encounter besides the patient
type EncounterParticipant struct {
	Type       []CodeableConcept `json:"type,omitempty"`       // Role of the participant in the encounter
	Period     Period            `json:"period,omitempty"`     // The period of time during the encounter that the participant participated
	Individual *Reference        `json:"individual,omitempty"` // Persons involved in the encounter other than the patient
}

// EncounterDiagnosis represents the diagnosis relevant to the encounter
type EncounterDiagnosis struct {
	Condition Reference       `json:"condition"`      // The condition diagnosed
	Use       CodeableConcept `json:"use,omitempty"`  // Role that this diagnosis has within the encounter (e.g., admission, billing, discharge)
	Rank      int             `json:"rank,omitempty"` // Ranking of the diagnosis (primary, secondary, etc.)
}

// Period represents a start and an end time
type Period struct {
	Start time.Time `json:"start,omitempty"` // The start of the period
	End   time.Time `json:"end,omitempty"`   // The end of the period
}

// Location represents a physical place where services are provided and resources and participants may be stored, found, contained, or accommodated
type Location struct {
	ID                   Identifier            `json:"identifier"`            // Unique identifier for the location
	Status               Code                  `json:"status,omitempty"`      // The operational status of the location (e.g., active, suspended, inactive)
	Name                 string                `json:"name,omitempty"`        // A name given to the location
	Alias                string                `json:"alias,omitempty"`       // A list of alternate names that the location is known by
	Description          string                `json:"description,omitempty"` // A description of the location
	Type                 CodeableConcept       `json:"type,omitempty"`        // The type of location (e.g., hospital, clinic)
	Mode                 Code                  `json:"mode,omitempty"`        // The mode of operation of the location
	Contact              ExtendedContactDetail `json:"contact,omitempty"`     // Contact details of the location
	Address              Address               `json:"address,omitempty"`     // Physical location
	ManagingOrganization *Reference            `json:"managedby,omitempty"`   // Organization responsible for provisioning and upkeep
	HoursOfOperation     Availability          `json:"available,omitempty"`   // The usual hours of operation
}

// Availability specifies when the location is available for use or not
type Availability struct {
	Period         Period        `json:"period,omitempty"`         // The overall period during which this location is available
	DaysOfWeek     []Code        `json:"days,omitempty"`           // The days of the week on which this location is available
	AllDay         bool          `json:"allday,omitempty"`         // Whether this location is available all day
	StartTime      time.Duration `json:"start,omitempty"`          // The opening time of day
	EndTime        time.Duration `json:"end,omitempty"`            // The closing time of day
	Unavailability Period        `json:"unavailability,omitempty"` // Periods during which the location is not available
}

// Quantity represents the amount of medication.
type Quantity struct {
	Value  float64 `json:"value"`            // The numeric value of the quantity.
	Unit   string  `json:"unit,omitempty"`   // The unit of measurement for the quantity, e.g., mg for milligrams.
	System string  `json:"system,omitempty"` // The system that the unit is derived from.
}

// Practitioner represents a healthcare provider involved in the care of patients
type Practitioner struct {
	ID            Identifier      `json:"identifier"`              // Unique identifier for the practitioner
	Active        bool            `json:"active,omitempty"`        // Whether the practitioner's record is active
	Name          []HumanName     `json:"name,omitempty"`          // Names associated with the practitioner
	Telecom       ContactPoint    `json:"telecom,omitempty"`       // Contact details for the practitioner
	Gender        Code            `json:"gender,omitempty"`        // Gender of the practitioner
	BirthDate     time.Time       `json:"date,omitempty"`          // Birth date of the practitioner
	Deceased      bool            `json:"deceased,omitempty"`      // Indicates if the practitioner is deceased
	Address       Address         `json:"address,omitempty"`       // Addresses for the practitioner
	Photo         Attachment      `json:"photo,omitempty"`         // Photos associated with the practitioner
	Qualification []Qualification `json:"qualification,omitempty"` // Qualifications held by the practitioner
	Communication []Communication `json:"communication,omitempty"` // Languages the practitioner can communicate in
}

// AllergyIntolerance represents a patient's allergies or intolerances
type AllergyIntolerance struct {
	ID                 Identifier          `json:"identifier"`                   // Unique identifier for the allergy or intolerance record
	ClinicalStatus     CodeableConcept     `json:"clinicalStatus,omitempty"`     // Clinical status of the allergy or intolerance
	VerificationStatus CodeableConcept     `json:"verificationStatus,omitempty"` // Verification status of the allergy or intolerance
	Type               string              `json:"type,omitempty"`               // Type of the record (allergy or intolerance)
	Category           []string            `json:"category,omitempty"`           // Categories of substances associated with the allergy or intolerance
	Criticality        string              `json:"criticality,omitempty"`        // The criticality of the allergy or intolerance
	Patient            *Reference          `json:"patient,omitempty"`            // Reference to the patient who has the allergy or intolerance
	Code               CodeableConcept     `json:"code,omitempty"`               // The allergen or intolerant substance
	Reaction           []ReactionComponent `json:"reaction,omitempty"`           // Reactions triggered by the allergen
}

// ReactionComponent provides details about the reaction to an allergen
type ReactionComponent struct {
	Substance     CodeableConcept   `json:"substance,omitempty"`     // The substance that caused the reaction
	Manifestation []CodeableConcept `json:"manifestation"`           // Clinical symptoms/signs of the reaction
	Severity      string            `json:"severity,omitempty"`      // Severity of the reaction (mild, moderate, severe)
	ExposureRoute CodeableConcept   `json:"exposureRoute,omitempty"` // How the substance was encountered
	Note          []Annotation      `json:"note,omitempty"`          // Additional notes about the reaction
}

// Annotation represents a comment or explanatory note
type Annotation struct {
	AuthorReference *Reference `json:"authorReference,omitempty"` // Reference to who made the note
	AuthorString    string     `json:"authorString,omitempty"`    // String identifying who made the note
	Time            time.Time  `json:"time,omitempty"`            // Time the note was made
	Text            string     `json:"text"`                      // The content of the note
}

// Observation represents measurements or simple assertions made about a patient
type Observation struct {
	ID              string                 `json:"id"`                        // Unique identifier for this Observation
	Status          string                 `json:"status"`                    // The status of the observation (registered | preliminary | final | amended +)
	Category        []CodeableConcept      `json:"category,omitempty"`        // Classification of the observation (e.g., laboratory, vital signs)
	Code            CodeableConcept        `json:"code"`                      // Describes what was observed
	Subject         *Reference             `json:"subject"`                   // Who and/or what the observation is about
	Encounter       *Reference             `json:"encounter,omitempty"`       // The healthcare event (e.g., a patient encounter) during which the observation was made
	EffectivePeriod Period                 `json:"effectivePeriod,omitempty"` // A period of time during which the observation was made
	Issued          time.Time              `json:"issued,omitempty"`          // The date and time this observation was made available
	Performer       []Reference            `json:"performer,omitempty"`       // Who made the observation
	Interpretation  []CodeableConcept      `json:"interpretation,omitempty"`  // High-level interpretation of observation
	Note            []Annotation           `json:"note,omitempty"`            // Comments about the observation
	Component       []ObservationComponent `json:"component,omitempty"`       // Provides a specific result
}

// Range specifies a range of values
type Range struct {
	Low  Quantity `json:"low,omitempty"`  // Low limit
	High Quantity `json:"high,omitempty"` // High limit
}

// Ratio represents a relationship between two quantities.
type Ratio struct {
	Numerator   Quantity `json:"numerator"`   // The value of the numerator
	Denominator Quantity `json:"denominator"` // The value of the denominator
}

// ObservationComponent represents a component of the observation
type ObservationComponent struct {
	Code                 CodeableConcept   `json:"code"`                           // Describes what was observed
	ValueQuantity        Quantity          `json:"valueQuantity,omitempty"`        // The result of the component
	ValueCodeableConcept CodeableConcept   `json:"valueCodeableConcept,omitempty"` // The result of the component
	ValueString          string            `json:"valueString,omitempty"`          // The result of the component
	ValueBoolean         bool              `json:"valueBoolean,omitempty"`         // The result of the component
	ValueInteger         int               `json:"valueInteger,omitempty"`         // The result of the component
	ValueRange           Range             `json:"valueRange,omitempty"`           // The result of the component
	ValueRatio           Ratio             `json:"valueRatio,omitempty"`           // The result of the component
	Interpretation       []CodeableConcept `json:"interpretation,omitempty"`       // Interpretation of the component
}

// Procedure represents a healthcare procedure performed on a patient
type Procedure struct {
	ID                Identifier      `json:"identifier"`           // Unique identifier for the procedure
	Subject           *Reference      `json:"subject,omitempty"`    // The patient the procedure was performed on
	Code              CodeableConcept `json:"code,omitempty"`       // The specific procedure performed
	Status            Code            `json:"status,omitempty"`     // The status of the procedure (completed, planned, etc.)
	Category          CodeableConcept `json:"category,omitempty"`   // Classification of the procedure
	Performer         *Reference      `json:"performed,omitempty"`  // The entities who performed the procedure
	PartOf            *Reference      `json:"contained,omitempty"`  // A larger event of which this particular procedure is a component
	BasedOn           *Reference      `json:"basedon,omitempty"`    // A request for this procedure
	Reason            CodeableConcept `json:"reason,omitempty"`     // The reason the procedure was performed
	Encounter         *Reference      `json:"encounter,omitempty"`  // The encounter during which the procedure was performed
	Note              []Annotation    `json:"note,omitempty"`       // Additional notes about the procedure
	ReportedReference *Reference      `json:"reportedby,omitempty"` // Who reported the procedure
}

// Immunization records information about a vaccination event
type Immunization struct {
	ID                  Identifier          `json:"identifier"`             // Unique identifier for the immunization event
	Patient             *Reference          `json:"patient,omitempty"`      // The patient who received the vaccine
	VaccineCode         CodeableConcept     `json:"vaccineCode,omitempty"`  // Vaccine that was administered
	Occurrence          time.Time           `json:"occurrence,omitempty"`   // The date/time the vaccine was administered
	Location            *Reference          `json:"location,omitempty"`     // The location where the vaccine was administered
	Status              Code                `json:"status,omitempty"`       // The status of the immunization (completed, entered in error, etc.)
	Reason              CodeableConcept     `json:"reason,omitempty"`       // The reason for the vaccination
	Manufacturer        Organization        `json:"manufacturer,omitempty"` // The manufacturer of the vaccine
	LotNumber           string              `json:"lotnumber,omitempty"`    // The lot number of the vaccine
	ExpirationDate      time.Time           `json:"expiration,omitempty"`   // The expiration date of the vaccine
	Encounter           *Reference          `json:"encounter,omitempty"`    // The encounter during which the vaccine was given
	AdministeredProduct MedicationStatement `json:"product,omitempty"`      // Information about the vaccine product
	Site                CodeableConcept     `json:"site,omitempty"`         // The body site where the vaccine was administered
	Note                []Annotation        `json:"note,omitempty"`         // Additional notes about the immunization event
	Reaction            []ReactionComponent `json:"reaction,omitempty"`     // Any adverse reactions to the vaccine
}

// Condition captures information about a health condition diagnosed or identified in a patient
type Condition struct {
	ID                 Identifier          `json:"id"`                           // Unique identifier for the condition instance
	ClinicalStatus     CodeableConcept     `json:"clinicalStatus,omitempty"`     // Clinical status of the condition
	VerificationStatus CodeableConcept     `json:"verificationStatus,omitempty"` // Verification status of the condition
	Category           []CodeableConcept   `json:"category,omitempty"`           // Categorization of the condition
	Severity           CodeableConcept     `json:"severity,omitempty"`           // Severity of the condition
	Code               []CodeableConcept   `json:"code,omitempty"`               // Code that identifies the condition
	Subject            *Reference          `json:"subject,omitempty"`            // The patient who has the condition
	OnsetDateTime      string              `json:"onsetDateTime,omitempty"`      // The date/time when the condition began
	AbatementDateTime  string              `json:"abatementDateTime,omitempty"`  // The date/time when the condition resolved
	RecordedDate       string              `json:"recordedDate,omitempty"`       // Date and time the condition was first recorded
	Recorder           *Reference          `json:"recorder,omitempty"`           // Who recorded the condition
	Asserter           *Reference          `json:"asserter,omitempty"`           // Individual making the condition statement
	Evidence           []ConditionEvidence `json:"evidence,omitempty"`           // Evidence supporting the existence of the condition
}

type ConditionEvidence struct {
	Code   CodeableConcept `json:"code,omitempty"`   // A manifestation or symptom that led to the recording of this condition
	Detail []Reference     `json:"detail,omitempty"` // Links to other relevant information, including diagnostic reports, observations documenting symptoms, or other conditions that are due to the same underlying cause
}

// MedicationStatement represents information about medication that is being consumed by a patient
type MedicationStatement struct {
	ID                        string            `json:"id"`                                  // Unique identifier for this particular MedicationStatement
	Status                    string            `json:"status"`                              // Medication status (active, completed, entered-in-error, intended, stopped, on-hold)
	MedicationCodeableConcept CodeableConcept   `json:"medicationCodeableConcept,omitempty"` // Identifies the medication being administered. This should be a codified drug name
	Subject                   *Reference        `json:"subject"`                             // The patient or group who is taking the medication
	Context                   *Reference        `json:"context,omitempty"`                   // The encounter or episode of care that establishes the context for this MedicationStatement
	EffectiveDateTime         string            `json:"effectiveDateTime,omitempty"`         // The date/time when the medication was taken
	EffectivePeriod           Period            `json:"effectivePeriod,omitempty"`           // The period over which the medication was taken
	DateAsserted              string            `json:"dateAsserted,omitempty"`              // The date when the medication statement was asserted by the information source
	InformationSource         *Reference        `json:"informationSource,omitempty"`         // The person or organization that provided the information about the taking of this medication
	ReasonCode                []CodeableConcept `json:"reasonCode,omitempty"`                // Reason for why the medication is being/was taken
	Dosage                    []Dosage          `json:"dosage,omitempty"`                    // Details of how the medication was taken
}

// Dosage represents how the medication is/was taken or should be taken by the patient
type Dosage struct {
	Text         string          `json:"text,omitempty"`         // Free text dosage instructions e.g. "Take one tablet daily"
	Timing       Timing          `json:"timing,omitempty"`       // When the medication should be taken
	Route        CodeableConcept `json:"route,omitempty"`        // How the medication enters the body, e.g., oral, injection
	DoseQuantity Quantity        `json:"doseQuantity,omitempty"` // The amount of medication taken at one time
}

// Timing represents the timing of medication intake
type Timing struct {
	Repeat Repeat `json:"repeat,omitempty"` // Codified representation of the schedule
}

// Repeat defines frequency and duration of the medication intake
type Repeat struct {
	Frequency  int     `json:"frequency,omitempty"`  // The number of times the medication is to be taken every
	Period     float64 `json:"period,omitempty"`     // The period over which the medication is to be taken
	PeriodUnit string  `json:"periodUnit,omitempty"` // The unit of time for the period, e.g., days, weeks, months
}

// MedicationRequest represents a request for prescribing medication to a patient
type MedicationRequest struct {
	ID                        Identifier       `json:"identifier"`                  // Unique identifier for this medication request
	Status                    Code             `json:"status"`                      // The status of the prescription (e.g., active, cancelled, completed)
	Intent                    Code             `json:"intent"`                      // The intention behind the prescription order (e.g., order, proposal, plan)
	MedicationCodeableConcept CodeableConcept  `json:"medicationCodeableConcept"`   // The medication to be prescribed
	Subject                   *Reference       `json:"subject"`                     // The patient to whom the medication is prescribed
	Encounter                 *Reference       `json:"encounter,omitempty"`         // The encounter during which the prescription was made
	AuthoredOn                time.Time        `json:"authoredOn,omitempty"`        // The date and time when the prescription was authored
	Requester                 *Reference       `json:"requester,omitempty"`         // The healthcare professional who requested the prescription
	DosageInstruction         []Dosage         `json:"dosageInstruction,omitempty"` // Instructions for dosing of the medication
	DispenseRequest           *DispenseRequest `json:"dispenseRequest,omitempty"`   // Details on how the medication should be dispensed to the patient
}

// DispenseRequest contains details about the dispensing of a prescribed medication
type DispenseRequest struct {
	ValidityPeriod         Period     `json:"validityPeriod,omitempty"`         // The period during which the prescription is valid
	NumberOfRepeatsAllowed int        `json:"numberOfRepeatsAllowed,omitempty"` // The number of times the medication can be dispensed
	Quantity               Quantity   `json:"quantity,omitempty"`               // The quantity of medication to dispense
	ExpectedSupplyDuration Duration   `json:"expectedSupplyDuration,omitempty"` // The expected duration for which the supplied medication should last
	Performer              *Reference `json:"performer,omitempty"`              // The designated pharmacy to dispense the medication
}

// Duration represents a length of time
type Duration struct {
	Value  float64 `json:"value"`            // The numeric value of the duration
	Unit   string  `json:"unit,omitempty"`   // The unit of measurement for the duration, e.g., days, weeks
	System string  `json:"system,omitempty"` // The system that the unit is derived from
}

// Insurance represents coverage provided to an individual or organization for healthcare costs
type Insurance struct {
	ID           Identifier      `json:"identifier"`             // Unique identifier for the insurance policy
	Status       Coding          `json:"status,omitempty"`       // The status of the insurance (active, cancelled, etc.)
	Type         CodeableConcept `json:"type,omitempty"`         // The type of insurance (e.g., health, auto, property)
	Subject      *Reference      `json:"subject,omitempty"`      // The individual or entity covered by the insurance
	SubscriberID Identifier      `json:"subscriberId,omitempty"` // Identifier for the subscriber of the policy
	Plan         *Reference      `json:"plan,omitempty"`         // Specific plan details of the insurance
	Payor        *Reference      `json:"payor,omitempty"`        // The organization or entity covering the insurance
	Beneficiary  *Reference      `json:"beneficiary,omitempty"`  // Beneficiary of the insurance policy
	Period       Period          `json:"period,omitempty"`       // Time period the insurance coverage is in effect
}

// Appointment represents a scheduled healthcare event for a patient
type Appointment struct {
	ID          Identifier    `json:"identifier"`            // Unique identifier for the appointment
	Status      Coding        `json:"status,omitempty"`      // Current status of the appointment (booked, cancelled, etc.)
	Subject     *Reference    `json:"subject,omitempty"`     // The patient that the appointment is for
	Participant []Participant `json:"participant,omitempty"` // Individuals involved in the appointment
	Start       time.Time     `json:"start,omitempty"`       // Scheduled start time of the appointment
	End         time.Time     `json:"end,omitempty"`         // Scheduled end time of the appointment
	Booked      time.Time     `json:"booked,omitempty"`      // The time when the appointment was initially booked
}

// Participant details an individual's role in an appointment
type Participant struct {
	Type     CodeableConcept `json:"type,omitempty"`     // The role of the participant in the appointment
	Actor    *Reference      `json:"actor,omitempty"`    // The person participating in the appointment
	Required bool            `json:"required,omitempty"` // Whether the participant's presence is required
	Status   Coding          `json:"status,omitempty"`   // Participation status of the participant (accepted, declined, etc.)
}

// ServiceRequest represents an order for a service to be performed.
type ServiceRequest struct {
	ID             Identifier        `json:"identifier"`
	Status         Code              `json:"status"`                   // e.g., active, on-hold, completed
	Intent         Code              `json:"intent"`                   // e.g., order, original-order, reflex-order
	Category       []CodeableConcept `json:"category,omitempty"`       // Classification of service
	Priority       Code              `json:"priority,omitempty"`       // e.g., routine, urgent, asap
	Service        CodeableConcept   `json:"service,omitempty"`        // The service that is to be performed
	Subject        *Reference        `json:"subject"`                  // Who the service is for
	Encounter      *Reference        `json:"encounter,omitempty"`      // Encounter during which the request was created
	Requester      *Reference        `json:"requester,omitempty"`      // Individual who initiated the request
	Performer      *Reference        `json:"performer,omitempty"`      // Desired performer for service
	ReasonCode     []CodeableConcept `json:"reasonCode,omitempty"`     // Reason for the service request
	SupportingInfo []Reference       `json:"supportingInfo,omitempty"` // Additional information to support the service request
	Note           []Annotation      `json:"note,omitempty"`           // Comments made about the ServiceRequest
}

// CarePlanActivity details a specific action planned as part of the care plan.
type CarePlanActivity struct {
	OutcomeCodeableConcept []CodeableConcept      `json:"outcomeCodeableConcept,omitempty"` // Results of the activity
	Detail                 CarePlanActivityDetail `json:"detail,omitempty"`                 // In-line definition of the activity
}

type CarePlanActivityDetail struct {
	Category               CodeableConcept   `json:"category,omitempty"`               // Kind of activity, e.g., drug, encounter
	Code                   CodeableConcept   `json:"code,omitempty"`                   // Detail type of activity
	ReasonCode             []CodeableConcept `json:"reasonCode,omitempty"`             // Why activity should be done
	ScheduledTiming        Timing            `json:"scheduledTiming,omitempty"`        // When activity is to occur
	Location               *Reference        `json:"location,omitempty"`               // Where activity will take place
	Performer              []Reference       `json:"performer,omitempty"`              // Who will be responsible?
	ProductCodeableConcept CodeableConcept   `json:"productCodeableConcept,omitempty"` // What is to be administered/supplied
	DailyAmount            Quantity          `json:"dailyAmount,omitempty"`            // How much to administer/supply/consume
	Quantity               Quantity          `json:"quantity,omitempty"`               // How much is administered/supplied/consumed
	Description            string            `json:"description,omitempty"`            // Extra info describing activity
}
