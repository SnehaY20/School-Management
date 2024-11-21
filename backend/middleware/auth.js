const jwt = require("jsonwebtoken");
const asyncHandler = require("../middleware/asyncHandler");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User"); // Import the User model

// Protect routes for authenticated users
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in headers or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token; // Ensure you use cookie-parser middleware for this
  }

  // Ensure token is present
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    // Verify token and decode the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the ID in the token
    req.user = await User.findById(decoded.id);

    // If the user doesn't exist or is inactive, return unauthorized
    if (!req.user) {
      return next(new ErrorResponse("Not authorized, user not found", 401));
    }

    next();
  } catch (err) {
    // Handle specific token errors
    if (err.name === "TokenExpiredError") {
      return next(new ErrorResponse("Token expired", 401));
    }
    return next(new ErrorResponse("Not authorized, invalid token", 401));
  }
});

// Middleware to check user roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Ensure the user role matches one of the allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};
