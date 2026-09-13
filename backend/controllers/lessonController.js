const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// Only the instructor who owns the parent course, or an admin,
// can add/edit/delete lessons in it.
const canModifyCourse = (course, user) => {
  return course.instructor.toString() === user.userId || user.role === "admin";
};

const createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, videoUrl, duration, order, isFreePreview } = req.body;

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

    if (!canModifyCourse(course, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to add lessons to this course",
      });
    }

    const lesson = await Lesson.create({
      course: courseId,
      title,
      description,
      videoUrl,
      duration,
      order,
      isFreePreview,
    });

    // Keep the bidirectional link in sync: add this lesson's id to the
    // course's lessons array too.
    course.lessons.push(lesson._id);
    await course.save();

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

// Returns the lesson list for a course. If the requester is NOT enrolled
// (and isn't the owner/admin), locked lessons are returned WITHOUT the
// actual videoUrl/description - only title/order/isFreePreview - so the
// frontend can show a "locked" state without leaking paid content.
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

    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });

    let hasFullAccess = false;
    if (req.user) {
      const isOwner = course.instructor.toString() === req.user.userId;
      const isAdmin = req.user.role === "admin";
      const enrolled = isOwner || isAdmin
        ? null
        : await Enrollment.findOne({ student: req.user.userId, course: courseId });
      hasFullAccess = isOwner || isAdmin || !!enrolled;
    }

    const responseLessons = hasFullAccess
      ? lessons
      : lessons.map((lesson) =>
          lesson.isFreePreview
            ? lesson
            : {
                _id: lesson._id,
                title: lesson.title,
                order: lesson.order,
                duration: lesson.duration,
                isFreePreview: false,
                locked: true,
              }
        );

    res.status(200).json({
      success: true,
      count: responseLessons.length,
      lessons: responseLessons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Full lesson detail (with videoUrl) - gated behind enrollment/ownership/free-preview.
const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate("course", "title instructor");

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const course = lesson.course;

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "The course this lesson belongs to no longer exists",
      });
    }

    const isOwner = req.user && course.instructor.toString() === req.user.userId;
    const isAdmin = req.user && req.user.role === "admin";

    if (!lesson.isFreePreview && !isOwner && !isAdmin) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Please log in and enroll to access this lesson",
        });
      }

      const enrolled = await Enrollment.findOne({
        student: req.user.userId,
        course: course._id,
      });

      if (!enrolled) {
        return res.status(403).json({
          success: false,
          message: "You must enroll in this course to access this lesson",
        });
      }
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
    const { title, description, videoUrl, duration, order, isFreePreview } = req.body;

    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const course = await Course.findById(lesson.course);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "The course this lesson belongs to no longer exists",
      });
    }

    if (!canModifyCourse(course, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to update this lesson",
      });
    }

    lesson.title = title ?? lesson.title;
    lesson.description = description ?? lesson.description;
    lesson.videoUrl = videoUrl ?? lesson.videoUrl;
    lesson.duration = duration ?? lesson.duration;
    lesson.order = order ?? lesson.order;
    lesson.isFreePreview = isFreePreview ?? lesson.isFreePreview;

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

    const course = await Course.findById(lesson.course);

    if (!course) {
      // The parent course is gone but this lesson is orphaned - allow
      // deletion anyway (only admin/instructor reaches this route), since
      // there's no owner left to check permission against.
      await lesson.deleteOne();
      return res.status(200).json({
        success: true,
        message: "Orphaned lesson deleted successfully",
      });
    }

    if (!canModifyCourse(course, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this lesson",
      });
    }

    await lesson.deleteOne();

    // Keep the bidirectional link in sync: remove this lesson's id from
    // the course's lessons array too.
    course.lessons.pull(lesson._id);
    await course.save();

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