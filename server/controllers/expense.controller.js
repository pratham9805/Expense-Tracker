const Expense = require("../models/Expense");

// ✅ ADD EXPENSE / INCOME
exports.addExpense = async (req, res) => {
  try {
    const { type, amount, category, date } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    const expense = await Expense.create({
      userId: req.userId,
      type,
      amount,
      category,
      date,
    });

    res.status(201).json({
      success: true,
      expense,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ GET ALL EXPENSES (USER-WISE)
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.userId })
      .sort({ date: -1 });

    res.json({
      success: true,
      expenses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATE EXPENSE
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({
      success: true,
      expense,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ DELETE EXPENSE
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({
      success: true,
      message: "Expense deleted",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
