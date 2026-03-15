const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");

const {
  getDashboardSummary,
  getMonthlySummary,
  getCategoryWise,
  getTopCategory,
  checkBudget,
} = require("../controllers/analytics.controller");

router.get("/dashboard", authMiddleware, getDashboardSummary);
router.get("/summary", authMiddleware, getMonthlySummary);
router.get("/category-wise", authMiddleware, getCategoryWise);
router.get("/top-category", authMiddleware, getTopCategory);
router.get("/budget", authMiddleware, checkBudget);

module.exports = router;
