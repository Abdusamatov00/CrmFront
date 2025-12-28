import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useEnrollments,
  useCreateEnrollment,
  useUpdateEnrollment,
  useDeleteEnrollment,
} from "@/hooks/useEnrollments";
import { CreateEnrollmentDialog } from "./CreateEnrollmentDialog";
import { EnrollmentFilters } from "./EnrollmentFilters";
import { EnrollmentTable } from "./EnrollmentTable";
import { EditEnrollmentDialog } from "./EditEnrollmentDialog";
import { DeleteEnrollmentAlert } from "./DeleteEnrollmentAlert";
import { Pagination } from "./Pagination";
import type { FilterParams } from "@/service/enrollments/enrollment.service";
import type { Enrollment } from "@/store/authStore";

export default function EnrollmentsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterParams>({});
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [enrollmentToDelete, setEnrollmentToDelete] = useState<string | null>(null);

  // Queries
  const { data, isLoading, isError } = useEnrollments({
    ...filters,
    page,
    limit: 10,
  });

  // Mutations
  const createMutation = useCreateEnrollment();
  const updateMutation = useUpdateEnrollment();
  const deleteMutation = useDeleteEnrollment();

  // Handlers
  const handleFilterChange = (newFilters: FilterParams) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleFilterReset = () => {
    setFilters({});
    setPage(1);
  };

  const handleEdit = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setEnrollmentToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (enrollmentToDelete) {
      deleteMutation.mutate(enrollmentToDelete, {
        onSuccess: () => {
          setIsDeleteAlertOpen(false);
          setEnrollmentToDelete(null);
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">Yuklanmoqda...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-red-600">
          Ma'lumotlarni yuklashda xatolik
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ro'yxatdan O'tishlar
          </h1>
          <p className="text-muted-foreground">
            Barcha talabalar ro'yxatdan o'tishlari
          </p>
        </div>
        <CreateEnrollmentDialog
          onCreate={createMutation.mutate}
          isPending={createMutation.isPending}
        />
      </div>

      <EnrollmentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
      />

      <Card>
        <CardHeader>
          <CardTitle>Ro'yxatdan O'tishlar Ro'yxati</CardTitle>
          <CardDescription>
            Jami {data?.meta.total || 0} ta ro'yxatdan o'tish
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnrollmentTable
            enrollments={data?.items || []}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
          
          {data?.meta && (
            <Pagination
              meta={data.meta}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

      <EditEnrollmentDialog
        enrollment={selectedEnrollment}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdate={updateMutation.mutate}
        isPending={updateMutation.isPending}
      />

      <DeleteEnrollmentAlert
        open={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}