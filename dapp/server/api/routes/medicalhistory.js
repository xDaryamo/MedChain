const express = require("express");
const router = express.Router();
const medicalHistoryController = require("../controllers/medicalhistory");
const { verifyToken, authorizeOrganization } = require("../middleware/auth");

// POST Create a new medical record linked to a patient
router.post("/", verifyToken, medicalHistoryController.createMedicalRecords);

// GET Retrieve all medical records from user id
router.post(
  "/search",
  verifyToken,
  medicalHistoryController.searchMedicalRecords
);

// Condition Routes
router.post(
  "/conditions",
  verifyToken,
  medicalHistoryController.createCondition
);
router.post(
  "/conditions/search",
  verifyToken,
  medicalHistoryController.searchConditions
);

// Batch Condition Routes
router.post(
  "/conditions/batch",
  verifyToken,
  medicalHistoryController.createConditionsBatch
);
router.patch(
  "/conditions/batch",
  verifyToken,
  medicalHistoryController.updateConditionsBatch
);
router.delete(
  "/conditions/batch",
  verifyToken,
  medicalHistoryController.deleteConditionsBatch
);

// Procedure Routes
router.post(
  "/procedures",
  verifyToken,
  medicalHistoryController.createProcedure
);
router.post(
  "/procedures/search",
  verifyToken,
  medicalHistoryController.searchProcedures
);

// Batch Procedure Routes
router.post(
  "/procedures/batch",
  verifyToken,
  medicalHistoryController.createProceduresBatch
);
router.patch(
  "/procedures/batch",
  verifyToken,
  medicalHistoryController.updateProceduresBatch
);
router.delete(
  "/procedures/batch",
  verifyToken,
  medicalHistoryController.deleteProceduresBatch
);

// Allergies Routes
router.post("/allergies", verifyToken, medicalHistoryController.createAllergy);
router.post(
  "/allergies/search",
  verifyToken,
  medicalHistoryController.searchAllergies
);

// Batch Allergy Routes
router.post(
  "/allergies/batch",
  verifyToken,
  medicalHistoryController.createAllergiesBatch
);
router.patch(
  "/allergies/batch",
  verifyToken,
  medicalHistoryController.updateAllergiesBatch
);
router.delete(
  "/allergies/batch",
  verifyToken,
  medicalHistoryController.deleteAllergiesBatch
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

router.get("/allergies/:id", verifyToken, medicalHistoryController.getAllergy);
router.patch(
  "/allergies/:id",
  verifyToken,
  medicalHistoryController.updateAllergy
);
router.delete(
  "/allergies/:id",
  verifyToken,
  medicalHistoryController.deleteAllergy
);
// GET Retrieve medical record details by ID
router.get(
  "/:id",
  verifyToken,
  medicalHistoryController.getMedicalRecordsDetails
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
module.exports = router;
