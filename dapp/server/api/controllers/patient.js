const FabricNetwork = require('../../blockchain/fabric');
const fabric = new FabricNetwork();

exports.getPatients = async (req, res, next) => {
    // Not implemented yet
    res.status(501).json({ message: 'Not implemented' });
};

exports.getPatientDetails = async (req, res, next) => {
    const patientID = req.params.id;
    try {
        const patientDetails = await fabric.evaluateTransaction('ReadPatient', patientID);
        res.status(200).json({ patient: JSON.parse(patientDetails) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createPatient = async (req, res, next) => {
    const { patientID, patientJSON } = req.body;
    try {
        const result = await fabric.submitTransaction('CreatePatient', patientID, patientJSON);
        res.status(201).json({ message: 'Patient created successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePatient = async (req, res, next) => {
    const patientID = req.params.id;
    const updatedPatient = req.body.updatedPatient; 
    try {
        const result = await fabric.submitTransaction('UpdatePatient', patientID, JSON.stringify(updatedPatient));
        res.status(200).json({ message: 'Organization updated successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePatient = async (req, res, next) => {
    const patientID = req.params.id;
    try {
        const result = await fabric.submitTransaction('DeletePatient', patientID);
        res.status(200).json({ message: 'Patient deleted successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
