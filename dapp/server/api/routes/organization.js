const express = require("express");

const router = express.Router();

const organizationController = require("../controllers/organization");

// GET Organization Details
router.get("/:id", organizationController.getOrganizationDetails);

// POST
router.post("/search", organizationController.searchOrganizations);

// POST Register a new Organization
router.post("/", organizationController.createOrganization);

// PATCH Update Exisisting Organization information
router.patch("/:id", organizationController.updateOrganization);

// DELETE Remove an Organization
router.delete("/:id", organizationController.deleteOrganization);

module.exports = router;
