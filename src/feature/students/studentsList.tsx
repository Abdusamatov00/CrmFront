// src/components/futured/students/StudentsList.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/service/api";
import ToggleStudentStatus from "./ToggleStudentStatus";
import { PencilIcon, Search, Filter } from "lucide-react";

interface Student {
  id: string;
  fullName: string;
  phone: string;
  dateOfBirth: string | null;
  startDate: string | null;
  isActive: boolean;
}

const StudentsList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "archived">("active");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "100",
        ...(search.trim() && { search: search.trim() }),
        ...(filter !== "all" && {
          isActive: filter === "active" ? "true" : "false",
        }),
      });

      const res = await api.get<{ items: Student[] }>(
        `/students?${params.toString()}`
      );
      setStudents(res.data.items || []);
    } catch (err) {
      console.error("Studentlarni yuklashda xato:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, filter]);

  const handleStatusChanged = () => {
    fetchStudents();
  };

  const formatDate = (date: string | null): string => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("uz-UZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                📚 Talabalar Boshqaruvi
              </h1>
              <p className="text-lg text-gray-600">
                Talabalarni boshqarish va kuzatish uchun panel
              </p>
            </div>
            <Link
              to="/admin/students/create"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
            >
              <span className="relative z-10">+ Yangi Talaba Qo'shish</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Jami Talabalar
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {students.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Faol Talabalar
                  </p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {students.filter((s) => s.isActive).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Arxiv Talabalar
                  </p>
                  <p className="text-3xl font-bold text-amber-600 mt-2">
                    {students.filter((s) => !s.isActive).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📁</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Ism, familiya yoki telefon raqami bo'yicha qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all hover:border-gray-300"
              />
            </div>
            <div className="flex gap-3">
              {(["active", "archived", "all"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-6 py-3 rounded-xl font-medium text-base transition-all duration-200 flex items-center gap-2 ${
                    filter === f
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  {f === "active"
                    ? "Faol"
                    : f === "archived"
                    ? "Arxiv"
                    : "Barchasi"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full" />
            <p className="mt-6 text-xl text-gray-600 font-medium">
              Ma'lumotlar yuklanmoqda...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && students.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">😔</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              Talabalar topilmadi
            </h3>
            <p className="text-gray-500 mb-8">
              Qidiruvga mos talabalar yo'q yoki hali talaba qo'shilmagan
            </p>
            <Link
              to="/admin/students/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Birinchi talabani qo'shish
            </Link>
          </div>
        )}

        {/* Table Section */}
        {!loading && students.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                  <tr>
                    <th className="py-6 px-8 text-left font-semibold text-lg">
                      Talaba
                    </th>
                    <th className="py-6 px-8 text-left font-semibold text-lg">
                      Aloqa
                    </th>
                    <th className="py-6 px-8 text-left font-semibold text-lg">
                      Tug'ilgan sana
                    </th>
                    <th className="py-6 px-8 text-left font-semibold text-lg">
                      Boshlanish
                    </th>
                    <th className="py-6 px-8 text-left font-semibold text-lg">
                      Holat
                    </th>
                    <th className="py-6 px-8 text-left font-semibold text-lg">
                      Amallar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr
                      key={student.id}
                      className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-gray-50/50" : ""
                      }`}
                    >
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                            <span className="text-xl font-bold text-blue-700">
                              {student.fullName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">
                              {student.fullName}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {student.id.substring(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-blue-600">📱</span>
                          </span>
                          <span className="font-medium text-gray-700">
                            {student.phone}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                          <span className="text-gray-500">📅</span>
                          <span className="font-medium text-gray-700">
                            {formatDate(student.dateOfBirth)}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 rounded-lg">
                          <span className="text-blue-500">🎓</span>
                          <span className="font-medium text-gray-700">
                            {formatDate(student.startDate)}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                            student.isActive
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {student.isActive ? (
                            <>
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                              Faol
                            </>
                          ) : (
                            <>
                              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                              Arxiv
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-3">
                          <Link
                            to={`/admin/students/edit/${student.id}`}
                            className="group relative p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
                            title="Tahrirlash"
                          >
                            <PencilIcon className="w-5 h-5" />
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Tahrirlash
                            </div>
                          </Link>
                          <ToggleStudentStatus
                            studentId={student.id}
                            isActive={student.isActive}
                            onSuccess={handleStatusChanged}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-100 px-8 py-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">
                  Jami{" "}
                  <span className="font-semibold text-gray-900">
                    {students.length}
                  </span>{" "}
                  ta talaba
                </p>
                <div className="flex items-center gap-4">
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition">
                    ← Oldingi
                  </button>
                  <span className="text-gray-700">1 / 1</span>
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition">
                    Keyingi →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsList;
