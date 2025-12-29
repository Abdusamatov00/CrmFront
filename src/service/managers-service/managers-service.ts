// src/service/managers-service.ts
import { api } from "../api";

/* ===== DTO TYPES ===== */

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
}

export interface Manager {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  photoUrl?: string;
  monthlySalary?: number;
  createdAt: string;
}

/* ===== API CALLS ===== */

// CREATE
export const createManager = (data: CreateManagerDto) =>
  api.post("/managers", data);

// LIST
export const getManagers = () => api.get<Manager[]>("/managers");

// 🔹 GET ONE (UPDATE uchun KERAK)
export const getManagerById = (id: string) =>
  api.get<Manager>(`/managers/${id}`);

// UPDATE
export const updateManager = (id: string, data: UpdateManagerDto) =>
  api.patch(`/managers/${id}`, data);

// DELETE
export const deleteManager = (id: string) => api.delete(`/managers/${id}`);
