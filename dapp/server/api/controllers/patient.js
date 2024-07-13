const FabricNetwork = require("../../blockchain/fabric");

const fabric = new FabricNetwork();
const practitionerFabric = new FabricNetwork();
const User = require("../models/user");

exports.getPatient = async (req, res, next) => {
  const patientId = req.params.id;

  try {
    const channel = "identity-channel";
    const chaincode = "patient";
    const userId = req.user.userId;
    const organization = req.user.organization;

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const resultString = await fabric.evaluateTransaction(
      "ReadPatient",
      patientId
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

exports.createPatient = async (req, res, next) => {
  const { organization, fhirData } = req.body;
  try {
    const channel = "identity-channel";
    const chaincode = "patient";
    const userId = fhirData.identifier.value;

    const fabric = new FabricNetwork();
    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    let patientJSONString;
    try {
      patientJSONString = JSON.stringify(fhirData);
      JSON.parse(patientJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return { error: "Invalid JSON format" }; // Restituisci un errore JSON
    }

    console.log("Submitting transaction with patient JSON:", patientJSONString);

    const result = await fabric.submitTransaction(
      "CreatePatient",
      patientJSONString
    );

    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");

    return JSON.parse(result); // Restituisci il risultato JSON
  } catch (error) {
    console.error("Error creating patient:", error);
    return { error: error.message }; // Restituisci l'errore JSON
  }
};

exports.updatePatient = async (req, res, next) => {
  const fhirData = req.body;
  try {
    const channel = "identity-channel";
    const chaincode = "patient";
    const userId = req.user.userId;
    const organization = req.user.organization;

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    fhirData.identifier.value = userId;

    let patientJSONString;
    try {
      patientJSONString = JSON.stringify(fhirData);
      JSON.parse(patientJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    console.log("Submitting transaction with patient JSON:", patientJSONString);

    const resultString = await fabric.submitTransaction(
      "UpdatePatient",
      patientJSONString
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

exports.deletePatient = async (req, res, next) => {
  const patientID = req.params.id;
  const organization = req.user.organization;
  try {
    const channel = "identity-channel";
    const chaincode = "patient";

    await fabric.init(patientID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const resultString = await fabric.submitTransaction(
      "DeletePatient",
      patientID
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

exports.searchPatients = async (req, res, next) => {
  const queryString = req.body.query || { selector: {} };

  const userId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "identity-channel";
    const chaincode = "patient";

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    let queryJSONString;
    try {
      queryJSONString = JSON.stringify(queryString);
      JSON.parse(queryJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    console.log(
      "Submitting query transaction with query JSON string:",
      queryJSONString
    );

    const resultString = await fabric.submitTransaction(
      "SearchPatients",
      queryJSONString
    );

    console.log("Result string from Fabric transaction:", resultString);

    let results;
    try {
      results = JSON.parse(resultString);
    } catch (error) {
      console.error("Failed to parse result string:", error);
      return res.status(500).json({ error: "Failed to parse result string" });
    }

    res.status(200).json({
      results: results,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.requestAccess = async (req, res, next) => {
  const patientID = req.params.id;
  const requesterID = req.user.userId;
  const isOrg = req.body.isOrg;
  const organization = req.user.organization;
  console.log(isOrg);
  try {
    const channel = "identity-channel";
    const chaincode = "patient";

    await fabric.init(requesterID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const resultString = await fabric.submitTransaction(
      "RequestAccess",
      patientID,
      requesterID,
      isOrg.toString()
    );

    console.log("Result from blockchain:", resultString);

    let result;
    if (resultString) {
      try {
        result = JSON.parse(resultString);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        return res
          .status(500)
          .json({ error: "Error parsing JSON response from blockchain" });
      }
    } else {
      return res.status(500).json({ error: "Empty response from blockchain" });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.grantAccess = async (req, res, next) => {
  const patientID = req.user.userId;
  const requesterID = req.params.requesterId;
  const isOrg = req.body.isOrg || false;
  const organization = req.user.organization;

  try {
    const channel = "identity-channel";
    const chaincode = "patient";

    await fabric.init(patientID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const resultString = await fabric.submitTransaction(
      "GrantAccess",
      patientID,
      requesterID,
      isOrg.toString()
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

exports.revokeAccess = async (req, res, next) => {
  const patientID = req.user.userId;
  const requesterID = req.params.requesterId;
  const isOrg = req.body.isOrg || false;
  const organization = req.user.organization;

  try {
    const channel = "identity-channel";
    const chaincode = "patient";

    await fabric.init(patientID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const revokeResultString = await fabric.submitTransaction(
      "RevokeAccess",
      patientID,
      requesterID,
      isOrg.toString()
    );

    if (revokeResultString) {
      const revokeResult = JSON.parse(revokeResultString);

      if (revokeResult.error) {
        throw new Error(revokeResult.error);
      }

      const deleteResultString = await fabric.submitTransaction(
        "DeletePendingRequest",
        patientID,
        requesterID,
        isOrg.toString()
      );

      const deleteResult = JSON.parse(deleteResultString);

      if (deleteResult.error) {
        throw new Error(deleteResult.error);
      }

      res
        .status(200)
        .json({ message: "Access revoked and request deleted successfully" });
    } else {
      throw new Error("Failed to revoke access");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.getAccessRequests = async (req, res, next) => {
  try {
    const channel = "identity-channel";
    const chaincode = "patient";
    const userId = req.user.userId;
    const organization = req.user.organization;

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const resultString = await fabric.evaluateTransaction(
      "GetAccessRequests",
      userId
    );
    const accessRequests = JSON.parse(resultString);

    const practitionerDetails = await Promise.all(
      Object.keys(accessRequests.Authorized).map(async (practitionerId) => {
        try {
          await practitionerFabric.init(
            userId,
            organization,
            "identity-channel",
            "practitioner"
          );
          const practitionerResultString =
            await practitionerFabric.evaluateTransaction(
              "ReadPractitioner",
              practitionerId
            );
          const practitioner = JSON.parse(practitionerResultString);
          return {
            practitionerId,
            authorized: accessRequests.Authorized[practitionerId],
            details: practitioner,
          };
        } catch (error) {
          console.error(
            `Failed to retrieve details for practitioner ${practitionerId}:`,
            error
          );
          return null;
        }
      })
    );

    const validPractitionerDetails = practitionerDetails.filter(
      (practitioner) => practitioner !== null
    );

    res.status(200).json(validPractitionerDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    practitionerFabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.getPatientByEmail = async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  try {
    const patientUser = await User.findOne({ email, role: "patient" });
    if (!patientUser) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // Costruisci l'oggetto da restituire
    const result = {
      userId: patientUser.userId,
      email: patientUser.email,
      username: patientUser.username, // Supponendo che tu abbia un campo username
    };

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deletePendingRequest = async (req, res, next) => {
  const { isOrg = false } = req.body;
  const requesterID = req.params.requesterId;
  const organization = req.user.organization;

  try {
    const channel = "identity-channel";
    const chaincode = "patient";
    const userId = req.user.userId;

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const resultString = await fabric.submitTransaction(
      "DeletePendingRequest",
      userId,
      requesterID,
      isOrg.toString()
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
