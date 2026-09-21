const multer = require("multer");

// Files are held in memory only (never written to this server's disk)
// and streamed straight to Cloudinary in the controller - this matters
// because Render's free tier wipes local disk writes on every restart,
// so the file never actually needs to touch this server's filesystem.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;