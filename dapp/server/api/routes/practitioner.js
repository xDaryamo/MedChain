const express = require('express');

const router = express.Router();

const practitionerController = require('../controllers/practitioner');


// POST Create a new practitioner 
router.post('/practitioner/:userid', practitionerController.createPractitioner);

// GET Retrieve a practitioner
router.get('/practitioner/:userid', practitionerController.readPractitioner);

// PATCH Update a practitioner 
router.patch('/practitioner/:userid', practitionerController.updatePractitioner);

// DELETE Delete a practitioner
router.delete('/practitioner/:userid', practitionerController.updatePractitioner);


// POST Create a new procedure 
router.post('/practitioner/:userid', practitionerController.createProcedure);

// GET Retrieve a procedure 
router.get('/practitioner/:userid/:procedureid', practitionerController.readProcedure);

// PATCH Update a procedure 
router.patch('/practitioner/:userid/:procedureid', practitionerController.updateProcedure);

// DELETE Delete a procedure
router.delete('/practitioner/:userid/:procedureid', practitionerController.deleteProcedure);


// POST Create a new condition 
router.post('/practitioner/:userid', practitionerController.createCondition);

// GET Retrieve a specific condition 
router.get('/practitioner/:userid/:conditionid', practitionerController.readCondition);

// PATCH Update a specific condition 
router.patch('/practitioner/:userid/:conditionid', practitionerController.updateCondition);

// DELETE Delete a procedure
router.delete('/practitioner/:userid/:conditionid', practitionerController.deleteCondition);


// POST Create a new annotation 
router.post('/practitioner/:userid/:procedureid', practitionerController.createAnnotation);

// GET Retrieve annotation 
router.get('/procedure/:userid/:procedureid/:annotationindex', practitionerController.readAnnotation);


module.exports = router