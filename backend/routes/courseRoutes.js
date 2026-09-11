const express = require("express");

const { createCourse, getCourses, getCourseById, updateCourse, deleteCourse } = require("../controllers/courseController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createCourse
);
router.get("/", getCourses);

router.get("/:id", getCourseById);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  updateCourse
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteCourse
);

module.exports = router;