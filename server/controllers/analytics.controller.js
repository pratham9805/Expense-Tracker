const Expense = require("../models/Expense");
const User = require("../models/User");

// Helper: get start/end of current month
const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
};

// ✅ FULL DASHBOARD SUMMARY (single optimized call)
exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const { start, end } = getCurrentMonthRange();

    const user = await User.findById(userId).select("name monthlyBudget");

    // Get all expenses for this month
    const monthlyExpenses = await Expense.find({
      userId,
      date: { $gte: start, $lte: end },
    });

    let income = 0;
    let expense = 0;
    const categoryMap = {};

    monthlyExpenses.forEach((e) => {
      if (e.type === "income") {
        income += e.amount;
      } else {
        expense += e.amount;
        categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
      }
    });

    const balance = income - expense;
    const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;

    // Top spending category
    let topCategory = null;
    if (Object.keys(categoryMap).length > 0) {
      const topKey = Object.keys(categoryMap).reduce((a, b) =>
        categoryMap[a] > categoryMap[b] ? a : b
      );
      topCategory = {
        name: topKey,
        amount: categoryMap[topKey],
        percentage: expense > 0 ? Math.round((categoryMap[topKey] / expense) * 100) : 0,
      };
    }

    // Budget info
    const budget = user.monthlyBudget || 0;
    const percentUsed = budget > 0 ? Math.round((expense / budget) * 100) : 0;

    res.json({
      success: true,
      userName: user.name,
      monthlyBudget: budget,
      income,
      expense,
      balance,
      savingsRate,
      topCategory,
      budget: {
        limit: budget,
        used: expense,
        percentUsed,
        warning: percentUsed >= 80,
        critical: percentUsed >= 100,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ MONTHLY SUMMARY
exports.getMonthlySummary = async (req, res) => {
  try {
    const { start, end } = getCurrentMonthRange();
    const expenses = await Expense.find({
      userId: req.userId,
      date: { $gte: start, $lte: end },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    expenses.forEach((item) => {
      if (item.type === "income") totalIncome += item.amount;
      else totalExpense += item.amount;
    });

    res.json({
      success: true,
      totalIncome,
      totalExpense,
      savings: totalIncome - totalExpense,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ CATEGORY-WISE SPENDING
exports.getCategoryWise = async (req, res) => {
  try {
    const { start, end } = getCurrentMonthRange();
    const data = await Expense.aggregate([
      {
        $match: {
          userId: req.userId,
          type: "expense",
          date: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
    ]);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ TOP SPENDING CATEGORY
exports.getTopCategory = async (req, res) => {
  try {
    const { start, end } = getCurrentMonthRange();
    const data = await Expense.aggregate([
      {
        $match: {
          userId: req.userId,
          type: "expense",
          date: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);
    res.json({ success: true, topCategory: data[0] || null });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ BUDGET CHECK (current month only)
exports.checkBudget = async (req, res) => {
  try {
    const { start, end } = getCurrentMonthRange();
    const user = await User.findById(req.userId);
    const expenses = await Expense.find({
      userId: req.userId,
      type: "expense",
      date: { $gte: start, $lte: end },
    });

    const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
    const percentUsed = user.monthlyBudget
      ? (totalExpense / user.monthlyBudget) * 100
      : 0;

    res.json({
      success: true,
      monthlyBudget: user.monthlyBudget,
      totalExpense,
      percentUsed,
      warning: percentUsed >= 80,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
