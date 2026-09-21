const mongoose = require("mongoose");
const Banner = require("../models/Banner");

// Admin only - every banner ever created, in slider order, so the manage
// screen lists them the same way they'd appear in the homepage rotation.
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Public - every banner currently active, in slider order. Multiple
// banners can be active at once (the homepage rotates through them);
// zero is a normal state too (the frontend falls back to its default
// hero content), so this never 404s.
const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const createBanner = async (req, res) => {
  try {
    const {
      badge,
      title,
      highlight,
      description,
      mediaType,
      mediaUrl,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink,
      isActive,
      order,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Banner title is required",
      });
    }

    const banner = await Banner.create({
      badge,
      title,
      highlight,
      description,
      mediaType,
      mediaUrl,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink,
      isActive: !!isActive,
      order: order ?? 0,
      createdBy: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid banner ID",
      });
    }

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    const {
      badge,
      title,
      highlight,
      description,
      mediaType,
      mediaUrl,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink,
      isActive,
      order,
    } = req.body;

    banner.badge = badge ?? banner.badge;
    banner.title = title ?? banner.title;
    banner.highlight = highlight ?? banner.highlight;
    banner.description = description ?? banner.description;
    banner.mediaType = mediaType ?? banner.mediaType;
    banner.mediaUrl = mediaUrl ?? banner.mediaUrl;
    banner.primaryButtonText = primaryButtonText ?? banner.primaryButtonText;
    banner.primaryButtonLink = primaryButtonLink ?? banner.primaryButtonLink;
    banner.secondaryButtonText = secondaryButtonText ?? banner.secondaryButtonText;
    banner.secondaryButtonLink = secondaryButtonLink ?? banner.secondaryButtonLink;
    banner.isActive = isActive ?? banner.isActive;
    banner.order = order ?? banner.order;

    await banner.save();

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid banner ID",
      });
    }

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    await banner.deleteOne();

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
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
  getBanners,
  getActiveBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};