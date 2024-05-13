const FabricNetwork = require('../../blockchain/fabric');
const fabric = new FabricNetwork();

exports.getMedicalRecordsDetails = async (req, res, next) => {
    const patientID = req.params.id;
    try {
        const recordDetails = await fabric.evaluateTransaction('GetMedicalRecords', patientID);
        res.status(200).json({ record: JSON.parse(recordDetails) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMedicalRecords = async (req, res, next) => {
    const patientID = req.params.id;
    const recordJSON  = req.body;
    try {
        const result = await fabric.submitTransaction('CreateMedicalRecords', patientID, recordJSON);
        res.status(201).json({ message: 'Record created successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateMedicalRecords = async (req, res, next) => {
    const patientID = req.params.id;
    const updatedRecord = req.body.updatedOrganization; 
    try {
        const result = await fabric.submitTransaction('UpdateMedicalRecords', patientID, JSON.stringify(updatedRecord));
        res.status(200).json({ message: 'Record updated successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMedicalRecords = async (req, res, next) => {
    const patientID = req.params.id;
    try {
        const result = await fabric.submitTransaction('DeleteMedicalRecords', patientID);
        res.status(200).json({ message: 'Record deleted successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};