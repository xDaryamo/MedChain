const express = require('express');

const router = express.Router();

const prescriptionController = require('../controllers/prescription');


// GET Retrieves a specific prescription
router.get('/prescriptions/:id', prescriptionController.getMedicationRequest);

// POST Create a new prescription 
router.post('/prescription', prescriptionController.createMedicationRequest)

// PATCH Update status of an existing prescription
router.patch('/prescription/:id', prescriptionController.verifyPrescription)

module.exports = router