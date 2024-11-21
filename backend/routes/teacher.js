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
router.get("/", protect, authorizeRoles("admin", "teacher"), getTeachers); 
router.get("/:id", protect, authorizeRoles("admin", "teacher"), getTeacherById); 
router.put("/:id", protect, authorizeRoles("admin", "teacher"), updateTeacher); 
router.delete("/:id", protect, authorizeRoles("admin"), deleteTeacher); 
router.put(
  "/:id/photo",
  protect,
  authorizeRoles("teacher"),
  teacherPhotoUpload
);

module.exports = router;
