const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const filter = {
      user: req.user.id,
      ...(search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { metaTitle: { $regex: search, $options: "i" } },
            ],
          }
        : {}),
    };

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Product.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: products,
      meta: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    console.error("GetAllProducts error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or access denied." });
    }
    return res.json({ success: true, data: product });
  } catch (err) {
    console.error("GetProductById error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// GET /api/products/slug/:slug
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      user: req.user.id,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found or access denied." });
    }
    return res.json({ success: true, data: product });
  } catch (err) {
    console.error("GetProductBySlug error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const { metaTitle, name, slug, galleryImages, price, discountedPrice, description } = req.body;

    const existing = await Product.findOne({ slug });
    if (existing) {
      return res.status(409).json({ success: false, message: "A product with this slug already exists." });
    }

    const product = await Product.create({
      metaTitle,
      name,
      slug,
      galleryImages,
      price,
      discountedPrice: discountedPrice ?? null,
      description,
      user: req.user.id,
    });

    return res.status(201).json({ success: true, message: "Product created.", data: product });
  } catch (err) {
    console.error("CreateProduct error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Product.findOne({
      _id: id,
      user: req.user.id,
    });
    if (!existing) {
      return res.status(404).json({ success: false, message: "Product not found or access denied." });
    }

    if (req.body.slug && req.body.slug !== existing.slug) {
      const slugExists = await Product.findOne({ slug: req.body.slug });
      if (slugExists) {
        return res.status(409).json({ success: false, message: "A product with this slug already exists." });
      }
    }

    const { metaTitle, name, slug, galleryImages, price, discountedPrice, description } = req.body;
    
    existing.metaTitle = metaTitle ?? existing.metaTitle;
    existing.name = name ?? existing.name;
    existing.slug = slug ?? existing.slug;
    existing.galleryImages = galleryImages ?? existing.galleryImages;
    existing.price = price ?? existing.price;
    existing.discountedPrice = discountedPrice !== undefined ? discountedPrice : existing.discountedPrice;
    existing.description = description ?? existing.description;

    const updatedProduct = await existing.save();

    return res.json({ success: true, message: "Product updated.", data: updatedProduct });
  } catch (err) {
    console.error("UpdateProduct error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });
    
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found or access denied." });
    }

    return res.json({ success: true, message: "Product deleted successfully." });
  } catch (err) {
    console.error("DeleteProduct error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
