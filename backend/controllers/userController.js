const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Review = require("../models/Review");

// Logged-in user views their own profile.
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Logged-in user updates their own name/bio/avatar (NOT role or email).
const updateMyProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Logged-in user changes their own password.
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user.userId);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      // 400, not 401: the user's session/token is still perfectly valid -
      // they just typed the wrong current password into this form. A 401
      // here would incorrectly trigger the frontend's global "session
      // expired, log out" handling for what is really just a form
      // validation error.
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ---- ADMIN ONLY below this line ----

// Admin: list all users, with optional role filter + name/email search.
const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 20;

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Admin: change a user's role or activate/deactivate their account.
const updateUserByAdmin = async (req, res) => {
  try {
    const { role, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Admin: permanently delete a user account.
//
// This is intentionally NOT a cascading delete - hard-deleting an
// instructor with live courses (or a student with live enrollments)
// would leave those documents pointing at a user that no longer
// exists, which breaks anything that populates/display that person
// (e.g. "taught by [nothing]" on a course card). Real-world platforms
// avoid this by either blocking the delete or soft-deleting instead;
// this app already has a soft-delete path (isActive, see
// updateUserByAdmin above), so hard delete is only allowed once there's
// nothing left that would be orphaned by it.
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "instructor") {
      const courseCount = await Course.countDocuments({ instructor: user._id });
      if (courseCount > 0) {
        return res.status(409).json({
          success: false,
          message: `This instructor still has ${courseCount} course(s). Reassign or remove those first, or deactivate the account instead of deleting it.`,
        });
      }
    }

    if (user.role === "student") {
      const enrollmentCount = await Enrollment.countDocuments({ student: user._id });
      if (enrollmentCount > 0) {
        return res.status(409).json({
          success: false,
          message: `This student still has ${enrollmentCount} enrollment(s). Deactivate the account instead of deleting it, to keep their progress history intact.`,
        });
      }
    }

    // Not blocking data, but no reason to leave a ghost review behind
    // for an account that no longer exists.
    await Review.deleteOne({ user: user._id });

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
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
  getMyProfile,
  updateMyProfile,
  changePassword,
  getAllUsers,
  updateUserByAdmin,
  deleteUser,
};