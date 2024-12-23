const express = require("express");
const router = express.Router();
const {
  addClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
} = require("../controllers/classes.js");

// Import the protect and authorizeRoles middlewares
const { protect, authorizeRoles } = require("../middleware/auth.js");

// Protected routes, only accessible by admin users
router.post("/", protect, authorizeRoles("admin"), addClass);
router.get("/", getClasses);
router.get("/:id", getClassById);
router.put("/:id", protect, authorizeRoles("admin"), updateClass);
router.delete("/:id", protect, authorizeRoles("admin"), deleteClass);

module.exports = router;
