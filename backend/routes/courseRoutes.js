const express = require("express");

const {
  createCourse,
  getCourses,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const { protect, optionalAuth } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Instructors AND admins can create/manage courses.
// Ownership (only the instructor who made it, or an admin) is enforced
// inside updateCourse/deleteCourse in the controller.
router.post("/", protect, authorizeRoles("instructor", "admin"), createCourse);

router.get("/", getCourses);

// Instructor's own courses (including unpublished drafts) - must come
// before "/:id" so Express doesn't treat "my-courses" as an :id value.
router.get(
  "/my-courses",
  protect,
  authorizeRoles("instructor", "admin"),
  getMyCourses
);

// optionalAuth: guests can view published courses; if a logged-in
// instructor/admin requests their own draft, we still recognize them.
router.get("/:id", optionalAuth, getCourseById);

router.put(
  "/:id",
  protect,
  authorizeRoles("instructor", "admin"),
  updateCourse
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("instructor", "admin"),
  deleteCourse
);

module.exports = router;