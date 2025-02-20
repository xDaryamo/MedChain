# MedChain: Innovation in Healthcare

MedChain is an innovative blockchain-based solution for managing healthcare data securely. By integrating HL7 FHIR standards for healthcare interoperability with a permissioned Hyperledger Fabric network, MedChain ensures that patient data is protected, traceable, and readily available to authorized healthcare providers.

> This project was developed for the Data Security exam as part of the Master's degree in Computer Science at the University of Salerno.

## Context and Motivation
In today’s increasingly digital healthcare landscape, securing sensitive patient information is a critical challenge. Traditional systems often struggle to protect data from unauthorized access and fraud. MedChain addresses these issues by:
- Utilizing a permissioned blockchain that restricts access to authorized entities (e.g., hospitals, clinics, physicians).
- Ensuring complete traceability of data modifications.
- Maintaining data integrity and accuracy for reliable clinical decision-making.

This project was created specifically for the Data Security exam at the University of Salerno, demonstrating the potential of blockchain technology to enhance the security and interoperability of healthcare systems.

## Technologies
- **Hyperledger Fabric**: A permissioned blockchain that secures data by limiting access to known, trusted participants. Chaincodes manage the creation, reading, updating, and deletion of records securely.
- **Fablo**: Simplifies the setup and management of a Hyperledger Fabric network by transforming a single configuration file into a fully operational network. This flexibility supports multiple organizations, channels, and chaincodes.
- **HL7 FHIR**: A standard for exchanging electronic healthcare information that enables interoperability between diverse systems, ensuring that data is shared efficiently and accurately.

## Features
- **Secure Medical Records Management**  
  Implements chaincode for full CRUD operations on medical records, including batch processing for complex data like conditions, procedures, and allergies.
  
- **Patient Data Handling**  
  Manages patient records securely with built-in authorization mechanisms to control data access in accordance with HL7 FHIR standards.

- **Interoperability**  
  Integrates HL7 FHIR to promote seamless data exchange between different healthcare systems, enhancing clinical decision-making and research.

- **Scalable and Flexible**  
  Adaptable to various clinical settings—from public health surveillance and clinical decision support to secure document sharing and research.

