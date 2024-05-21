const FabricNetwork = require("../../blockchain/fabric");
const fabric = new FabricNetwork();

exports.getMedicationRequest = async (req, res, next) => {
  const prescriptionID = req.params.id;
  try {
    const organization = "patients.medchain.com";
    const channel = "patient-records-channel";
    const chaincode = "prescription";

    await fabric.init(prescriptionID, organization, channel, chaincode);
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
  try {
    const organization = "patients.medchain.com";
    const channel = "patient-records-channel";
    const chaincode = "prescription";

    const medicationJSONString = JSON.stringify(medicationJSON);
    JSON.parse(medicationJSONString); // Ensure the string is valid JSON

    await fabric.init(
      medicationJSON.patientID,
      organization,
      channel,
      chaincode
    );
    console.log("Fabric network initialized successfully.");

    console.log(
      "Submitting transaction with medication request JSON:",
      medicationJSONString
    );

    const result = await fabric.submitTransaction(
      "CreatePrescription",
      medicationJSONString
    );
    res
      .status(201)
      .json({ message: "Prescription created successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.verifyPrescription = async (req, res, next) => {
  const prescriptionID = req.params.id;
  const pharmacyID = req.body.pharmacyID;
  try {
    const organization = "patients.medchain.com";
    const channel = "patient-records-channel";
    const chaincode = "prescription";

    await fabric.init(prescriptionID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.submitTransaction(
      "VerifyPrescription",
      prescriptionID,
      pharmacyID
    );
    res
      .status(200)
      .json({ message: "Prescription verified successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};
