const express = require('express');

const router = express.Router();

const patientController = require('../controllers/patient');


// GET Patient Details
router.get('/patient/:id', patientController.getPatientDetails);

// POST Register a new Patient
router.post('/patient/:id', patientController.createPatient)

// PATCH Update Exisisting Patient information
router.patch('/patient/:id', patientController.updatePatient)

// DELETE Remove a Patient
router.delete('/patient/:id', patientController.deletePatient)


module.exports = router