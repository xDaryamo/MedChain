import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [identifierValue, setIdentifierValue] = useState('');
  const [nameText, setNameText] = useState('');
  const [nameFamily, setNameFamily] = useState('');
  const [telecomValue, setTelecomValue] = useState('');
  const [telecomUse, setTelecomUse] = useState('');
  const [genderCode, setGenderCode] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressPostalCode, setAddressPostalCode] = useState('');
  const [addressCountry, setAddressCountry] = useState('');
  const [maritalStatusCode, setMaritalStatusCode] = useState('');
  const [communicationLanguage, setCommunicationLanguage] = useState('');

  const handleRegister = async () => {
    try {
      const fhirData = {
        identifier: {
          value: identifierValue,
          system: 'http://hospital.smarthealthit.org',
        },
        active: true,
        name: {
          text: nameText,
          family: nameFamily,
        },
        telecom: [
          {
            system: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/contact-point-system',
                  code: 'phone',
                  display: 'Phone',
                },
              ],
            },
            value: telecomValue,
            use: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/contact-point-use',
                  code: telecomUse,
                  display: 'Home',
                },
              ],
            },
            rank: 1,
          },
        ],
        gender: {
          coding: [
            {
              system: 'http://hl7.org/fhir/administrative-gender',
              code: genderCode,
              display: 'Male', // Update display based on the selected gender
            },
          ],
        },
        birthDate: birthDate,
        address: [
          {
            use: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/address-use',
                  code: 'home',
                  display: 'Home',
                },
              ],
            },
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/address-type',
                  code: 'postal',
                  display: 'Postal',
                },
              ],
            },
            text: `${addressLine}, ${addressCity}, ${addressState}, ${addressPostalCode}, ${addressCountry}`,
            line: addressLine,
            city: addressCity,
            state: addressState,
            postalCode: addressPostalCode,
            country: addressCountry,
          },
        ],
        maritalStatus: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v3-MaritalStatus',
              code: maritalStatusCode,
              display: 'Married', // Update display based on the selected marital status
            },
          ],
          text: 'Married', // Update text based on the selected marital status
        },
        communication: [
          {
            language: {
              coding: [
                {
                  system: 'urn:ietf:bcp:47',
                  code: communicationLanguage,
                  display: 'English', // Update display based on the selected language
                },
              ],
            },
            preferred: true, // Update based on user preference
          },
        ],
      };

      const response = await axios.put('/auth/signup', {
        email,
        password,
        username,
        role,
        organization,
        fhirData,
      });

      console.log('Registration successful!', response.data);
      
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Role:
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </label>
      <label>
        Organization:
        <input
          type="text"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
      </label>
      <h3>FHIR Data</h3>
      <label>
        Identifier Value:
        <input
          type="text"
          value={identifierValue}
          onChange={(e) => setIdentifierValue(e.target.value)}
        />
      </label>
      <label>
        Name Text:
        <input
          type="text"
          value={nameText}
          onChange={(e) => setNameText(e.target.value)}
        />
      </label>
      <label>
        Name Family:
        <input
          type="text"
          value={nameFamily}
          onChange={(e) => setNameFamily(e.target.value)}
        />
      </label>
      <label>
        Telecom Value:
        <input
          type="text"
          value={telecomValue}
          onChange={(e) => setTelecomValue(e.target.value)}
        />
      </label>
      <label>
        Telecom Use:
        <input
          type="text"
          value={telecomUse}
          onChange={(e) => setTelecomUse(e.target.value)}
        />
      </label>
      <label>
        Gender Code:
        <input
          type="text"
          value={genderCode}
          onChange={(e) => setGenderCode(e.target.value)}
        />
      </label>
      <label>
        Birth Date:
        <input
          type="text"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </label>
      <label>
        Address Line:
        <input
          type="text"
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
        />
      </label>
      <label>
        Address City:
        <input
          type="text"
          value={addressCity}
          onChange={(e) => setAddressCity(e.target.value)}
        />
      </label>
      <label>
        Address State:
        <input
          type="text"
          value={addressState}
          onChange={(e) => setAddressState(e.target.value)}
        />
      </label>
      <label>
        Address Postal Code:
        <input
          type="text"
          value={addressPostalCode}
          onChange={(e) => setAddressPostalCode(e.target.value)}
        />
      </label>
      <label>
        Address Country:
        <input
          type="text"
          value={addressCountry}
          onChange={(e) => setAddressCountry(e.target.value)}
        />
      </label>
      <label>
        Marital Status Code:
        <input
          type="text"
          value={maritalStatusCode}
          onChange={(e) => setMaritalStatusCode(e.target.value)}
        />
      </label>
      <label>
        Communication Language:
        <input
          type="text"
          value={communicationLanguage}
          onChange={(e) => setCommunicationLanguage(e.target.value)}
        />
      </label>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
