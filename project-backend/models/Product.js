const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    galleryImages: [{ type: String }],
    price: { type: Number, required: true },
    discountedPrice: { type: Number, default: null },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
