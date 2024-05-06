const express = require('express');

const router = express.Router();

const labresultsController = require('../controllers/lab-results');


// GET Retrieve all lab results associated with a specific patient
router.get('/patient/:id/lab-results', labresultsController.getLabResultsByPatient);


// POST Create a new prescription linked to a patient and authorized by a doctor
router.post('/lab-result', labresultsController.createLabResult)




module.exports = router