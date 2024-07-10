const FabricNetwork = require("../../blockchain/fabric");
const { v4: uuidv4 } = require("uuid");
const fabric = new FabricNetwork();

exports.createEncounter = async (req, res, next) => {
  const encounterJSON = req.body;
  const userID = req.user.userId;
  const organization = req.user.organization;
  try {
    const encounterID = uuidv4();
    const channel = "patient-records-channel";
    const chaincode = "encounter";

    encounterJSON.id.value = encounterID;

    if (
      !(await isAuthorized(
        userID,
        organization,
        encounterJSON.subject.reference
      ))
    ) {
      return res.status(403).json({ error: "User not approved" });
    }

    // Validate and stringify JSON
    let encounterJSONString;
    try {
      encounterJSONString = JSON.stringify(encounterJSON);
      JSON.parse(encounterJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.submitTransaction(
      "CreateEncounter",
      encounterJSONString
    );
    res.status(201).json({ result: JSON.parse(result) });
  } catch (error) {
    console.error("Failed to create encounter:", error);
    res.status(500).json({ error: "Failed to create encounter" });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.getEncounter = async (req, res, next) => {
  const encounterID = req.params.id;
  const userID = req.user.userId;
  const organization = req.user.organization;
  try {
    const channel = "patient-records-channel";
    const chaincode = "encounter";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const encounterString = await fabric.evaluateTransaction(
      "ReadEncounter",
      encounterID
    );

    const encounter = JSON.parse(encounter);

    if (
      !(await isAuthorized(userID, organization, encounter.subject.reference))
    ) {
      return res.status(403).json({ error: "User not approved" });
    }

    res.status(200).json({ encounter: encounter });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.updateEncounter = async (req, res, next) => {
  const encounterID = req.params.id;
  const updatedEncounter = req.body;
  const userID = req.user.userId;
  const organization = req.user.organization;
  try {
    if (
      !(await isAuthorized(
        userID,
        organization,
        updatedEncounter.subject.reference
      ))
    ) {
      return res.status(403).json({ error: "User not approved" });
    }

    const channel = "patient-records-channel";
    const chaincode = "encounter";

    let encounterJSONString;
    try {
      encounterJSONString = JSON.stringify(updatedEncounter);
      JSON.parse(encounterJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");
    const result = await fabric.submitTransaction(
      "UpdateEncounter",
      encounterID,
      encounterJSONString
    );

    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.deleteEncounter = async (req, res, next) => {
  const encounterID = req.params.id;
  const userID = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "patient-records-channel";
    const chaincode = "encounter";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const encounterString = await fabric.evaluateTransaction(
      "ReadEncounter",
      encounterID
    );
    const encounter = JSON.parse(encounterString);

    if (
      !(await isAuthorized(userID, organization, encounter.subject.reference))
    ) {
      return res.status(403).json({ error: "User not approved" });
    }

    const result = await fabric.submitTransaction(
      "DeleteEncounter",
      encounterID
    );
    res.status(200).json({ result: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.searchEncounter = async (req, res, next) => {
  const queryString = req.body.query || { selector: {} };
  const userID = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "patient-records-channel";
    const chaincode = "encounter";

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
      "SearchEncounters",
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
