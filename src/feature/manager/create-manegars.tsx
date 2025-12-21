// components/CreateManager.tsx
import React, { useState } from "react";
import axios from "axios";

interface CreateManagerDto {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  photoUrl?: string;
  monthlySalary?: number;
}

const CreateManager: React.FC = () => {
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
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "monthlySalary") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? parseFloat(value) : undefined,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Tokenni localStorage yoki cookies'dan olish
      const response = await api.post(
        "http://localhost:3000/managers",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          password: formData.password,
          ...(formData.photoUrl && { photoUrl: formData.photoUrl }),
          ...(formData.monthlySalary && {
            monthlySalary: formData.monthlySalary,
          }),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          password: "",
          photoUrl: "",
          monthlySalary: undefined,
        });
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 409) {
        setError("Bu telefon raqam allaqachon ro'yxatdan o'tgan");
      } else if (err.response?.status === 401) {
        setError("Kirish huquqi yo'q. Iltimos, tizimga kiring");
      } else {
        setError("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="create-manager-container"
      style={{ maxWidth: "500px", margin: "0 auto" }}
    >
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        Xush kelibsiz
      </h2>

      <h3 style={{ textAlign: "center", color: "#555", marginBottom: "20px" }}>
        Yangi Menejer Qo'shish
      </h3>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Ism *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
            placeholder="Ismingizni kiriting"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Familiya *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
            placeholder="Familiyangizni kiriting"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Telefon *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
            placeholder="+998901234567"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Parol *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
            placeholder="Kamida 6 ta belgi"
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Rasm URL (ixtiyoriy)
          </label>
          <input
            type="url"
            name="photoUrl"
            value={formData.photoUrl}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}
          >
            Oylik maosh (ixtiyoriy)
          </label>
          <input
            type="number"
            name="monthlySalary"
            value={formData.monthlySalary || ""}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "16px",
            }}
            placeholder="Oylik maoshni kiriting"
            min="0"
          />
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            Menejer muvaffaqiyatli qo'shildi!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Yuklanmoqda..." : "Qo'shish"}
        </button>
      </form>
    </div>
  );
};

export default CreateManager;
