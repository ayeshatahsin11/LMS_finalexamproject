const express = require("express");

const {
  getBanners,
  getActiveBanner,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");

const { protect } = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// Public - the homepage hero fetches this on every load. Must come
// before "/:id"-style routes if any are ever added, so Express doesn't
// treat "active" as an :id value.
router.get("/active", getActiveBanner);

// Everything else is admin-only: listing every banner (for the manage
// screen), creating, updating and deleting.
router.get("/", protect, authorizeRoles("admin"), getBanners);
router.post("/", protect, authorizeRoles("admin"), createBanner);
router.put("/:id", protect, authorizeRoles("admin"), updateBanner);
router.delete("/:id", protect, authorizeRoles("admin"), deleteBanner);

module.exports = router;