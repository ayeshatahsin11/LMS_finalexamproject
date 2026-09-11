const Lesson = require("../models/Lesson");
const Course = require("../models/Course");

const createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, videoUrl, duration, order } = req.body;

    if (!title || !videoUrl || order === undefined) {
      return res.status(400).json({
        success: false,
        message: "Title, video URL and order are required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lesson = await Lesson.create({
      course: courseId,
      title,
      description,
      videoUrl,
      duration,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getCourseLessons = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const lessons = await Lesson.find({ course: courseId })
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: lessons.length,
      lessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate("course", "title");

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { title, description, videoUrl, duration, order } = req.body;

    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    lesson.title = title ?? lesson.title;
    lesson.description = description ?? lesson.description;
    lesson.videoUrl = videoUrl ?? lesson.videoUrl;
    lesson.duration = duration ?? lesson.duration;
    lesson.order = order ?? lesson.order;

    await lesson.save();

    res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    await lesson.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
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
  createLesson,
  getCourseLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
};