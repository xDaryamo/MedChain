const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const FabricNetwork = require("../../blockchain/fabric");
const patientController = require("../controllers/patient");
const practitionerController = require("../controllers/practitioner");

exports.signup = async (req, res, next) => {
  const session = await User.startSession();
  session.startTransaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(422)
        .json({ message: "Validation failed.", data: errors.array() });
    }

    const { email, password, username, role, organization, fhirData } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    const fabricNetwork = new FabricNetwork();
    const userId = await fabricNetwork.registerAndEnrollUser("", organization);

    fhirData.identifier.value = userId;

    const user = new User({
      email,
      password: hashedPassword,
      username,
      role,
      organization,
      userId,
    });

    await user.save({ session });

    let createResult;
    if (role === "patient") {
      createResult = await patientController.createPatient(
        { body: { organization, fhirData } },
        res,
        next
      );
    } else if (role === "practitioner") {
      createResult = await practitionerController.createPractitioner(
        { body: { organization, fhirData } },
        res,
        next
      );
    }

    if (createResult && createResult.error) {
      throw new Error(createResult.error);
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.userId,
        organization: user.organization,
        role: user.role,
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: user.userId },
      "somesupersecretrefreshsecret",
      { expiresIn: "7d" }
    );

    const expireDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      session: {
        access_token: token,
        expires_at: Date.now() + 60 * 60 * 1000,
        expires_in: 3600,
        refresh_token: refreshToken,
        token_type: "bearer",
        user: { id: userId, email, username, role, organization },
      },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("A user with this email could not be found");
      error.statusCode = 401;
      throw error;
    }

    const isEqualHash = await bcrypt.compare(password, user.password);

    if (!isEqualHash) {
      const error = new Error("Wrong Password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.userId,
        organization: user.organization,
        role: user.role,
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: user.userId },
      "somesupersecretrefreshsecret",
      { expiresIn: "7d" }
    );

    const expireDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    res.status(200).json({
      session: {
        access_token: token,
        expires_at: Date.now() + 60 * 60 * 1000,
        expires_in: 3600,
        refresh_token: refreshToken,
        token_type: "bearer",
        user: {
          id: user.userId,
          email,
          username: user.username,
          role: user.role,
          organization: user.organization,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, "somesupersecretrefreshsecret");

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      {
        email: user.email,
        userId: user.userId,
        organization: user.organization,
        role: user.role,
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      access_token: newAccessToken,
      expires_at: Date.now() + 60 * 60 * 1000,
      expires_in: 3600,
    });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.userId; // Token JWT
    const user = await User.findOne({ userId }).select("-password"); // Exclude Password

    if (!user) {
      const error = new Error("User not found.");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ user });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
