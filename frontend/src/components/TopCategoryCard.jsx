const CATEGORY_ICONS = {
  Food: "🍔", Transport: "🚗", Rent: "🏠", Shopping: "🛍️",
  Health: "💊", Entertainment: "🎬", Salary: "💼", Other: "📦",
};

const CATEGORY_COLORS = {
  Food: "text-orange-400 bg-orange-500/15 border-orange-500/25",
  Transport: "text-blue-400 bg-blue-500/15 border-blue-500/25",
  Rent: "text-purple-400 bg-purple-500/15 border-purple-500/25",
  Shopping: "text-pink-400 bg-pink-500/15 border-pink-500/25",
  Health: "text-green-400 bg-green-500/15 border-green-500/25",
  Entertainment: "text-yellow-400 bg-yellow-500/15 border-yellow-500/25",
  Salary: "text-teal-400 bg-teal-500/15 border-teal-500/25",
  Other: "text-gray-400 bg-gray-500/15 border-gray-500/25",
};

export default function TopCategoryCard({ topCategory }) {
  if (!topCategory) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">🏆</div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Top Spending Category</p>
          <p className="text-sm text-gray-500">No expenses yet this month</p>
        </div>
      </div>
    );
  }

  const { name, amount, percentage } = topCategory;
  const icon = CATEGORY_ICONS[name] || "📦";
  const colorClass = CATEGORY_COLORS[name] || CATEGORY_COLORS.Other;

  return (
    <div className={`border rounded-2xl p-5 flex items-center gap-4 ${colorClass} fade-in`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${colorClass}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 mb-0.5">🏆 Top Spending Category</p>
        <p className="font-bold text-white text-base">{name}</p>
        <p className="text-xs text-gray-400 mt-0.5">{percentage}% of total expenses</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xl font-bold text-red-400">₹{amount.toLocaleString()}</p>
        <p className="text-xs text-gray-500">this month</p>
      </div>
    </div>
  );
}
