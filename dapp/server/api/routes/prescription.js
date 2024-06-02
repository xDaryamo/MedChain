const express = require("express");

const router = express.Router();

const prescriptionController = require("../controllers/prescription");
const { verifyToken, authorizeOrganization } = require("../middleware/auth");

// GET Retrieves a specific prescription
router.get("/:id", verifyToken, prescriptionController.getMedicationRequest);

// POST Search prescriptions
router.post("/search", verifyToken, prescriptionController.searchPrescriptions);

// POST Create a new prescription
router.post("/", verifyToken, prescriptionController.createMedicationRequest);

// PATCH Update status of an existing prescription
router.patch("/:id", verifyToken, prescriptionController.updatePrescription);

// DELETE Remove a prescription
router.delete("/:id", verifyToken, prescriptionController.deletePrescription);

module.exports = router;
