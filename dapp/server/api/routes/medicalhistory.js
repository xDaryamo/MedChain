const express = require("express");
const router = express.Router();
const medicalHistoryController = require("../controllers/medicalhistory");
const { verifyToken, authorizeOrganization } = require("../middleware/auth");

// POST Create a new medical record linked to a patient
router.post("/", verifyToken, medicalHistoryController.createMedicalRecords);

// GET Retrieve medical record details by ID
router.get(
  "/:id",
  verifyToken,
  medicalHistoryController.getMedicalRecordsDetails
);

// GET Retrieve all medical records from user id
router.post(
  "/search",
  verifyToken,
  medicalHistoryController.searchMedicalRecords
);

// PATCH update the medical record linked to a patient
router.patch(
  "/:id",
  verifyToken,
  medicalHistoryController.updateMedicalRecords
);

// DELETE Delete medical record linked to a patient
router.delete(
  "/:id",
  verifyToken,
  medicalHistoryController.deleteMedicalRecords
);

// Condition Routes
router.post(
  "/conditions",
  verifyToken,
  medicalHistoryController.createCondition
);
router.get(
  "/conditions/:id",
  verifyToken,
  medicalHistoryController.readCondition
);
router.patch(
  "/conditions/:id",
  verifyToken,
  medicalHistoryController.updateCondition
);
router.delete(
  "/conditions/:id",
  verifyToken,
  medicalHistoryController.deleteCondition
);

// Procedure Routes
router.post(
  "/procedures",
  verifyToken,
  medicalHistoryController.createProcedure
);
router.get(
  "/procedures/:id",
  verifyToken,
  medicalHistoryController.readProcedure
);
router.patch(
  "/procedures/:id",
  verifyToken,
  medicalHistoryController.updateProcedure
);
router.delete(
  "/procedures/:id",
  verifyToken,
  medicalHistoryController.deleteProcedure
);

module.exports = router;
