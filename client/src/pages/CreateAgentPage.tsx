import React, { useState, useEffect } from 'react';
import { User, Phone, CreditCard } from 'lucide-react';
import axios from 'axios';

const CreateAgentPage: React.FC = () => {
  const [agent, setAgent] = useState({
    fullName: '',
    phone: '',
    cardNumber: '',
    managerName: '',
    managerPhone: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    passportNumber: '',
    visaType: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCreated, setIsCreated] = useState(false);

  const resetForm = () => {
    setAgent({ fullName: '', phone: '', cardNumber: '', managerName: '', managerPhone: '', birthYear: '', birthMonth: '', birthDay: '', passportNumber: '', visaType: '' });
  };

  useEffect(() => {
    if (isCreated) {
      resetForm();
    }
  }, [isCreated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAgent({ ...agent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setIsCreated(false);
    try {
      const birthDate = agent.birthYear && agent.birthMonth && agent.birthDay
        ? `${agent.birthYear}-${agent.birthMonth.padStart(2, '0')}-${agent.birthDay.padStart(2, '0')}`
        : '';
      await axios.post('/agent/create', {
        fullName: agent.fullName,
        phone: agent.phone,
        cardNumber: agent.cardNumber,
        managerName: agent.managerName,
        managerPhone: agent.managerPhone,
        birthDate,
        passportNumber: agent.passportNumber,
        visaType: agent.visaType
      });
      setIsCreated(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-12 md:pt-8 rounded-2xl" dir="rtl">
      <div className="max-w-7xl mx-auto rounded-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50  shadow-2xl p-8 pb-0 ">
          <div className='w-fit mx-auto'>
            <div className="flex items-center justify-center mb-2 w-fit mx-auto">
              <div className="bg-blue-100 p-3 rounded-full ml-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">إنشاء طلب تأشيرة </h1>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 shadow-lg border-blue-200 p-8  rounded-b-2xl mb-5 md:mb-8">
            <h2 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-blue-500" />
              بيانات طالب التأشيرة
            </h2>
            <div className="grid lg:grid-cols-2  xl:grid-cols-3 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم طالب التأشيرة</label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input type="text" name="fullName" placeholder="اسم الكفيل" value={agent.fullName} onChange={handleChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white" required />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجوال</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input type="text" name="phone" placeholder="رقم الجوال" value={agent.phone} onChange={handleChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white" required />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الحدود</label>
                <div className="relative">
                  <CreditCard className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input type="text" name="cardNumber" placeholder="رقم الحدود" value={agent.cardNumber} onChange={handleChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white" required />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الميلاد</label>
                <div className="flex gap-2">
                  <div className="relative w-full md:w-fit mb-2">
                    <select name="birthYear" value={agent.birthYear} onChange={handleChange} className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400">
                      <option value="">السنة</option>
                      {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </div>
                  <div className="relative w-full md:w-fit mb-2 ">
                    <select name="birthMonth" value={agent.birthMonth} onChange={handleChange} className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400">
                      <option value="">الشهر</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month.toString().padStart(2, '0')}>{month}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </div>
                  <div className="relative w-full md:w-fit mb-2">
                    <select name="birthDay" value={agent.birthDay} onChange={handleChange} className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400">
                      <option value="">اليوم</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day.toString().padStart(2, '0')}>{day}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">اسم الوكيل</label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input type="text" name="managerName" placeholder="اسم الوكيل" value={agent.managerName} onChange={handleChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white" required />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم جوال الوكيل</label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input type="text" name="managerPhone" placeholder="رقم جوال الوكيل" value={agent.managerPhone} onChange={handleChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white" required />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجواز</label>
                <div className="relative">
                  <input type="text" name="passportNumber" placeholder="رقم الجواز" value={agent.passportNumber} onChange={handleChange} className="w-full pr-4 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white" />
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع التأشيرة</label>
                <div className="relative">
                  <select name="visaType" value={agent.visaType} onChange={handleChange} className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400">
                    <option value="">اختر نوع التأشيرة</option>
                    <option value="زيارة">زيارة</option>
                    <option value="عمرة">عمرة</option>
                    <option value="عمل">عمل</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* زر الحفظ */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`px-12 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 ${
                loading 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {loading ? 'جاري الحفظ...' : 'حفظ البيانات'}
            </button>
          </div>
          {/* Error Display */}
          {error && (
            <div className="flex justify-center mt-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            </div>
          )}
          {isCreated && (
            <div className="flex justify-center mt-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">تم إنشاء الوكيل بنجاح</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAgentPage; 