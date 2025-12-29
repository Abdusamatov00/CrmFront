import { create } from "zustand";
import type { Room } from "./rooms/RoomInterface";
import { RoomService } from "@/service/room-service/room-service";

interface RoomStore {
  rooms: Room[];
  loading: boolean;
  fetchRooms: () => Promise<void>;
  addRoom: (data: { name: string; capacity?: number }) => Promise<void>;
  deleteRoom: (id: string) => Promise<void>;
}

export const useRoomStore = create<RoomStore>((set) => ({
  rooms: [],
  loading: false,

  fetchRooms: async () => {
    set({ loading: true });
    try {
      const data = await RoomService.getAll();
      set({
        rooms: data.filter((r) => r.isActive !== false),
      });
    } catch (e) {
      console.error("Fetch rooms failed:", e);
    } finally {
      set({ loading: false });
    }
  },

  addRoom: async (data) => {
    set({ loading: true });
    try {
      const res = await RoomService.create(data);

      if (res?.data) {
        set((state) => ({
          rooms: [...state.rooms, res.data],
        }));
      } else {
        const rooms = await RoomService.getAll();
        set({ rooms });
      }
    } catch (e) {
      console.error("Add room failed:", e);
    } finally {
      set({ loading: false });
    }
  },

  deleteRoom: async (id) => {
    set({ loading: true });
    try {
      await RoomService.delete(id);
      set((state) => ({
        rooms: state.rooms.filter((r) => r.id !== id),
      }));
    } catch (e) {
      console.error("Delete room failed:", e);
    } finally {
      set({ loading: false });
    }
  },
}));
