const Review = require("../models/Review");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// Public - visible reviews only, newest first. Capped at 60 since this
// only ever feeds the homepage/reviews marquee, not a paginated list.
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isVisible: true }).sort({ createdAt: -1 }).limit(60);

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Admin only - every review, hidden ones included, for the manage screen.
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// The logged-in user's own review, or null - lets the homepage form
// decide whether to show "write a review" or "edit your review".
const getMyReview = async (req, res) => {
  try {
    const review = await Review.findOne({ user: req.user.userId });

    res.status(200).json({
      success: true,
      review: review || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const createReview = async (req, res) => {
  try {
    const { role, quote, rating } = req.body;

    if (!role || !quote || !rating) {
      return res.status(400).json({
        success: false,
        message: "Role, review text and a rating are all required",
      });
    }

    const existing = await Review.findOne({ user: req.user.userId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You've already written a review - edit it instead.",
      });
    }

    // Only people with real activity on the platform get to leave a
    // review: a student needs at least one enrollment, an instructor
    // needs at least one course. Admin accounts skip this check.
    if (req.user.role === "student") {
      const hasEnrollment = await Enrollment.exists({ student: req.user.userId });
      if (!hasEnrollment) {
        return res.status(403).json({
          success: false,
          message: "Enroll in a course first, then share what you thought.",
        });
      }
    } else if (req.user.role === "instructor") {
      const hasCourse = await Course.exists({ instructor: req.user.userId });
      if (!hasCourse) {
        return res.status(403).json({
          success: false,
          message: "Create a course first, then share your experience teaching on Pathway.",
        });
      }
    }

    // The JWT only carries userId/role (see authMiddleware.js) - pull
    // the display name from the database rather than trust the request
    // body, so nobody can submit a review under a different name.
    const user = await User.findById(req.user.userId).select("name");

    const review = await Review.create({
      user: req.user.userId,
      name: user.name,
      role,
      quote,
      rating,
    });

    res.status(201).json({
      success: true,
      message: "Thanks for sharing!",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You've already written a review - edit it instead.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (!review.user || review.user.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "This is not your review",
      });
    }

    const { role, quote, rating } = req.body;
    review.role = role ?? review.role;
    review.quote = quote ?? review.quote;
    review.rating = rating ?? review.rating;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const isOwner = review.user && review.user.toString() === req.user.userId;
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this review",
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Admin only - hide/show a review without deleting it, e.g. if the
// content is inappropriate or unusually long.
const toggleVisibility = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.isVisible = !review.isVisible;
    await review.save();

    res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getReviews,
  getAllReviews,
  getMyReview,
  createReview,
  updateReview,
  deleteReview,
  toggleVisibility,
};