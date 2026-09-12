const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },

    duration: {
      type: Number,
      default: 0,
    },

    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
