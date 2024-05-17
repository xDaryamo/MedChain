package main

import (
	"time"
)

// Code represents a coded value following a coding system like LOINC or SNOMED CT
type Code struct {
	Coding []Coding `json:"coding"` // A reference to a code defined by a terminology system
}

// Coding provides reference information to a coding system and a code within that system
type Coding struct {
	System  string `json:"system,omitempty"`  // The identification of the code system that defines the meaning of the symbol in the code
	Code    string `json:"code,omitempty"`    // The symbol in syntax defined by the system
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
	ID                   *Identifier      `json:"identifier"`                     // Unique identifier for individuals receiving care
	Active               bool            `json:"active,omitempty"`               // Whether the patient's record is in active use
	Name                 *HumanName       `json:"name,omitempty"`                 // A name associated with the patient
	Telecom              []ContactPoint  `json:"telecom,omitempty"`              // A contact detail for the individual
	Gender               *Code            `json:"gender,omitempty"`               // Gender of the patient
	BirthDate            *time.Time       `json:"date,omitempty"`                 // The birth date for the patient
	Deceased             bool            `json:"deceased,omitempty"`             // Indicates if the patient is deceased
	Address              []Address       `json:"address,omitempty"`              // Addresses for the individual
	MaritalStatus        *CodeableConcept `json:"maritalstatus,omitempty"`        // Marital (civil) status of a patient
	MultipleBirth        []int           `json:"multiplebirth,omitempty"`        // Indicates if the patient is part of a multiple birth
	Photo                *Attachment      `json:"photo,omitempty"`                // Image of the patient
	Contact              []Contact       `json:"contact,omitempty"`              // A contact party (e.g., guardian, partner, friend) for the patient
	Communication        []Communication `json:"communication,omitempty"`        // A list of Languages which may be used to communicate with the patient
	GeneralPractitioner  *Reference      `json:"generalpractitioner,omitempty"`  // Patient's primary care provider
	ManagingOrganization *Reference      `json:"managingorganization,omitempty"` // Organization that is the custodian of the patient record
}

// Human Name
type HumanName struct {
	Text   string   `json:"text,omitempty"`
	Family string   `json:"family,omitempty"`
	Given  []string `json:"given,omitempty"`
	Prefix []string `json:"prefix,omitempty"`
	Suffix []string `json:"suffix,omitempty"`
}

// ContactPoint specifies contact information for a person or organization
type ContactPoint struct {
	System *Code   `json:"system,omitempty"` // The system for the contact point, e.g., phone, email
	Value  string `json:"value,omitempty"`  // The actual contact point details
	Use    *Code   `json:"use,omitempty"`    // The use of the contact point (e.g., home, work)
	Rank   uint   `json:"rank,omitempty"`   // Specifies a preference order for the contact points
	Period *Period `json:"period,omitempty"` // The period during which the contact point is valid
}

// Address represents an address expressed using postal conventions
type Address struct {
	Use        *Code   `json:"use,omitempty"`        // The use of the address (e.g., home, work)
	Type       *Code   `json:"type,omitempty"`       // The type of address (e.g., postal, physical)
	Text       string `json:"text,omitempty"`       // A full text representation of the address
	Line       string `json:"line,omitempty"`       // Address line details (e.g., street, PO Box)
	City       string `json:"city,omitempty"`       // The city name.
	State      string `json:"state,omitempty"`      // State or province name
	PostalCode string `json:"postalcode,omitempty"` // Postal code
	Country    string `json:"country,omitempty"`    // Country name
}

// Period represents a start and an end time
type Period struct {
	Start time.Time `json:"start,omitempty"` // The start of the period
	End   time.Time `json:"end,omitempty"`   // The end of the period
}

// Attachment holds content in a variety of formats
type Attachment struct {
	ContentType *Code      `json:"type,omitempty"`     // Mime type of the content
	Language    *Code      `json:"language,omitempty"` // Human language of the content
	Data        string    `json:"data,omitempty"`     // Data package
	Url         string    `json:"url,omitempty"`      // URL where the data can be found
	Size        int64     `json:"size,omitempty"`     // Number of bytes of content
	Hash        string    `json:"hash,omitempty"`     // Hash of the data (SHA-1)
	IPFSHash    string    `json:"ipfsHash,omitempty"` // The IPFS CID for the content
	Title       string    `json:"title,omitempty"`    // Label to display in place of the data
	Creation    time.Time `json:"creation,omitempty"` // Date attachment was first created
	Height      uint64    `json:"height,omitempty"`   // Height in pixels for images
	Width       uint64    `json:"width,omitempty"`    // Width in pixels for images
	Frames      uint64    `json:"frames,omitempty"`   // Number of frames for videos
	Duration    *Duration  `json:"duration,omitempty"` // Length in seconds for audio/video
	Pages       uint64    `json:"pages,omitempty"`    // Number of pages for documents
}

// Contact details for a person or organization associated with the patient
type Contact struct {
	Relationship *CodeableConcept `json:"relationship,omitempty"` // The kind of relationship
	Name         HumanName       `json:"name,omitempty"`         // A name associated with the contact person
	Telecom      ContactPoint    `json:"telecom,omitempty"`      // Contact details for the person
	Address      *Address         `json:"address,omitempty"`      // Address for the contact person
	Gender       *Code            `json:"gender,omitempty"`       // Gender of the contact person
	Organization *Reference      `json:"organization,omitempty"` // Organization that is associated with the contact
}

// Communication specifies a language which can be used to communicate with the patient
type Communication struct {
	Language  *CodeableConcept `json:"language,omitempty"`  // The language which can be used
	Preferred bool            `json:"preferred,omitempty"` // True if this is the preferred language for communications
}

// Duration represents a length of time
type Duration struct {
	Value  float64 `json:"value"`            // The numeric value of the duration
	Unit   string  `json:"unit,omitempty"`   // The unit of measurement for the duration, e.g., days, weeks
	System string  `json:"system,omitempty"` // The system that the unit is derived from
}
