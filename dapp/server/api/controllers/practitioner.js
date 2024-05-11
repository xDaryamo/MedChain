const fabric = require('../../blockchain/fabric');

exports.createPractitioner = async (req, res, next) => {
    const practitionerID = req.params.practitionerid;
    const practitionerJSON = req.body

    try {
        const practitioner = await fabric.evaluateTransaction('CreatePractitioner', practitionerID, practitionerJSON);
        res.status(200).json({ practitioner: JSON.parse(practitioner) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.readPractitioner = async (req, res, next) => {
    const practitionerID = req.params.id;
    try {
        const practitioner = await fabric.evaluateTransaction('ReadPractitioner', practitionerID);
        res.status(200).json({ practitioner: JSON.parse(practitioner) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updatePractitioner = async (req, res, next) => {
    const practitionerID = req.params.id;
    const updatedPractitioner = req.body

    try {
        const practitioner = await fabric.evaluateTransaction('UpdatePractitioner', practitionerID, updatedPractitioner);
        res.status(200).json({ practitioner: JSON.parse(practitioner) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deletePractitioner = async (req, res, next) => {
    const practitionerID = req.params.id;

    try {
        const practitioner = await fabric.evaluateTransaction('DeletePractitioner', practitionerID);
        res.status(200).json({ practitioner: JSON.parse(practitioner) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.createProcedure = async (req, res, next) => {
    const procedureID = req.params.procedureid;
    const procedureJSON = req.body

    try {
        const procedure = await fabric.evaluateTransaction('CreateProcedure', procedureID, procedureJSON);
        res.status(200).json({ procedure: JSON.parse(procedure) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.readProcedure = async (req, res, next) => {
    const procedureID = req.params.procedureid;

    try {
        const procedure = await fabric.evaluateTransaction('ReadProcedure', procedureID);
        res.status(200).json({ procedure: JSON.parse(procedure) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProcedure = async (req, res, next) => {
    const procedureID = req.params.procedureid;
    const updatedProcedure = req.body

    try {
        const procedure = await fabric.evaluateTransaction('UpdateProcedure', procedureID, updatedProcedure);
        res.status(200).json({ procedure: JSON.parse(procedure) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.createCondition = async (req, res, next) => {
    const conditionID = req.params.conditionid;
    const conditionJSON = req.body

    try {
        const condition = await fabric.evaluateTransaction('CreateCondition', conditionID, conditionJSON);
        res.status(200).json({ condition: JSON.parse(condition) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.readCondition = async (req, res, next) => {
    const conditionID = req.params.conditionid;
   
    try {
        const condition = await fabric.evaluateTransaction('ReadCondition', conditionID);
        res.status(200).json({ condition: JSON.parse(condition) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCondition = async (req, res, next) => {
    const conditionID = req.params.conditionid;
    const updatedCondition = req.body

    try {
        const condition = await fabric.evaluateTransaction('UpdateCondition', conditionID, updatedCondition);
        res.status(200).json({ condition: JSON.parse(condition) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.createAnnotation = async (req, res, next) => {
    const procedureID = req.params.id;
    // ToDo
};

exports.readAnnotation = async (req, res, next) => {
    const procedureID = req.params.id;
    // ToDO
};


