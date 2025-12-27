import type { Room } from "@/store/rooms/RoomInterface";
import { api } from "../api";

export const RoomService = {
  async getAll(): Promise<Room[]> {
    try {
      const res = await api.get("/rooms");
      return res.data;
    } catch (error: any) {
      if (error.response) {
        console.error("Get all rooms failed:", error.response.data);
      } else if (error.request) {
        console.error(
          "Get all rooms failed: No response from server",
          error.request
        );
      } else {
        console.error("Get all rooms failed:", error.message);
      }
      return []; // fallback
    }
  },

  async create(data: { name: string; capacity?: number }) {
    try {
      return await api.post("/rooms", data);
    } catch (error: any) {
      if (error.response) {
        console.error("Create room failed:", error.response.data);
      } else if (error.request) {
        console.error(
          "Create room failed: No response from server",
          error.request
        );
      } else {
        console.error("Create room failed:", error.message);
      }
      throw error;
    }
  },

  async update(id: string, data: { name: string; capacity?: number }) {
    try {
      return await api.put(`/rooms/${id}`, data);
    } catch (error: any) {
      console.error("Update room failed:", error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      return await api.delete(`/rooms/${id}`);
    } catch (error: any) {
      console.error("Delete room failed:", error);
      throw error;
    }
  },
};
