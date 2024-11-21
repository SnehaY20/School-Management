const express = require("express");
const { register, login, getMe } = require("../controllers/auth.js");

const router = express.Router();

const { protect } = require("../middleware/auth.js");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe); // Get logged-in user's data

module.exports = router;
