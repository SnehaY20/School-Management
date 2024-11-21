const express = require("express");
const router = express.Router();
const {
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  studentPhotoUpload,
} = require("../controllers/student.js");
const { protect, authorizeRoles } = require("../middleware/auth");

// Routes for getting students
router.get("/", protect, authorizeRoles("admin", "student"), getStudents); // Admin & Student can access
router.get("/:id", protect, authorizeRoles("admin", "student"), getStudentById); // Admin & Student can access

// Routes for updating and deleting students
router.put("/:id", protect, authorizeRoles("admin", "student"), updateStudent); // Admin & Student can update
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "student"),
  deleteStudent
); // Admin & Student can delete
router.put(
  "/:id/photo",
  protect,
  authorizeRoles("student"),
  studentPhotoUpload
);
module.exports = router;
