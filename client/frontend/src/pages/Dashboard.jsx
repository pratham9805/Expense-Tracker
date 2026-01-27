import { useEffect, useState } from "react";
import api from "../services/api";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import MonthlyChart from "../components/MonthlyChart";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/expenses");
    setExpenses(res.data.expenses);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);


  const getMonthlySummary = () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let income = 0;
  let expense = 0;
    if (!Array.isArray(expenses)) {
  return { income: 0, expense: 0, balance: 0 };
}
  expenses.forEach((e) => {
    const d = new Date(e.date);
    if (
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    ) {
      if (e.type === "income") income += e.amount;
      else expense += e.amount;
    }
  });

  
  return { income, expense, balance: income - expense };
};
const { income, expense, balance } = getMonthlySummary();


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-xl mx-auto p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-center">
          Smart Expense Tracker
        </h1>

        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-lg">
          {/* Add Expense */}

          {/* Monthly Summary */}
<div className="grid grid-cols-3 gap-4 mb-6">
  {/* Income */}
  <div className="bg-green-500/10 border border-green-400/20 backdrop-blur-lg rounded-xl p-4 text-center">
    <p className="text-sm text-gray-300">Income</p>
    <p className="text-xl font-bold text-green-400">₹{income}</p>
  </div>

  {/* Expense */}
  <div className="bg-red-500/10 border border-red-400/20 backdrop-blur-lg rounded-xl p-4 text-center">
    <p className="text-sm text-gray-300">Expense</p>
    <p className="text-xl font-bold text-red-400">₹{expense}</p>
  </div>

  {/* Balance */}
  <div className="bg-blue-500/10 border border-blue-400/20 backdrop-blur-lg rounded-xl p-4 text-center">
    <p className="text-sm text-gray-300">Balance</p>
    <p
      className={`text-xl font-bold ${
        balance >= 0 ? "text-green-400" : "text-red-400"
      }`}
    >
      ₹{balance}
    </p>
  </div>
</div>
      <MonthlyChart income={income} expense={expense} />

          <ExpenseForm
            onAdd={(newExpense) =>
              setExpenses((prev) => [newExpense, ...prev])
            }
          />

          {/* Divider */}
          <div className="my-4 border-t border-white/20" />

          {/* Expense List */}
          {loading ? (
            <p className="text-center text-gray-400">Loading expenses...</p>
          ) : expenses.length === 0 ? (
            <p className="text-center text-gray-400">
              No expenses yet. Add one 👆
            </p>
          ) : (
            <ExpenseList
              expenses={expenses}
              fetchExpenses={fetchExpenses}
            />
          )}
        </div>
      </div>
    </div>
  );
}
