const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User.js");

// @desc     Register a user (teacher, student, or admin)
// @route    POST /api/v1/auth/register
// @access   Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, role, password, subject, classId } = req.body;

  // Validate role input
  if (!role || !["student", "teacher", "admin"].includes(role)) {
    return next(
      new ErrorResponse("Role must be 'student', 'teacher', or 'admin'", 400)
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorResponse("Email already exists", 400));
  }

  // Create user based on role
  let user;
  if (role === "teacher") {
    user = await User.create({
      name,
      email,
      role,
      password,
      subject, // Only for teachers
    });
  } else if (role === "student") {
    user = await User.create({
      name,
      email,
      role,
      password,
      classId, // Only for students
    });
  } else if (role === "admin") {
    user = await User.create({
      name,
      email,
      role,
      password, // Admin does not have a subject or classId
    });
  }

  // Send token response after user creation
  sendTokenResponse(user, 201, res);
});

// Helper function to send the JWT token in the response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken(); // Create a token using the user method

  const userData = {
    id: user._id,
    name: user.name || null, // If no name is provided (e.g., admin), return null
    email: user.email,
    role: user.role,
    token,
  };

  res.status(statusCode).json({ success: true, data: userData });
};

// @desc     Login a user (teacher, student, or admin)
// @route    POST /api/v1/auth/login
// @access   Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc     Get logged-in user's data
// @route    GET /api/v1/auth/me
// @access   Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id); // req.user is set by the protect middleware

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});
