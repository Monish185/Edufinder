const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BlacklistedToken = require("../models/blacklist");

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Check if token is blacklisted
    const blacklisted = await BlacklistedToken.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: "Token has been invalidated. Please log in again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    return res.status(500).json({ message: "Authentication error." });
  }
};

const adminMiddleware = async (req, res, next) => {
  await authMiddleware(req, res, () => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  });
};

module.exports = { authMiddleware, adminMiddleware };
