const { v2: cloudinary } = require("cloudinary");
const base64Encoder = require("./encoder");
const ErrorResponse = require("./errorResponse");

const uploadPhoto = async function (file, next) {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  try {
    // Encode image to base64 string
    const { base64Image, base64ImageURI } = base64Encoder(file);

    // Upload an image
    const result = await cloudinary.uploader.upload(base64ImageURI, {
      folder: "photos", // Specify folder in Cloudinary
    });

    return result.secure_url;
  } catch (error) {
    console.error(error);
    return next(new ErrorResponse(`Photo upload failed`, 500));
  }
};

module.exports = uploadPhoto;
