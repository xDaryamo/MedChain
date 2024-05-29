const express = require('express');

const router = express.Router();

const medicalHistoryController = require('../controllers/medical-history');


// DELETE Delete medical record linked to a patient 
router.delete('/medical-history/:userid/:recordid', medicalHistoryController.deleteMedicalRecords);

// POST Create a new medical record linked to a patient 
router.post('/medical-history/:userid', medicalHistoryController.createMedicalRecords)

// GET Retrieve medical record details
router.get('/medical-history/:userid/:recordid', medicalHistoryController.getMedicalRecordsDetails);

// GET Retrieve medical record details associated with a specific patient
router.get('/medical-history/:userid/', medicalHistoryController.queryMedicalRecords);

// PATCH update the medical record linked to a patient 
router.patch('/medical-history/:userid/:recordid', medicalHistoryController.updateMedicalRecords)


module.exports = router