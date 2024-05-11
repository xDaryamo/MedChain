const express = require('express');

const router = express.Router();

const medicalHistoryController = require('../controllers/medical-history');


// DELETE Delete medical record linked to a patient 
router.get('/patient/:id/medical-history', medicalHistoryController.deleteMedicalRecords);

// POST Create a new medical record linked to a patient 
router.post('/patient/:id/medical-history', medicalHistoryController.createMedicalRecords)

// GET Retrieve medical record details associated with a specific patient
router.get('/patient/:id/medical-history', medicalHistoryController.getMedicalRecordsDetails);

// PATCH update the medical record linked to a patient 
router.patch('/patient/:id/medical-history', medicalHistoryController.updateMedicalRecords)


module.exports = router