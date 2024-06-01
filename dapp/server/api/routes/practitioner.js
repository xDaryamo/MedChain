const express = require("express");
const router = express.Router();
const practitionerController = require("../controllers/practitioner");
const { verifyToken, authorizeOrganization } = require("../middleware/auth");

router.get(
  "/followed-patients",
  verifyToken,
  authorizeOrganization([
    "ospedale-maresca.aslnapoli3.medchain.com",
    "ospedale-del-mare.aslnapoli1.medchain.com",
    "ospedale-sgiuliano.aslnapoli2.medchain.com",
    "laboratorio-analisi-cmo.medchain.com",
    "medicina-generale-napoli.medchain.com",
    "neurologia-napoli.medchain.com",
    "patients.medchain.com",
  ]),
  practitionerController.getFollowedPatients
);

router.get(
  "/:id",
  verifyToken,
  authorizeOrganization([
    "ospedale-maresca.aslnapoli3.medchain.com",
    "ospedale-del-mare.aslnapoli1.medchain.com",
    "ospedale-sgiuliano.aslnapoli2.medchain.com",
    "laboratorio-analisi-cmo.medchain.com",
    "medicina-generale-napoli.medchain.com",
    "neurologia-napoli.medchain.com",
    "patients.medchain.com",
  ]),
  practitionerController.getPractitioner
);

router.post(
  "/",
  verifyToken,
  authorizeOrganization([
    "ospedale-maresca.aslnapoli3.medchain.com",
    "ospedale-del-mare.aslnapoli1.medchain.com",
    "ospedale-sgiuliano.aslnapoli2.medchain.com",
    "medicina-generale-napoli.medchain.com",
    "neurologia-napoli.medchain.com",
    "patients.medchain.com",
  ]),
  practitionerController.createPractitioner
);

router.patch(
  "/:id",
  verifyToken,
  authorizeOrganization([
    "ospedale-maresca.aslnapoli3.medchain.com",
    "ospedale-del-mare.aslnapoli1.medchain.com",
    "ospedale-sgiuliano.aslnapoli2.medchain.com",
    "medicina-generale-napoli.medchain.com",
    "neurologia-napoli.medchain.com",
    "patients.medchain.com",
  ]),
  practitionerController.updatePractitioner
);

router.delete(
  "/:id",
  verifyToken,
  authorizeOrganization([
    "ospedale-maresca.aslnapoli3.medchain.com",
    "ospedale-del-mare.aslnapoli1.medchain.com",
    "ospedale-sgiuliano.aslnapoli2.medchain.com",
    "medicina-generale-napoli.medchain.com",
    "neurologia-napoli.medchain.com",
    "patients.medchain.com",
  ]),
  practitionerController.deletePractitioner
);

module.exports = router;
