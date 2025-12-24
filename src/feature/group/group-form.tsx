import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useGroupStore, type Group } from "@/store/group.store";

interface GroupFormProps {
  initialGroup?: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GroupForm({
  initialGroup,
  open,
  onOpenChange,
}: GroupFormProps) {
  const { createGroup, updateGroup, loading, error } = useGroupStore();

  const [formData, setFormData] = useState({
    name: initialGroup?.name ?? "",
    capacity: initialGroup?.capacity ?? 1,
    daysPattern: initialGroup?.daysPattern ?? "ODD",
    startTime: initialGroup?.startTime ?? "09:00",
    endTime: initialGroup?.endTime ?? "10:00",
    monthlyFee: initialGroup?.monthlyFee ?? 0,
    roomId: initialGroup?.roomId ?? undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name.trim(),
      capacity: formData.capacity,
      daysPattern: formData.daysPattern,
      startTime: formData.startTime,
      endTime: formData.endTime,
      monthlyFee: formData.monthlyFee,
      ...(formData.roomId ? { roomId: formData.roomId } : {}),
    };

    if (initialGroup) {
      await updateGroup(initialGroup.id, payload);
    } else {
      await createGroup(payload);
    }

    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="[data-slot='sheet-close']:hidden w-full max-w-xl px-6">
        <SheetHeader className="relative border-b pb-4">
          <SheetTitle className="text-xl font-semibold">
            {initialGroup ? "Guruhni tahrirlash" : "Yangi guruh yaratish"}
          </SheetTitle>

          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-4"
            >
              <X className="h-5 w-5" />
            </Button>
          </SheetClose>
        </SheetHeader>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-1">
            <Label>Guruh nomi *</Label>
            <Input
              required
              placeholder="Masalan: Frontend 101"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Sig‘im *</Label>
              <Input
                type="number"
                min={1}
                required
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-1">
              <Label>Oylik to‘lov *</Label>
              <Input
                type="number"
                min={0}
                required
                value={formData.monthlyFee}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthlyFee: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Boshlanish vaqti *</Label>
              <Input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label>Tugash vaqti *</Label>
              <Input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Kunlar *</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                className={
                  formData.daysPattern === "ODD"
                    ? "w-full bg-blue-500 hover:bg-blue-60 text-white"
                    : "outline"
                }
                variant={formData.daysPattern === "ODD" ? "default" : "outline"}
                onClick={() => setFormData({ ...formData, daysPattern: "ODD" })}
              >
                Toq kunlar
              </Button>
              <Button
                type="button"
                className={
                  formData.daysPattern === "EVEN"
                    ? "w-full bg-blue-500 hover:bg-blue-600 text-white"
                    : "outline"
                }
                variant={
                  formData.daysPattern === "EVEN" ? "default" : "outline"
                }
                onClick={() =>
                  setFormData({ ...formData, daysPattern: "EVEN" })
                }
              >
                Juft kunlar
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Xona ID (ixtiyoriy)</Label>
            <Input
              placeholder="Masalan: ROOM-12"
              value={formData.roomId ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roomId: e.target.value || undefined,
                })
              }
            />
          </div>
          <SheetFooter className="absolute w-full bottom-3 right-0">
            <div className="pt-4 grid grid-cols-2 gap-2">
              <SheetClose className="w-full">
                <Button variant={"outline"} type="reset" className="w-full">
                  Bekor qilish
                </Button>
              </SheetClose>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white hover:scale-101"
                disabled={loading}
              >
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
