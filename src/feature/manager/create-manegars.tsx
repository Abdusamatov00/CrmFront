import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createManager,
  type CreateManagerDto,
} from "@/service/managers-service/managers-service";

const CreateManager: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CreateManagerDto>({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
    photoUrl: "",
    monthlySalary: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((p) => ({
      ...p,
      [name]:
        name === "monthlySalary"
          ? value === ""
            ? undefined
            : Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createManager(formData);
      navigate("/admin/managers");
    } catch (err: any) {
      if (err.response?.status === 409)
        setError("Bu telefon raqam allaqachon mavjud");
      else setError("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 lg:p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              👨‍💼 Yangi Menejer Qo‘shish
            </h2>
            <p className="text-gray-500 mt-1">
              Menejer ma’lumotlarini to‘ldiring
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
          >
            ← Orqaga
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Input
            label="Ismi"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          <Input
            label="Familiyasi"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />

          <Input
            label="Telefon raqami"
            name="phone"
            placeholder="+998..."
            value={formData.phone}
            onChange={handleChange}
          />

          <Input
            label="Parol"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          <Input
            label="Rasm URL (ixtiyoriy)"
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleChange}
          />

          <Input
            label="Oylik maosh (UZS)"
            name="monthlySalary"
            type="number"
            value={formData.monthlySalary ?? ""}
            onChange={handleChange}
          />

          {error && (
            <div className="md:col-span-2 text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/managers")}
              className="px-8 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold transition"
            >
              Bekor qilish
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg disabled:opacity-60"
            >
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateManager;

/* ================= INPUT ================= */

const Input = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div className="flex flex-col gap-2">
    <label className="text-gray-700 font-medium">{label}</label>
    <input
      {...props}
      required={props.name !== "photoUrl" && props.name !== "monthlySalary"}
      className="h-11 rounded-xl border border-gray-300 px-4 outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  </div>
);
