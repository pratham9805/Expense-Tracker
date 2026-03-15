/**
 * BudgetAlertModal
 * Shows a dismissable fullscreen popup when budget usage >= 80%.
 * Dismissed state is stored in sessionStorage so it shows only once per session.
 */

const SESSION_KEY = "budgetAlertDismissed";

export default function BudgetAlertModal({ budget, onDismiss }) {
  const pct   = budget?.percentUsed ?? 0;
  const used  = budget?.used ?? 0;
  const limit = budget?.limit ?? 0;
  const remaining = Math.max(0, limit - used);
  const isCritical = pct >= 100;

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "true");
    onDismiss?.();
  };

  return (
    <div className="modal-overlay" onClick={handleDismiss} role="dialog" aria-modal="true" aria-label="Budget alert">
      {/* Stop click propagation on the card so only backdrop click closes */}
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="modal-header-gradient">
          <div className="flex justify-center">
            <div className="modal-icon-ring bounce-in">
              <span style={{ fontSize: 34, lineHeight: 1 }}>
                {isCritical ? "🚨" : "⚠️"}
              </span>
            </div>
          </div>
          <h2 className="text-white text-xl font-bold mt-3 mb-1">
            {isCritical ? "Over Budget!" : "Budget Warning"}
          </h2>
          <p className="text-red-200/80 text-sm">
            {isCritical
              ? "You've exceeded your monthly spending limit."
              : "You've used more than 80% of your monthly budget."}
          </p>
        </div>

        {/* ── Body ── */}
        <div className="modal-body">
          {/* Usage display */}
          <div className="flex justify-between items-end mb-1">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Budget used</span>
            <span
              className="text-2xl font-black"
              style={{ color: isCritical ? "#f87171" : "#fb923c" }}
            >
              {pct}%
            </span>
          </div>

          {/* Progress bar */}
          <div className="modal-progress-bar">
            <div
              className="modal-progress-fill"
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>

          {/* Figures */}
          <div className="flex justify-between text-xs text-gray-500 mb-5">
            <span>₹{used.toLocaleString()} spent</span>
            <span className="text-red-400 font-medium">₹{remaining.toLocaleString()} remaining</span>
            <span>₹{limit.toLocaleString()} limit</span>
          </div>

          {/* Tip box */}
          <div className="rounded-xl p-3.5 text-sm text-amber-300/80 border border-amber-500/20 bg-amber-500/8 flex gap-2.5">
            <span className="text-base leading-none mt-0.5">💡</span>
            <span>
              {isCritical
                ? "Consider reviewing your expenses and increasing your budget limit."
                : "Try to limit non-essential spending for the rest of the month."}
            </span>
          </div>

          {/* Buttons */}
          <button className="modal-dismiss-btn" onClick={handleDismiss}>
            Got it — I'll be careful
          </button>
          <button className="modal-secondary-btn" onClick={handleDismiss}>
            Dismiss for this session
          </button>
        </div>
      </div>
    </div>
  );
}
