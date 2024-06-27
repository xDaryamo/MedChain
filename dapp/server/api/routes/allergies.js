const express = require("express");
const router = express.Router();
const allergies = require("../controllers/allergies");
const { verifyToken, authorizeOrganization } = require("../middleware/auth");

module.exports = router;
