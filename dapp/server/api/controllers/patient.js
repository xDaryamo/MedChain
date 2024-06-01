const FabricNetwork = require("../../blockchain/fabric");

const fabric = new FabricNetwork();

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

    res
      .status(200)
      .json({ message: "Patient retrieved successfully", result: result });
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

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    // Validate and stringify JSON
    let patientJSONString;
    try {
      patientJSONString = JSON.stringify(fhirData);
      JSON.parse(patientJSONString); // This ensures the string is valid JSON
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return { error: "Invalid JSON format" };
    }

    // Log the JSON string
    console.log("Submitting transaction with patient JSON:", patientJSONString);

    const result = await fabric.submitTransaction(
      "CreatePatient",
      patientJSONString
    );

    return { message: "Patient created successfully", result: result };
  } catch (error) {
    return { error: error.message };
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
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

    if (!fhirData.identifier) {
      fhirData.identifier = {};
    }
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
    res
      .status(200)
      .json({ message: "Patient updated successfully", result: result });
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
    const result = JSON.parse(resultString); // Assuming resultString is JSON string

    res.status(200).json({ message: "Patient deleted successfully", result });
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

    // Log the result string for debugging
    console.log("Result from blockchain:", resultString);

    // Check if resultString is valid JSON
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

    res
      .status(200)
      .json({ message: "Access request sent successfully", result });
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
  const isOrg = req.body.isOrg;
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
    const result = JSON.parse(resultString); // Assuming resultString is JSON string

    res.status(200).json({ message: "Access granted successfully", result });
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
  const organization = req.user.organization;

  try {
    const channel = "identity-channel";
    const chaincode = "patient";

    await fabric.init(patientID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const resultString = await fabric.submitTransaction(
      "RevokeAccess",
      patientID,
      requesterID
    );
    const result = JSON.parse(resultString); // Assuming resultString is JSON string

    res.status(200).json({ message: "Access revoked successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};
