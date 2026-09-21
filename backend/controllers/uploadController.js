const cloudinary = require("../config/cloudinary");

// Streams the in-memory file buffer (from multer) up to Cloudinary and
// resolves with the upload result. Wrapped in a Promise because
// Cloudinary's upload_stream API is callback-based.
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "lms-courses" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer);
  });
};

// POST /api/upload/image - instructor/admin only. Accepts one image
// file (multipart/form-data, field name "image") and returns the
// Cloudinary URL to store on the course (thumbnail) or anywhere else
// that needs an image URL.
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file was provided",
      });
    }

    const result = await streamUpload(req.file.buffer);

    res.status(200).json({
      success: true,
      url: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

module.exports = { uploadImage };