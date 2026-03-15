import { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import { Toaster } from "react-hot-toast";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import MonthlyChart from "../components/MonthlyChart";
import CategoryChart from "../components/CategoryChart";
import BudgetWidget from "../components/BudgetWidget";
import TopCategoryCard from "../components/TopCategoryCard";
import BudgetAlertModal from "../components/BudgetAlertModal";

const SESSION_KEY = "budgetAlertDismissed";

export default function Dashboard() {
  const [expenses, setExpenses]               = useState([]);
  const [analytics, setAnalytics]             = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [mobileTab, setMobileTab]             = useState("overview");
  const [showBudgetAlert, setShowBudgetAlert] = useState(false);

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/expenses");
      setExpenses(res.data.expenses);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true);
      const res = await api.get("/analytics/dashboard");
      setAnalytics(res.data);

      // Show alert if budget >= 80% and not yet dismissed this session
      const pct = res.data?.budget?.percentUsed ?? 0;
      const dismissed = sessionStorage.getItem(SESSION_KEY);
      if (pct >= 80 && !dismissed) {
        setShowBudgetAlert(true);
      }
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
    fetchAnalytics();
  }, []);

  const handleAfterChange = () => {
    fetchExpenses();
    fetchAnalytics();
  };

  const income      = analytics?.income ?? 0;
  const expense     = analytics?.expense ?? 0;
  const balance     = analytics?.balance ?? 0;
  const savingsRate = analytics?.savingsRate ?? 0;
  const userName    = analytics?.userName ?? "";

  const STAT_CARDS = [
    {
      label: "Monthly Income", value: `₹${income.toLocaleString()}`,
      sub: "💰 This month", color: "text-emerald-400",
      border: "border-emerald-500/20", bg: "bg-emerald-500/5",
    },
    {
      label: "Monthly Expense", value: `₹${expense.toLocaleString()}`,
      sub: "💸 This month", color: "text-red-400",
      border: "border-red-500/20", bg: "bg-red-500/5",
    },
    {
      label: "Net Balance", value: `₹${balance.toLocaleString()}`,
      sub: "🏦 Net savings", color: balance >= 0 ? "text-blue-400" : "text-red-400",
      border: balance >= 0 ? "border-blue-500/20" : "border-red-500/20",
      bg: balance >= 0 ? "bg-blue-500/5" : "bg-red-500/5",
    },
    {
      label: "Savings Rate", value: `${savingsRate}%`,
      sub: "📈 Of income saved", color: savingsRate >= 0 ? "text-purple-400" : "text-red-400",
      border: savingsRate >= 0 ? "border-purple-500/20" : "border-red-500/20",
      bg: savingsRate >= 0 ? "bg-purple-500/5" : "bg-red-500/5",
    },
  ];

  return (
    <div className="min-h-screen dashboard-bg text-white">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111827",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            fontSize: "14px",
          },
        }}
      />

      {/* ── Budget Alert Modal ── */}
      {showBudgetAlert && analytics?.budget && (
        <BudgetAlertModal
          budget={analytics.budget}
          onDismiss={() => setShowBudgetAlert(false)}
        />
      )}

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-30 border-b border-white/8 bg-gray-950/85 backdrop-blur-xl slide-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-base shrink-0 shadow-lg">
              💳
            </div>
            <div>
              <span className="font-bold text-white text-sm sm:text-base leading-none block">SmartSpend</span>
              {userName && (
                <p className="text-xs text-gray-400 leading-none mt-0.5 hidden sm:block">
                  Hey, {userName} 👋
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {userName && (
              <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-white/5 border border-white/8 rounded-full px-3 py-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold" style={{ fontSize: 9 }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
                {userName}
              </div>
            )}
            <button
              onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/12 text-xs text-gray-300 hover:bg-white/8 hover:text-white transition-all"
            >
              🚪 <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── STATS ROW ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        {analyticsLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-white/5 border border-white/8 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            {STAT_CARDS.map((card, i) => (
              <div
                key={card.label}
                className={`stat-card ${card.border} ${card.bg} slide-up`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <p className="text-xs text-gray-400 mb-1.5">{card.label}</p>
                <p className={`text-xl sm:text-2xl font-bold ${card.color}`}>{card.value}</p>
                <p className="text-xs text-gray-600 mt-1.5">{card.sub}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── MOBILE TAB SWITCHER ── */}
      <div className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 mb-4">
        <div className="flex rounded-xl border border-white/10 bg-white/5 overflow-hidden p-1 gap-1">
          {[["overview", "📊", "Overview"], ["add", "➕", "Add"], ["transactions", "📋", "Transactions"]].map(([tab, emoji, label]) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mobileTab === tab
                  ? "bg-blue-600/40 text-blue-300 shadow"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {emoji} {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">

        {/* DESKTOP: two-column layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <MonthlyChart income={income} expense={expense} />
            <CategoryChart expenses={expenses} />
            <TopCategoryCard topCategory={analytics?.topCategory} />
            <BudgetWidget
              budget={analytics?.budget}
              expense={expense}
              onBudgetUpdate={() => fetchAnalytics()}
            />
          </div>
          <div className="space-y-4">
            <ExpenseForm
              onAdd={(newExpense) => {
                setExpenses((prev) => [newExpense, ...prev]);
                fetchAnalytics();
              }}
            />
            <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Transactions</h3>
              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : expenses.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-6">No transactions yet. Add one ☝️</p>
              ) : (
                <ExpenseList expenses={expenses} fetchExpenses={handleAfterChange} />
              )}
            </div>
          </div>
        </div>

        {/* MOBILE: tab-based layout */}
        <div className="lg:hidden">
          {mobileTab === "overview" && (
            <div className="space-y-4 fade-in">
              <MonthlyChart income={income} expense={expense} />
              <CategoryChart expenses={expenses} />
              <TopCategoryCard topCategory={analytics?.topCategory} />
              <BudgetWidget
                budget={analytics?.budget}
                expense={expense}
                onBudgetUpdate={() => fetchAnalytics()}
              />
            </div>
          )}
          {mobileTab === "add" && (
            <div className="fade-in">
              <ExpenseForm
                onAdd={(newExpense) => {
                  setExpenses((prev) => [newExpense, ...prev]);
                  fetchAnalytics();
                  setMobileTab("transactions");
                }}
              />
            </div>
          )}
          {mobileTab === "transactions" && (
            <div className="fade-in">
              <div className="bg-white/3 border border-white/8 rounded-2xl p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Transactions</h3>
                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : expenses.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm py-6">No transactions yet. Add one ☝️</p>
                ) : (
                  <ExpenseList expenses={expenses} fetchExpenses={handleAfterChange} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
