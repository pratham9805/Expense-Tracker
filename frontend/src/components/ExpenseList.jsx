import { useState } from "react";
import { deleteExpense } from "../services/expense.service";
import EditExpenseModal from "./EditExpenseModal";
import toast from "react-hot-toast";
import { CATEGORY_COLORS } from "./ExpenseForm";

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const getBadgeColor = (category) =>
  CATEGORY_COLORS[category] || "bg-gray-500/20 border-gray-400/40 text-gray-300";

export default function ExpenseList({ expenses, fetchExpenses }) {
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = (expense) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Delete "{expense.category}"?</p>
          <p className="text-xs text-gray-400">₹{expense.amount} — This cannot be undone.</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                confirmDelete(expense._id);
              }}
              className="flex-1 bg-red-500 text-white text-xs py-1.5 rounded-lg font-semibold"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 bg-white/10 text-white text-xs py-1.5 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 8000, style: { background: "#1f2937", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" } }
    );
  };

  const confirmDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteExpense(id);
      toast.success("Expense deleted");
      fetchExpenses();
    } catch (err) {
      toast.error("Delete failed. Try again.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter + sort
  const filtered = expenses
    .filter((e) => {
      const matchSearch = e.category.toLowerCase().includes(search.toLowerCase()) ||
        (e.note || "").toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || e.type === filterType;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "highest") return b.amount - a.amount;
      if (sortBy === "lowest") return a.amount - b.amount;
      return 0;
    });

  return (
    <>
      {/* Controls */}
      <div className="space-y-2 mb-4">
        <input
          placeholder="🔍  Search by category or note…"
          className="w-full bg-black/40 text-white placeholder-gray-500 p-2.5 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-blue-400/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2">
          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="flex-1 bg-black/40 text-white p-2 rounded-xl border border-white/10 text-xs focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="expense">Expense Only</option>
            <option value="income">Income Only</option>
          </select>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 bg-black/40 text-white p-2 rounded-xl border border-white/10 text-xs focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 text-sm py-6">No transactions match your filters.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((e) => (
            <div
              key={e._id}
              className="flex justify-between items-start bg-black/30 hover:bg-black/50 border border-white/5 p-3.5 rounded-xl transition-all group"
            >
              {/* Left */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getBadgeColor(e.category)}`}>
                    {e.category}
                  </span>
                  <span className="text-xs text-gray-500">{e.type === "income" ? "Income" : "Expense"}</span>
                </div>
                {e.note && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">{e.note}</p>
                )}
                <p className="text-xs text-gray-600 mt-1">{formatDate(e.date)}</p>
              </div>

              {/* Right */}
              <div className="flex items-center gap-3 ml-3 shrink-0">
                <p className={`font-bold text-sm ${e.type === "expense" ? "text-red-400" : "text-green-400"}`}>
                  {e.type === "expense" ? "-" : "+"}₹{e.amount.toLocaleString()}
                </p>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setSelectedExpense(e)}
                    className="text-blue-400 text-xs hover:text-blue-300 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(e)}
                    disabled={deletingId === e._id}
                    className="text-red-400 text-xs hover:text-red-300 transition-colors disabled:opacity-40"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedExpense && (
        <EditExpenseModal
          expense={selectedExpense}
          onClose={() => setSelectedExpense(null)}
          onUpdated={fetchExpenses}
        />
      )}
    </>
  );
}
