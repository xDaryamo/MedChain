const FabricNetwork = require('../../blockchain/fabric');
const fabric = new FabricNetwork();

exports.getMedicationRequest = async (req, res, next) => {
    const prescriptionID = req.params.id;
    try {
        const prescriptionDetails = await fabric.evaluateTransaction('GetMedicationRequest', prescriptionID);
        res.status(200).json({ prescription: JSON.parse(prescriptionDetails) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMedicationRequest = async (req, res, next) => {
    const medicationJSON = req.body;
    try {
        const result = await fabric.submitTransaction('CreateMedicationRequest', medicationJSON);
        res.status(201).json({ message: 'Prescription created successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyPrescription = async (req, res, next) => {
    const prescriptionID = req.params.id;
    try {
        const result = await fabric.submitTransaction('VerifyPrescription', prescriptionID);
        res.status(200).json({ message: 'Prescription verified successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
