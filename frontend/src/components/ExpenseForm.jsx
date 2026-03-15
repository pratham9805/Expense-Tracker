import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const CATEGORIES = [
  { label: "Food", icon: "🍔" },
  { label: "Transport", icon: "🚗" },
  { label: "Rent", icon: "🏠" },
  { label: "Shopping", icon: "🛍️" },
  { label: "Health", icon: "💊" },
  { label: "Entertainment", icon: "🎬" },
  { label: "Salary", icon: "💼" },
  { label: "Other", icon: "📦" },
];

const CATEGORY_COLORS = {
  Food: "bg-orange-500/20 border-orange-400/40 text-orange-300",
  Transport: "bg-blue-500/20 border-blue-400/40 text-blue-300",
  Rent: "bg-purple-500/20 border-purple-400/40 text-purple-300",
  Shopping: "bg-pink-500/20 border-pink-400/40 text-pink-300",
  Health: "bg-green-500/20 border-green-400/40 text-green-300",
  Entertainment: "bg-yellow-500/20 border-yellow-400/40 text-yellow-300",
  Salary: "bg-teal-500/20 border-teal-400/40 text-teal-300",
  Other: "bg-gray-500/20 border-gray-400/40 text-gray-300",
};

export { CATEGORIES, CATEGORY_COLORS };

export default function ExpenseForm({ onAdd }) {
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.error("Please select or enter a category");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/expenses", {
        type,
        category,
        amount: Number(amount),
        note,
      });
      onAdd(res.data.expense);
      setCategory("");
      setAmount("");
      setNote("");
      toast.success(`${type === "income" ? "Income" : "Expense"} added!`);
    } catch (err) {
      toast.error("Failed to add. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-5 rounded-2xl mb-6 space-y-4">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Add Transaction</h3>

      {/* Income / Expense Toggle */}
      <div className="flex rounded-xl overflow-hidden border border-white/15">
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`flex-1 py-2 text-sm font-semibold transition-all ${
            type === "expense"
              ? "bg-red-500/30 text-red-300"
              : "text-gray-400 hover:bg-white/5"
          }`}
        >
          💸 Expense
        </button>
        <button
          type="button"
          onClick={() => setType("income")}
          className={`flex-1 py-2 text-sm font-semibold transition-all ${
            type === "income"
              ? "bg-green-500/30 text-green-300"
              : "text-gray-400 hover:bg-white/5"
          }`}
        >
          💰 Income
        </button>
      </div>

      {/* Category Chips */}
      <div>
        <p className="text-xs text-gray-400 mb-2">Category</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => setCategory(cat.label)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                category === cat.label
                  ? "bg-blue-500/30 border-blue-400/60 text-blue-200 scale-105"
                  : "bg-white/5 border-white/15 text-gray-300 hover:border-white/30"
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
        <input
          placeholder="or type custom category…"
          className="w-full bg-black/40 text-white placeholder-gray-500 p-2.5 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-blue-400/60"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      {/* Amount */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
        <input
          type="number"
          placeholder="0.00"
          className="w-full bg-black/40 text-white placeholder-gray-500 pl-7 pr-4 py-2.5 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-blue-400/60"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="1"
        />
      </div>

      {/* Note */}
      <input
        placeholder="Note (optional)"
        className="w-full bg-black/40 text-white placeholder-gray-500 p-2.5 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-blue-400/60"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 py-2.5 rounded-xl text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/20"
      >
        {loading ? "Adding…" : "✚ Add Transaction"}
      </button>
    </form>
  );
}
