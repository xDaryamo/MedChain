const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret");
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  req.user = {
    userId: decodedToken.userId,
    organization: decodedToken.organization,
    role: decodedToken.role,
  };

  next();
};

exports.authorizeOrganization = (organizations) => {
  return (req, res, next) => {
    if (organizations.includes(req.user.organization)) {
      next();
    } else {
      console.log(req.user.organization);
      res.status(403).json({ message: "Forbidden" });
    }
  };
};
