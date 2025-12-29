import { api } from "../api";

export interface FinanceOverview {
  from: string;
  to: string;
  method: string;
  totalIncome: number;
  totalExpense: number;
  profit: number;
}

export interface GlobalBalance {
  totalCharges: number;
  totalIncome: number;
  totalExpense: number;
  netCash: number;
  totalDebt: number;
}

export interface Debtor {
  studentId: string;
  fullName: string;
  phone: string;
  totalDebt: number;
  groups: { groupId: string; name: string; debt: number }[];
}

export const financeService = {
  // Oylik dinamika (grafik uchun)
  getMonthlyOverview: () => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 5, 1); // oxirgi 6 oy
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return api.get<FinanceOverview>("/finance/overview", {
      params: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
    });
  },

  // Umumiy balans (kartalar uchun)
  getGlobalBalance: () => {
    return api.get<GlobalBalance>("/finance/balance");
  },

  // Qarzdorlar
  getDebtors: (minDebt = 0) => {
    return api.get<Debtor[]>("/finance/debtors", { params: { minDebt } });
  },
};
