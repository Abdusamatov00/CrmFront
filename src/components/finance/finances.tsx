"use client";

import React from "react";
import { Wallet, CreditCard, DollarSign, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import FinanceGrowthChart from "./FinanceGrowthChart";
import { api } from "@/service/api";

const dashboardData = {
  summary: {
    totalIncome: 32_506_254,
    totalExpenses: 18_400_000,
    totalDebt: 9_200_000,
    monthlyRevenue: 48_750_000,
    monthlyExpenses: 25_450_000,
    netProfit: 23_300_000,
  },
  debtors: [
    { id: 1, name: "Anvar Karimov", amount: 2_500_000, dueDate: "05.07.2024", status: "overdue" },
    { id: 2, name: "Sofia Solutions", amount: 3_800_000, dueDate: "28.06.2024", status: "pending" },
    { id: 3, name: "Rahim Timur", amount: 1_600_000, dueDate: "20.06.2024", status: "overdue" },
    { id: 4, name: "Zmax Group", amount: 4_200_000, dueDate: "15.06.2024", status: "soon" },
  ],
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    maximumFractionDigits: 0,
  }).format(amount);
const getStudent   = async ()=>{
  const res = await api.get('/students');
}
const getStatusText = (status: "overdue" | "pending" | "soon") => {
  switch (status) {
    case "overdue": return "Muddati o‘tgan";
    case "pending": return "Kutilmoqda";
    default: return "Yaqinlarda";
  }
};

const getStatusVariant = (status: "overdue" | "pending" | "soon") => {
  switch (status) {
    case "overdue": return "destructive";
    case "pending": return "secondary";
    default: return "default";
  }
};

type SummaryCardProps = {
  title: string;
  amount: number;
  trend: string;
  icon: React.ElementType;
  gradient: string;
};

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  trend,
  icon: Icon,
  gradient,
}) => (
 <Card className={`bg-gradient-to-br ${gradient} border-0 shadow-lg text-white`}>
  <CardContent className="p-6 flex justify-between items-center">
    <div>
      <p className="text-sm opacity-80">{title}</p>
      {/* Amount – responsive text sizes */}
      <p className="text-lg sm:text-xxl md:text-xl lg:text-xl xl:text-xl font-bold mt-2">
        {formatCurrency(amount)}
      </p>
      <p className="text-sm mt-2 flex items-center gap-1">
        <TrendingUp className="w-4 h-4" />
        {trend}
      </p>
    </div>
    {/* Icon – responsive sizing */}
    <Icon className="w-10 h-10 sm:w-12 sm:h-8 md:w-10 md:h-14 opacity-60" />
  </CardContent>
</Card>

);
const Row: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span className="font-semibold">{formatCurrency(value)}</span>
  </div>
);
function MoliyaviyDashboard() {
  const { summary, expenseBreakdown, debtors } = dashboardData;
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Sarlavha */}
        <h1 className="text-4xl font-bold text-gray-900">
          Moliyaviy Dashboard
        </h1>
        {/* Umumiy kartalar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Umumiy Daromad"
            amount={summary.totalIncome}
            trend="12% bu oy"
            icon={Wallet}
            gradient="from-emerald-500 to-teal-600"
          />
          <SummaryCard
            title="Umumiy Xarajat"
            amount={summary.totalExpenses}
            trend="8% bu oy"
            icon={CreditCard}
            gradient="from-red-500 to-orange-600"
          />
          <SummaryCard
            title="Jami Qarzdorlik"
            amount={summary.totalDebt}
            trend="3% o‘sish"
            icon={DollarSign}
            gradient="from-amber-500 to-orange-600"
          />
          {/* Oylik ko'rinish */}
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
            <CardHeader><CardTitle>Oylik Ko‘rinish</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Row label="Daromad" value={summary.monthlyRevenue} />
              <Row label="Xarajat" value={summary.monthlyExpenses} />
              <div className="border-t border-white/30 pt-4 flex justify-between text-lg font-bold">
                <span>Sof foyda</span>
                <span>{formatCurrency(summary.netProfit)}</span>
              </div>
              <Button className="w-full bg-white text-blue-700 hover:bg-gray-100">Hisobotni ko‘rish</Button>
            </CardContent>
          </Card>
        </div>
        {/* Grafiklar qismi */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader><CardTitle>Daromad va xarajatlar dinamikasi</CardTitle></CardHeader>
              <CardContent><FinanceGrowthChart /></CardContent>
            </Card>
          </div>
          {/* Xarajatlar taqsimoti - Donut chart + legend */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Xarajatlar taqsimoti</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={expenseBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    layout="horizontal"
                    iconType="circle"
                  />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        {/* Qarzdorlar jadvali */}
        <Card>
          <CardHeader><CardTitle>Qarzdorlar ro‘yxati</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mijoz</TableHead>
                  <TableHead>Miqdor</TableHead>
                  <TableHead>Muddat</TableHead>
                  <TableHead>Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {debtors.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{d.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      {d.name}
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(d.amount)}</TableCell>
                    <TableCell>{d.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(d.status)}>{getStatusText(d.status)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

export default MoliyaviyDashboard;
