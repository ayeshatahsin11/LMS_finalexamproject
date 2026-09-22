const express = require("express");

const {
  getCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Public - active categories with course counts, used by the homepage
// grid, the course-listing filter, and the "create/edit course" forms.
router.get("/", getCategories);

// Admin only - every category including hidden ones, for the manage screen.
router.get("/all", protect, authorizeRoles("admin"), getAllCategories);

router.post("/", protect, authorizeRoles("admin"), createCategory);
router.put("/:id", protect, authorizeRoles("admin"), updateCategory);
router.delete("/:id", protect, authorizeRoles("admin"), deleteCategory);

module.exports = router;