const FabricNetwork = require("../../blockchain/fabric");
const { v4: uuidv4 } = require("uuid");

const fabric = new FabricNetwork();

exports.getPrescription = async (req, res, next) => {
  const prescriptionID = req.params.id;
  const userId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "prescriptions-channel";
    const chaincode = "prescription";

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const prescriptionDetails = await fabric.evaluateTransaction(
      "ReadPrescription",
      prescriptionID
    );
    res.status(200).json({ prescription: JSON.parse(prescriptionDetails) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.createPrescription = async (req, res, next) => {
  const prescriptionJSON = req.body;
  const userId = req.user.userId;
  const organization = req.user.organization;
  try {
    const channel = "prescriptions-channel";
    const chaincode = "prescription";
    const uniqueId = uuidv4();

    prescriptionJSON.identifier.value = uniqueId;

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    let prescriptionJSONString;
    try {
      prescriptionJSONString = JSON.stringify(prescriptionJSON);
      JSON.parse(prescriptionJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    console.log(
      "Submitting transaction with prescription request JSON:",
      prescriptionJSONString
    );

    const resultString = await fabric.submitTransaction(
      "CreatePrescription",
      prescriptionJSONString
    );

    let result;
    try {
      result = JSON.parse(resultString);
    } catch (error) {
      console.error("Failed to parse result string:", error);
      return res.status(500).json({ error: "Failed to parse result string" });
    }

    res.status(201).json({
      prescription: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.updatePrescription = async (req, res, next) => {
  const prescriptionJSON = req.body;
  const userId = req.user.userId;
  const organization = req.user.organization;
  const prescriptionId = req.params.id;

  try {
    const channel = "prescriptions-channel";
    const chaincode = "prescription";

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    prescriptionJSON.identifier = { value: prescriptionId };

    let prescriptionJSONString;
    try {
      prescriptionJSONString = JSON.stringify(prescriptionJSON);
      JSON.parse(prescriptionJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    console.log(
      "Submitting transaction with updated prescription request JSON:",
      prescriptionJSONString
    );

    const resultString = await fabric.submitTransaction(
      "UpdatePrescription",
      prescriptionJSONString
    );

    let result;
    try {
      result = JSON.parse(resultString);
    } catch (error) {
      console.error("Failed to parse result string:", error);
      return res.status(500).json({ error: "Failed to parse result string" });
    }

    res.status(200).json({
      prescription: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.deletePrescription = async (req, res, next) => {
  const prescriptionId = req.params.id;
  const userId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "prescriptions-channel";
    const chaincode = "prescription";

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    console.log(
      "Submitting transaction to delete prescription:",
      prescriptionId
    );

    const resultString = await fabric.submitTransaction(
      "DeletePrescription",
      prescriptionId
    );

    let result;
    try {
      result = JSON.parse(resultString);
    } catch (error) {
      console.error("Failed to parse result string:", error);
      return res.status(500).json({ error: "Failed to parse result string" });
    }

    res.status(200).json({
      prescription: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.searchPrescriptions = async (req, res, next) => {
  const queryString = req.body.query || { selector: {} };

  const userId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "prescriptions-channel";
    const chaincode = "prescription";

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
      "SearchPrescriptions",
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

// Batch operations
exports.createPrescriptionsBatch = async (req, res, next) => {
  const prescriptionsJSON = req.body.prescriptions;
  const userId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "prescriptions-channel";
    const chaincode = "prescription";

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    prescriptionsJSON.forEach((prescription) => {
      prescription.identifier = {
        ...prescription.identifier,
        value: uuidv4(),
      };
    });

    let prescriptionsJSONString;
    try {
      prescriptionsJSONString = JSON.stringify(prescriptionsJSON);
      JSON.parse(prescriptionsJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    console.log(
      "Submitting transaction with prescriptions batch JSON:",
      prescriptionsJSONString
    );

    const resultString = await fabric.submitTransaction(
      "CreatePrescriptionsBatch",
      prescriptionsJSONString
    );

    res.status(201).json({
      prescriptions: prescriptionsJSON,
    });
  } catch (error) {
    console.error("Error creating prescriptions batch:", error);
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.updatePrescriptionsBatch = async (req, res, next) => {
  console.log("updatePrescriptionsBatch controller called");
  console.log("User:", req.user);
  console.log("Request Body:", JSON.stringify(req.body, null, 2));

  const prescriptionsJSON = req.body.prescriptions;
  const userId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "prescriptions-channel";
    const chaincode = "prescription";

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    // Assicurati che gli identificatori non vengano modificati
    prescriptionsJSON.forEach((prescription) => {
      if (!prescription.identifier || !prescription.identifier.value) {
        throw new Error("Missing identifier for prescription");
      }
    });

    let prescriptionsJSONString;
    try {
      prescriptionsJSONString = JSON.stringify(prescriptionsJSON);
      JSON.parse(prescriptionsJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    // Check if each prescription exists before attempting to update
    for (const prescription of prescriptionsJSON) {
      const prescriptionID = prescription.identifier.value;
      console.log(`Checking existence of prescription ID: ${prescriptionID}`);

      try {
        const existingPrescription = await fabric.evaluateTransaction(
          "ReadPrescription",
          prescriptionID
        );
        console.log(`Prescription ID ${prescriptionID} exists.`);
      } catch (readError) {
        console.error(
          `Prescription ID ${prescriptionID} does not exist.`,
          readError
        );
        return res
          .status(404)
          .json({ error: `Prescription ID ${prescriptionID} does not exist.` });
      }
    }

    console.log(
      "Submitting transaction with updated prescriptions batch JSON:",
      prescriptionsJSONString
    );

    const resultString = await fabric.submitTransaction(
      "UpdatePrescriptionsBatch",
      prescriptionsJSONString
    );

    res.status(200).json({
      prescriptions: prescriptionsJSON,
    });
  } catch (error) {
    console.error("Error updating prescriptions batch:", error);
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.deletePrescriptionsBatch = async (req, res, next) => {
  const prescriptionIDs = req.body.ids;
  const userId = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "prescriptions-channel";
    const chaincode = "prescription";

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    let prescriptionIDsJSONString;
    try {
      prescriptionIDsJSONString = JSON.stringify(prescriptionIDs);
      JSON.parse(prescriptionIDsJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    console.log(
      "Submitting transaction to delete prescriptions batch:",
      prescriptionIDsJSONString
    );

    const resultString = await fabric.submitTransaction(
      "DeletePrescriptionsBatch",
      prescriptionIDsJSONString
    );

    res.status(200).json({
      prescriptions: prescriptionIDs,
    });
  } catch (error) {
    console.error("Error deleting prescriptions batch:", error);
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};
