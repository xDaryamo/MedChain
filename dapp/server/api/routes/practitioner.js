const express = require('express');

const router = express.Router();

const practitionerController = require('../controllers/practitioner');


// POST Create a new practitioner associated with a specific organization
router.post('/organization/:id/practitioner', practitionerController.createPractitioner);

// GET Retrieve a practitioner associated with a specific organization
router.get('/organization/:id/practitioner/:practitionerid', practitionerController.readPractitioner);

// PATCH Update a practitioner associated with a specific organization
router.patch('/organization/:id/practitioner/:practitionerid', practitionerController.updatePractitioner);

// DELETE Delete a practitioner associated with a specific organization
router.delete('/organization/:id/practitioner/:practitionerid', practitionerController.updatePractitioner);


// POST Create a new procedure associated with a specific practitioner
router.post('/practitioner/:id/procedure/:procedureid', practitionerController.createProcedure);

// GET Retrieve a procedure associated with a specific organization
router.get('/practitioner/:id/procedure/:procedureid', practitionerController.readProcedure);

// PATCH Update a procedure associated with a specific practitioner
router.patch('/practitioner/:id/procedure/:procedureid', practitionerController.updateProcedure);


// POST Create a new condition associated with a specific patient 
router.post('/patient/:id/condition/:conditionid', practitionerController.createCondition);

// GET Retrieve a specific condition associated with a specific patient
router.get('/patient/:id/condition/:conditionid', practitionerController.readCondition);

// PATCH Update a specific condition associated with a specific patient
router.patch('/patient/:id/condition/:conditionid', practitionerController.updateCondition);


// POST Create a new annotation associated with a procedure
router.post('/procedure/:id/annotations', practitionerController.createAnnotation);

// GET Retrieve annotations associated with a procedure
router.get('/procedure/:id/annotations', practitionerController.readAnnotation);


module.exports = router