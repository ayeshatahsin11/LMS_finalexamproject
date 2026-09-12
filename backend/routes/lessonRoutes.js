const express = require("express");

const {
  createLesson,
  getCourseLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");

const { protect, optionalAuth } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// optionalAuth: guests get locked/preview-only lesson lists; logged-in
// enrolled students, owners, and admins get full content.
router.get("/course/:courseId", optionalAuth, getCourseLessons);
router.get("/:id", optionalAuth, getLessonById);

// Create lesson - Instructor (owner) or Admin only
router.post(
  "/course/:courseId",
  protect,
  authorizeRoles("instructor", "admin"),
  createLesson
);

// Update lesson - Instructor (owner) or Admin only
router.put(
  "/:id",
  protect,
  authorizeRoles("instructor", "admin"),
  updateLesson
);

// Delete lesson - Instructor (owner) or Admin only
router.delete(
  "/:id",
  protect,
  authorizeRoles("instructor", "admin"),
  deleteLesson
);

module.exports = router;