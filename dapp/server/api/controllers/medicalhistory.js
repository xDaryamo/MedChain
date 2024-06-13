const FabricNetwork = require("../../blockchain/fabric");
const fabric = new FabricNetwork();
const { v4: uuidv4 } = require("uuid");

exports.getMedicalRecordsDetails = async (req, res, next) => {
  const recordID = req.params.id;
  const organization = req.user.organization;
  const userID = req.user.userId;
  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const record = await fabric.evaluateTransaction(
      "ReadMedicalRecords",
      recordID
    );
    res.status(200).json({ record: JSON.parse(record) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Disconnetti dalla rete Fabric
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.createMedicalRecords = async (req, res, next) => {
  const recordJSON = req.body;
  const organization = req.user.organization;
  const userID = req.user.userId;
  try {
    const recordID = uuidv4();
    recordJSON.identifier = recordID;

    const channel = "patient-records-channel";
    const chaincode = "records";

    let recordJSONString;
    try {
      recordJSONString = JSON.stringify(recordJSON);
      JSON.parse(recordJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    console.log("Submitting transaction with record JSON:", recordJSONString);

    const result = await fabric.submitTransaction(
      "CreateMedicalRecords",
      JSON.stringify(recordJSON)
    );
    res
      .status(201)
      .json({ message: "Record created successfully", result: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Disconnetti dalla rete Fabric
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.updateMedicalRecords = async (req, res, next) => {
  const recordID = req.params.id;
  const updatedRecord = req.body;
  const organization = req.user.organization;
  const userID = req.user.userId;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");
    const result = await fabric.submitTransaction(
      "UpdateMedicalRecords",
      recordID,
      JSON.stringify(updatedRecord)
    );
    res.status(200).json({ message: "Record updated successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Disconnetti dalla rete Fabric
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.deleteMedicalRecords = async (req, res, next) => {
  const recordID = req.params.id;
  const userID = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");
    const result = await fabric.submitTransaction(
      "DeleteMedicalRecords",
      recordID
    );
    res.status(200).json({ message: "Record deleted successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Disconnetti dalla rete Fabric
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.searchMedicalRecords = async (req, res, next) => {
  const queryString = req.body.query || JSON.stringify({ selector: {} });

  const userId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

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
      "SearchMedicalRecords",
      queryJSONString
    );

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
