const express = require("express");
const router = express.Router();
const practitionerController = require("../controllers/practitioner");
const { verifyToken, authorizeOrganization } = require("../middleware/auth");

router.get(
  "/followed-patients",
  verifyToken,
  practitionerController.getFollowedPatients
);

router.get("/:id", verifyToken, practitionerController.getPractitioner);

router.post("/", verifyToken, practitionerController.createPractitioner);

router.patch("/:id", verifyToken, practitionerController.updatePractitioner);

router.delete("/:id", verifyToken, practitionerController.deletePractitioner);

module.exports = router;
