const FabricNetwork = require("../../blockchain/fabric");

const fabric = new FabricNetwork();

const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.getPractitioner = async (req, res, next) => {
  const practitionerId = req.params.id;
  console.log(practitionerId);
  try {
    const channel = "identity-channel";
    const chaincode = "practitioner";
    const userId = req.user.userId;
    const organization = req.user.organization;

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const resultString = await fabric.evaluateTransaction(
      "ReadPractitioner",
      practitionerId
    );
    const result = JSON.parse(resultString);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.createPractitioner = async (req, res, next) => {
  const { organization, fhirData } = req.body;
  const userId = fhirData.identifier.value;

  try {
    const channel = "identity-channel";
    const chaincode = "practitioner";

    const fabric = new FabricNetwork();
    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    let practitionerJSONString;
    try {
      practitionerJSONString = JSON.stringify(fhirData);
      JSON.parse(practitionerJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return { error: "Invalid JSON format" };
    }

    console.log(
      "Submitting transaction with practitioner JSON:",
      practitionerJSONString
    );

    const resultString = await fabric.submitTransaction(
      "CreatePractitioner",
      practitionerJSONString
    );
    const result = JSON.parse(resultString);

    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");

    return result; // Restituisci il risultato JSON
  } catch (error) {
    console.error("Error creating practitioner:", error);
    return { error: error.message }; // Restituisci l'errore JSON
  }
};

exports.updatePractitioner = async (req, res, next) => {
  const practitionerId = req.params.id;
  const practitionerJSON = req.body;
  const userId = req.user.userId;
  const organization = req.user.organization;
  console.log(practitionerJSON); // Debugging line to verify the incoming data

  try {
    const channel = "identity-channel";
    const chaincode = "practitioner";

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    if (!practitionerJSON.identifier) {
      practitionerJSON.identifier = {};
    }
    practitionerJSON.identifier.value = practitionerId;

    let practitionerJSONString;
    try {
      practitionerJSONString = JSON.stringify(practitionerJSON);
      JSON.parse(practitionerJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    console.log(
      "Submitting transaction with practitioner JSON:",
      practitionerJSONString
    );

    const resultString = await fabric.submitTransaction(
      "UpdatePractitioner",
      practitionerId,
      practitionerJSONString
    );

    const result = JSON.parse(resultString);

    // Update MongoDB with the new organization information
    const updatedUser = await User.findOneAndUpdate(
      { userId: userId },
      { organization: practitionerJSON.qualification[0].issuer.reference },
      { new: true }
    );

    // Generate a new token with the updated organization information
    const newToken = jwt.sign(
      {
        userId: updatedUser.userId, // Use updatedUser.userId instead of _id
        organization: updatedUser.organization,
        role: req.user.role,
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ ...result, token: newToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.deletePractitioner = async (req, res, next) => {
  const practitionerID = req.params.id;
  const organization = req.user.organization;

  try {
    const channel = "identity-channel";
    const chaincode = "practitioner";

    await fabric.init(practitionerID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const resultString = await fabric.submitTransaction(
      "DeletePractitioner",
      practitionerID
    );
    const result = JSON.parse(resultString);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.getFollowedPatients = async (req, res, next) => {
  const practitionerId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "identity-channel";
    const chaincode = "practitioner";

    await fabric.init(practitionerId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    // Ottieni gli ID dei pazienti seguiti
    const resultString = await fabric.evaluateTransaction(
      "GetFollowedPatients",
      practitionerId
    );
    const patientIds = JSON.parse(resultString);

    // Recupera i dettagli di ogni paziente
    const patientDetails = await Promise.all(
      patientIds.map(async (patientId) => {
        try {
          await fabric.init(practitionerId, organization, channel, "patient");
          const patientResultString = await fabric.evaluateTransaction(
            "ReadPatient",
            patientId
          );
          return JSON.parse(patientResultString);
        } catch (error) {
          console.error(
            `Failed to retrieve details for patient ${patientId}:`,
            error
          );
          return null;
        }
      })
    );

    // Filtra eventuali pazienti nulli (che non sono stati recuperati correttamente)
    const validPatientDetails = patientDetails.filter(
      (patient) => patient !== null
    );

    res.status(200).json(validPatientDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};
