// src/components/futured/students/CreateStudent.tsx
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/service/api";
import { ArrowLeft, Calendar, Clock, UserPlus } from "lucide-react";

const CreateStudent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "+998",
    password: "",
    dateOfBirth: "",
    startDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleaned = value.replace(/[^\d+]/g, "");
      if (cleaned.length > 0 && !cleaned.startsWith("+998")) return;
      if (cleaned.length > 13) return;
      setFormData((prev) => ({ ...prev, phone: cleaned }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.firstName.trim()) err.firstName = "Ism kiritish shart";
    if (!formData.lastName.trim()) err.lastName = "Familiya kiritish shart";
    if (!/^\+998\d{9}$/.test(formData.phone))
      err.phone = "To'g'ri telefon raqamini kiriting (+998XXXXXXXXX)";
    if (formData.password.length < 6)
      err.password = "Parol kamida 6 belgidan iborat bo'lishi kerak";
    if (!formData.startDate)
      err.startDate = "Boshlanish sanasi kiritilishi shart";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMessage(null);

    try {
      await api.post("/students", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth || null,
        startDate: formData.startDate,
      });

      setMessage({
        text: "✅ Talaba muvaffaqiyatli qo'shildi! Talabalar ro'yxatiga yo'naltirilmoqda...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/admin/students");
      }, 1500);
    } catch (err: unknown) {
      setMessage({
        text: "❌ Xato: Talaba qo'shishda muammo yuz berdi",
        type: "error",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setNow = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    setFormData((prev) => ({
      ...prev,
      startDate: `${year}-${month}-${day}T${hours}:${minutes}`,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-indigo-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                to="/admin/students"
                className="group p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:bg-blue-50"
                title="Ro'yxatga qaytish"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </Link>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Yangi Talaba Qo'shish
                </h1>
                <p className="text-gray-600 mt-2">
                  Talaba ma'lumotlarini to'ldiring va tizimga qo'shing
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Talaba Ma'lumotlari</h2>
                <p className="text-blue-100 mt-1">
                  Barcha maydonlarni to'ldiring
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <span className="text-sm">
                  Qo'shilish: {new Date().toLocaleDateString("uz-UZ")}
                </span>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-8 lg:p-10">
            {message && (
              <div
                className={`mb-8 p-6 rounded-2xl border-2 ${
                  message.type === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      message.type === "success" ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {message.type === "success" ? "✅" : "❌"}
                  </div>
                  <p className="font-medium">{message.text}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* First Name */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-lg font-semibold text-gray-800">
                      Ism *
                    </span>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Ali"
                        className={`w-full px-5 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                          errors.firstName
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        disabled={loading}
                      />
                      {errors.firstName && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <span>⚠</span> {errors.firstName}
                        </p>
                      )}
                    </div>
                  </label>
                </div>

                {/* Last Name */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-lg font-semibold text-gray-800">
                      Familiya *
                    </span>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Valiyev"
                        className={`w-full px-5 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                          errors.lastName
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        disabled={loading}
                      />
                      {errors.lastName && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <span>⚠</span> {errors.lastName}
                        </p>
                      )}
                    </div>
                  </label>
                </div>

                {/* Phone */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-lg font-semibold text-gray-800">
                      Telefon raqami *
                    </span>
                    <div className="mt-2 relative">
                      <div className="flex items-center border-2 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500">
                        <div className="px-4 py-4 bg-gray-50 border-r">
                          <span className="text-gray-600">+998</span>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone.slice(4)}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            if (value.length <= 9) {
                              setFormData((prev) => ({
                                ...prev,
                                phone: "+998" + value,
                              }));
                            }
                          }}
                          placeholder="90 123 45 67"
                          className="flex-1 px-5 py-4 text-lg border-none focus:outline-none"
                          disabled={loading}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <span>⚠</span> {errors.phone}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-gray-500">
                        9 ta raqamdan iborat bo'lishi kerak
                      </p>
                    </div>
                  </label>
                </div>

                {/* Password */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-lg font-semibold text-gray-800">
                      Parol *
                    </span>
                    <div className="mt-2 relative">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••"
                        className={`w-full px-5 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                          errors.password
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                        disabled={loading}
                      />
                      {errors.password && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                          <span>⚠</span> {errors.password}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-gray-500">
                        Kamida 6 ta belgi
                      </p>
                    </div>
                  </label>
                </div>

                {/* Date of Birth */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-lg font-semibold text-gray-800">
                      Tug'ilgan sana
                    </span>
                    <div className="mt-2 relative">
                      <div className="flex items-center border-2 border-gray-200 rounded-xl hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50">
                        <Calendar className="absolute left-4 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="w-full pl-12 pr-5 py-4 text-lg bg-transparent focus:outline-none"
                          disabled={loading}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Masalan: 2000-12-31
                      </p>
                    </div>
                  </label>
                </div>

                {/* Start Date */}
                <div className="space-y-3">
                  <label className="block">
                    <span className="text-lg font-semibold text-gray-800">
                      Boshlanish sanasi *
                    </span>
                    <div className="mt-2 space-y-4">
                      <div className="flex items-center border-2 border-gray-200 rounded-xl hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/50">
                        <Clock className="absolute left-4 text-gray-400 w-5 h-5" />
                        <input
                          type="datetime-local"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          className="w-full pl-12 pr-5 py-4 text-lg bg-transparent focus:outline-none"
                          disabled={loading}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={setNow}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all shadow-md hover:shadow-lg"
                      >
                        <Clock className="w-4 h-4" />
                        Hozirgi vaqtni tanlash
                      </button>
                      {errors.startDate && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <span>⚠</span> {errors.startDate}
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full md:w-auto px-16 py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-xl font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-70 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                      Qo'shilmoqda...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3">
                      <UserPlus className="w-6 h-6" />
                      Talaba Qo'shish
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStudent;
  