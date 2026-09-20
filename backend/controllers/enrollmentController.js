const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Lesson = require("../models/Lesson");

// Student enrolls themself in a published course.
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course || !course.isPublished) {
      return res.status(404).json({
        success: false,
        message: "Course not found or not available for enrollment",
      });
    }

    const existing = await Enrollment.findOne({
      student: req.user.userId,
      course: courseId,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    const enrollment = await Enrollment.create({
      student: req.user.userId,
      course: courseId,
    });

    course.enrollmentCount += 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Logged-in student's own enrollments - powers the Student Dashboard.
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.userId })
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Instructor/admin: see who is enrolled in a specific course they own.
const getCourseEnrollments = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const isOwner = course.instructor.toString() === req.user.userId;
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view these enrollments",
      });
    }

    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate("student", "name email");

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Student marks a lesson complete -> recalculates progressPercent.
const updateProgress = async (req, res) => {
  try {
    const { lessonId } = req.body;

    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: "lessonId is required",
      });
    }

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    if (enrollment.student.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "This is not your enrollment",
      });
    }

    const lesson = await Lesson.findById(lessonId);

    if (!lesson || lesson.course.toString() !== enrollment.course.toString()) {
      return res.status(400).json({
        success: false,
        message: "This lesson does not belong to the enrolled course",
      });
    }

    const alreadyCompleted = enrollment.completedLessons.some(
      (id) => id.toString() === lessonId
    );

    if (!alreadyCompleted) {
      enrollment.completedLessons.push(lessonId);
    }

    const totalLessons = await Lesson.countDocuments({ course: enrollment.course });
    enrollment.progressPercent = totalLessons
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;

    if (enrollment.progressPercent >= 100) {
      enrollment.status = "completed";
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Progress updated",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Admin: see ALL enrollments (with progress) for one specific student,
// across every course they've enrolled in. Powers the detailed "Manage
// Users" admin view.
const getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.params.userId })
      .populate("course", "title category level isPublished")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
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
  enrollInCourse,
  getMyEnrollments,
  getCourseEnrollments,
  getUserEnrollments,
  updateProgress,
};