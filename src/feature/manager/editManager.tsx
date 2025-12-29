// src/feature/manager/EditManager.tsx
import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "@/service/api"; // axios instance
import { ArrowLeft } from "lucide-react";

interface ManagerData {
  firstName: string;
  lastName: string;
  phone: string;
  password?: string;
  photoUrl?: string;
  monthlySalary?: number;
}

const EditManager: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ManagerData>({
    firstName: "",
    lastName: "",
    phone: "+998",
    password: "",
    photoUrl: "",
    monthlySalary: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // ===== FETCH MANAGER =====
  useEffect(() => {
    if (!id) {
      setMessage({ text: "Manager ID topilmadi", type: "error" });
      setFetching(false);
      return;
    }

    const fetchManager = async () => {
      try {
        const res = await api.get(`/managers/${id}`);
        const m = res.data.manager ?? res.data; // backend formatiga moslash

        setFormData({
          firstName: m.firstName || "",
          lastName: m.lastName || "",
          phone: m.phone || "+998",
          password: "",
          photoUrl: m.photoUrl || "",
          monthlySalary: m.monthlySalary ?? undefined,
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setMessage({ text: "Manager ma’lumotlari yuklanmadi", type: "error" });
      } finally {
        setFetching(false);
      }
    };

    fetchManager();
  }, [id]);

  // ===== HANDLE CHANGE =====
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const cleaned = value.replace(/[^\d+]/g, "");
      if (cleaned.length > 0 && !cleaned.startsWith("+998")) return;
      if (cleaned.length > 13) return;
      setFormData((prev) => ({ ...prev, phone: cleaned }));
    } else if (name === "monthlySalary") {
      setFormData((prev) => ({
        ...prev,
        monthlySalary: value === "" ? undefined : Number(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ===== HANDLE SUBMIT =====
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;

    setLoading(true);
    setMessage(null);

    try {
      const dataToSend: Partial<ManagerData> = {
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
        phone: formData.phone,
        photoUrl: formData.photoUrl?.trim() || undefined,
        monthlySalary: formData.monthlySalary,
      };

      if (formData.password?.trim()) {
        dataToSend.password = formData.password.trim();
      }

      await api.patch(`/managers/${id}`, dataToSend);

      setMessage({
        text: "Ma’lumotlar muvaffaqiyatli yangilandi! ✅",
        type: "success",
      });
      setTimeout(() => navigate("/admin/managers"), 2000);
    } catch (err) {
      console.error("Update error:", err);
      setMessage({ text: "Yangilashda xato yuz berdi", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin w-20 h-20 border-8 border-blue-500 border-t-transparent rounded-full" />
          <p className="mt-8 text-2xl text-gray-600 font-medium">
            Ma’lumotlar yuklanmoqda...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-10 text-white flex justify-between items-center">
          <h2 className="text-3xl font-bold">✏️ Menejerni tahrirlash</h2>
          <Link
            to="/admin/managers"
            title="Orqaga"
            className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200 flex items-center justify-center"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>

        {/* Body */}
        <div className="p-8 lg:p-12">
          {message && (
            <div
              className={`p-6 rounded-2xl text-center text-xl font-bold mb-10 shadow-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border-2 border-green-300"
                  : "bg-red-100 text-red-700 border-2 border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            {(
              [
                "firstName",
                "lastName",
                "phone",
                "password",
                "photoUrl",
                "monthlySalary",
              ] as const
            ).map((field) => (
              <div key={field} className="space-y-4">
                <label className="block text-xl font-semibold text-gray-800">
                  {field === "firstName" && "Ism *"}
                  {field === "lastName" && "Familiya *"}
                  {field === "phone" && "Telefon raqami *"}
                  {field === "password" && "Yangi parol (ixtiyoriy)"}
                  {field === "photoUrl" && "Rasm URL"}
                  {field === "monthlySalary" && "Oylik maosh"}
                </label>

                <input
                  type={
                    field === "password"
                      ? "password"
                      : field === "phone"
                      ? "tel"
                      : field === "monthlySalary"
                      ? "number"
                      : "text"
                  }
                  name={field}
                  value={formData[field] ?? ""}
                  onChange={handleChange}
                  className="w-full px-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 transition-all hover:shadow-md"
                  disabled={loading}
                  required={
                    field === "firstName" ||
                    field === "lastName" ||
                    field === "phone"
                  }
                />

                {field === "phone" && (
                  <p className="text-sm text-gray-500">
                    +998 bilan boshlanib, 9 ta raqam
                  </p>
                )}
              </div>
            ))}

            <div className="md:col-span-2 flex justify-center mt-12">
              <button
                type="submit"
                disabled={loading}
                className="px-20 py-6 bg-gradient-to-r from-green-600 to-green-700 text-white text-2xl font-bold rounded-3xl hover:from-green-700 hover:to-green-800 disabled:opacity-70 transition-all shadow-2xl flex items-center justify-center gap-4"
              >
                {loading && (
                  <span className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditManager;
