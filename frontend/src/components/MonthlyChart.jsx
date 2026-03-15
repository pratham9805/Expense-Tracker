import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function MonthlyChart({ income, expense }) {
  const data = {
    labels: ["This Month"],
    datasets: [
      {
        label: "Income",
        data: [income],
        backgroundColor: "rgba(16, 185, 129, 0.7)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label: "Expense",
        data: [expense],
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgb(239, 68, 68)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: { color: "rgba(255,255,255,0.7)", font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ₹${ctx.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { ticks: { color: "rgba(255,255,255,0.5)" }, grid: { display: false } },
      y: {
        ticks: { color: "rgba(255,255,255,0.5)", callback: (v) => "₹" + v.toLocaleString() },
        grid: { color: "rgba(255,255,255,0.06)" },
      },
    },
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Monthly Overview</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
