const { validationResult } = require("express-validator/check");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const FabricNetwork = require("../../blockchain/fabric");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed.");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const { email, password, role, username, organization } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const fabricNetwork = new FabricNetwork();
    const userId = await fabricWeb.registerAndEnrollUser("", organization);

    const user = new User({
      email: email,
      password: hashedPassword,
      userId: userId,
      username: username,
      role: role,
    });

    const result = await user.save();
    res.status(201).json({ message: "User created", userId: result.userId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("A user with this email could note be found");
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
        role: user.role,
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: user.userId });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
