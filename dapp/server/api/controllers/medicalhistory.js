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

exports.createCondition = async (req, res, next) => {
  const conditionJSON = req.body;

  try {
    const conditionID = uuidv4();
    conditionJSON.identifier = conditionID;

    const channel = "patient-records-channel";
    const chaincode = "records";

    let conditionJSONString;
    try {
      conditionJSONString = JSON.stringify(conditionJSON);
      JSON.parse(conditionJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    await fabric.init(req.user.userId, req.user.organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    console.log("Submitting transaction with condition JSON:", conditionJSONString);

    const result = await fabric.submitTransaction(
      "CreateCondition",
      conditionID,
      conditionJSONString
    );
    res.status(201).json({ message: "Condition created successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.readCondition = async (req, res, next) => {
  const conditionID = req.params.id;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(req.user.userId, req.user.organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.evaluateTransaction(
      "ReadCondition",
      conditionID
    );
    res.status(200).json({ condition: JSON.parse(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.updateCondition = async (req, res, next) => {
  const conditionID = req.params.id;
  const updatedCondition = req.body;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(req.user.userId, req.user.organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.submitTransaction(
      "UpdateCondition",
      conditionID,
      JSON.stringify(updatedCondition)
    );
    res.status(200).json({ message: "Condition updated successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.deleteCondition = async (req, res, next) => {
  const conditionID = req.params.id;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(req.user.userId, req.user.organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.submitTransaction(
      "DeleteCondition",
      conditionID
    );
    res.status(200).json({ message: "Condition deleted successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.createProcedure = async (req, res, next) => {
  const procedureData = req.body;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(req.user.userId, req.user.organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.submitTransaction(
      "CreateProcedure",
      JSON.stringify(procedureData)
    );
    res.status(201).json({ message: "Procedure created successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.readProcedure = async (req, res, next) => {
  const procedureID = req.params.id;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(req.user.userId, req.user.organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.evaluateTransaction(
      "ReadProcedure",
      procedureID
    );
    res.status(200).json({ procedure: JSON.parse(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.updateProcedure = async (req, res, next) => {
  const procedureID = req.params.id;
  const updatedProcedure = req.body;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(req.user.userId, req.user.organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.submitTransaction(
      "UpdateProcedure",
      procedureID,
      JSON.stringify(updatedProcedure)
    );
    res.status(200).json({ message: "Procedure updated successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.deleteProcedure = async (req, res, next) => {
  const procedureID = req.params.id;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(req.user.userId, req.user.organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.submitTransaction(
      "DeleteProcedure",
      procedureID
    );
    res.status(200).json({ message: "Procedure deleted successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};
