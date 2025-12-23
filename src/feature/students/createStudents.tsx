// src/components/futured/students/CreateStudent.tsx
import React, { useState } from "react";
import { api } from "@/service/api";
import { X } from "lucide-react";

type Props = {
  onClose: () => void;
};

const CreateStudent: React.FC<Props> = ({ onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "+998",
    password: "",
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
    <div className="relative p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
      >
        <X size={24} />
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">Yangi talaba</h2>

      <form onSubmit={submit} className="space-y-5">
        <input
          placeholder="Ism"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({ ...form, firstName: e.target.value })
          }
        />
        <input
          placeholder="Familiya"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({ ...form, lastName: e.target.value })
          }
        />
        <input
          placeholder="Telefon"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />
        <input
          type="password"
          placeholder="Parol"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        <input
          type="datetime-local"
          placeholder="Boshlanish sanasi"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) =>
            setForm({ ...form, startDate: e.target.value })
          }
        />

        <button
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-70"
        >
          {loading ? "Saqlanmoqda..." : "Saqlash"}
        </button>
      </form>
    </div>
  );
};

export default CreateStudent;