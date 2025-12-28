import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

import { enrollmentService, type CreateEnrollmentData, type FilterParams, type UpdateEnrollmentData } from "@/service/enrollments/enrollment.service";

export const useEnrollments = (params: FilterParams = {}) => {
  return useQuery({
    queryKey: ["enrollments", params],
    queryFn: () => enrollmentService.getAll(params),
  });
};

export const useEnrollment = (id: string) => {
  return useQuery({
    queryKey: ["enrollment", id],
    queryFn: () => enrollmentService.getOne(id),
    enabled: !!id,
  });
};

export const useCreateEnrollment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateEnrollmentData) =>
      enrollmentService.create(data),
    onSuccess: () => {
      toast({
        title: "Muvaffaqiyatli",
        description: "Yangi ro'yxatdan o'tish yaratildi",
      });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
    onError: (error: any) => {
      toast({
        title: "Xatolik",
        description: error.response?.data?.message || "Xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateEnrollment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEnrollmentData }) =>
      enrollmentService.update(id, data),
    onSuccess: (_, variables) => {
      toast({
        title: "Muvaffaqiyatli",
        description: "Ro'yxatdan o'tish yangilandi",
      });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollment", variables.id] });
    },
    onError: (error: any) => {
      toast({
        title: "Xatolik",
        description: error.response?.data?.message || "Xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteEnrollment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => enrollmentService.delete(id),
    onSuccess: () => {
      toast({
        title: "Muvaffaqiyatli",
        description: "Ro'yxatdan o'tish o'chirildi",
      });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
    onError: (error: any) => {
      toast({
        title: "Xatolik",
        description: error.response?.data?.message || "Xatolik yuz berdi",
        variant: "destructive",
      });
    },
  });
};