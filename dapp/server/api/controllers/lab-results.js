const FabricNetwork = require('../../blockchain/fabric');
const fabric = new FabricNetwork();

exports.getLabResultsByPatient = async (req, res, next) => {
    const patientID = req.params.id;
    try {
        const resultsDetails = await fabric.evaluateTransaction('QueryLabResults', patientID);
        res.status(200).json({ result: JSON.parse(resultsDetails) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createLabResult = async (req, res, next) => {
    const { resultID, resultJSON } = req.body;
    try {
        const result = await fabric.submitTransaction('CreateLabResult', resultID, resultJSON);
        res.status(201).json({ message: 'LabResult created successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateLabResult = async (req, res, next) => {
    const resultID = req.params.id;
    const updatedResult = req.body.updatedResult; 
    try {
        const result = await fabric.submitTransaction('UpdateLabResult', resultID, JSON.stringify(updatedResult));
        res.status(200).json({ message: 'LabResult updated successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteLabResult= async (req, res, next) => {
    const resultID = req.params.id;
    try {
        const result = await fabric.submitTransaction('DeleteLabResult', resultID);
        res.status(200).json({ message: 'LabResult deleted successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};