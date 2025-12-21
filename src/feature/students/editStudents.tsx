// src/components/futured/students/EditStudent.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '@/service/api';
import { ArrowLeft, Clock } from 'lucide-react';

const EditStudent: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '+998',
    password: '',
    dateOfBirth: '',
    startDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!studentId) {
      setMessage({ text: 'Student ID topilmadi', type: 'error' });
      setFetching(false);
      return;
    }

    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/${studentId}`);
        const s = res.data;

        const nameParts = s.fullName?.trim().split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setFormData({
          firstName,
          lastName,
          phone: s.phone || '+998',
          password: '',
          dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : '',
          startDate: s.startDate ? new Date(s.startDate).toISOString().slice(0, 16) : '',
        });
      } catch (err) {
        setMessage({ text: 'Student maʼlumotlari yuklanmadi', type: 'error' });
        console.error('Fetch error:', err);
      } finally {
        setFetching(false);
      }
    };

    fetchStudent();
  }, [studentId]);

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

      setMessage({ text: 'Maʼlumotlar muvaffaqiyatli yangilandi! ✅', type: 'success' });
      setTimeout(() => navigate('/admin/students'), 2500);
    } catch (err) {
      setMessage({ text: 'Yangilashda xato yuz berdi', type: 'error' });
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const setCurrentTime = () => {
    const now = new Date().toISOString().slice(0, 16);
    setFormData(prev => ({ ...prev, startDate: now }));
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin w-20 h-20 border-8 border-blue-500 border-t-transparent rounded-full" />
          <p className="mt-8 text-2xl text-gray-600 font-medium">Maʼlumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-10 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              {/* FAQAT TAHRIRLASH IKONKASI — YOZUV YO‘Q */}
              <div className="text-5xl sm:text-6xl">
                
              </div>

              {/* ID ko‘rsatish (ixtiyoriy, agar kerak bo‘lmasa olib tashlang) */}
              <p className="text-blue-100 text-lg">ID: {studentId}</p>

              {/* ORQAGA QAYTISH IKONKASI */}
              <Link
                to="/admin/students"
                title="Roʻyxatga qaytish"
                className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl hover:bg-white/30 transition-all duration-200 flex items-center justify-center shadow-lg group"
              >
                <ArrowLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 lg:p-12">
            {message && (
              <div
                className={`p-6 rounded-2xl text-center text-xl font-bold mb-10 shadow-lg ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-red-100 text-red-700 border-2 border-red-300'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {(['firstName', 'lastName', 'phone', 'password', 'dateOfBirth', 'startDate'] as const).map((field) => (
                <div key={field} className="space-y-4">
                  <label className="block text-xl font-semibold text-gray-800">
                    {field === 'firstName' && 'Ism *'}
                    {field === 'lastName' && 'Familiya *'}
                    {field === 'phone' && 'Telefon raqami *'}
                    {field === 'password' && 'Yangi parol (ixtiyoriy)'}
                    {field === 'dateOfBirth' && 'Tugʻilgan sana'}
                    {field === 'startDate' && 'Boshlanish sanasi *'}
                  </label>

                  <input
                    type={
                      field === 'password' ? 'password' :
                      field === 'phone' ? 'tel' :
                      field === 'dateOfBirth' ? 'date' :
                      field === 'startDate' ? 'datetime-local' :
                      'text'
                    }
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-6 py-5 text-lg border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 transition-all hover:shadow-md"
                    disabled={loading}
                    required={field === 'firstName' || field === 'lastName' || field === 'phone' || field === 'startDate'}
                  />

                  {field === 'phone' && (
                    <p className="text-sm text-gray-500">+998 bilan boshlanib, 9 ta raqam</p>
                  )}
                  {field === 'dateOfBirth' && (
                    <p className="text-sm text-gray-500">Masalan: 2000-10-29</p>
                  )}
                  {field === 'startDate' && (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={setCurrentTime}
                        disabled={loading}
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition shadow-md font-medium"
                      >
                        <Clock className="w-5 h-5" />
                        Hozirgi vaqt
                      </button>
                      <p className="text-sm text-gray-500">Sana va vaqt tanlang</p>
                    </div>
                  )}
                </div>
              ))}

              <div className="md:col-span-2 flex justify-center mt-12">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-20 py-6 bg-gradient-to-r from-green-600 to-green-700 text-white text-2xl font-bold rounded-3xl hover:from-green-700 hover:to-green-800 disabled:opacity-70 transition-all shadow-2xl flex items-center gap-6"
                >
                  {loading && <span className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />}
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;