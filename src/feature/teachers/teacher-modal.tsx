import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
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
import { Loader2, User, Phone, Lock, UserCheck } from "lucide-react";
import { useTeacherStore } from "@/store/teacher.store";

interface TeacherSheetProps {
  open: boolean;
  teacherId: string | null;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  phone: string;
  password: string;
  photoUrl: string;
  monthlySalary: string;
  percentShare: string;
  isActive: boolean;
}

export default function TeacherSheet({
  open,
  teacherId,
  onClose,
}: TeacherSheetProps) {
  const { fetchTeacher, createTeacher, updateTeacher, loading } =
    useTeacherStore();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    password: "",
    photoUrl: "",
    monthlySalary: "",
    percentShare: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;

    if (teacherId) {
      (async () => {
        const teacher = await fetchTeacher(teacherId);
        if (!teacher) return;

        setFormData({
          fullName: teacher.fullName,
          phone: teacher.phone,
          password: "",
          photoUrl: teacher.photoUrl ?? "",
          monthlySalary: teacher.monthlySalary ?? "",
          percentShare: teacher.percentShare ?? "",
          isActive: teacher.isActive,
        });
      })();
    } else {
      setFormData({
        fullName: "",
        phone: "",
        password: "",
        photoUrl: "",
        monthlySalary: "",
        percentShare: "",
        isActive: true,
      });
    }
  }, [open, teacherId, fetchTeacher]);

  const validate = () => {
    const e: Record<string, string> = {};

    if (!formData.fullName.trim()) e.fullName = "To‘liq ism majburiy";

    if (!formData.phone.trim()) e.phone = "Telefon majburiy";

    if (!teacherId && formData.password.length < 6)
      e.password = "Parol kamida 6 ta belgidan iborat";

    if (formData.monthlySalary && formData.percentShare) {
      e.monthlySalary = "Faqat bittasini tanlang";
      e.percentShare = "Faqat bittasini tanlang";
    }

    if (!formData.monthlySalary && !formData.percentShare) {
      e.monthlySalary = "Maosh yoki foiz majburiy";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const parts = formData.fullName.trim().split(/\s+/);
    const firstName = parts.shift()!;
    const lastName = parts.join(" ") || "-";

    const payload: any = {
      firstName,
      lastName,
      phone: formData.phone.trim(),
      photoUrl: formData.photoUrl || undefined,
    };

    if (formData.monthlySalary) payload.monthlySalary = formData.monthlySalary;

    if (formData.percentShare) payload.percentShare = formData.percentShare;

    if (!teacherId) {
      payload.password = formData.password;
    } else {
      payload.isActive = formData.isActive;
      if (formData.password.trim()) payload.password = formData.password;
    }

    const result = teacherId
      ? await updateTeacher(teacherId, payload)
      : await createTeacher(payload);

    if (result) onClose();
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="right"
        className="w-full p-5 sm:max-w-lg overflow-y-auto bg-white dark:bg-slate-900"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">
            {teacherId
              ? "O‘qituvchini tahrirlash"
              : "Yangi o‘qituvchi qo‘shish"}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-5 mt-6 text-slate-800 dark:text-slate-200">
          {/* Full name */}
          <div>
            <Label className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4" /> To‘liq ism
            </Label>
            <Input
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
            />
            {errors.fullName && (
              <p className="text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label className="flex items-center gap-2 mb-1">
              <Phone className="w-4 h-4" /> Telefon
            </Label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <Label className="flex items-center gap-2 mb-1">
              <Lock className="w-4 h-4" /> Parol {teacherId && "(ixtiyoriy)"}
            </Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Salary */}
          <div>
            <Label>Oylik maosh</Label>
            <Input
              value={formData.monthlySalary}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  monthlySalary: e.target.value,
                  percentShare: "",
                })
              }
            />
            {errors.monthlySalary && (
              <p className="text-sm text-red-500">{errors.monthlySalary}</p>
            )}
          </div>

          {/* Percent */}
          <div>
            <Label>Foiz (%)</Label>
            <Input
              value={formData.percentShare}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  percentShare: e.target.value,
                  monthlySalary: "",
                })
              }
            />
            {errors.percentShare && (
              <p className="text-sm text-red-500">{errors.percentShare}</p>
            )}
          </div>

          {/* Status */}
          {teacherId && (
            <div>
              <Label className="flex items-center gap-2 mb-1">
                <UserCheck className="w-4 h-4" /> Status
              </Label>
              <Select
                value={formData.isActive ? "true" : "false"}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    isActive: v === "true",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Faol</SelectItem>
                  <SelectItem value="false">Nofaol</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <SheetFooter className="mt-8 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Bekor qilish
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Yuklanmoqda
              </>
            ) : teacherId ? (
              "Saqlash"
            ) : (
              "Qo‘shish"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
