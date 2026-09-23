const express = require("express");

const {
  getReviews,
  getAllReviews,
  getMyReview,
  createReview,
  updateReview,
  deleteReview,
  toggleVisibility,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Public - visible reviews for the homepage/reviews marquee.
router.get("/", getReviews);

// Admin only - every review, for the manage screen.
router.get("/all", protect, authorizeRoles("admin"), getAllReviews);

// Any logged-in user - their own review, if they've written one.
router.get("/mine", protect, getMyReview);

router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

router.patch("/:id/visibility", protect, authorizeRoles("admin"), toggleVisibility);

module.exports = router;