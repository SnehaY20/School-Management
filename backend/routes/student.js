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


router.get("/", protect, authorizeRoles("admin", "student"), getStudents); 
router.get("/:id", protect, authorizeRoles("admin", "student"), getStudentById); 

// Routes for updating and deleting students
router.put("/:id", protect, authorizeRoles("admin", "student"), updateStudent); 
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "student"),
  deleteStudent
); 
router.put(
  "/:id/photo",
  protect,
  authorizeRoles("student"),
  studentPhotoUpload
);
module.exports = router;
