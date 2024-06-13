const express = require("express");
const router = express.Router();
const medicalHistoryController = require("../controllers/medicalhistory");
const { verifyToken, authorizeOrganization } = require("../middleware/auth");

// POST Create a new medical record linked to a patient
router.post("/", verifyToken, medicalHistoryController.createMedicalRecords);

// GET Retrieve medical record details by ID
router.get("/:id", verifyToken, medicalHistoryController.getMedicalRecordsDetails);

// GET Retrieve medical records based on a query
router.get("/", verifyToken, medicalHistoryController.searchMedicalRecords);

// PATCH update the medical record linked to a patient
router.patch("/:id", verifyToken, medicalHistoryController.updateMedicalRecords);

// DELETE Delete medical record linked to a patient
router.delete("/:id", verifyToken, medicalHistoryController.deleteMedicalRecords);

module.exports = router;
