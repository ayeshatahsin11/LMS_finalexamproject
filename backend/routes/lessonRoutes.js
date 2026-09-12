const express = require("express");

const {
  createLesson,
  getCourseLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Get all lessons of a course
router.get("/course/:courseId", getCourseLessons);

// Get single lesson
router.get("/:id", getLessonById);

// Create lesson - Admin only
router.post(
  "/course/:courseId",
  protect,
  authorizeRoles("admin"),
  createLesson,
);

// Update lesson - Admin only
router.put("/:id", protect, authorizeRoles("admin"), updateLesson);

// Delete lesson - Admin only
router.delete("/:id", protect, authorizeRoles("admin"), deleteLesson);

module.exports = router;
