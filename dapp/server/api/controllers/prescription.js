const FabricNetwork = require("../../blockchain/fabric");
const { v4: uuidv4 } = require("uuid");

const fabric = new FabricNetwork();

exports.getMedicationRequest = async (req, res, next) => {
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
exports.createMedicationRequest = async (req, res, next) => {
  const medicationJSON = req.body;
  const userId = req.user.userId;
  const organization = req.user.organization;
  try {
    const channel = "prescriptions-channel";
    const chaincode = "prescription";
    const uniqueId = uuidv4();

    medicationJSON.identifier.value = uniqueId;

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    let medicationJSONString;
    try {
      medicationJSONString = JSON.stringify(medicationJSON);
      JSON.parse(medicationJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    console.log(
      "Submitting transaction with medication request JSON:",
      medicationJSONString
    );

    const resultString = await fabric.submitTransaction(
      "CreatePrescription",
      medicationJSONString
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

exports.updatePrescription = async (req, res, next) => {
  const medicationJSON = req.body;
  const userId = req.user.userId;
  const organization = req.user.organization;
  const prescriptionId = req.params.id;

  try {
    const channel = "prescriptions-channel";
    const chaincode = "prescription";

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    medicationJSON.identifier = { value: prescriptionId };

    let medicationJSONString;
    try {
      medicationJSONString = JSON.stringify(medicationJSON);
      JSON.parse(medicationJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    console.log(
      "Submitting transaction with updated medication request JSON:",
      medicationJSONString
    );

    const resultString = await fabric.submitTransaction(
      "UpdatePrescription",
      medicationJSONString
    );

    let result;
    try {
      result = JSON.parse(resultString);
    } catch (error) {
      console.error("Failed to parse result string:", error);
      return res.status(500).json({ error: "Failed to parse result string" });
    }

    res.status(200).json({
      result: result,
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
      result: result,
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

// exports.verifyPrescription = async (req, res, next) => {
//   const prescriptionID = req.params.id;
//   const pharmacyID = req.body.pharmacyID;
//   try {
//     const organization = "patients.medchain.com";
//     const channel = "patient-records-channel";
//     const chaincode = "prescription";

//     await fabric.init(prescriptionID, organization, channel, chaincode);
//     console.log("Fabric network initialized successfully.");

//     const result = await fabric.submitTransaction(
//       "VerifyPrescription",
//       prescriptionID,
//       pharmacyID
//     );
//     res
//       .status(200)
//       .json({ message: "Prescription verified successfully", result });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   } finally {
//     fabric.disconnect();
//     console.log("Disconnected from Fabric gateway.");
//   }
// };
