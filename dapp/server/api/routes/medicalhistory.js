const express = require('express');

const router = express.Router();

const medicalHistoryController = require('../controllers/medicalhistory');
const { verifyToken, authorizeOrganization } = require("../middleware/auth");


// DELETE Delete medical record linked to a patient 
router.delete('/medicalhistory/:recordid', 
verifyToken,
authorizeOrganization(["patients.medchain.com", "ospedale-maresca.aslnapoli3.medchain.com"]),
medicalHistoryController.deleteMedicalRecords);

// POST Create a new medical record linked to a patient 
router.post('/medicalhistory', 
verifyToken,
authorizeOrganization(["patients.medchain.com", "ospedale-maresca.aslnapoli3.medchain.com"]),
medicalHistoryController.createMedicalRecords)

// GET Retrieve medical record details
router.get('/medicalhistory/:recordid',
verifyToken,
authorizeOrganization(["patients.medchain.com", "ospedale-maresca.aslnapoli3.medchain.com"]),
medicalHistoryController.getMedicalRecordsDetails);

// GET Retrieve medical record details associated with a specific patient
router.get('/medicalhistory/:query', 
verifyToken,
authorizeOrganization(["patients.medchain.com", "ospedale-maresca.aslnapoli3.medchain.com"]),
medicalHistoryController.queryMedicalRecords);

// PATCH update the medical record linked to a patient 
router.patch('/medicalhistory/:recordid', 
verifyToken,
authorizeOrganization(["patients.medchain.com", "ospedale-maresca.aslnapoli3.medchain.com"]),
medicalHistoryController.updateMedicalRecords)


module.exports = router