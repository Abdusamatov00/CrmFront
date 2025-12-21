// src/service/managers-service.ts

import { api } from "../api";

export interface CreateManagerDto {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  photoUrl?: string;
  monthlySalary?: number;
}

export const createManager = (data: CreateManagerDto) => {
  return api.post("/managers", data);
};
