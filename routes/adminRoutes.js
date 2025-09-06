const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const User = require("../models/userModels");

const router = express.Router();

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

module.exports = router;
