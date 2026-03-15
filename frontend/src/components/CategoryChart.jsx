import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#f97316", "#3b82f6", "#a855f7", "#10b981",
  "#ef4444", "#eab308", "#06b6d4", "#ec4899",
];

export default function CategoryChart({ expenses }) {
  // Aggregate expenses by category
  const categoryMap = {};
  (expenses || []).forEach((e) => {
    if (e.type === "expense") {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    }
  });

  const labels = Object.keys(categoryMap);
  const values = Object.values(categoryMap);

  if (labels.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 mb-6 flex items-center justify-center h-48">
        <p className="text-gray-400 text-sm">No expense data for chart</p>
      </div>
    );
  }

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: COLORS.slice(0, labels.length),
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
          padding: 12,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.toLocaleString()}`,
        },
      },
    },
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Expense by Category
      </h2>
      <div className="max-w-xs mx-auto">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}
