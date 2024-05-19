const express = require('express');
const router = express.Router();
const encounter = require('../controllers/encounter'); 

// Routes for CRUD operations
router.post('/encounter/:userid', encounter.createEncounter);
router.get('/encounter/:userid/:encounterid', encounter.getEncounter);
router.patch('/encounter/:userid/:encounterid', encounter.updateEncounter);
router.delete('/encounter/:userid/:encounterid', encounter.deleteEncounter);


// Routes for BUSINESS operations
router.get('/encounter/:userid/:query', encounter.queryEncounter);


module.exports = router;
