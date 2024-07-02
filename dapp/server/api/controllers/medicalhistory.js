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

  if (!(await isAuthorized(userID, organization, recordJSON.patientID))) {
    return res.status(403).json({ error: "User not approved" });
  }

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
      recordJSONString
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

  if (!(await isAuthorized(userID, organization, updatedRecord.patientID))) {
    return res.status(403).json({ error: "User not approved" });
  }

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
    const chaincode = "record";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const recordString = await fabric.evaluateTransaction(
      "ReadMedicalRecords",
      recordID
    );
    const record = JSON.parse(recordString);

    if (!(await isAuthorized(userID, organization, record.patientID))) {
      return res.status(403).json({ error: "User not approved" });
    }

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
  const queryString = req.body.query || { selector: {} };

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

exports.createCondition = async (req, res, next) => {
  const conditionJSON = req.body;
  const userId = req.user.userId;
  const organization = req.user.organization;

  if (
    !(await isAuthorized(userId, organization, conditionJSON.subject.reference))
  ) {
    return res.status(403).json({ error: "User not approved" });
  }

  try {
    const conditionID = uuidv4();
    conditionJSON.identifier.value = conditionID;

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

    await fabric.init(
      req.user.userId,
      req.user.organization,
      channel,
      chaincode
    );
    console.log("Fabric network initialized successfully.");

    console.log(
      "Submitting transaction with condition JSON:",
      conditionJSONString
    );

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
  const userId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(
      req.user.userId,
      req.user.organization,
      channel,
      chaincode
    );
    console.log("Fabric network initialized successfully.");

    const result = await fabric.evaluateTransaction(
      "ReadCondition",
      conditionID
    );

    const condition = JSON.parse(result);

    if (
      !(await isAuthorized(userId, organization, condition.subject.reference))
    ) {
      return res.status(403).json({ error: "User not approved" });
    }

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
  const userId = req.user.userId;
  const organization = req.user.organization;

  if (
    !(await isAuthorized(
      userId,
      organization,
      updatedCondition.subject.reference
    ))
  ) {
    return res.status(403).json({ error: "User not approved" });
  }

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(
      req.user.userId,
      req.user.organization,
      channel,
      chaincode
    );
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
  const userId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const conditionString = await fabric.evaluateTransaction(
      "ReadCondition",
      conditionID
    );
    const condition = JSON.parse(conditionString);

    if (
      !(await isAuthorized(userId, organization, condition.subject.reference))
    ) {
      return res.status(403).json({ error: "User not approved" });
    }

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

exports.searchConditions = async (req, res, next) => {
  const queryString = req.params.query || { selector: {} };

  const userID = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

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
      "SearchConditions",
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

exports.createProcedure = async (req, res, next) => {
  const procedureData = req.body;
  const userId = req.user.userId;
  const organization = req.user.organization;

  if (
    !(await isAuthorized(userId, organization, procedureData.subject.reference))
  ) {
    return res.status(403).json({ error: "User not approved" });
  }

  try {
    const procedureID = uuidv4();
    procedureData.identifier.value = procedureID;

    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(
      req.user.userId,
      req.user.organization,
      channel,
      chaincode
    );
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
  const userId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(
      req.user.userId,
      req.user.organization,
      channel,
      chaincode
    );
    console.log("Fabric network initialized successfully.");

    const result = await fabric.evaluateTransaction(
      "ReadProcedure",
      procedureID
    );

    const procedure = JSON.parse(result);

    if (
      !(await isAuthorized(userId, organization, procedure.subject.reference))
    ) {
      return res.status(403).json({ error: "User not approved" });
    }

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
  const userId = req.user.userId;
  const organization = req.user.organization;

  if (
    !(await isAuthorized(
      userId,
      organization,
      updatedProcedure.subject.reference
    ))
  ) {
    return res.status(403).json({ error: "User not approved" });
  }

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(
      req.user.userId,
      req.user.organization,
      channel,
      chaincode
    );
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
  const userId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(
      req.user.userId,
      req.user.organization,
      channel,
      chaincode
    );
    console.log("Fabric network initialized successfully.");

    const procedureString = await fabric.evaluateTransaction(
      "ReadProcedure",
      procedureID
    );
    const procedure = JSON.parse(procedureString);

    if (
      !(await isAuthorized(userId, organization, procedure.subject.reference))
    ) {
      return res.status(403).json({ error: "User not approved" });
    }

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

exports.searchProcedures = async (req, res, next) => {
  const queryString = req.params.query || { selector: {} };

  const userID = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

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
      "SearchProcedures",
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

exports.createAllergy = async (req, res, next) => {
  const allergyJSON = req.body;
  const userID = req.user.userId;
  const organization = req.user.organization;
  try {
    const allergyID = uuidv4();
    allergyJSON.identifier.value = allergyID;

    const channel = "patient-records-channel";
    const chaincode = "records";

    if (
      !(await isAuthorized(userID, organization, allergyJSON.patient.reference))
    ) {
      return res.status(403).json({ error: "User not approved" });
    }

    // Validate and stringify JSON
    let allergyJSONString;
    try {
      allergyJSONString = JSON.stringify(allergyJSON);
      JSON.parse(allergyJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.submitTransaction(
      "CreateAllergy",
      allergyJSONString
    );
    res.status(201).json({ result: result });
  } catch (error) {
    console.error("Failed to create allergy:", error);
    res.status(500).json({ error: "Failed to create allergy" });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.getAllergy = async (req, res, next) => {
  const allergyID = req.params.id;
  const userID = req.user.userId;
  const organization = req.user.organization;
  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const allergyString = await fabric.evaluateTransaction(
      "ReadAllergy",
      allergyID
    );

    const allergy = JSON.parse(allergyString);

    if (
      !(await isAuthorized(userID, organization, allergy.patient.reference))
    ) {
      return res.status(403).json({ error: "User not approved" });
    }

    res.status(200).json({ allergy: allergy });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.updateAllergy = async (req, res, next) => {
  const allergyID = req.params.id;
  const updatedallergy = req.body;
  const userID = req.user.userId;
  const organization = req.user.organization;
  try {
    if (
      !(await isAuthorized(
        userID,
        organization,
        updatedallergy.patient.reference
      ))
    ) {
      return res.status(403).json({ error: "User not approved" });
    }

    const channel = "patient-records-channel";
    const chaincode = "records";

    let allergyJSONString;
    try {
      allergyJSONString = JSON.stringify(allergyJSON);
      JSON.parse(allergyJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");
    const result = await fabric.submitTransaction(
      "UpdateAllergy",
      allergyID,
      allergyJSONString
    );

    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.deleteAllergy = async (req, res, next) => {
  const allergyID = req.params.id;
  const userID = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const allergyString = await fabric.evaluateTransaction(
      "ReadAllergy",
      allergyID
    );
    const allergy = JSON.parse(allergyString);

    if (
      !(await isAuthorized(userID, organization, allergy.subject.reference))
    ) {
      return res.status(403).json({ error: "User not approved" });
    }

    const result = await fabric.submitTransaction("DeleteAllergy", allergyID);
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.searchAllergies = async (req, res, next) => {
  const queryString = req.params.query || { selector: {} };

  const userID = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "patient-records-channel";
    const chaincode = "records";

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
      "SearchAllergies",
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

async function isAuthorized(userID, organization, patientReference) {
  const identity_channel = "identity-channel";
  const auth_chaincode = "patient";

  await fabric.init(userID, organization, identity_channel, auth_chaincode);
  console.log("Verifying user...");

  const authBool = await fabric.submitTransaction(
    "IsAuthorized",
    patientReference,
    userID
  );

  fabric.disconnect();
  if (authBool === "false") {
    console.log("User not approved", userID);
    return false;
  }

  console.log("User approved with success", userID);
  return true;
}
