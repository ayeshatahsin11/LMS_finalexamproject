const express = require("express");

const {
  enrollInCourse,
  getMyEnrollments,
  getCourseEnrollments,
  getUserEnrollments,
  updateProgress,
} = require("../controllers/enrollmentController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Student enrolls in a course
router.post("/", protect, authorizeRoles("student"), enrollInCourse);

// Student's own enrollments (for their dashboard)
router.get("/my", protect, authorizeRoles("student"), getMyEnrollments);

// Instructor/admin: see who is enrolled in one of their courses
router.get(
  "/course/:courseId",
  protect,
  authorizeRoles("instructor", "admin"),
  getCourseEnrollments
);

// Admin only: see one specific student's enrollments/progress across ALL courses
router.get(
  "/user/:userId",
  protect,
  authorizeRoles("admin"),
  getUserEnrollments
);

// Student marks a lesson as complete (updates progress %)
router.put(
  "/:id/progress",
  protect,
  authorizeRoles("student"),
  updateProgress
);

module.exports = router;