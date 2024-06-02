const express = require('express');
const router = express.Router();
const encounter = require('../controllers/encounter'); 
const { verifyToken, authorizeOrganization } = require("../middleware/auth");

// Routes for CRUD operations
router.post('/encounter', 
verifyToken,
authorizeOrganization(["ospedale-maresca.aslnapoli3.medchain.com", "patients.medchain.com"]),
encounter.createEncounter);

router.get('/encounter/:encounterid', 
verifyToken,
authorizeOrganization(["ospedale-maresca.aslnapoli3.medchain.com", "patients.medchain.com"]),
encounter.getEncounter);

router.patch('/encounter/:encounterid', 
verifyToken,
authorizeOrganization(["ospedale-maresca.aslnapoli3.medchain.com", "patients.medchain.com"]),
encounter.updateEncounter);

router.delete('/encounter/:encounterid', 
verifyToken,
authorizeOrganization(["ospedale-maresca.aslnapoli3.medchain.com", "patients.medchain.com"]),
encounter.deleteEncounter);

// Routes for BUSINESS operations
router.get('/encounter/:query', 
verifyToken,
authorizeOrganization(["ospedale-maresca.aslnapoli3.medchain.com", "patients.medchain.com"]),
encounter.queryEncounter);


module.exports = router;
