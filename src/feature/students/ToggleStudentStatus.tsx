// src/components/futured/students/ToggleStudentStatus.tsx
import React from "react";
import { api } from "@/service/api";
import { Trash2, RotateCcw } from "lucide-react";

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
    const action = isActive ? "arxivga oʻtkazish" : "faol holatga tiklash";
    const actionText = isActive ? "arxiv" : "faol";
    const confirmText = `Bu talabani ${actionText} holatga o'tkazmoqchimisiz?\n\nTalaba ma'lumotlari saqlanib qoladi.`;

    if (!confirm(confirmText)) return;

    try {
      if (isActive) {
        await api.delete(`/students/${studentId}`);
      } else {
        await api.patch(`/students/${studentId}/restore`);
      }
      onSuccess();
    } catch (err: unknown) {
      console.error("Status o'zgartirishda xato:", err);
      alert("Internet yoki server bilan bogʻliq muammo yuz berdi");
    }
  };

  return (
    <button
      onClick={handleClick}
      title={
        isActive
          ? "Talabani arxivga oʻtkazish"
          : "Talabani faol holatga tiklash"
      }
      className={`group relative p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
        isActive
          ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
          : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
      }`}
    >
      {isActive ? (
        <Trash2 className="w-5 h-5 text-white" />
      ) : (
        <RotateCcw className="w-5 h-5 text-white" />
      )}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        {isActive ? "Arxivga o'tkazish" : "Faollashtirish"}
      </div>
    </button>
  );
};

export default ToggleStudentStatus;
