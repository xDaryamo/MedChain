const express = require('express');

const router = express.Router();

const medicalHistoryController = require('../controllers/medical-history');


// GET Retrieve all lab results associated with a specific patient
router.get('/patient/:id/medical-history', medicalHistoryController.getMedicalHistoryByPatient);


// POST Create a new prescription linked to a patient and authorized by a doctor
router.post('/patient/:id/medical-history', medicalHistoryController.updateMedicalHistory)


module.exports = router