const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    image: { type: String, required: true }, // Cloudinary URL
    stock: { 
      type: Number, 
      default: 0 
    },
    stockStatus: {
      type: String,
      default: "Sold Out",
    }
  },
  { timestamps: true }
);

// Middleware to auto-update stockStatus
menuSchema.pre("save", function (next) {
  if (this.stock > 0) {
    this.stockStatus = "Available";
  } else {
    this.stockStatus = "Sold Out";
  }
  next();
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
