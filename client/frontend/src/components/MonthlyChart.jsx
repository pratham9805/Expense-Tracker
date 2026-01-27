import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function MonthlyChart({ income, expense }) {
  const data = {
    labels: ["This Month"],
    datasets: [
  {
    label: "Income",
    data: [income],
    backgroundColor: "rgba(59, 130, 246, 0.7)", // blue-500
    borderColor: "rgb(59, 130, 246)",
    borderWidth: 1,
  },
  {
    label: "Expense",
    data: [expense],
    backgroundColor: "rgba(239, 68, 68, 0.7)", // red-500
    borderColor: "rgb(239, 68, 68)",
    borderWidth: 1,
  },
],

  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "white" },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Monthly Overview
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
}
