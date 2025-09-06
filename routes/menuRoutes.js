const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const Menu = require("../models/menuModel");

const router = express.Router();

// Multer-Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "menu_items", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 600, crop: "limit" }], // optional resize
  },
});

const upload = multer({ storage });

/**
 * @desc   Create a new menu item
 * @route  POST /api/menu
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const imageUrl = req.file?.path;

    if (!name || !description || !price || !imageUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const menuItem = new Menu({
      name,
      description,
      price,
      image: imageUrl,
      stock: stock ? Number(stock) : 0, // convert to number, default 0
    });

    const createdMenu = await menuItem.save();
    res.status(201).json({
      message: "✅ Menu item created successfully",
      menu: createdMenu,
    });
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "❌ Error creating menu item", error: error.message });
  }
});

/**
 * @desc   Get all menu items
 * @route  GET /api/menu
 */
router.get("/", async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({ createdAt: -1 });
    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res
      .status(500)
      .json({ message: "❌ Error fetching menu items", error: error.message });
  }
});

/**
 * @desc   Update stock for a menu item
 * @route  PATCH /api/menu/:id/stock
 */
router.patch("/:id/stock", async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({ message: "Stock value is required" });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({
      message: "✅ Stock updated successfully",
      menu: updatedMenu,
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    res
      .status(500)
      .json({ message: "❌ Error updating stock", error: error.message });
  }
});

module.exports = router;
