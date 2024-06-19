import React, { useState } from "react";
import { signup } from "../api";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [fhirData, setFhirData] = useState(`{
    "identifier": {
      "system": "http://example.org/ids",
      "value": "practitioner-12345"
    },
    "active": true,
    "name": [
      {
        "text": "Dr. John Doe",
        "family": "Doe",
        "given": [
          "John"
        ],
        "prefix": [
          "Dr."
        ]
      }
    ]
  }`);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const fhirDataParsed = JSON.parse(fhirData);
      const userData = {
        email,
        password,
        username,
        role,
        organization,
        fhirData: fhirDataParsed,
      };

      const result = await signup(userData);
      setSuccess("Registration successful!");
      console.log("Registration successful:", result);
    } catch (err) {
      console.error("Error during registration:", err);
      setError(err.message || "An error occurred during registration.");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="patient">Patient</option>
            <option value="practitioner">Practitioner</option>
          </select>
        </div>
        <div>
          <label>Organization:</label>
          <input
            type="text"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            required
          />
        </div>
        <div>
          <label>FHIR Data (JSON):</label>
          <textarea
            value={fhirData}
            onChange={(e) => setFhirData(e.target.value)}
            rows="10"
            cols="50"
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
