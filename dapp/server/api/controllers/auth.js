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

  let userId;
  let email, password, username, role, organization, fhirData;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ message: "Validation failed.", data: errors.array() });
    }

    email = req.body.email;
    password = req.body.password;
    username = req.body.username;
    role = req.body.role;
    organization = req.body.organization;
    fhirData = req.body.fhirData;

    console.log("User data received:", {
      email,
      password,
      username,
      role,
      organization,
      fhirData,
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    const fabricNetwork = new FabricNetwork();
    userId = await fabricNetwork.registerAndEnrollUser("", organization);

    console.log("Generated userId:", userId);

    fhirData.identifier.value = userId;

    const user = new User({
      email: email,
      password: hashedPassword,
      username: username,
      role: role,
      organization: organization,
      userId: userId,
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
      console.log("Creating practitioner...");
      createResult = await practitionerController.createPractitioner(
        { body: { organization, fhirData } },
        res,
        next
      );
    }

    console.log("Create result:", createResult);

    if (createResult && createResult.error) {
      throw new Error(createResult.error);
    }

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      result: createResult,
    });
  } catch (err) {
    console.error("Error in signup process:", err);

    try {
      await session.abortTransaction();
    } catch (transactionError) {
      console.error("Failed to abort transaction:", transactionError.message);
    } finally {
      session.endSession();
    }

    if (userId) {
      try {
        const fabricNetwork = new FabricNetwork();
        await fabricNetwork.revokeUserEnrollment("", organization, userId);
      } catch (revokeError) {
        console.error(
          "Failed to revoke enrollment for user:",
          revokeError.message
        );
      }
    }

    if (!res.headersSent) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      return res
        .status(err.statusCode)
        .json({ message: err.message, data: err.data });
    } else {
      next(err);
    }
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      const error = new Error(
        "A user with this email and organization could not be found"
      );
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
    res.status(200).json({
      token: token,
      userId: user.userId,
      organization: user.organization,
      role: user.role,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
