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

router.post("/refresh-token", authController.refreshToken);
router.post(
  "/update-credentials",
  verifyToken,
  [
    body("email").isEmail().withMessage("Please enter a valid email."),
    body("oldPassword").optional(),
    body("password").optional().trim().isLength({ min: 5 }),
  ],
  authController.updateCredentials
);

module.exports = router;
