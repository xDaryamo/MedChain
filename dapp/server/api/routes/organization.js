const express = require('express');

const router = express.Router();

const organizationController = require('../controllers/organization');

// GET Organization Details
router.get('/organization/:id', organizationController.getOrganizationDetails);

// POST Register a new Organization
router.post('/organization', organizationController.createOrganization)

// PATCH Update Exisisting Organization information
router.patch('/organization/:id', organizationController.updateOrganization)

// DELETE Remove an Organization
router.delete('/organization/:id', organizationController.deleteOrganization)

module.exports = router