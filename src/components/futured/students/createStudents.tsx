// src/components/futured/students/CreateStudent.tsx
import React, { useState, type ChangeEvent, type FormEvent, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

const CreateStudent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '+998', password: '', dateOfBirth: '', startDate: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      let cleaned = value.replace(/[^\d+]/g, '');
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
    if (!/^\+998\d{9}$/.test(formData.phone)) err.phone = 'Toʻgʻri telefon kiriting';
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
      await axios.post('http://localhost:3000/api/students', {
        ...formData,
        dateOfBirth: formData.dateOfBirth || null,
      });
      setMessage('Student muvaffaqiyatli qoʻshildi! ✅');
      setFormData({ firstName: '', lastName: '', phone: '+998', password: '', dateOfBirth: '', startDate: '' });
      setTimeout(() => navigate('/admin/students'), 2000);
    } catch (err) {
      const msg = (err as AxiosError<{ message?: string }>).response?.data?.message || 'Xato';
      setMessage(`Xato: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const setNow = () => setFormData(prev => ({ ...prev, startDate: new Date().toISOString() }));

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">➕ Yangi Student Qoʻshish</h2>
          <Link to="/admin/students" className="text-blue-600 hover:underline">← Orqaga</Link>
        </div>

        {message && <p className={`text-center p-4 rounded mb-6 ${message.includes('Xato') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(['firstName', 'lastName', 'phone', 'password', 'dateOfBirth', 'startDate'] as const).map(field => (
            <div key={field}>
              <label className="block font-medium mb-2">{field === 'firstName' ? 'Ism *' : field === 'lastName' ? 'Familiya *' : field === 'phone' ? 'Telefon *' : field === 'password' ? 'Parol *' : field === 'dateOfBirth' ? 'Tugʻilgan sana' : 'Boshlanish sanasi *'}</label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
                disabled={loading}
              />
              {field === 'startDate' && <button type="button" onClick={setNow} className="mt-2 text-sm text-blue-600">Hozirgi vaqt</button>}
              {errors[field] && <span className="text-red-600 text-sm">{errors[field]}</span>}
            </div>
          ))}
          <div className="md:col-span-2 text-center">
            <button type="submit" disabled={loading} className="px-10 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70">
              {loading ? 'Yuborilmoqda...' : 'Qoʻshish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStudent;