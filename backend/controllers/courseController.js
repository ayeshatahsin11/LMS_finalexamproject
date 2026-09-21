const Course = require("../models/Course");
const mongoose = require("mongoose");

// A course can only be modified/deleted by the instructor who owns it,
// or by an admin. req.user comes from the decoded JWT (see authMiddleware)
// and already contains { userId, role }, so no extra DB lookup is needed.
const canModifyCourse = (course, user) => {
  return course.instructor.toString() === user.userId || user.role === "admin";
};

const createCourse = async (req, res) => {
  try {
    const { title, description, category, level, thumbnail, isFeatured } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description and category are required",
      });
    }

    const course = await Course.create({
      title,
      description,
      category,
      level,
      thumbnail,
      isFeatured: !!isFeatured,
      instructor: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Public course listing: supports search (title/description),
// category & level filters, and pagination.
const getCourses = async (req, res) => {
  try {
    const { search, category, level, featured, page = 1, limit = 12 } = req.query;

    const query = { isPublished: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (level) query.level = level;
    // ?featured=true - powers the homepage "Popular courses" carousel,
    // which should only show courses an instructor explicitly opted in,
    // not just "the most recent ones".
    if (featured === "true") query.isFeatured = true;

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 12;

    const [courses, total] = await Promise.all([
      Course.find(query)
        .populate("instructor", "name email")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Course.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Instructor's own courses (drafts + published) - for their dashboard
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID",
      });
    }

    const course = await Course.findById(id)
      .populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Draft (unpublished) courses are only visible to their owner or an admin.
    if (!course.isPublished) {
      const isOwner = req.user && course.instructor._id.toString() === req.user.userId;
      const isAdmin = req.user && req.user.role === "admin";
      if (!isOwner && !isAdmin) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
    }

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { title, description, category, level, thumbnail, isPublished, isFeatured } = req.body;

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!canModifyCourse(course, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this course",
      });
    }

    course.title = title ?? course.title;
    course.description = description ?? course.description;
    course.category = category ?? course.category;
    course.level = level ?? course.level;
    course.thumbnail = thumbnail ?? course.thumbnail;
    course.isPublished = isPublished ?? course.isPublished;
    course.isFeatured = isFeatured ?? course.isFeatured;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (!canModifyCourse(course, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this course",
      });
    }

    // Avoid orphaned data: remove lessons and enrollments tied to this course.
    const Lesson = require("../models/Lesson");
    const Enrollment = require("../models/Enrollment");
    await Lesson.deleteMany({ course: course._id });
    await Enrollment.deleteMany({ course: course._id });

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: "Course and its lessons/enrollments were deleted",
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
  createCourse,
  getCourses,
  getMyCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};