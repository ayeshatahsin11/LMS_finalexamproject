const multer = require("multer");

// Same in-memory strategy as middleware/upload.js (images) - the file
// buffer is streamed straight to Cloudinary in the controller and never
// written to this server's disk.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"), false);
  }
};

// 100MB cap - this matches Cloudinary's limit for a single, non-chunked
// upload on the free plan, so anything under this size is guaranteed to
// actually go through in one request (no resumable/chunked upload here).
const uploadVideo = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
});

module.exports = uploadVideo;