const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Not authenticated." });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretsecret");
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(500).json({ message: "Failed to authenticate token." });
  }
  if (!decodedToken) {
    return res.status(401).json({ message: "Not authenticated." });
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
