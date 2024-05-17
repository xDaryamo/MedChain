const FabricNetwork = require("../../blockchain/fabric");

const fabric = new FabricNetwork();

exports.getPatientDetails = async (req, res, next) => {
  const patientID = req.params.id;
  try {
    const organization = "patients.medchain.com";
    const channel = "patient-records-channel";
    const chaincode = "patient";

    await fabric.init(patientID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const patientDetails = await fabric.evaluateTransaction(
      "ReadPatient",
      patientID
    );
    res.status(200).json({ patient: JSON.parse(patientDetails) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createPatient = async (req, res, next) => {
  const patientJSON = req.body;
  try {
    const organization = "patients.medchain.com";
    const channel = "patient-records-channel";
    const chaincode = "patient";
    const userId = await fabric.registerAndEnrollUser("", organization);

    patientJSON.identifier.value = userId;

    // Validate and stringify JSON
    let patientJSONString;
    try {
      patientJSONString = JSON.stringify(patientJSON);
      JSON.parse(patientJSONString); // This ensures the string is valid JSON
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    // Log the JSON string
    console.log("Submitting transaction with patient JSON:", patientJSONString);

    const result = await fabric.submitTransaction(
      "CreatePatient",
      JSON.stringify(patientJSON)
    );

    res
      .status(201)
      .json({ message: "Patient created successfully", result: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Disconnetti dalla rete Fabric
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

const object = {
  active: true,
  date: "0001-01-01T00:00:00Z",
  gender: { coding: null },
  identifier: {
    system: "http://hospital.smarthealth.it",
    value: "cdc455e6-3216-4ea5-af87-ff3d99368b3c",
  },
  maritalstatus: {},
  name: { family: "Rossi", text: "Mario" },
  photo: {
    creation: "0001-01-01T00:00:00Z",
    duration: { value: 0 },
    language: { coding: null },
    type: { coding: null },
  },
};
exports.updatePatient = async (req, res, next) => {
  const patientID = req.params.id;
  const updatedPatient = req.body.updatedPatient;
  try {
    const result = await fabric.submitTransaction(
      "UpdatePatient",
      patientID,
      JSON.stringify(updatedPatient)
    );
    res
      .status(200)
      .json({ message: "Organization updated successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePatient = async (req, res, next) => {
  const patientID = req.params.id;
  try {
    const result = await fabric.submitTransaction("DeletePatient", patientID);
    res.status(200).json({ message: "Patient deleted successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requestAccess = async (req, res, next) => {
  const patientID = req.params.id;
  const requesterID = req.params.requesterId;

  try {
    const result = await fabric.submitTransaction(
      "RequestAccess",
      patientID,
      requesterID
    );
    res
      .status(200)
      .json({ message: "Access request sent successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.grantAccess = async (req, res, next) => {
  const patientID = req.params.id;
  const requesterID = req.params.requesterId;

  try {
    const result = await fabric.submitTransaction(
      "GrantAccess",
      patientID,
      requesterID
    );
    res.status(200).json({ message: "Access granted successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.revokeAccess = async (req, res, next) => {
  const patientID = req.params.id;
  const requesterID = req.params.requesterId;

  try {
    const result = await fabric.submitTransaction(
      "RevokeAccess",
      patientID,
      requesterID
    );
    res.status(200).json({ message: "Access revoked successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
