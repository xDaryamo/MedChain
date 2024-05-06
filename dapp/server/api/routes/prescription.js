const express = require('express');

const router = express.Router();

const prescriptionController = require('../controllers/prescription');


// GET Retrieves all prescriptions for a specific patient
router.get('/patient/:id/prescriptions', prescriptionController.getPrescriptionsByPatient);


// POST Create a new prescription linked to a patient and authorized by a doctor
router.post('/prescription', prescriptionController.createPrescription)

// PUT Update details of an existing prescription
router.put('/prescription/:id', prescriptionController.updatePrescription)

// DELETE Remove a Patient
router.delete('/prescription/:id', prescriptionController.deletePrescription)


module.exports = router