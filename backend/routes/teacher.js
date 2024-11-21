const express = require("express");
const router = express.Router();
const {
  addTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  teacherPhotoUpload,
} = require("../controllers/teachers");
const { protect, authorizeRoles } = require("../middleware/auth");

// Routes
router.get("/", protect, authorizeRoles("admin", "teacher"), getTeachers); // Admin & teacher can view
router.get("/:id", protect, authorizeRoles("admin", "teacher"), getTeacherById); // Admin & teacher can view by ID
router.put("/:id", protect, authorizeRoles("admin", "teacher"), updateTeacher); // Admin & teacher can update
router.delete("/:id", protect, authorizeRoles("admin"), deleteTeacher); // Only admin can delete
router.put(
  "/:id/photo",
  protect,
  authorizeRoles("teacher"),
  teacherPhotoUpload
);

module.exports = router;
