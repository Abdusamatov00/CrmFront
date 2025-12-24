import { create } from "zustand";
import { api } from "@/service/api";

export interface Group {
  id: string;
  name: string;
  capacity: number;
  daysPattern: "ODD" | "EVEN";
  startTime: string;
  endTime: string;
  monthlyFee: number;
  isActive: boolean;
  roomId?: string | null;
  deactivatedAt?: string | null;
  deactivateReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface GroupStore {
  groups: Group[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error?: string;

  fetchGroups: (
    page?: number,
    limit?: number,
    search?: string
  ) => Promise<void>;
  createGroup: (dto: Partial<Group>) => Promise<Group | void>;
  updateGroup: (id: string, dto: Partial<Group>) => Promise<Group | void>;
  deleteGroup: (id: string, reason?: string) => Promise<Group | void>;
}

export const useGroupStore = create<GroupStore>((set, get) => ({
  groups: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: undefined,

  fetchGroups: async (page = 1, limit = 10, search = "") => {
    set({ loading: true, error: undefined });
    try {
      const { data } = await api.get("/groups", {
        params: { page, limit, search },
      });
      set({
        groups: data.items,
        total: data.meta.total,
        page: data.meta.page,
        limit: data.meta.limit,
        loading: false,
      });
    } catch (err: any) {
      set({ loading: false, error: err.message || "Xatolik yuz berdi" });
    }
  },

  createGroup: async (dto) => {
    set({ loading: true, error: undefined });
    try {
      const { data } = await api.post("/groups", dto);
      set({ groups: [data, ...get().groups], loading: false });
      return data;
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message,
      });
    }
  },

  updateGroup: async (id, dto) => {
    set({ loading: true, error: undefined });
    try {
      const { data } = await api.patch(`/groups/${id}`, dto);
      set({
        groups: get().groups.map((g) => (g.id === id ? data : g)),
        loading: false,
      });
      return data;
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message,
      });
    }
  },

  deleteGroup: async (id, reason) => {
    set({ loading: true, error: undefined });
    try {
      const { data } = await api.delete(`/groups/${id}`, {
        params: { reason },
      });
      set({
        groups: get().groups.map((g) => (g.id === id ? data : g)),
        loading: false,
      });
      return data;
    } catch (err: any) {
      set({
        loading: false,
        error: err.response?.data?.message || err.message,
      });
    }
  },
}));
