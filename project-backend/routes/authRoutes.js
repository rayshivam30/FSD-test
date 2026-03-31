const express = require("express");
const router = express.Router();

const { signup, login, getMe } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const { signupSchema, loginSchema } = require("../validators/authValidator");


router.post("/signup", validate(signupSchema), signup);

router.post("/login", validate(loginSchema), login);

router.get("/me", authMiddleware, getMe);

module.exports = router;
