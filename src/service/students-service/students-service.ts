// src/service/managers-service.ts

import { api } from "../api";

// DTO'lar
export interface CreateManagerDto {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  photoUrl?: string;
  monthlySalary?: number;
}

export interface UpdateManagerDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  password?: string;
  photoUrl?: string;
  monthlySalary?: number;
  isActive?: boolean; // soft-delete uchun
}

export interface Manager {
  id: string;
  fullName: string;
  phone: string;
  photoUrl?: string | null;
  monthlySalary?: number | null;
  isActive: boolean;
  createdAt: string;
}

export interface PaginatedManagers {
  items: Manager[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// CREATE - Manager yaratish
export const createManager = (data: CreateManagerDto) => {
  return api.post<Manager>("/managers", data);
};

// READ ALL - Barcha managerlarni olish (qidiruv, filtr, paginatsiya bilan)
export const getManagers = (params?: {
  search?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}) => {
  return api.get<PaginatedManagers>("/managers", { params });
};

// READ ONE - Bitta managerni ID bo‘yicha olish
export const getManagerById = (id: string) => {
  return api.get<Manager>(`/managers/${id}`);
};

// UPDATE - Managerni yangilash
export const updateManager = (id: string, data: UpdateManagerDto) => {
  return api.patch<Manager>(`/managers/${id}`, data);
};

// DELETE (soft) - Managerni arxivga o‘tkazish
export const deleteManager = (id: string) => {
  return api.delete(`/managers/${id}`);
};

// RESTORE - Arxivdan qaytarish
export const restoreManager = (id: string) => {
  return api.patch(`/managers/${id}/restore`);
};

// OPTIONAL: Managerni butunlay o‘chirish (hard delete, agar kerak bo‘lsa)
export const hardDeleteManager = (id: string) => {
  return api.delete(`/managers/${id}/hard`);
};