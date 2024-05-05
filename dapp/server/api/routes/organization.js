const express = require('express');

const router = express.Router();

const organizationController = require('../controllers/organization');

router.get('/organization/:id', organizationController.getOrganization);

router.patch('/api/organizations/:id', organizationController.updateOrganization)

module.exports = router