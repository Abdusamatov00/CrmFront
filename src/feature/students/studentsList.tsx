// src/components/futured/students/StudentsList.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/service/api";
import { Search, Filter, PencilIcon } from "lucide-react";
import ToggleStudentStatus from "./ToggleStudentStatus"; // Agar sizda bu komponent mavjud bo'lsa
import CreateStudent from "./createStudents";
// Agar ToggleStudentStatus komponenti hali yo'q bo'lsa, quyidagi oddiy tugmani ishlatamiz

interface Student {
  id: string;
  fullName: string;
  phone: string;
  dateOfBirth: string | null;
  startDate: string | null;
  isActive: boolean;
}

const StudentsList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "archived">("active");
  const [openCreate, setOpenCreate] = useState(false);

  const fetchStudents = async (forceAll = false) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "100",
        ...(search.trim() && { search: search.trim() }),
        ...(filter !== "all" &&
          !forceAll && {
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
    fetchStudents(true);
  };

  const formatDate = (date: string | null) =>
    date
      ? new Date(date).toLocaleDateString("uz-UZ", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "-";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
              📚 Talabalar Boshqaruvi
            </h1>
            <p className="text-lg text-gray-600">
              Talabalarni boshqarish va kuzatish uchun panel
            </p>
          </div>
          <button
            onClick={() => setOpenCreate(true)}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
          >
            + Yangi Talaba Qo'shish
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Jami Talabalar
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {students.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
              👥
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Faol Talabalar
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {students.filter((s) => s.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
              ✅
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Arxiv Talabalar
              </p>
              <p className="text-3xl font-bold text-amber-600 mt-2">
                {students.filter((s) => !s.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">
              📁
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
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
            <div className="flex gap-2 md:gap-3 flex-wrap">
              {(["active", "archived", "all"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2 rounded-xl font-medium text-base transition-all duration-200 flex items-center gap-2 ${
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

        {/* Desktop Table (md va undan kattaroq) */}
        {!loading && students.length > 0 && (
          <div className="hidden md:block bg-white rounded-2xl shadow-xl overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold text-lg">
                    Talaba
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-lg">
                    Aloqa
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-lg">
                    Tug'ilgan sana
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-lg">
                    Boshlanish
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-lg">
                    Holat
                  </th>
                  <th className="py-4 px-6 text-left font-semibold text-lg">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-gray-100 hover:bg-blue-50/50"
                  >
                    <td className="py-4 px-6">{student.fullName}</td>
                    <td className="py-4 px-6">{student.phone}</td>
                    <td className="py-4 px-6">
                      {formatDate(student.dateOfBirth)}
                    </td>
                    <td className="py-4 px-6">
                      {formatDate(student.startDate)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-xl text-sm ${
                          student.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {student.isActive ? "Faol" : "Arxiv"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {/* Tahrirlash tugmasi - yangi dizayn bilan */}
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

                        {/* Statusni o'zgartirish (Arxiv/Faol) - ToggleStudentStatus komponenti */}
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
        )}

        {/* Mobile Card View */}
        {!loading && students.length > 0 && (
          <div className="md:hidden flex flex-col gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-2xl shadow p-4 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{student.fullName}</h3>
                  <span
                    className={`px-3 py-1 rounded-xl text-sm font-medium ${
                      student.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {student.isActive ? "Faol" : "Arxiv"}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    Aloqa:{" "}
                    <span className="font-medium text-gray-900">
                      {student.phone}
                    </span>
                  </p>
                  <p>
                    Tug'ilgan sana:{" "}
                    <span className="font-medium text-gray-900">
                      {formatDate(student.dateOfBirth)}
                    </span>
                  </p>
                  <p>
                    Boshlanish:{" "}
                    <span className="font-medium text-gray-900">
                      {formatDate(student.startDate)}
                    </span>
                  </p>
                </div>
                <div className="flex gap-3 mt-3">
                  <Link
                    to={`/admin/students/edit/${student.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition font-medium"
                  >
                    <PencilIcon className="w-5 h-5" />
                    Tahrirlash
                  </Link>
                  <div className="flex-1">
                    <ToggleStudentStatus
                      studentId={student.id}
                      isActive={student.isActive}
                      onSuccess={handleStatusChanged}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading va Empty state */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Yuklanmoqda...</p>
          </div>
        )}
        {!loading && students.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-xl">
            <p className="text-xl text-gray-600">Talabalar topilmadi</p>
          </div>
        )}
      </div>

      {/* Drawer - Yangi talaba qo'shish formasi */}
      {openCreate && (
        <div className="fixed inset-0 z-[9999] flex">
          {/* Overlay - tashqariga bosganda yopiladi */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setOpenCreate(false)}
          />

          {/* Drawer panel - endi oq emas, zamonaviy gradient va ko'proq "nafas oladigan" */}
          <div className="relative ml-auto w-full max-w-md h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-2xl overflow-y-auto">
            <CreateStudent
              onClose={() => {
                setOpenCreate(false);
                fetchStudents(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;
