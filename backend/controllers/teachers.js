const asyncHandler = require("../middleware/asyncHandler.js");
const Teacher = require("../models/User.js");
const ErrorResponse = require("../utils/errorResponse");
const uploadPhoto = require("../utils/cloudinary.js");

// @desc     Get all teachers
// @route    GET /api/v1/teachers
// @access   Private
exports.getTeachers = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const teachers = await Teacher.find({ role: "teacher" })
    .select("name") // Include only teacher name
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalTeachers = await Teacher.countDocuments({ role: "teacher" });

  if (!teachers.length) {
    return res.status(404).json({
      success: false,
      message: "No teachers found",
    });
  }

  res.status(200).json({
    success: true,
    count: teachers.length,
    total: totalTeachers,
    page: Number(page),
    pages: Math.ceil(totalTeachers / limit),
    data: teachers,
  });
});

// @desc     Get teacher by ID
// @route    GET /api/v1/teachers/:id
// @access   Private
exports.getTeacherById = asyncHandler(async (req, res, next) => {
  const teacher = await Teacher.findById(req.params.id).select(
    "name subject profileImageUrl"
  );

  if (!teacher || teacher.role !== "teacher") {
    return next(
      new ErrorResponse(`Teacher with ID ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: teacher,
  });
});

// @desc     Update teacher by ID
// @route    PUT /api/v1/teachers/:id
// @access   Private
exports.updateTeacher = asyncHandler(async (req, res, next) => {
  const { name, subject, profileImageUrl } = req.body;
  const updateData = { name, subject, profileImageUrl };

  const teacher = await Teacher.findById(req.params.id);

  if (!teacher || teacher.role !== "teacher") {
    return next(new ErrorResponse("Teacher not found", 404));
  }

  // Check if the current user is authorized (admin or the teacher themselves)
  if (
    req.user.role !== "admin" &&
    req.user.id.toString() !== teacher._id.toString()
  ) {
    return next(new ErrorResponse("Unauthorized to update this teacher", 403));
  }

  const updatedTeacher = await Teacher.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedTeacher,
  });
});

// @desc     Delete teacher by ID
// @route    DELETE /api/v1/teachers/:id
// @access   Private
exports.deleteTeacher = asyncHandler(async (req, res, next) => {
  const teacher = await Teacher.findById(req.params.id);

  if (!teacher || teacher.role !== "teacher") {
    return next(new ErrorResponse("Teacher not found", 404));
  }

  await teacher.remove();

  res.status(200).json({
    success: true,
    message: "Teacher deleted",
  });
});

// @desc    Upload photo for teachers
// @route   PUT /api/v1/upload/teachers/:id/photo
// @access  Private
exports.teacherPhotoUpload = asyncHandler(async (req, res, next) => {
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher)
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

  teacher.photo = uploadedFileUrl;
  await teacher.save();

  res.status(200).json({
    success: true,
    data: teacher,
  });
});
