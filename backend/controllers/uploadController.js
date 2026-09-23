const cloudinary = require("../config/cloudinary");

// Streams the in-memory file buffer (from multer) up to Cloudinary and
// resolves with the upload result. Wrapped in a Promise because
// Cloudinary's upload_stream API is callback-based.
const streamUpload = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "lms-courses", ...options },
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

// POST /api/upload/video - instructor/admin only. Accepts one video
// file (multipart/form-data, field name "video", max 100MB - see
// middleware/uploadVideo.js) and returns the Cloudinary URL to store on
// a lesson (Lesson.videoUrl). This is the alternative to pasting a
// YouTube/external URL directly - lesson creation supports both.
//
// `resource_type: "video"` is required here - without it Cloudinary
// treats the upload as an image and rejects the file outright.
const uploadVideoFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video file was provided",
      });
    }

    const result = await streamUpload(req.file.buffer, {
      folder: "lms-lessons",
      resource_type: "video",
    });

    res.status(200).json({
      success: true,
      url: result.secure_url,
      // Cloudinary reads the video's actual length - handy for
      // auto-filling Lesson.duration instead of the instructor guessing it.
      duration: result.duration ? Math.round(result.duration) : undefined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Video upload failed",
      error: error.message,
    });
  }
};

module.exports = { uploadImage, uploadVideoFile };