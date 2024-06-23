const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user");
const authController = require("../controllers/auth");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom(async (value) => {
        const userDoc = await User.findOne({ email: value });
        if (userDoc) {
          throw new Error("Email address already exists!");
        }
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("role").not().isEmpty().withMessage("Role is required"),
  ],
  authController.signup
);

router.post("/login", authController.login);

router.get("/user", verifyToken, authController.getCurrentUser);

router.get("/refresh-token", authController.refreshToken);

module.exports = router;
