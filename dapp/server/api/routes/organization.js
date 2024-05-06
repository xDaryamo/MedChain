const express = require('express');

const router = express.Router();

const organizationController = require('../controllers/organization');

// GET List of Organizations
router.get('/organizations', organizationController.getOrganizations);

// GET Organization Details
router.get('/organization/:id', organizationController.getOrganizationDetails);

// POST Register a new Organization
router.post('/organization', organizationController.createOrganization)

// PUT Update Exisisting Organization information
router.put('/organization/:id', organizationController.updateOrganization)

// DELETE Remove an Organization
router.delete('/patient/:id', organizationController.deleteOrganization)

module.exports = router