const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const MenuRoutes=require("./routes/menuRoutes")

const app = express();
const PORT = 5000;

// ================== MongoDB Connection ==================
mongoose.connect("mongodb+srv://mufeez:Z5JgACRiLHCvkb4p@cheesecake1.q6lvaua.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// ================== Middleware ==================
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));


//==============Routes=====================//
app.use("/api/menu",MenuRoutes);

// ================== Multer Config ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ================== Start Server ==================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
