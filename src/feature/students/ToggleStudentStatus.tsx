// src/components/futured/students/ToggleStudentStatus.tsx
import React from 'react';
import { api } from '@/service/api';
import { Trash2, RotateCcw } from 'lucide-react'; // lucide-react ikonkalari

interface ToggleStudentStatusProps {
  studentId: string;
  isActive: boolean;
  onSuccess: () => void;
}

const ToggleStudentStatus: React.FC<ToggleStudentStatusProps> = ({
  studentId,
  isActive,
  onSuccess,
}) => {
  const handleClick = async () => {
    const action = isActive ? 'arxivga oʻtkazish' : 'faol holatga tiklash';
    if (!confirm(`Haqiqatan ham bu studentni ${action} qilmoqchimisiz?`)) return;

    try {
      if (isActive) {
        // Soft-delete (arxivga o'tkazish)
        await api.delete(`/students/${studentId}`);
      } else {
        // Tiklash
        await api.patch(`/students/${studentId}/restore`);
      }

      onSuccess();
    } catch (err: unknown) {
      console.error('Toggle status xatosi:', err);
      alert('Internet yoki server bilan bogʻliq xato yuz berdi');
    }
  };

  return (
    <button
      onClick={handleClick}
      title={isActive ? 'Studentni arxivga oʻtkazish' : 'Studentni faol holatga tiklash'}
      className={`p-3 rounded-xl text-white font-semibold transition hover:shadow-lg shadow-sm flex items-center justify-center ${
        isActive
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isActive ? (
        <Trash2 className="w-5 h-5" />
      ) : (
        <RotateCcw className="w-5 h-5" />
      )}
    </button>
  );
};

export default ToggleStudentStatus;