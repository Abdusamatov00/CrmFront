// src/components/futured/students/EditStudent.tsx
import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/service/api";

const EditStudent: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "+998",
    password: "",
    dateOfBirth: "",
    startDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!studentId) {
      setMessage({ text: "Student ID topilmadi", type: "error" });
      setFetching(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/${studentId}`);
        const s = res.data;

        const nameParts = s.fullName?.trim().split(" ") || ["", ""];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        setFormData({
          firstName,
          lastName,
          phone: s.phone || "+998",
          password: "",
          dateOfBirth: s.dateOfBirth
            ? new Date(s.dateOfBirth).toISOString().split("T")[0]
            : "",
          startDate: s.startDate
            ? new Date(s.startDate).toISOString().slice(0, 16)
            : "",
        });
      } catch (err) {
        setMessage({ text: "Student maʼlumotlari yuklanmadi", type: "error" });
        console.error("Fetch error:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchStudent();
  }, [studentId]);

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
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!studentId) return;

    setLoading(true);
    setMessage(null);

    try {
      const dataToSend: Partial<typeof formData> = {
        firstName: formData.firstName.trim() || undefined,
        lastName: formData.lastName.trim() || undefined,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth || undefined,
        startDate: formData.startDate || undefined,
      };

      if (formData.password.trim()) {
        dataToSend.password = formData.password.trim();
      }

      await api.patch(`/students/${studentId}`, dataToSend);

      setMessage({
        text: "Maʼlumotlar muvaffaqiyatli yangilandi! ✅",
        type: "success",
      });
      setTimeout(() => navigate("/admin/students"), 2500);
    } catch (err) {
      setMessage({ text: "Yangilashda xato yuz berdi", type: "error" });
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const setCurrentTime = () => {
    const now = new Date().toISOString().slice(0, 16);
    setFormData((prev) => ({ ...prev, startDate: now }));
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin w-20 h-20 border-8 border-blue-500 border-t-transparent rounded-full" />
          <p className="mt-8 text-2xl text-gray-600 font-medium">
            Maʼlumotlar yuklanmoqda...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-3xl w-full p-8 md:p-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <span>👨‍💼</span> Yangi Menejer Qo‘shish
            </h1>
            <p className="text-gray-500">Menejer ma’lumotlarini to‘ldiring</p>
          </div>
          <Link
            to="/admin/students"
            className="mt-4 sm:mt-0 px-5 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
          >
            ← Orqaga
          </Link>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {(
            [
              "firstName",
              "lastName",
              "phone",
              "password",
              "dateOfBirth",
              "startDate",
            ] as const
          ).map((field) => (
            <div key={field} className="flex flex-col">
              <label className="font-semibold text-gray-700">
                {field === "firstName" && "Ism"}
                {field === "lastName" && "Familiya"}
                {field === "phone" && "Telefon raqami"}
                {field === "password" && "Parol (ixtiyoriy)"}
                {field === "dateOfBirth" && "Tug‘ilgan sana"}
                {field === "startDate" && "Boshlanish sanasi"}
              </label>
              <input
                type={
                  field === "password"
                    ? "password"
                    : field === "phone"
                    ? "tel"
                    : field === "dateOfBirth"
                    ? "date"
                    : field === "startDate"
                    ? "datetime-local"
                    : "text"
                }
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="mt-2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required={
                  field === "firstName" ||
                  field === "lastName" ||
                  field === "phone" ||
                  field === "startDate"
                }
                disabled={loading}
              />
            </div>
          ))}

          {/* Buttons */}
          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/students")}
              className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
            >
              {loading ? "Saqlanmoqda..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
