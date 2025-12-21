import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

type Period = "weekly" | "monthly" | "yearly";

const DATA = {
  weekly: {
    labels: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
    income: [200000, 350000, 500000, 420000, 600000, 300000, 450000],
    expense: [120000, 200000, 180000, 220000, 250000, 150000, 190000],
  },
  monthly: {
    labels: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun"],
    income: [1200000, 1800000, 2500000, 2100000, 2967254, 2700000],
    expense: [600000, 900000, 1200000, 800000, 0, 1100000],
  },
  yearly: {
    labels: ["2021", "2022", "2023", "2024", "2025"],
    income: [12000000, 18000000, 25000000, 32000000, 42000000],
    expense: [8000000, 11000000, 14000000, 16000000, 18000000],
  },
};

export default function FinanceGrowthChart() {
  const [period, setPeriod] = useState<Period>("weekly");

  const { labels, income, expense } = DATA[period];
  const profit = income.map((v, i) => v - expense[i]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">
          Moliyaviy o‘sish dinamikasi
        </h2>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(["weekly", "monthly", "yearly"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-sm rounded-md transition ${
                period === p
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500"
              }`}
            >
              {p === "weekly" ? "Hafta" : p === "monthly" ? "Oy" : "Yil"}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[340px]">
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Kirim",
                data: income,
                borderColor: "#22c55e",
                backgroundColor: "rgba(34,197,94,0.15)",
                fill: true,
                tension: 0.45,
                pointRadius: 0,
                borderWidth: 3,
              },
              {
                label: "Chiqim",
                data: expense,
                borderColor: "#ef4444",
                backgroundColor: "rgba(239,68,68,0.1)",
                fill: true,
                tension: 0.45,
                pointRadius: 0,
                borderWidth: 3,
              },
              {
                label: "Sof foyda",
                data: profit,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.15)",
                fill: true,
                tension: 0.45,
                pointRadius: 0,
                borderWidth: 3,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 800,
              easing: "easeOutQuart",
            },
            plugins: {
              legend: {
                position: "top",
                labels: {
                  usePointStyle: true,
                  boxWidth: 8,
                },
              },
              tooltip: {
                backgroundColor: "#111827",
                titleColor: "#fff",
                bodyColor: "#e5e7eb",
                padding: 12,
                callbacks: {
                  label: (ctx) =>
                    `${ctx.dataset.label}: ${Number(ctx.raw).toLocaleString()} so‘m`,
                },
              },
            },
            scales: {
              x: {
                grid: { display: false },
              },
              y: {
                grid: { color: "#f1f5f9" },
                ticks: {
                  callback: (v) => `${v.toLocaleString()} so‘m`,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
