const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { productCreateSchema, productUpdateSchema } = require("../validators/productValidator");


router.get("/", authMiddleware, getAllProducts);
router.get("/slug/:slug", authMiddleware, getProductBySlug);
router.get("/:id", authMiddleware, getProductById);


router.post("/", authMiddleware, validate(productCreateSchema), createProduct);
router.put("/:id", authMiddleware, validate(productUpdateSchema), updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
