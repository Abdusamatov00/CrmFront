import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import type { Enrollment } from "@/service/enrollments/enrollment.service";

interface EnrollmentTableProps {
  enrollments: Enrollment[];
  onEdit: (enrollment: Enrollment) => void;
  onDelete: (id: string) => void;
}

export function EnrollmentTable({
  enrollments,
  onEdit,
  onDelete,
}: EnrollmentTableProps) {
  const getStatusBadge = (status: string) => {
    const colors = {
      ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
      PAUSED: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      LEFT: "bg-red-100 text-red-800 hover:bg-red-100",
    };

    const translations = {
      ACTIVE: "Faol",
      PAUSED: "To'xtatilgan",
      LEFT: "Ketgan",
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {translations[status as keyof typeof translations]}
      </Badge>
    );
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Talaba</TableHead>
          <TableHead>Telefon</TableHead>
          <TableHead>Guruh</TableHead>
          <TableHead>Qo'shilish Sanasi</TableHead>
          <TableHead>Ketish Sanasi</TableHead>
          <TableHead>Holati</TableHead>
          <TableHead className="text-right">Harakatlar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {enrollments.map((enrollment) => (
          <TableRow key={enrollment.id}>
            <TableCell className="font-medium">
              {enrollment.student.fullName}
            </TableCell>
            <TableCell>{enrollment.student.phone}</TableCell>
            <TableCell>{enrollment.group.name}</TableCell>
            <TableCell>
              {format(new Date(enrollment.joinDate), "dd.MM.yyyy")}
            </TableCell>
            <TableCell>
              {enrollment.leaveDate
                ? format(new Date(enrollment.leaveDate), "dd.MM.yyyy")
                : "-"}
            </TableCell>
            <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Ochish</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Harakatlar</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onEdit(enrollment)}>
                    Tahrirlash
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(enrollment.id)}
                    className="text-red-600"
                  >
                    O'chirish
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
        {enrollments.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              Hech qanday ma'lumot topilmadi
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}