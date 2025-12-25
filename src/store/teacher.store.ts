import { create } from "zustand";
import { api } from "@/service/api";

export interface Teacher {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  photoUrl: string | null;
  monthlySalary: string | null;
  percentShare: string | null;
  createdAt: string;
}

export interface TeacherQuery {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

interface TeacherStore {
  teachers: Teacher[];
  meta: { page: number; limit: number; total: number; pages: number } | null;
  myGroups: any[];
  loading: boolean;
  error: string | null;

  fetchTeachers: (query?: TeacherQuery) => Promise<void>;
  fetchTeacher: (id: string) => Promise<Teacher | null>;
  createTeacher: (data: any) => Promise<Teacher | null>;
  updateTeacher: (id: string, data: any) => Promise<Teacher | null>;
  deleteTeacher: (id: string) => Promise<Teacher | null>;
  restoreTeacher: (id: string) => Promise<Teacher | null>;
  fetchMyGroups: () => Promise<void>;
}

export const useTeacherStore = create<TeacherStore>((set, get) => ({
  teachers: [],
  meta: null,
  myGroups: [],
  loading: false,
  error: null,

  fetchTeachers: async (query = {}) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/teachers", { params: query });
      set({ teachers: data.items, meta: data.meta });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch teachers" });
    } finally {
      set({ loading: false });
    }
  },

  fetchTeacher: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/teachers/${id}`);
      return data;
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch teacher" });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  createTeacher: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/teachers", data);
      set({ teachers: [res.data, ...get().teachers] });
      return res.data;
    } catch (err: any) {
      set({ error: err.message || "Failed to create teacher" });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  updateTeacher: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.patch(`/teachers/${id}`, data);
      set({
        teachers: get().teachers.map((t) => (t.id === id ? res.data : t)),
      });
      return res.data;
    } catch (err: any) {
      set({ error: err.message || "Failed to update teacher" });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  deleteTeacher: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.delete(`/teachers/${id}`);
      set({
        teachers: get().teachers.map((t) => (t.id === id ? res.data : t)),
      });
      return res.data;
    } catch (err: any) {
      set({ error: err.message || "Failed to delete teacher" });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  restoreTeacher: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await api.patch(`/teachers/${id}/restore`);
      set({
        teachers: get().teachers.map((t) => (t.id === id ? res.data : t)),
      });
      return res.data;
    } catch (err: any) {
      set({ error: err.message || "Failed to restore teacher" });
      return null;
    } finally {
      set({ loading: false });
    }
  },

  fetchMyGroups: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get("/teachers/my-groups");
      set({ myGroups: data });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch my groups" });
    } finally {
      set({ loading: false });
    }
  },
}));
