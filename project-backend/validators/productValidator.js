const Joi = require("joi");

const productCreateSchema = Joi.object({
  metaTitle: Joi.string().trim().min(3).max(255).required().messages({
    "string.empty": "Meta title is required",
    "string.min": "Meta title must be at least 3 characters",
    "string.max": "Meta title must be at most 255 characters",
  }),
  name: Joi.string().trim().min(2).max(255).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name must be at least 2 characters",
  }),
  slug: Joi.string()
    .trim()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(255)
    .required()
    .messages({
      "string.empty": "Slug is required",
      "string.pattern.base":
        "Slug must be lowercase letters, numbers, and hyphens only",
    }),
  galleryImages: Joi.array().items(Joi.string().uri()).min(1).required().messages({
    "array.min": "At least one gallery image is required",
    "any.required": "Gallery images are required",
  }),
  price: Joi.number().positive().precision(2).required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be positive",
    "any.required": "Price is required",
  }),
  discountedPrice: Joi.number().positive().precision(2).less(Joi.ref("price")).optional().allow(null).messages({
    "number.positive": "Discounted price must be positive",
    "number.less": "Discounted price must be less than the original price",
  }),
  description: Joi.string().min(10).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters",
  }),
});

const productUpdateSchema = productCreateSchema.fork(
  ["metaTitle", "name", "slug", "galleryImages", "price", "description"],
  (field) => field.optional()
);

module.exports = { productCreateSchema, productUpdateSchema };
