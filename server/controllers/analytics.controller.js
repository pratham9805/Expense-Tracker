    const Expense = require("../models/Expense");
const User = require("../models/User");

// ✅ MONTHLY SUMMARY (Income, Expense, Savings)
exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = req.userId;

    const expenses = await Expense.find({ userId });

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

// ✅ CATEGORY-WISE SPENDING (Pie Chart)
exports.getCategoryWise = async (req, res) => {
  try {
    const data = await Expense.aggregate([
      {
        $match: {
          userId: req.userId,
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ TOP SPENDING CATEGORY
exports.getTopCategory = async (req, res) => {
  try {
    const data = await Expense.aggregate([
      {
        $match: {
          userId: req.userId,
          type: "expense",
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);

    res.json({
      success: true,
      topCategory: data[0] || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ BUDGET CHECK (80% WARNING)
exports.checkBudget = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const expenses = await Expense.find({
      userId: req.userId,
      type: "expense",
    });

    const totalExpense = expenses.reduce(
      (sum, item) => sum + item.amount,
      0
    );

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
