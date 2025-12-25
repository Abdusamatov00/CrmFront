import { X, Phone, Calendar } from "lucide-react";
import type { Group } from "@/store/group.store";

interface Props {
  group: Group;
  onClose: () => void;
}

export default function GroupStudents({ group, onClose }: Props) {
  const students = Array.from({ length: Math.min(group.capacity, 5) }).map(
    (_, i) => ({
      enrollmentId: `${i}`,
      fullName: `Talaba ${i + 1}`,
      studentId: `STD-${i + 1}`,
      phone: "+998 90 000 00 00",
      joinDate: new Date().toISOString(),
    })
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-slate-200 bg-white">
          <h2 className="text-2xl font-bold text-slate-900">
            Guruh talabalar ro'yxati
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    To'liq ism
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Telefon
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Qo'shilgan sana
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Harakat
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((student) => (
                  <tr key={student.enrollmentId}>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">{student.fullName}</p>
                      <p className="text-xs text-slate-500">
                        {student.studentId}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Phone size={16} className="inline mr-1" />
                      {student.phone}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Calendar size={16} className="inline mr-1" />
                      {new Date(student.joinDate).toLocaleDateString("uz-UZ")}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                        O'chirish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-200 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
