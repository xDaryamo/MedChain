const FabricNetwork = require('../../blockchain/fabric');
const fabric = new FabricNetwork();

exports.createEncounter = async (req, res, next) => {
    const encounterID = req.params.encounterid;
    const encounterJSON = req.body;

    try {
        const result = await fabric.submitTransaction('CreateEncounter', encounterID, JSON.stringify(encounterJSON));
        res.status(201).json({ message: 'Encounter created successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEncounter = async (req, res, next) => {
    const encounterID = req.params.encounterid;

    try {
        const encounter = await fabric.evaluateTransaction('GetEncounter', encounterID);
        res.status(200).json({ encounter: JSON.parse(encounter) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEncounter = async (req, res, next) => {
    const encounterID = req.params.encounterid;
    const updatedEncounter = req.body;

    try {
        const result = await fabric.submitTransaction('UpdateEncounter', encounterID, JSON.stringify(updatedEncounter));
        res.status(200).json({ message: 'Encounter updated successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteEncounter = async (req, res, next) => {
    const encounterID = req.params.encounterid;

    try {
        const result = await fabric.submitTransaction('DeleteEncounter', encounterID);
        res.status(200).json({ message: 'Encounter deleted successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEncountersByPatientID = async (req, res, next) => {
    const patientID = req.params.patientid;

    try {
        const encounters = await fabric.evaluateTransaction('GetEncountersByPatientID', patientID);
        res.status(200).json({ encounters: JSON.parse(encounters) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEncountersByDateRange = async (req, res, next) => {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    try {
        const encounters = await fabric.evaluateTransaction('GetEncountersByDateRange', startDate.toISOString(), endDate.toISOString());
        res.status(200).json({ encounters: JSON.parse(encounters) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEncountersByType = async (req, res, next) => {
    const encounterType = req.params.type;

    try {
        const encounters = await fabric.evaluateTransaction('GetEncountersByType', encounterType);
        res.status(200).json({ encounters: JSON.parse(encounters) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEncountersByLocation = async (req, res, next) => {
    const locationID = req.params.locationid;

    try {
        const encounters = await fabric.evaluateTransaction('GetEncountersByLocation', locationID);
        res.status(200).json({ encounters: JSON.parse(encounters) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEncountersByPractitioner = async (req, res, next) => {
    const practitionerID = req.params.practitionerid;

    try {
        const encounters = await fabric.evaluateTransaction('GetEncountersByPractitioner', practitionerID);
        res.status(200).json({ encounters: JSON.parse(encounters) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEncounterStatus = async (req, res, next) => {
    const encounterID = req.params.encounterid;
    const newStatus = req.body.newStatus;

    try {
        const result = await fabric.submitTransaction('UpdateEncounterStatus', encounterID, JSON.stringify(newStatus));
        res.status(200).json({ message: 'Encounter status updated successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addDiagnosisToEncounter = async (req, res, next) => {
    const encounterID = req.params.encounterid;
    const diagnosis = req.body.diagnosis;

    try {
        const result = await fabric.submitTransaction('AddDiagnosisToEncounter', encounterID, JSON.stringify(diagnosis));
        res.status(200).json({ message: 'Diagnosis added to encounter successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addParticipantToEncounter = async (req, res, next) => {
    const encounterID = req.params.encounterid;
    const participant = req.body.participant;

    try {
        const result = await fabric.submitTransaction('AddParticipantToEncounter', encounterID, JSON.stringify(participant));
        res.status(200).json({ message: 'Participant added to encounter successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeParticipantFromEncounter = async (req, res, next) => {
    const encounterID = req.params.encounterid;
    const participantIndex = req.params.participantindex;

    try {
        const result = await fabric.submitTransaction('RemoveParticipantFromEncounter', encounterID, participantIndex);
        res.status(200).json({ message: 'Participant removed from encounter successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addLocationToEncounter = async (req, res, next) => {
    const encounterID = req.params.encounterid;
    const location = req.body.location;

    try {
        const result = await fabric.submitTransaction('AddLocationToEncounter', encounterID, JSON.stringify(location));
        res.status(200).json({ message: 'Location added to encounter successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeLocationFromEncounter = async (req, res, next) => {
    const encounterID = req.params.encounterid;
    const locationIndex = req.params.locationindex;

    try {
        const result = await fabric.submitTransaction('RemoveLocationFromEncounter', encounterID, locationIndex);
        res.status(200).json({ message: 'Location removed from encounter successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEncountersByReason = async (req, res, next) => {
    const reason = req.params.reason;

    try {
        const encounters = await fabric.evaluateTransaction('GetEncountersByReason', reason);
        res.status(200).json({ encounters: JSON.parse(encounters) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getEncountersByServiceProvider = async (req, res, next) => {
    const serviceProviderID = req.params.serviceproviderid;

    try {
        const encounters = await fabric.evaluateTransaction('GetEncountersByServiceProvider', serviceProviderID);
        res.status(200).json({ encounters: JSON.parse(encounters) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};