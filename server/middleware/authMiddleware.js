
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // Check that the JWT secret is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables.");

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error.",
      });
    }

    // Require the correct Bearer token format
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. A valid authentication token is required.",
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token || token.includes(" ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // Verify the JWT
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    // Validate the user ID contained in the token
    if (
      !decoded ||
      typeof decoded.id !== "string" ||
      !/^[a-fA-F0-9]{24}$/.test(decoded.id)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    // Retrieve the current user from the database
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    next(error);
  }
};

module.exports = protect;
