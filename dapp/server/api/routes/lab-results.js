const express = require("express");
const router = express.Router();
const labresultsController = require("../controllers/lab-results");
const { verifyToken, authorizeOrganization } = require("../middleware/auth");

router.get(
  "/patient/:id",
  verifyToken,
  authorizeOrganization(["labs.medchain.com"]), //to do: add all orgs
  labresultsController.getLabResultsByPatient
);

router.get(
  "/:resultId",
  verifyToken,
  authorizeOrganization(["laboratorio-analisi-cmo.medchain.com"]),
  labresultsController.getLabResult
);

router.post(
  "/",
  verifyToken,
  authorizeOrganization(["laboratorio-analisi-cmo.medchain.com"]),
  labresultsController.createLabResult
);

router.patch(
  "/tech/:resultId",
  verifyToken,
  authorizeOrganization(["labs.medchain.com"]),
  labresultsController.updateLabResult
);

module.exports = router;
