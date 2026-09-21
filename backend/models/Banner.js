const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    // Small pill label above the heading, e.g. "Learn without limits"
    // or "Limited-time offer".
    badge: {
      type: String,
      trim: true,
      default: "",
    },

    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
    },

    // The part of the heading rendered with the gradient accent, shown
    // on its own line under `title` (e.g. "one lesson at a time.").
    highlight: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    mediaType: {
      type: String,
      enum: ["none", "image", "video"],
      default: "none",
    },

    // Image URL, or a video URL (YouTube link or direct file) - same
    // convention as Course.thumbnail / Lesson.videoUrl.
    mediaUrl: {
      type: String,
      trim: true,
      default: "",
    },

    primaryButtonText: {
      type: String,
      trim: true,
      default: "Browse courses",
    },
    primaryButtonLink: {
      type: String,
      trim: true,
      default: "/courses",
    },

    // Optional - leave blank to hide the secondary button entirely.
    secondaryButtonText: {
      type: String,
      trim: true,
      default: "",
    },
    secondaryButtonLink: {
      type: String,
      trim: true,
      default: "",
    },

    // Multiple banners can be active at once (they rotate as a slider on
    // the homepage) - `order` controls the sequence, lowest first.
    isActive: {
      type: Boolean,
      default: false,
    },

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

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;