const express = require("express");

const router = express.Router();

const organizationController = require("../controllers/organization");

router.get("/", organizationController.getAllOrganizations);

// GET Organization Details
router.get(
  "/organization/:userid",
  organizationController.getOrganizationDetails
);

// POST Register a new Organization
router.post("/organization/:userid", organizationController.createOrganization);

// PATCH Update Exisisting Organization information
router.patch(
  "/organization/:userid",
  organizationController.updateOrganization
);

// DELETE Remove an Organization
router.delete(
  "/organization/:userid",
  organizationController.deleteOrganization
);

// GET Search for organizations by type
router.get(
  "/organization/:userid/:query",
  organizationController.searchOrganizationsByType
);

// GET Search for an organization by name
router.get(
  "/organization/:userid/:query",
  organizationController.searchOrganizationByName
);

router.get("/initialize-ledger", organizationController.initializeLedger);

module.exports = router;
