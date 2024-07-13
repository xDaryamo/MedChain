const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient");
const { verifyToken, authorizeOrganization } = require("../middleware/auth");

router.get(
  "/access-requests/",
  verifyToken,
  patientController.getAccessRequests
);

router.get(
  "/:id",
  verifyToken,

  patientController.getPatient
);
router.post("/", verifyToken, patientController.createPatient);

router.post("/email", verifyToken, patientController.getPatientByEmail);

router.post("/search", verifyToken, patientController.searchPatients);

router.patch("/:id", verifyToken, patientController.updatePatient);
router.delete("/:id", verifyToken, patientController.deletePatient);

router.post(
  "/delete-pending-request/:requesterId",
  verifyToken,
  patientController.deletePendingRequest
);

router.post(
  "/request-access/:id/",
  verifyToken,
  patientController.requestAccess
);

router.post(
  "/grant-access/:requesterId",
  verifyToken,
  patientController.grantAccess
);

router.post(
  "/revoke-access/:requesterId",
  verifyToken,
  patientController.revokeAccess
);

module.exports = router;
