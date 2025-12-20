'use client';

import React from 'react';
import {
  Wallet,
  CreditCard,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import FinanceGrowthChart from './FinanceGrowthChart';


// --------------------- DATA -----------------------

const dashboardData = {
  summary: {
    totalIncome: 32_506_254,
    totalExpenses: 18_400_000,
    totalDebt: 9_200_000,
    monthlyRevenue: 48_750_000,
    monthlyExpenses: 25_450_000,
    netProfit: 23_300_000,
  },

  expenseBreakdown: [
    { name: 'Ish haqi', value: 35, color: '#3b82f6' },
    { name: 'Ofis', value: 25, color: '#10b981' },
    { name: 'Marketing', value: 20, color: '#f59e0b' },
    { name: 'Boshqa', value: 20, color: '#ef4444' },
  ],

  debtors: [
    { id: 1, name: 'Anvar Karimov', amount: 2_500_000, dueDate: '05.07.2024', status: 'overdue' },
    { id: 2, name: 'Sofia Solutions', amount: 3_800_000, dueDate: '28.06.2024', status: 'pending' },
    { id: 3, name: 'Rahim Timur', amount: 1_600_000, dueDate: '20.06.2024', status: 'overdue' },
    { id: 4, name: 'Zmax Group', amount: 4_200_000, dueDate: '15.06.2024', status: 'soon' },
  ],
};


// --------------------- HELPERS -----------------------

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('uz-UZ', {
    style: 'currency',
    currency: 'UZS',
    maximumFractionDigits: 0,
  }).format(amount);

const getStatusText = (status: string) =>
  status === 'overdue'
    ? 'Muddati o‘tgan'
    : status === 'pending'
    ? 'Kutilmoqda'
    : 'Yaqinlarda';

const getStatusVariant = (status: string) =>
  status === 'overdue'
    ? 'destructive'
    : status === 'pending'
    ? 'secondary'
    : 'default';


// --------------------- SUMMARY CARD -----------------------

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
        <p className="text-3xl font-bold mt-2">{formatCurrency(amount)}</p>
        <p className="text-sm mt-2 flex items-center gap-1">
          <TrendingUp className="w-4 h-4" />
          {trend}
        </p>
      </div>

      <Icon className="w-12 h-12 opacity-60" />
    </CardContent>
  </Card>
);


// --------------------- MONTHLY ROW -----------------------

const Row: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex justify-between">
    <span>{label}</span>
    <span className="font-semibold">{formatCurrency(value)}</span>
  </div>
);


// --------------------- MAIN COMPONENT -----------------------

export default function MoliyaviyDashboard() {
  const { summary, expenseBreakdown, debtors } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-gray-900">
          Moliyaviy Dashboard
        </h1>


        {/* TOP SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

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

          {/* MONTH STAT */}
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg">
            <CardHeader>
              <CardTitle>Oylik Ko‘rinish</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Row label="Daromad" value={summary.monthlyRevenue} />
              <Row label="Xarajat" value={summary.monthlyExpenses} />

              <div className="border-t border-white/30 pt-4 flex justify-between text-lg font-bold">
                <span>Sof foyda</span>
                <span>{formatCurrency(summary.netProfit)}</span>
              </div>

              <Button className="w-full bg-white text-blue-700 hover:bg-gray-100">
                Hisobotni ko‘rish
              </Button>
            </CardContent>
          </Card>

        </div>


        {/* CHART AREA */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* LINE CHART LEFT */}
          <Card className="xl:col-span-2 w-full">
  <CardHeader>
    <CardTitle>Daromad va xarajatlar dinamikasi</CardTitle>
  </CardHeader>
  <CardContent className="p-4">
    <FinanceGrowthChart />
  </CardContent>
</Card>


        </div>


        {/* FOOTER TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Qarzdorlar ro‘yxati</CardTitle>
          </CardHeader>

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
                        <AvatarFallback>
                          {d.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {d.name}
                    </TableCell>

                    <TableCell className="font-medium">
                      {formatCurrency(d.amount)}
                    </TableCell>

                    <TableCell>
                      {d.dueDate}
                    </TableCell>

                    <TableCell>
                      <Badge variant={getStatusVariant(d.status)}>
                        {getStatusText(d.status)}
                      </Badge>
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
