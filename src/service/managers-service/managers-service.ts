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
  createdAt: string;
}

/* ===== API CALLS ===== */

export const createManager = (data: CreateManagerDto) =>
  api.post("/managers", data);

export const getManagers = () => api.get<Manager[]>("/managers");

export const updateManager = (id: string, data: UpdateManagerDto) =>
  api.patch(`/managers/${id}`, data);

export const deleteManager = (id: string) => api.delete(`/managers/${id}`);
