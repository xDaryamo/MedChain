const FabricNetwork = require("../../blockchain/fabric");
const { v4: uuidv4 } = require("uuid");

const fabric = new FabricNetwork();

exports.getLabResultsByPatient = async (req, res, next) => {
  const patientID = req.params.id;
  try {
    const organization = req.user.organization;
    const channel = "lab-results-channel";
    const chaincode = "labresults";

    await fabric.init(patientID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const labResults = await fabric.evaluateTransaction(
      "QueryLabResultsByPatientID",
      patientID
    );
    res.status(200).json({ labResults: JSON.parse(labResults) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.getLabResult = async (req, res, next) => {
  const { resultId } = req.params;
  const practitionerId = req.user.userId; // Use practitioner ID from the verified token
  const organization = req.user.organization;

  try {
    const channel = "lab-results-channel";
    const chaincode = "labresults";

    await fabric.init(practitionerId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const labResultJSONString = await fabric.evaluateTransaction(
      "GetLabResult",
      resultId
    );

    const labResult = JSON.parse(labResultJSONString);

    res.status(200).json({ labResult });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.createLabResult = async (req, res, next) => {
  const labResultData = req.body;
  const practitionerId = req.user.userId; // Use practitioner ID from the verified token
  const organization = req.user.organization;

  try {
    const channel = "lab-results-channel";
    const chaincode = "labresults";
    const uniqueId = uuidv4();

    labResultData.id = uniqueId;

    await fabric.init(practitionerId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    let labResultJSONString;
    try {
      labResultJSONString = JSON.stringify(labResultData);
      JSON.parse(labResultJSONString); // Ensures the string is valid JSON
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    console.log(
      "Submitting transaction with lab result JSON:",
      labResultJSONString
    );

    const result = await fabric.submitTransaction(
      "CreateLabResult",
      labResultJSONString
    );

    res
      .status(201)
      .json({ message: "Lab result created successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.updateLabResult = async (req, res, next) => {
  const labResultID = req.params.resultId;
  const { organization, updatedLabResult } = req.body;
  try {
    const channel = "lab-results-channel";
    const chaincode = "labresults";

    await fabric.init(labResultID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    let updatedLabResultJSONString;
    try {
      updatedLabResultJSONString = JSON.stringify(updatedLabResult);
      JSON.parse(updatedLabResultJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    console.log(
      "Submitting transaction with updated lab result JSON:",
      updatedLabResultJSONString
    );

    const result = await fabric.submitTransaction(
      "UpdateLabResult",
      labResultID,
      updatedLabResultJSONString
    );

    res
      .status(200)
      .json({ message: "Lab result updated successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};
