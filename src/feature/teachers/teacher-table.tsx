import { useTeacherStore, type Teacher } from "@/store/teacher.store";
import { Edit2, Trash2, RotateCcw, Phone } from "lucide-react";

export default function TeacherTable({
  teachers,
  onEdit,
}: {
  teachers: Teacher[];
  onEdit: (id: string) => void;
}) {
  const { deleteTeacher, restoreTeacher } = useTeacherStore();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-foreground">
        <thead className="bg-card border-b border-border">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              O‘qituvchi
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Telefon
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Maosh
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
              Status
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase">
              Harakatlar
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {teachers.map((teacher) => (
            <tr key={teacher.id} className="hover:bg-popover transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium">{teacher.fullName}</div>
                <div className="text-sm text-muted-foreground">
                  ID: {teacher.id.slice(0, 8)}
                </div>
              </td>

              <td className="px-6 py-4 flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {teacher.phone}
              </td>

              <td className="px-6 py-4">
                {teacher.monthlySalary
                  ? `${teacher.monthlySalary} so‘m`
                  : teacher.percentShare
                  ? `${teacher.percentShare}%`
                  : "-"}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                    teacher.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {teacher.isActive ? "Faol" : "Nofaol"}
                </span>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(teacher.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {teacher.isActive ? (
                    <button
                      onClick={() => deleteTeacher(teacher.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => restoreTeacher(teacher.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
