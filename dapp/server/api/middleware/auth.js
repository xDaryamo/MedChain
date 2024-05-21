const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "somesupersecretsecret", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

exports.authorizeOrganization = (organizations) => {
  return (req, res, next) => {
    if (organizations.includes(req.user.organization)) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
};
