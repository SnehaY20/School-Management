const asyncHandler = require("../middleware/asyncHandler.js");
const Class = require("../models/Class.js");
const Teacher = require("../models/User.js");
const ErrorResponse = require("../utils/errorResponse.js");

// @desc     Add a new class
// @route    POST /api/v1/classes
// @access   Private
exports.addClass = asyncHandler(async (req, res, next) => {
  const { name, teacherId } = req.body;

  // Check for duplicate class name
  const existingClass = await Class.findOne({ name });
  if (existingClass) {
    return next(new ErrorResponse("Class with this name already exists", 400));
  }

  // Validate teacher existence
  const teacher = await Teacher.findById(teacherId);
  if (!teacher || teacher.role !== "teacher") {
    return next(new ErrorResponse("Invalid or non-existent teacher ID", 400));
  }

  const classData = await Class.create({ name, teacherId });

  res.status(201).json({
    success: true,
    data: classData,
  });
});

// @desc     Assign a teacher to a class
// @route    PUT /api/v1/classes/:id/assign-teacher
// @access   Private
exports.assignTeacher = asyncHandler(async (req, res, next) => {
  const { teacherId } = req.body;

  // Validate teacher existence
  const teacher = await Teacher.findById(teacherId);
  if (!teacher || teacher.role !== "teacher") {
    return next(new ErrorResponse("Invalid or non-existent teacher ID", 400));
  }

  const classData = await Class.findByIdAndUpdate(
    req.params.id,
    { teacherId },
    { new: true, runValidators: true }
  ).populate("teacherId");

  if (!classData) {
    return next(new ErrorResponse("Class not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Teacher assigned successfully",
    data: classData,
  });
});

// @desc     Get all classes
// @route    GET /api/v1/classes
// @access   Private
exports.getClasses = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const classes = await Class.find()
    .populate("teacherId", "name subject") // Populate teacher's name and subject
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalClasses = await Class.countDocuments();

  if (!classes || classes.length === 0) {
    return next(new ErrorResponse("No classes found", 404));
  }

  res.status(200).json({
    success: true,
    count: classes.length,
    page: Number(page),
    pages: Math.ceil(totalClasses / limit),
    data: classes,
  });
});

// @desc     Get class by ID
// @route    GET /api/v1/classes/:id
// @access   Private
exports.getClassById = asyncHandler(async (req, res, next) => {
  const classData = await Class.findById(req.params.id).populate(
    "teacherId",
    "name subject profileImageUrl"
  );

  if (!classData) {
    return next(
      new ErrorResponse(`Class with ID ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: classData,
  });
});

// @desc     Update class details
// @route    PUT /api/v1/classes/:id
// @access   Private
exports.updateClass = asyncHandler(async (req, res, next) => {
  const { name, teacherId } = req.body;

  // Check for duplicate class name
  if (name) {
    const existingClass = await Class.findOne({
      name,
      _id: { $ne: req.params.id },
    });
    if (existingClass) {
      return next(
        new ErrorResponse("Another class with this name already exists", 400)
      );
    }
  }

  // Validate teacher ID if provided
  if (teacherId) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return next(new ErrorResponse("Invalid or non-existent teacher ID", 400));
    }
  }

  const classData = await Class.findByIdAndUpdate(
    req.params.id,
    { name, teacherId },
    { new: true, runValidators: true }
  ).populate("teacherId");

  if (!classData) {
    return next(new ErrorResponse("Class not found", 404));
  }

  res.status(200).json({
    success: true,
    data: classData,
  });
});

// @desc     Delete class by ID
// @route    DELETE /api/v1/classes/:id
// @access   Private
exports.deleteClass = asyncHandler(async (req, res, next) => {
  const classData = await Class.findByIdAndDelete(req.params.id);

  if (!classData) {
    return next(new ErrorResponse("Class not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Class deleted successfully",
  });
});
