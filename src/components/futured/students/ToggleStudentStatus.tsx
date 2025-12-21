// src/components/futured/students/ToggleStudentStatus.tsx
import React from 'react';
import axios from 'axios';

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
        await axios.delete(`http://localhost:3000/api/students/${studentId}`);
      } else {
        await axios.patch(`http://localhost:3000/api/students/${studentId}/restore`);
      }
      onSuccess();
    } catch (err) {
      alert('Xato yuz berdi. Internetni tekshiring yoki keyinroq urinib ko‘ring.');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-5 py-2 rounded-lg text-white font-medium transition hover:shadow-md ${
        isActive
          ? 'bg-red-600 hover:bg-red-700'
          : 'bg-blue-600 hover:bg-blue-700'
      }`}
    >
      {isActive ? '🗑️ Oʻchirish' : '🔄 Tiklash'}
    </button>
  );
};

export default ToggleStudentStatus;