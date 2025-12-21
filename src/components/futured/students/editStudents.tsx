// src/components/futured/students/EditStudent.tsx
import React, { useState, useEffect, type ChangeEvent, type FormEvent} from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const EditStudent: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '+998', password: '', dateOfBirth: '', startDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/students/${studentId}`);
        const s = res.data;
        const name = s.fullName.split(' ');
        setFormData({
          firstName: name[0] || '',
          lastName: name.slice(1).join(' ') || '',
          phone: s.phone,
          password: '',
          dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : '',
          startDate: s.startDate ? new Date(s.startDate).toISOString() : '',
        });
      } catch (err) {
        setMessage('Student topilmadi');
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [studentId]);

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
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth || null,
        startDate: formData.startDate,
      };
      if (formData.password) data.password = formData.password;
      await axios.patch(`http://localhost:3000/api/students/${studentId}`, data);
      setMessage('Yangilandi! ✅');
      setTimeout(() => navigate('/admin/students'), 2000);
    } catch (err) {
      setMessage('Xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const setNow = () => setFormData(prev => ({ ...prev, startDate: new Date().toISOString() }));

  if (fetching) return <p className="text-center py-10">Yuklanmoqda...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">✏️ Studentni Tahrirlash</h2>
          <Link to="/admin/students" className="text-blue-600 hover:underline">← Orqaga</Link>
        </div>

        {message && <p className={`text-center p-4 rounded mb-6 ${message.includes('Xato') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</p>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(['firstName', 'lastName', 'phone', 'password', 'dateOfBirth', 'startDate'] as const).map(field => (
            <div key={field}>
              <label className="block font-medium mb-2">
                {field === 'password' ? 'Yangi parol (ixtiyoriy)' : field.charAt(0).toUpperCase() + field.slice(1) + ' *'}
              </label>
              <input
                type={field === 'password' ? 'password' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 border-gray-300"
                disabled={loading}
              />
              {field === 'startDate' && <button type="button" onClick={setNow} className="mt-2 text-sm text-blue-600">Hozirgi vaqt</button>}
            </div>
          ))}
          <div className="md:col-span-2 text-center">
            <button type="submit" disabled={loading} className="px-10 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;