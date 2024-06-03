const express = require("express");
const router = express.Router();
const labresultsController = require("../controllers/lab-results");
const { verifyToken, authorizeOrganization } = require("../middleware/auth");

router.get("/:id", verifyToken, labresultsController.getLabResult);

router.post("/search", verifyToken, labresultsController.searchLabResults);

router.post("/", verifyToken, labresultsController.createLabResult);

router.patch("/:id", verifyToken, labresultsController.updateLabResult);

router.delete("/:id", verifyToken, labresultsController.deleteLabResult);

module.exports = router;
