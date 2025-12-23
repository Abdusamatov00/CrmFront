// src/components/futured/students/CreateStudent.tsx
import React, { useState } from "react";
import { api } from "@/service/api";
import { X, Calendar } from "lucide-react";

type Props = {
  onClose: () => void;
};

const CreateStudent: React.FC<Props> = ({ onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "+998",
    password: "",
    dateOfBirth: "",
    startDate: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/students", form);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {/* Yopish tugmasi */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition z-10"
      >
        <X size={28} />
      </button>

      {/* Forma kartochkasi */}
      <div className="max-w-md mx-auto w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Sarlavha */}
        <div className="px-8 pt-10 pb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Yangi talaba</h2>
        </div>

        <form onSubmit={submit} className="px-6 sm:px-8 pb-12 space-y-6">
          {/* Ism */}
          <input
            required
            type="text"
            placeholder="Ism"
            value={form.firstName}
            className="w-full px-5 py-4 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />

          {/* Familiya */}
          <input
            required
            type="text"
            placeholder="Familiya"
            value={form.lastName}
            className="w-full px-5 py-4 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />

          {/* Telefon */}
          <input
            required
            type="tel"
            placeholder="Telefon"
            value={form.phone}
            className="w-full px-5 py-4 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          {/* Parol */}
          <input
            required
            type="password"
            placeholder="Parol"
            value={form.password}
            className="w-full px-5 py-4 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

                  {/* Tug'ilgan sana */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 pl-1">
              Tug'ilgan sana
            </label>
            <div className="relative">
              <input
                required
                type="date"
                value={form.dateOfBirth}
                className="w-full px-5 py-4 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none [&::-webkit-datetime-edit]:text-transparent [&::-webkit-calendar-picker-indicator]:opacity-0"
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              />
              {/* Kalendar ikonkasi */}
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />

              {/* Har doim faqat bitta yozuv: bo'sh bo'lsa placeholder, to'ldirilgan bo'lsa sana */}
              <span className={`absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-base select-none transition-colors ${form.dateOfBirth ? "text-gray-900" : "text-gray-400"}`}>
                {form.dateOfBirth
                  ? new Date(form.dateOfBirth).toLocaleDateString("uz-UZ", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).replace(/\//g, ".")
                  : "dd/mm/yyyy"}
              </span>
            </div>
          </div>

          {/* Kursga kelgan vaqti */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 pl-1">
              Kursga kelgan vaqti
            </label>
            <div className="relative">
              <input
                required
                type="date"
                value={form.startDate}
                className="w-full px-5 py-4 text-base bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition appearance-none [&::-webkit-datetime-edit]:text-transparent [&::-webkit-calendar-picker-indicator]:opacity-0"
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />

              <span className={`absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-base select-none transition-colors ${form.startDate ? "text-gray-900" : "text-gray-400"}`}>
                {form.startDate
                  ? new Date(form.startDate).toLocaleDateString("uz-UZ", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).replace(/\//g, ".")
                  : "dd/mm/yyyy"}
              </span>
            </div>
          </div>
          {/* Saqlash tugmasi */}
          <div className="pt-8">
            <button
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg rounded-full transition disabled:opacity-70 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl"
            >
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;