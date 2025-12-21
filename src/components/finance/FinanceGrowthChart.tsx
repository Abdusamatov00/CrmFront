// src/components/finance/FinanceGrowthChart.tsx
"use client";

import  { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
  type TooltipItem,
  type ChartData,
 
} from "chart.js";
import { Line } from "react-chartjs-2";

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

const DATA: Record<Period, { labels: string[]; income: number[]; expense: number[] }> = {
  weekly: {
    labels: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
    income: [200_000, 350_000, 500_000, 420_000, 600_000, 300_000, 450_000],
    expense: [120_000, 200_000, 180_000, 220_000, 250_000, 150_000, 190_000],
  },
  monthly: {
    labels: ["Yan", "Fev", "Mar", "Apr", "May", "Iyun"],
    income: [1_200_000, 1_800_000, 2_500_000, 2_100_000, 2_967_254, 2_700_000],
    expense: [600_000, 900_000, 1_200_000, 800_000, 0, 1_100_000],
  },
  yearly: {
    labels: ["2021", "2022", "2023", "2024", "2025"],
    income: [12_000_000, 18_000_000, 25_000_000, 32_000_000, 42_000_000],
    expense: [8_000_000, 11_000_000, 14_000_000, 16_000_000, 18_000_000],
  },
};

export default function FinanceGrowthChart() {
  const [period, setPeriod] = useState<Period>("monthly");

  const { labels, income, expense } = DATA[period];
  const profit = income.map((v, i) => v - expense[i]);

  const chartData: ChartData<"line", number[], string> = {
    labels,
    datasets: [
      {
        label: "Kirim",
        data: income,
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        fill: true,
        tension: 0.45,
        pointRadius: 0,
        borderWidth: 3,
      },
      {
        label: "Chiqim",
        data: expense,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.45,
        pointRadius: 0,
        borderWidth: 3,
      },
      {
        label: "Sof foyda",
        data: profit,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.15)",
        fill: true,
        tension: 0.45,
        pointRadius: 0,
        borderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: "easeOutQuart" as const,
    },
    plugins: {
      legend: {
        position: "top" as const,
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
          label: (ctx: TooltipItem<"line">) =>
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
          callback: (value: number | string) => `${Number(value).toLocaleString()} so‘m`,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Moliyaviy o‘sish dinamikasi</h2>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(["weekly", "monthly", "yearly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 text-sm rounded-md transition ${
                period === p
                  ? "bg-white shadow text-blue-600 font-medium"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {p === "weekly" ? "Hafta" : p === "monthly" ? "Oy" : "Yil"}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[300px] md:h-[340px] lg:h-[380px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}