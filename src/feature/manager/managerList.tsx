// src/components/futured/managers/ManagersList.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "@/service/api";
import { PencilIcon, Trash2, RotateCcw } from "lucide-react";

interface Manager {
  id: string;
  fullName: string;
  phone: string;
  monthlySalary: number | null;
  photoUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

const ManagersList: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "archived">("active");

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "100",
        ...(search.trim() && { search: search.trim() }),
        ...(filter !== "all" && {
          isActive: filter === "active" ? "true" : "false",
        }),
      });

      const res = await api.get<{ items: Manager[] }>(
        `/managers?${params.toString()}`
      );
      setManagers(res.data.items || []);
    } catch (err) {
      console.error("Managerlarni yuklashda xato:", err);
      alert("Maʼlumotlarni yuklashda xato yuz berdi. Konsolni tekshiring.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, [search, filter]);

  const handleStatusChange = async (managerId: string, isActive: boolean) => {
    const action = isActive ? "arxivga oʻtkazish" : "faol holatga tiklash";
    if (!confirm(`Haqiqatan ham bu menejerni ${action} qilmoqchimisiz?`))
      return;

    try {
      if (isActive) {
        await api.delete(`/managers/${managerId}`);
      } else {
        await api.patch(`/managers/${managerId}/restore`);
      }
      fetchManagers();
    } catch (err) {
      console.error("Status ozgartirishda xato:", err);
      alert("Amalni bajarishda xato yuz berdi");
    }
  };

  const formatDate = (date: string | null): string => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("uz-UZ");
  };

  const formatSalary = (salary: number | null): string => {
    if (!salary) return "-";
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
      minimumFractionDigits: 0,
    }).format(salary);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
        {/* Sarlavha */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            👨‍💼 Menejerlar Roʻyxati ({managers.length})
          </h2>
          <Link
            to="/admin/managers/create"
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
          >
            + Yangi Menejer Qoʻshish
          </Link>
        </div>

        {/* Qidiruv va filtr */}
        <div className="flex flex-col lg:flex-row gap-6 mb-10">
          <input
            type="text"
            placeholder="Ism, familiya yoki telefon boʻyicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition text-lg"
          />
          <div className="flex gap-4 flex-wrap">
            {(["active", "archived", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition shadow-md ${
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {f === "active"
                  ? "Faol"
                  : f === "archived"
                  ? "Arxiv"
                  : "Barchasi"}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin w-16 h-16 border-8 border-blue-500 border-t-transparent rounded-full" />
            <p className="mt-8 text-2xl text-gray-600">Yuklanmoqda...</p>
          </div>
        )}

        {/* Bo'sh ro'yxat */}
        {!loading && managers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-3xl text-gray-500">
              Hech qanday menejer topilmadi 😔
            </p>
          </div>
        )}

        {/* Jadval */}
        {!loading && managers.length > 0 && (
          <div className="overflow-x-auto rounded-xl shadow-md">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <tr>
                  <th className="p-6 text-lg font-semibold">Rasm</th>
                  <th className="p-6 text-lg font-semibold">Ism Familiya</th>
                  <th className="p-6 text-lg font-semibold">Telefon</th>
                  <th className="p-6 text-lg font-semibold">Oylik maosh</th>
                  <th className="p-6 text-lg font-semibold">Qo'shilgan sana</th>
                  <th className="p-6 text-lg font-semibold text-center">
                    Holati
                  </th>
                  <th className="p-6 text-lg font-semibold text-center">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody>
                {managers.map((manager) => (
                  <tr
                    key={manager.id}
                    className="border-b hover:bg-gray-50 transition duration-200"
                  >
                    <td className="p-6">
                      {manager.photoUrl ? (
                        <img
                          src={manager.photoUrl}
                          alt={manager.fullName}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                          {manager.fullName.charAt(0)}
                        </div>
                      )}
                    </td>
                    <td className="p-6 font-medium text-gray-800 text-lg">
                      {manager.fullName}
                    </td>
                    <td className="p-6 text-gray-600 text-lg">
                      {manager.phone}
                    </td>
                    <td className="p-6 text-gray-600 text-lg font-semibold">
                      {formatSalary(manager.monthlySalary)}
                    </td>
                    <td className="p-6 text-gray-600 text-lg">
                      {formatDate(manager.createdAt)}
                    </td>
                    <td className="p-6 text-center">
                      <span
                        className={`inline-block px-6 py-3 rounded-full text-lg font-semibold shadow-sm ${
                          manager.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {manager.isActive ? "Faol" : "Arxiv"}
                      </span>
                    </td>
                    <td className="p-6 text-center">
                      <div className="flex justify-center gap-6 flex-wrap">
                        {/* Tahrirlash */}
                        <Link
                          to={`/admin/managers/edit/${manager.id}`}
                          className="px-3 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition shadow-lg inline-flex items-center gap-3"
                        >
                          <PencilIcon className="h-6 w-6" />
                        </Link>
                        {/* O'chirish / Tiklash */}
                        <button
                          onClick={() =>
                            handleStatusChange(manager.id, manager.isActive)
                          }
                          title={
                            manager.isActive
                              ? "Arxivga oʻtkazish"
                              : "Faol holatga tiklash"
                          }
                          className={`p-3 rounded-xl text-white font-semibold transition hover:shadow-lg shadow-sm ${
                            manager.isActive
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                        >
                          {manager.isActive ? (
                            <Trash2 className="w-5 h-5" />
                          ) : (
                            <RotateCcw className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagersList;
