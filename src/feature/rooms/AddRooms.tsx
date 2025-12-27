"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRoomStore } from "@/store/room.store";

export default function AddRoom() {
  const { addRoom, loading } = useRoomStore();
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addRoom({
        name,
        capacity: capacity ? Number(capacity) : undefined,
      });
      setName("");
      setCapacity("");
    } finally {
      setSubmitting(false);
    }
  };

  const isDisabled = submitting || loading;

  return (
    <form
      onSubmit={submit}
      className="bg-white/70 dark:bg-slate-900 p-6 rounded-2xl shadow-xl grid md:grid-cols-3 gap-4"
    >
      <div>
        <Label>Room Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={isDisabled}
        />
      </div>

      <div>
        <Label>Capacity</Label>
        <Input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          disabled={isDisabled}
        />
      </div>

      <Button
        type="submit"
        className="self-end bg-[#0208B0] text-white flex items-center justify-center"
        disabled={isDisabled}
      >
        {(submitting || loading) && (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        )}
        {submitting ? "Adding..." : "Add Room"}
      </Button>
    </form>
  );
}
