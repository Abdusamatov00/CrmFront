// src/components/futured/students/CreateStudent.tsx
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/service/api'; // ← Muhim! api import qiling

const CreateStudent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '+998',
    password: '',
    dateOfBirth: '',
    startDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const cleaned = value.replace(/[^\d+]/g, '');
      if (cleaned.length > 0 && !cleaned.startsWith('+998')) return;
      if (cleaned.length > 13) return;
      setFormData(prev => ({ ...prev, phone: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.firstName.trim()) err.firstName = 'Ism kiritish shart';
    if (!formData.lastName.trim()) err.lastName = 'Familiya kiritish shart';
    if (!/^\+998\d{9}$/.test(formData.phone)) err.phone = 'Toʻgʻri telefon kiriting (+998XXXXXXXXX)';
    if (formData.password.length < 6) err.password = 'Parol kamida 6 belgi';
    if (!formData.startDate) err.startDate = 'Boshlanish sanasi shart';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMessage(null);

    try {
      await api.post('/students', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth || null,
        startDate: formData.startDate,
      });

      setMessage('Student muvaffaqiyatli qoʻshildi! ✅');
      setFormData({
        firstName: '',
        lastName: '',
        phone: '+998',
        password: '',
        dateOfBirth: '',
        startDate: '',
      });

      setTimeout(() => {
        navigate('/admin/students');
      }, 2000);
    } catch (err: unknown) {
      const msg = 'server bilan boglanib bolmadi';
      setMessage(`Xato: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const setNow = () => {
    setFormData(prev => ({ ...prev, startDate: new Date().toISOString() }));
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            ➕ Yangi Student Qoʻshish
          </h2>
          <Link
            to="/admin/students"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition shadow-md"
          >
            ← Roʻyxatga qaytish
          </Link>
        </div>

        {message && (
          <div
            className={`p-6 rounded-xl text-center font-semibold text-lg mb-8 shadow-md ${
              message.includes('Xato') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(['firstName', 'lastName', 'phone', 'password', 'dateOfBirth', 'startDate'] as const).map((field) => (
            <div key={field} className="space-y-3">
              <label className="block text-lg font-medium text-gray-700">
                {field === 'firstName' && 'Ism *'}
                {field === 'lastName' && 'Familiya *'}
                {field === 'phone' && 'Telefon raqami *'}
                {field === 'password' && 'Parol *'}
                {field === 'dateOfBirth' && 'Tugʻilgan sana'}
                {field === 'startDate' && 'Boshlanish sanasi *'}
              </label>
              <input
                type={field === 'password' ? 'password' : field === 'phone' ? 'tel' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={
                  field === 'phone' ? '+998901234567' :
                  field === 'dateOfBirth' ? '2000-10-29' :
                  field === 'startDate' ? '2025-01-01T10:00:00Z' :
                  field === 'password' ? 'Kamida 6 belgi' : ''
                }
                className={`w-full px-6 py-4 text-lg border-2 rounded-xl focus:outline-none focus:border-blue-500 transition ${
                  errors[field] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {field === 'phone' && <small className="text-gray-500">+998 bilan boshlanib, 9 ta raqam</small>}
              {field === 'dateOfBirth' && <small className="text-gray-500">Masalan: 2000-10-29</small>}
              {field === 'startDate' && (
                <>
                  <button
                    type="button"
                    onClick={setNow}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition shadow-md"
                  >
                    Hozirgi vaqtni tanlash
                  </button>
                  <small className="block text-gray-500 mt-2">ISO format: YYYY-MM-DDTHH:MM:SSZ</small>
                </>
              )}
              {errors[field] && <span className="text-red-600 font-medium">{errors[field]}</span>}
            </div>
          ))}

          <div className="md:col-span-2 text-center mt-10">
            <button
              type="submit"
              disabled={loading}
              className="px-16 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-2xl font-bold rounded-2xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 transition shadow-2xl flex items-center gap-4 mx-auto"
            >
              {loading && <span className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></span>}
              {loading ? 'Qoʻshilmoqda...' : 'Student Qoʻshish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;