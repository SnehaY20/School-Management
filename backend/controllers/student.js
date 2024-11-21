const asyncHandler = require("../middleware/asyncHandler.js");
const Student = require("../models/User.js");
const Class = require("../models/Class.js");
const ErrorResponse = require("../utils/errorResponse");
const uploadPhoto = require("../utils/cloudinary.js");

// @desc     Get all students
// @route    GET /api/v1/students
// @access   Private
exports.getStudents = asyncHandler(async (req, res, next) => {
  const { classId, page = 1, limit = 10 } = req.query;

  // Build query object with optional filtering by classId
  const query = { role: "student" };
  if (classId) {
    query.classId = classId;
  }

  const students = await Student.find(query)
    .populate("classId", "name") // Populate only the class name
    .select("name classId") // Include only student name and class
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalStudents = await Student.countDocuments(query);

  if (!students.length) {
    return next(new ErrorResponse("No students found", 404));
  }

  res.status(200).json({
    success: true,
    count: students.length,
    page: Number(page),
    pages: Math.ceil(totalStudents / limit),
    data: students,
  });
});

// @desc     Get student by ID
// @route    GET /api/v1/students/:id
// @access   Private
exports.getStudentById = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id)
    .populate("classId", "name")
    .select("name classId email profileImageUrl");

  if (!student || student.role !== "student") {
    return next(
      new ErrorResponse(`Student with ID ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

// @desc     Update student by ID
// @route    PUT /api/v1/students/:id
// @access   Private
exports.updateStudent = asyncHandler(async (req, res, next) => {
  const { name, classId, profileImageUrl } = req.body;
  const updateData = { name, classId, profileImageUrl };

  const student = await Student.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!student || student.role !== "student") {
    return next(new ErrorResponse("Student not found", 404));
  }

  res.status(200).json({
    success: true,
    data: student,
  });
});

// @desc     Delete student by ID
// @route    DELETE /api/v1/students/:id
// @access   Private
exports.deleteStudent = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    return next(new ErrorResponse("Student not found", 404));
  }

  await student.remove();

  res.status(200).json({
    success: true,
    message: "Student deleted",
  });
});

// @desc    Upload photo for students
// @route   PUT /api/v1/upload/students/:id/photo
// @access  Private
exports.studentPhotoUpload = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student)
    return next(
      new ErrorResponse(`Resource not found with ID ${req.params.id}`, 404)
    );
  console.log(req.files);
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 404));
  }

  // Capture uploaded file object.
  const file = req.files.file;

  // Validate the image, if it is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please Upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create custom filename
  // file.name = `photo_${student._id}${path.parse(file.name).ext}`;

  const uploadedFileUrl = await uploadPhoto(file, next);

  student.photo = uploadedFileUrl;
  await student.save();

  res.status(200).json({
    success: true,
    data: student,
  });
});
