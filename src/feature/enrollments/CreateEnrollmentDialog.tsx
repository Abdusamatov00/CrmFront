import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import type { CreateEnrollmentData } from "@/service/enrollments/enrollment.service";

interface CreateEnrollmentDialogProps {
  onCreate: (data: CreateEnrollmentData) => void;
  isPending: boolean;
}

export function CreateEnrollmentDialog({
  onCreate,
  isPending,
}: CreateEnrollmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<CreateEnrollmentData>({
    studentId: "",
    groupId: "",
    joinDate: format(new Date(), "yyyy-MM-dd"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    setOpen(false);
    setFormData({
      studentId: "",
      groupId: "",
      joinDate: format(new Date(), "yyyy-MM-dd"),
    });
  };

  const handleChange = (field: keyof CreateEnrollmentData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yangi Ro'yxatdan O'tish
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Yangi Ro'yxatdan O'tish</DialogTitle>
          <DialogDescription>
            Talabani guruhga qo'shing. Barcha maydonlarni to'ldiring.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="studentId">Talaba ID</Label>
              <Input
                id="studentId"
                value={formData.studentId}
                onChange={(e) => handleChange("studentId", e.target.value)}
                placeholder="Talaba ID"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="groupId">Guruh ID</Label>
              <Input
                id="groupId"
                value={formData.groupId}
                onChange={(e) => handleChange("groupId", e.target.value)}
                placeholder="Guruh ID"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="joinDate">Qo'shilish Sanasi</Label>
              <Input
                id="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={(e) => handleChange("joinDate", e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Yaratilmoqda..." : "Yaratish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}