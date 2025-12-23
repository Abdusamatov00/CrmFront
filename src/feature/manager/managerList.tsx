import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getManagers,
  deleteManager,
} from "@/service/managers-service/managers-service";
import { Pencil, Archive } from "lucide-react";

const ManagersList: React.FC = () => {
  const [managers, setManagers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const res = await getManagers();
      setManagers(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Menejerni arxivga o‘tkazmoqchimisiz?")) return;
    await deleteManager(id);
    fetchManagers();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            📚 Menejerlar Boshqaruvi
          </h1>
          <p className="text-gray-500 mt-1">
            Menejerlarni boshqarish va kuzatish uchun panel
          </p>
        </div>

        <Link
          to="/admin/managers/create"
          className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
        >
          + Yangi Menejer Qo‘shish
        </Link>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Jami Menejerlar" value={managers.length} icon="👥" />
        <StatCard title="Faol Menejerlar" value={managers.length} icon="✅" />
        <StatCard title="Arxiv Menejerlar" value={0} icon="📁" />
      </div>

      {/* SEARCH + FILTER */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-wrap gap-4 items-center">
        <input
          placeholder="Ism, familiya yoki telefon raqami bo‘yicha qidirish..."
          className="flex-1 h-11 rounded-lg border px-4 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2">
          <FilterBtn active>Faol</FilterBtn>
          <FilterBtn>Arxiv</FilterBtn>
          <FilterBtn>Barchasi</FilterBtn>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <tr>
              <th className="p-4 text-left">Menejer</th>
              <th className="p-4 text-left">Aloqa</th>
              <th className="p-4 text-left">Qo‘shilgan sana</th>
              <th className="p-4 text-left">Holat</th>
              <th className="p-4 text-center">Amallar</th>
            </tr>
          </thead>

          <tbody>
            {!loading &&
              managers.map((m) => (
                <tr key={m.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">
                    {m.firstName} {m.lastName}
                  </td>
                  <td className="p-4">{m.phone}</td>
                  <td className="p-4">
                    {new Date(m.createdAt).toLocaleDateString("uz-UZ")}
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                      Faol
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <Link
                        to={`/admin/managers/edit/${m.id}`}
                        className="px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button
                        onClick={() => remove(m.id)}
                        className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                      >
                        <Archive size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {loading && (
          <div className="p-10 text-center text-gray-500">Yuklanmoqda...</div>
        )}
      </div>
    </div>
  );
};

export default ManagersList;

/* =================== COMPONENTS =================== */

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) => (
  <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
    <div>
      <p className="text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
    <div className="text-3xl">{icon}</div>
  </div>
);

const FilterBtn = ({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) => (
  <button
    className={`px-4 py-2 rounded-lg font-medium transition ${
      active
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);
