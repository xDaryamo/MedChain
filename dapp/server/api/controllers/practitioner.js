const FabricNetwork = require("../../blockchain/fabric");

const fabric = new FabricNetwork();

exports.getPractitioner = async (req, res, next) => {
  const practitionerId = req.params.id;

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

    res
      .status(200)
      .json({ message: "Practitioner retrieved successfully", result: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.createPractitioner = async (req, res, next) => {
  const { organization, fhirData } = req.body;
  try {
    const channel = "identity-channel";
    const chaincode = "practitioner";
    const userId = fhirData.identifier.value;

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    let practitionerJSONString;
    try {
      practitionerJSONString = JSON.stringify(fhirData);
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
      "CreatePractitioner",
      practitionerJSONString
    );
    const result = JSON.parse(resultString);

    return { message: "Practitioner created successfully", result: result };
  } catch (error) {
    return { error: error.message };
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.updatePractitioner = async (req, res, next) => {
  const practitionerId = req.params.id;
  const fhirData = req.body;
  try {
    const channel = "identity-channel";
    const chaincode = "practitioner";
    const userId = req.user.userId;
    const organization = req.user.organization;

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    if (!fhirData.identifier) {
      fhirData.identifier = {};
    }
    fhirData.identifier.value = practitionerId;

    let practitionerJSONString;
    try {
      practitionerJSONString = JSON.stringify(fhirData);
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
    res
      .status(200)
      .json({ message: "Practitioner updated successfully", result: result });
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

    res
      .status(200)
      .json({ message: "Practitioner deleted successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};
