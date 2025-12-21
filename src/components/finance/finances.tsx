"use client";

import { useState, useEffect } from "react";
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
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

import FinanceGrowthChart from "./FinanceGrowthChart";
import { financeService } from "@/service/finance-service/finance-service";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    maximumFractionDigits: 0,
  }).format(amount);

// Global balance uchun to‘g‘ri type
interface GlobalBalance {
  totalIncome: number;
  totalExpense: number;
  totalDebt: number;
  netCash: number;
}

type SummaryCardProps = {
  title: string;
  amount: number;
  trend?: string;
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
        <p className="text-2xl lg:text-3xl font-bold mt-2">
          {formatCurrency(amount)}
        </p>
        {trend && (
          <p className="text-sm mt-2 flex items-center gap-1">
            <TrendingUp className="inline w-4 h-4 mr-1" />
            {trend}
          </p>
        )}
      </div>
      <Icon className="w-12 h-12 opacity-60" />
    </CardContent>
  </Card>
);

function MoliyaviyDashboard() {
  const [balance, setBalance] = useState<GlobalBalance | null>(null);
  const [debtors, setDebtors] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [balanceRes, debtorsRes] = await Promise.all([
          financeService.getGlobalBalance(),
          financeService.getDebtors(),
        ]);
        setBalance(balanceRes.data);
        setDebtors(debtorsRes.data);
      } catch (err) {
        setError("Moliyaviy maʼlumotlarni yuklashda xato yuz berdi");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin w-20 h-20 border-8 border-blue-500 border-t-transparent rounded-full" />
          <p className="mt-8 text-2xl text-gray-600 font-medium">Maʼlumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error || !balance) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-2xl text-red-600 font-medium">{error || "Ma'lumotlar yuklanmadi"}</p>
          <p className="mt-4 text-gray-600">Iltimos, keyinroq qayta urinib ko‘ring</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Moliyaviy Dashboard
        </h1>

        {/* Kartalar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard
            title="Umumiy Daromad"
            amount={balance.totalIncome ?? 0}  // xavfsiz
            trend="Oxirgi oyda +12%"
            icon={Wallet}
            gradient="from-emerald-500 to-teal-600"
          />
          <SummaryCard
            title="Umumiy Xarajat"
            amount={balance.totalExpense ?? 0}
            trend="Oxirgi oyda +8%"
            icon={CreditCard}
            gradient="from-red-500 to-orange-600"
          />
          <SummaryCard
            title="Jami Qarzdorlik"
            amount={balance.totalDebt ?? 0}
            icon={DollarSign}
            gradient="from-amber-500 to-orange-600"
          />
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Sof Foyda</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {formatCurrency(balance.netCash ?? 0)}
              </p>
              <Button className="w-full mt-6 bg-white text-blue-700 hover:bg-gray-100 font-medium">
                Batafsil hisobot
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Grafiklar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardContent className="h-full">
                <FinanceGrowthChart />
              </CardContent>
            </Card>
          </div>

          {/* Pie Chart */}
          <Card className="h-full">
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RePieChart>
                  <Pie
                    data={[
                      { name: "Maoshlar", value: 45, color: "#3b82f6" },
                      { name: "Ijara", value: 20, color: "#10b981" },
                      { name: "Reklama", value: 15, color: "#f59e0b" },
                      { name: "Boshqa", value: 20, color: "#ef4444" },
                    ]}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                    cornerRadius={8}
                  >
                    {["#3b82f6", "#10b981", "#f59e0b", "#ef4444"].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: unknown) => `${value}%`}  // eng xavfsiz variant, qizil xato yo‘q
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "16px",
                      boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
                      padding: "12px 16px",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={50} />
                </RePieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Qarzdorlar ro‘yxati — o‘zgarmadi */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Qarzdorlar ro‘yxati</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mijoz</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Qarz miqdori</TableHead>
                    <TableHead>Guruhlar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
  {debtors.length === 0 ? (
    <TableRow>
      <TableCell colSpan={4} className="text-center py-10 text-gray-500 text-lg">
        Qarzdorlar topilmadi
      </TableCell>
    </TableRow>
  ) : (
    debtors.map((d: any) => (
      <TableRow key={d.studentId} className="hover:bg-gray-50">
        <TableCell className="flex items-center gap-4 py-4">
          <Avatar>
            <AvatarFallback className="bg-blue-100 text-blue-700">
              {d.fullName
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{d.fullName}</span>
        </TableCell>
        <TableCell>{d.phone}</TableCell>
        <TableCell className="font-bold text-red-600">
          {formatCurrency(d.totalDebt)}
        </TableCell>
        <TableCell>
          {d.groups.length === 0 ? (
            <span className="text-gray-500">—</span>
          ) : (
            d.groups.map((g: any) => (
              <Badge key={g.groupId} variant="outline" className="mr-2 mb-1">
                {g.name} ({formatCurrency(g.debt)})
              </Badge>
            ))
          )}
        </TableCell>
      </TableRow>
    ))
  )}
</TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default MoliyaviyDashboard;