const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient");
const { verifyToken, authorizeOrganization } = require("../middleware/auth");

// Rotte per i pazienti
router.get(
  "/:id",
  verifyToken,
  authorizeOrganization([
    "patients.medchain.com",
    "ospedale-maresca.aslnapoli3.medchain.com",
    "ospedale-del-mare.aslnapoli1.medchain.com",
    "ospedale-sgiuliano.aslnapoli2.medchain.com",
    "medicina-generale-napoli.medchain.com",
    "neurologia-napoli.medchain.com",
  ]),
  patientController.getPatient
);
router.post(
  "/",
  verifyToken,
  authorizeOrganization(["patients.medchain.com"]),
  patientController.createPatient
);
router.patch(
  "/:id",
  verifyToken,
  authorizeOrganization(["patients.medchain.com"]),
  patientController.updatePatient
);
router.delete(
  "/:id",
  verifyToken,
  authorizeOrganization(["patients.medchain.com"]),
  patientController.deletePatient
);

router.post(
  "/request-access/:id/",
  verifyToken,
  authorizeOrganization([
    "patients.medchain.com",
    "ospedale-maresca.aslnapoli3.medchain.com",
    "ospedale-del-mare.aslnapoli1.medchain.com",
    "ospedale-sgiuliano.aslnapoli2.medchain.com",
    "medicina-generale-napoli.medchain.com",
    "neurologia-napoli.medchain.com",
  ]),
  patientController.requestAccess
);

router.post(
  "/grant-access/:requesterId",
  verifyToken,
  authorizeOrganization(["patients.medchain.com"]),
  patientController.grantAccess
);

router.post(
  "/revoke-access/:requesterId",
  verifyToken,
  authorizeOrganization(["patients.medchain.com"]),
  patientController.revokeAccess
);

module.exports = router;
