const express = require('express');

const router = express.Router();

const organizationController = require('../controllers/organization');

// GET Organization Details
router.get('/organization/:id', organizationController.getOrganizationDetails);

// POST Register a new Organization
router.post('/organization/:id', organizationController.createOrganization)

// PATCH Update Exisisting Organization information
router.patch('/organization/:id', organizationController.updateOrganization)

// DELETE Remove an Organization
router.delete('/organization/:id', organizationController.deleteOrganization)

// GET Search for organizations by type
router.get('/organization/search/type/:query', organizationController.searchOrganizationsByType);

// GET Search for an organization by name
router.get('/organization/search/name/:query', organizationController.searchOrganizationByName);

// POST Add an endpoint to an organization
router.post('/organization/:id/endpoint', organizationController.addEndpoint);

// POST Add a qualification to an organization
router.post('/organization/:id/qualification', organizationController.addQualification);

// DELETE Remove an endpoint from an organization
router.delete('/organization/:id/endpoint', organizationController.removeEndpoint);

// DELETE Remove a qualification from an organization
router.delete('/organization/:id/qualification/:index', organizationController.removeQualification);

// PATCH Update an endpoint of an organization
router.patch('/organization/:id/endpoint', organizationController.updateEndpoint);

// PATCH Update contact details of an organization
router.patch('/organization/:id/contact', organizationController.updateContact);

// PATCH Update a qualification of an organization
router.patch('/organization/:id/qualification/:index', organizationController.updateQualification);

// GET Get the parent organization of an organization
router.get('/organization/:id/parent', organizationController.getParentOrganization);

// PATCH Update the parent organization of an organization
router.patch('/organization/:id/parent', organizationController.updateParentOrganization);


module.exports = router