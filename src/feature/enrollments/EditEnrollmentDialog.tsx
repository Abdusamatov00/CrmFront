"use client";
import React, {  useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import type { Enrollment, UpdateEnrollmentData } from "@/service/enrollments/enrollment.service";

interface EditEnrollmentDialogProps {
  enrollment: Enrollment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, data: UpdateEnrollmentData) => void;
  isPending: boolean;
}

export function EditEnrollmentDialog({
  enrollment,
  open,
  onOpenChange,
  onUpdate,
  isPending,
}: EditEnrollmentDialogProps) {
  const [formData, setFormData] = useState<UpdateEnrollmentData>({
    status: enrollment?.status,
    leaveDate: enrollment?.leaveDate
      ? format(new Date(enrollment.leaveDate), "yyyy-MM-dd")
      : "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enrollment) {
      onUpdate(enrollment.id, formData);
      onOpenChange(false);
    }
  };

  if (!enrollment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ro'yxatdan O'tishni Tahrirlash</DialogTitle>
          <DialogDescription>
            Ro'yxatdan o'tish holati va sanalarini tahrirlash
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Talaba</Label>
              <Input value={enrollment.student.fullName} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Guruh</Label>
              <Input value={enrollment.group.name} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Holati</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "ACTIVE" | "PAUSED" | "LEFT") =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Holatni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Faol</SelectItem>
                  <SelectItem value="PAUSED">To'xtatilgan</SelectItem>
                  <SelectItem value="LEFT">Ketgan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-leaveDate">Ketish Sanasi</Label>
              <Input
                id="edit-leaveDate"
                type="date"
                value={formData.leaveDate || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, leaveDate: e.target.value }))
                }
              />
              <p className="text-sm text-muted-foreground">
                Faqat "LEFT" holatida majburiy
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Yangilanmoqda..." : "Yangilash"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}