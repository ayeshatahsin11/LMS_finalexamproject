const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Re-check against the database on every request (not just at login) so
    // that if an admin deactivates this account, access is revoked right
    // away instead of waiting for the 7-day token to expire on its own.
    const user = await User.findById(decoded.userId).select("isActive role");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Account not found or deactivated.",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. Invalid or expired token.",
    });
  }
};

// For routes that work for guests AND logged-in users, but need to know
// WHO the user is when a valid token is present (e.g. so an instructor
// can view their own unpublished/draft course). Never blocks the request.
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      req.user = null; // invalid/expired token -> just treat as a guest
    }
  } else {
    req.user = null;
  }

  next();
};

module.exports = protect;
module.exports.protect = protect;
module.exports.optionalAuth = optionalAuth;