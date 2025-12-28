import { api } from "../api";

export interface Enrollment {
  id: string;
  status: "ACTIVE" | "PAUSED" | "LEFT";
  joinDate: string;
  leaveDate?: string;
  student: {
    id: string;
    fullName: string;
    phone: string;
  };
  group: {
    id: string;
    name: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CreateEnrollmentData {
  studentId: string;
  groupId: string;
  joinDate?: string;
}

export interface UpdateEnrollmentData {
  status?: "ACTIVE" | "PAUSED" | "LEFT";
  leaveDate?: string;
}

export interface FilterParams {
  studentId?: string;
  groupId?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

class EnrollmentService {
  // GET all enrollments with filters
  async getAll(params: FilterParams = {}) {
    const response = await api.get("/enrollments", { params });
    return response.data as { items: Enrollment[]; meta: PaginationMeta };
  }

  // GET single enrollment
  async getOne(id: string) {
    const response = await api.get(`/enrollments/${id}`);
    return response.data as Enrollment;
  }

  // CREATE enrollment
  async create(data: CreateEnrollmentData) {
    const response = await api.post("/enrollments", data);
    return response.data as Enrollment;
  }

  // UPDATE enrollment
  async update(id: string, data: UpdateEnrollmentData) {
    const response = await api.patch(`/enrollments/${id}`, data);
    return response.data as Enrollment;
  }

  // DELETE enrollment
  async delete(id: string) {
    await api.delete(`/enrollments/${id}`);
  }
}

export const enrollmentService = new EnrollmentService();