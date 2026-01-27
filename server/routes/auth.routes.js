const express = require("express");
const router = express.Router();
const { register, login,setBudget } = require("../controllers/auth.controller");
const authMiddleware=require("../middleware/auth.middleware");
router.post("/register", register);
router.post("/login", login);
router.put("/budget", authMiddleware, setBudget);

module.exports = router;
