import { useGroupStore, type Group } from "@/store/group.store";
import {
  Edit2,
  Trash2,
  Users,
  Clock,
  Calendar,
  ArrowLeftCircle,
} from "lucide-react";
import { useState } from "react";
import GroupForm from "./group-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenBack, setIsOpenBack] = useState(false);

  const { deleteGroup, updateGroup } = useGroupStore();

  const changeIsActive = (id: string, value: boolean) => {
    updateGroup(id, { isActive: value });
    setIsOpenBack(false);
  };

  const handleDelete = async () => {
    await deleteGroup(group.id);
    setIsOpen(false);
  };

  return (
    <>
      {/* CARD */}
      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm hover:shadow-md transition">
        {/* HEADER */}
        <div className="px-5 py-4 flex items-start justify-between border-b border-foreground/10">
          <h3 className="text-base font-semibold text-foreground">
            {group.name}
          </h3>

          {/* STATUS CHIP */}
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border
              ${
                group.isActive
                  ? "bg-green-50 text-green-600 border-green-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
          >
            {group.isActive ? "Faol" : "Arxiv"}
          </span>
        </div>

        {/* CONTENT */}
        <div className="px-5 py-4 space-y-3 text-sm text-foreground/70">
          <InfoRow icon={<Users size={16} />} label="Sig‘imi">
            {group.capacity} o‘rin
          </InfoRow>

          <InfoRow icon={<Clock size={16} />} label="Vaqti">
            {group.startTime} – {group.endTime}
          </InfoRow>

          <InfoRow icon={<Calendar size={16} />} label="Kunlar">
            {group.daysPattern === "ODD" ? "Toq kunlar" : "Juft kunlar"}
          </InfoRow>

          <div className="pt-3 border-t border-foreground/10 text-sm">
            Oylik to‘lov:{" "}
            <span className="font-semibold text-foreground">
              {group.monthlyFee} so‘m
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="px-5 py-3 flex gap-2 border-t border-foreground/10">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit2 size={16} />
            Tahrir
          </Button>

          {group.isActive ? (
            <Button
              variant="destructive"
              className="flex-1 gap-2"
              onClick={() => setIsOpen(true)}
            >
              <Trash2 size={16} />
              O‘chirish
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex-1 gap-2 text-green-600 border-green-300 hover:bg-green-50"
              onClick={() => setIsOpenBack(true)}
            >
              <ArrowLeftCircle size={16} />
              Qaytarish
            </Button>
          )}
        </div>
      </div>

      {/* DELETE DIALOG */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Guruhni o‘chirish</DialogTitle>
            <DialogDescription>
              Ushbu amalni qaytarib bo‘lmaydi. Davom etasizmi?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Bekor qilish
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              O‘chirish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RESTORE DIALOG */}
      <Dialog open={isOpenBack} onOpenChange={setIsOpenBack}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Guruhni qaytarish</DialogTitle>
            <DialogDescription>
              Guruh yana faol holatga o‘tkaziladi
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenBack(false)}>
              Bekor qilish
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => changeIsActive(group.id, true)}
            >
              Qaytarish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isEditOpen && (
        <GroupForm
          initialGroup={group}
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
        />
      )}
    </>
  );
}

/* 🔹 Kichik helper component (MUI ListItem style) */
function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-primary">{icon}</span>
      <span className="text-foreground/60">{label}:</span>
      <span className="font-medium text-foreground">{children}</span>
    </div>
  );
}
