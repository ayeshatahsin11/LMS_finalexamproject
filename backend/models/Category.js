const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },

    // Name of a lucide-react icon from the curated set the admin picker
    // offers (see frontend/src/lib/categoryIcons.js). Stored as plain
    // text because a React component can't be saved to MongoDB - the
    // frontend maps this string back to the actual icon component.
    icon: {
      type: String,
      trim: true,
      default: "BookOpen",
    },

    color: {
      type: String,
      trim: true,
      default: "#6366F1",
    },

    // Hiding a category (instead of deleting it) takes it off the
    // homepage and out of the "create course" dropdown without touching
    // any course that already uses this category's name.
    isActive: {
      type: Boolean,
      default: true,
    },

    // Display order in the homepage grid and admin list - lowest first.
    order: {
      type: Number,
      default: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;