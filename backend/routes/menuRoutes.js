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
 * @route  PATCH /api/menu/:id
 */
// Update stock by menu ID
// Full update (PUT)
// Update menu item (with optional image)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const updateData = { name, description, price, stock };

    // If a new image was uploaded, add it
    if (req.file?.path) {
      updateData.image = req.file.path;
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({
      message: "✅ Menu item updated successfully",
      menu: updatedMenu,
    });
  } catch (error) {
    console.error("Error updating menu item:", error);
    res
      .status(500)
      .json({ message: "❌ Error updating menu item", error: error.message });
  }
});




/**
 * @desc   Delete a menu item
 * @route  DELETE /api/menu/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Menu.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    res.json({
      message: "🗑️ Menu item deleted successfully",
      menu: deletedItem,
    });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res
      .status(500)
      .json({ message: "❌ Error deleting menu item", error: error.message });
  }
});


module.exports = router;
