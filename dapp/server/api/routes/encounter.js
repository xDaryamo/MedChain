const express = require("express");
const router = express.Router();
const encounter = require("../controllers/encounter");
const { verifyToken, authorizeOrganization } = require("../middleware/auth");

router.post("/", verifyToken, encounter.createEncounter);

router.post("/search/", verifyToken, encounter.searchEncounter);

router.get("/:id", verifyToken, encounter.getEncounter);

router.patch("/:id", verifyToken, encounter.updateEncounter);

router.delete("/:id", verifyToken, encounter.deleteEncounter);

module.exports = router;
