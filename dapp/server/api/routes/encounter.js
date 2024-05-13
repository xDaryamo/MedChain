const express = require('express');
const router = express.Router();
const encounter = require('../controllers/encounter'); 

// Routes for CRUD operations
router.post('/encounter/:encounterid', encounter.createEncounter);
router.get('/encounter/:encounterid', encounter.getEncounter);
router.put('/encounter/:encounterid', encounter.updateEncounter);
router.delete('/encounter/:encounterid', encounter.deleteEncounter);

// Routes for querying Encounters
router.get('/encounter/patient/:patientid', encounter.getEncountersByPatientID);
router.get('/encounter/date/:startdate/:enddate', encounter.getEncountersByDateRange);
router.get('/encounter/type/:type', encounter.getEncountersByType);
router.get('/encounter/location/:locationid', encounter.getEncountersByLocation);
router.get('/encounter/practitioner/:practitionerid', encounter.getEncountersByPractitioner);
router.get('/encounter/reason/:reason', encounter.getEncountersByReason);
router.get('/encounter/serviceprovider/:serviceproviderid', encounter.getEncountersByServiceProvider);

// Routes for handling Encounters
router.post('/encounter/:encounterid/status', encounter.updateEncounterStatus);
router.post('/encounter/:encounterid/diagnosis', encounter.addDiagnosisToEncounter);
router.post('/encounter/:encounterid/participant', encounter.addParticipantToEncounter);
router.delete('/encounter/:encounterid/participant/:participantindex', encounter.removeParticipantFromEncounter);
router.post('/encounter/:encounterid/location', encounter.addLocationToEncounter);
router.delete('/encounter/:encounterid/location/:locationindex', encounter.removeLocationFromEncounter);

module.exports = router;
