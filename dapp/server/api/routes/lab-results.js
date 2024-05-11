const express = require('express');

const router = express.Router();

const labresultsController = require('../controllers/lab-results');


// GET Retrieve all lab results associated with a specific patient
router.get('/patient/:id/lab-results', labresultsController.getLabResultsByPatient);

// POST Create a new lab result 
router.post('/lab-results', labresultsController.createLabResult)

// PATCH Update a lab result 
router.patch('/lab-results/:id', labresultsController.updateLabResult)


module.exports = router