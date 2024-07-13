const FabricNetwork = require("../../blockchain/fabric");
const { v4: uuidv4 } = require("uuid");

const fabric = new FabricNetwork();

exports.getLabResult = async (req, res, next) => {
  const resultId = req.params.id;
  const practitionerId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "lab-results-channel";
    const chaincode = "labresults";

    await fabric.init(practitionerId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const labResultJSONString = await fabric.evaluateTransaction(
      "ReadLabResult",
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
  const practitionerId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "lab-results-channel";
    const chaincode = "labresults";
    const uniqueId = uuidv4();

    labResultData.identifier.value = uniqueId;

    await fabric.init(practitionerId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    let labResultJSONString;
    try {
      labResultJSONString = JSON.stringify(labResultData);
      JSON.parse(labResultJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    console.log(
      "Submitting transaction with lab result JSON:",
      labResultJSONString
    );

    const resultString = await fabric.submitTransaction(
      "CreateLabResult",
      labResultJSONString
    );

    let result;
    try {
      result = JSON.parse(resultString);
    } catch (error) {
      console.error("Failed to parse result string:", error);
      return res.status(500).json({ error: "Failed to parse result string" });
    }

    res.status(201).json({
      result: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.updateLabResult = async (req, res, next) => {
  const labResultID = req.params.id;
  const updatedLabResult = req.body;
  const organization = req.user.organization;
  const practitionerId = req.user.userId;
  console.log(labResultID);

  try {
    const channel = "lab-results-channel";
    const chaincode = "labresults";

    await fabric.init(practitionerId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    updatedLabResult.identifier.value = labResultID;

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

    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.deleteLabResult = async (req, res, next) => {
  const labResultID = req.params.id;
  const organization = req.user.organization;
  const practitionerId = req.user.userId;

  try {
    const channel = "lab-results-channel";
    const chaincode = "labresults";

    await fabric.init(practitionerId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    console.log(
      "Submitting transaction to delete lab result with ID:",
      labResultID
    );

    const result = await fabric.submitTransaction(
      "DeleteLabResult",
      labResultID
    );

    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.searchLabResults = async (req, res, next) => {
  const queryString = req.body.query || { selector: {} };

  const userID = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "lab-results-channel";
    const chaincode = "labresults";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    let queryJSONString;
    try {
      queryJSONString = JSON.stringify(queryString);
      JSON.parse(queryJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON Format: ", jsonError);
      return res.status(400).json({ error: "Invalid JSON Format" });
    }

    console.log(
      "Submitting query transaction with query JSON string:",
      queryJSONString
    );

    const resultString = await fabric.submitTransaction(
      "SearchLabResults",
      queryJSONString
    );

    let results;
    try {
      results = JSON.parse(resultString);
    } catch (error) {
      console.error("Failed to parse result string: ", error);
      return res.status(500).json({ error: "Failed to parse result string" });
    }

    res.status(200).json({ results: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};
