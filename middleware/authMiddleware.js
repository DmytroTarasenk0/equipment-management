const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "hardcoded_secret";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // extract the token (from "Bearer <token>")
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // attach the decoded payload to the request object
    req.user = decoded;

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Access denied. Invalid or expired token." });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Admin rights required." });
  }
  next();
};

const requireEngineer = (req, res, next) => {
  if (req.user.role !== "Engineer") {
    return res
      .status(403)
      .json({ message: "Access denied. Technical specialist role required." });
  }
  next();
};

module.exports = {
  verifyToken,
  requireAdmin,
  requireEngineer,
};
