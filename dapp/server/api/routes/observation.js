const express = require("express");

const router = express.Router();

const observationController = require("../controllers/observation");

// GET Observation Details
router.get("/:id", observationController.getObservationDetails);

// POST
router.post("/search", observationController.searchObservations);

// POST Register a new Observation
router.post("/", observationController.createObservation);

// PATCH Update Exisisting Observation information
router.patch("/:id", observationController.updateObservation);

// DELETE Remove an Observation
router.delete("/:id", observationController.deleteObservation);

module.exports = router;
