import { useState, useEffect } from "react";
import { updateExpense } from "../services/expense.service";
import toast from "react-hot-toast";
import { CATEGORIES } from "./ExpenseForm";

const EditExpenseModal = ({ expense, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    category: "",
    date: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expense) {
      setFormData({
        type: expense.type,
        amount: expense.amount,
        category: expense.category,
        date: expense.date.split("T")[0],
        note: expense.note || "",
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateExpense(expense._id, formData);
      toast.success("Expense updated!");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error("Update failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900/95 border border-white/15 rounded-2xl p-6 w-full max-w-sm shadow-2xl mx-4">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold text-white">Edit Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-white/15">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "expense" })}
              className={`flex-1 py-2 text-sm font-semibold transition-all ${
                formData.type === "expense"
                  ? "bg-red-500/30 text-red-300"
                  : "text-gray-400 hover:bg-white/5"
              }`}
            >
              💸 Expense
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: "income" })}
              className={`flex-1 py-2 text-sm font-semibold transition-all ${
                formData.type === "income"
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
            <div className="flex flex-wrap gap-1.5 mb-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.label })}
                  className={`px-2.5 py-1 rounded-full text-xs border transition-all ${
                    formData.category === cat.label
                      ? "bg-blue-500/30 border-blue-400/60 text-blue-200"
                      : "bg-white/5 border-white/15 text-gray-300 hover:border-white/30"
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-black/40 text-white placeholder-gray-500 p-2.5 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-blue-400/60"
            />
          </div>

          {/* Amount */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full bg-black/40 text-white placeholder-gray-500 pl-7 pr-4 py-2.5 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-blue-400/60"
            />
          </div>

          {/* Date */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full bg-black/40 text-white p-2.5 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-blue-400/60"
          />

          {/* Note */}
          <input
            type="text"
            name="note"
            placeholder="Note (optional)"
            value={formData.note}
            onChange={handleChange}
            className="w-full bg-black/40 text-white placeholder-gray-500 p-2.5 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-blue-400/60"
          />

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-white/15 text-gray-300 text-sm hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white font-semibold text-sm transition-all"
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseModal;
