const mongoose = require("mongoose");
const Category = require("../models/Category");
const Course = require("../models/Course");

// Course.category is stored as plain text (not a reference), so a
// category's course count is computed here rather than kept in sync on
// the document - one aggregate query per request instead of N+1 lookups.
const withCourseCounts = async (categories) => {
  const tally = await Course.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);
  const countByName = {};
  tally.forEach((t) => {
    countByName[t._id] = t.count;
  });

  return categories.map((cat) => ({
    ...cat.toObject(),
    courseCount: countByName[cat.name] || 0,
  }));
};

// Public - active categories only, in display order, each with how many
// published courses currently use it. Powers the homepage grid and the
// course-listing filter dropdown.
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    const withCounts = await withCourseCounts(categories);

    res.status(200).json({
      success: true,
      categories: withCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Admin only - every category, including hidden ones, for the manage screen.
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1, createdAt: 1 });
    const withCounts = await withCourseCounts(categories);

    res.status(200).json({
      success: true,
      count: withCounts.length,
      categories: withCounts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, icon, color, isActive, order } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A category with this name already exists",
      });
    }

    const category = await Category.create({
      name,
      icon,
      color,
      isActive: isActive ?? true,
      order: order ?? 0,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const { name, icon, color, isActive, order } = req.body;
    const oldName = category.name;

    if (name && name.trim() !== oldName) {
      const existing = await Category.findOne({ name: name.trim(), _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "A category with this name already exists",
        });
      }
    }

    category.name = name ?? category.name;
    category.icon = icon ?? category.icon;
    category.color = color ?? category.color;
    category.isActive = isActive ?? category.isActive;
    category.order = order ?? category.order;

    await category.save();

    // Renaming a category would otherwise orphan every course that
    // already used the old name (Course.category is plain text, not a
    // reference) - carry them over to the new name so nothing silently
    // disappears from its category.
    if (category.name !== oldName) {
      await Course.updateMany({ category: oldName }, { category: category.name });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Existing courses keep their category text either way (nothing is
    // cascaded or blanked out on delete) - they just won't show up
    // under this category on the homepage/filter anymore since the
    // entry itself is gone.
    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
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
  getCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};