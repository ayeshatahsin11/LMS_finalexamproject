const mongoose = require("mongoose");
const Banner = require("../models/Banner");

// Admin only - every banner ever created, newest first, so the admin can
// pick a different one to activate later (e.g. swap back after an offer
// ends) without having to recreate it.
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });

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

// Public - the single banner the homepage hero should render. Returns
// `banner: null` (not a 404) when nothing is active yet, since "no
// custom banner" is an expected state, not an error - the frontend
// falls back to its default hero content in that case.
const getActiveBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne({ isActive: true }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      banner: banner || null,
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
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Banner title is required",
      });
    }

    // Only one banner is ever shown at once - if this one is being
    // created as active, deactivate every other banner first.
    if (isActive) {
      await Banner.updateMany({}, { isActive: false });
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
    } = req.body;

    // Switching this banner on deactivates every other one first, so
    // there's never more than one active banner at a time.
    if (isActive && !banner.isActive) {
      await Banner.updateMany({ _id: { $ne: banner._id } }, { isActive: false });
    }

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
  getActiveBanner,
  createBanner,
  updateBanner,
  deleteBanner,
};