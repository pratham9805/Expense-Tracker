import { useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

const CATEGORY_ICONS = {
  Food: "🍔", Transport: "🚗", Rent: "🏠", Shopping: "🛍️",
  Health: "💊", Entertainment: "🎬", Salary: "💼", Other: "📦",
};

export default function BudgetWidget({ budget, expense, onBudgetUpdate }) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState(budget?.limit || "");
  const [saving, setSaving] = useState(false);

  const limit = budget?.limit || 0;
  const used = budget?.used || 0;
  const pct = budget?.percentUsed || 0;
  const warning = budget?.warning || false;
  const critical = budget?.critical || false;

  const barColor = critical
    ? "bg-gradient-to-r from-red-600 to-red-500"
    : warning
    ? "bg-gradient-to-r from-amber-500 to-orange-500"
    : "bg-gradient-to-r from-emerald-500 to-teal-500";

  const handleSave = async () => {
    if (!inputVal || Number(inputVal) <= 0) {
      toast.error("Enter a valid budget amount");
      return;
    }
    setSaving(true);
    try {
      await api.put("/auth/budget", { monthlyBudget: Number(inputVal) });
      toast.success("Budget updated!");
      setEditing(false);
      onBudgetUpdate && onBudgetUpdate(Number(inputVal));
    } catch {
      toast.error("Failed to save budget");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`budget-widget rounded-2xl p-5 border transition-all ${
      critical
        ? "bg-red-500/10 border-red-500/30"
        : warning
        ? "bg-amber-500/10 border-amber-500/30"
        : "bg-white/5 border-white/10"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <h3 className="font-semibold text-white text-sm">Monthly Budget</h3>
          {warning && !critical && (
            <span className="warning-pulse text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
              ⚠ 80% Used
            </span>
          )}
          {critical && (
            <span className="warning-pulse text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-medium">
              🚨 Over Budget!
            </span>
          )}
        </div>

        {!editing ? (
          <button
            onClick={() => { setEditing(true); setInputVal(limit || ""); }}
            className="text-xs text-blue-400 hover:text-blue-300 border border-blue-400/30 px-3 py-1 rounded-full transition-all hover:bg-blue-400/10"
          >
            {limit ? "Edit Budget" : "Set Budget"}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">₹</span>
            <input
              type="number"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-28 bg-black/40 border border-blue-400/40 text-white text-sm px-2 py-1 rounded-lg focus:outline-none"
              placeholder="e.g. 20000"
              autoFocus
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded-lg text-white disabled:opacity-50 transition-all"
            >
              {saving ? "…" : "Save"}
            </button>
            <button onClick={() => setEditing(false)} className="text-xs text-gray-400 hover:text-white">✕</button>
          </div>
        )}
      </div>

      {limit > 0 ? (
        <>
          {/* Progress Bar */}
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-3">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          {/* Labels */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>₹{used.toLocaleString()} spent</span>
            <span className={`font-semibold ${critical ? "text-red-400" : warning ? "text-amber-400" : "text-gray-300"}`}>
              {pct}% of ₹{limit.toLocaleString()}
            </span>
            <span>₹{Math.max(0, limit - used).toLocaleString()} left</span>
          </div>
        </>
      ) : (
        <p className="text-sm text-gray-500 text-center py-2">
          No budget set. Click "Set Budget" to start tracking.
        </p>
      )}
    </div>
  );
}
