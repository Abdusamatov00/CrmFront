"use client";

import { useEffect } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoomStore } from "@/store/room.store";
import AddRoom from "./AddRooms";

export default function RoomsList() {
  const { rooms, fetchRooms, deleteRoom, loading } = useRoomStore();

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="space-y-6">
      <AddRoom />

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white/70 dark:bg-slate-900 p-5 rounded-2xl shadow-lg"
            >
              <h3 className="font-bold text-lg">{room.name}</h3>
              <p className="opacity-70">Capacity: {room.capacity ?? "—"}</p>

              <div className="flex justify-end mt-4">
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => deleteRoom(room.id)}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
