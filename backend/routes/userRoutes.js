const express = require("express");

const {
  getMyProfile,
  updateMyProfile,
  changePassword,
  getAllUsers,
  updateUserByAdmin,
  deleteUser,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Any logged-in user manages their OWN profile
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.put("/me/password", protect, changePassword);

// Admin-only: manage all users
router.get("/", protect, authorizeRoles("admin"), getAllUsers);
router.put("/:id", protect, authorizeRoles("admin"), updateUserByAdmin);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUser);

module.exports = router;