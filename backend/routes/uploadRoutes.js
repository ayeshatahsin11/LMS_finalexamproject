const express = require("express");
const { uploadImage } = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

// Only instructors/admins upload images (course thumbnails, banners, etc).
router.post(
  "/image",
  protect,
  authorizeRoles("instructor", "admin"),
  upload.single("image"),
  uploadImage
);

module.exports = router;