import React, { useState } from "react";
import {
  createManager,
  type CreateManagerDto,
} from "@/service/managers-service/managers-service";

const CreateManagers: React.FC = () => {
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

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "monthlySalary" ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createManager(formData);
      setSuccess(true);

      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        password: "",
        photoUrl: "",
        monthlySalary: undefined,
      });
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError("Bu telefon raqam allaqachon mavjud");
      } else if (err.response?.status === 401) {
        setError("Ruxsat yo‘q");
      } else {
        setError("Xatolik yuz berdi");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "rgba(15, 23, 42, 0.9)",
          borderRadius: "14px",
          padding: "28px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#fff",
            marginBottom: "24px",
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          Yangi Menejer Qo‘shish
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>
          <Input
            label="First name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          <Input
            label="Last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />

          <Input
            label="Telefon"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <Input
            label="Password"
            type="password"
            name="password"
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
            label="Oylik maosh (ixtiyoriy)"
            type="number"
            name="monthlySalary"
            value={formData.monthlySalary ?? ""}
            onChange={handleChange}
          />

          {error && (
            <p style={{ color: "#f87171", textAlign: "center" }}>{error}</p>
          )}
          {success && (
            <p style={{ color: "#4ade80", textAlign: "center" }}>
              Menejer muvaffaqiyatli qo‘shildi ✅
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: "8px",
              height: "42px",
              borderRadius: "8px",
              border: "none",
              background: loading
                ? "#334155"
                : "linear-gradient(90deg, #2563eb, #1d4ed8)",
              color: "#fff",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Yuklanmoqda..." : "Qo‘shish"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateManagers;

const Input = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label style={{ color: "#cbd5f5", fontSize: "13px" }}>{label}</label>
    <input
      {...props}
      required={props.name !== "photoUrl" && props.name !== "monthlySalary"}
      style={{
        height: "38px",
        borderRadius: "8px",
        border: "1px solid #334155",
        background: "#020617",
        color: "#fff",
        padding: "0 12px",
        outline: "none",
      }}
    />
  </div>
);
