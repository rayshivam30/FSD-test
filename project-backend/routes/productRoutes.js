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


router.get("/", getAllProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id", getProductById);


router.post("/", authMiddleware, validate(productCreateSchema), createProduct);
router.put("/:id", authMiddleware, validate(productUpdateSchema), updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
