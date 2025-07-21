import React, { useState, useEffect } from 'react';
import { Plus, User, Phone, CreditCard, FileText, X } from 'lucide-react';
import { useCreateGuarantor } from './Dashboard/hooks/bag/useCreateGuarantor';

interface Employee {
  name: string;
  phone: string;
  residency: string;
  amount: string; // المبلغ المستحق
  expiryYear: string;
  expiryMonth: string;
  expiryDay: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
}

const CreateSponsorPage: React.FC = () => {
  const { createGuarantor, loading, error, isCreated } = useCreateGuarantor();
  // تحديث حالة الكفيل لتشمل تاريخ الميلاد
  const [sponsor, setSponsor] = useState({ name: '', phone: '', id: '', birthYear: '', birthMonth: '', birthDay: '' });
  const [employees, setEmployees] = useState<Employee[]>([
    { name: '', phone: '', residency: '', amount: '', expiryYear: '', expiryMonth: '', expiryDay: '', birthYear: '', birthMonth: '', birthDay: '' },

  ]);

  // دالة لتفريغ جميع الحقول
  const resetForm = () => {
    setSponsor({ name: '', phone: '', id: '', birthYear: '', birthMonth: '', birthDay: '' });
    setEmployees([{ name: '', phone: '', residency: '', amount: '', expiryYear: '', expiryMonth: '', expiryDay: '', birthYear: '', birthMonth: '', birthDay: '' }]);
  };

  // مراقبة حالة النجاح وتفريغ النموذج
  useEffect(() => {
    if (isCreated) {
      resetForm();
    }
  }, [isCreated]);

  const handleSponsorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSponsor({ ...sponsor, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newEmployees = [...employees];
    newEmployees[idx][e.target.name as keyof Employee] = e.target.value;
    setEmployees(newEmployees);
  };

  const addEmployee = () => {
    if (employees.length < 4) {
      setEmployees([...employees, { name: '', phone: '', residency: '', amount: '', expiryYear: '', expiryMonth: '', expiryDay: '', birthYear: '', birthMonth: '', birthDay: '' }]);
    }
  };

  const handleRemoveEmployee = (idx: number) => {
    setEmployees(employees.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    try {
      // تحويل تواريخ انتهاء الإقامة وتواريخ الميلاد
      const employeesWithFormattedDates = employees.map(emp => ({
        fullName: emp.name,
        phone: parseInt(emp.phone) || 0,
        residenceNumber: parseInt(emp.residency) || 0,
        residenceEndDate: emp.expiryYear && emp.expiryMonth && emp.expiryDay 
          ? `${emp.expiryYear}-${emp.expiryMonth.padStart(2, '0')}-${emp.expiryDay.padStart(2, '0')}`
          : '',
        birthDate: emp.birthYear && emp.birthMonth && emp.birthDay
          ? `${emp.birthYear}-${emp.birthMonth.padStart(2, '0')}-${emp.birthDay.padStart(2, '0')}`
          : '',
        price: parseInt(emp.amount) || 0
      }));
      
      // تجهيز البيانات بالشكل المطلوب
      const formData = {
        fullName: sponsor.name,
        phone: parseInt(sponsor.phone) || 0,
        cardNumber: parseInt(sponsor.id) || 0,
        birthDate: sponsor.birthYear && sponsor.birthMonth && sponsor.birthDay
          ? `${sponsor.birthYear}-${sponsor.birthMonth.padStart(2, '0')}-${sponsor.birthDay.padStart(2, '0')}`
          : '',
        workers: employeesWithFormattedDates
      };
      
      console.log('بيانات الوكيل مع العملاء:', formData);
      console.log('جاري إرسال البيانات إلى API...');
      
      await createGuarantor(formData);
      
      console.log('تم إرسال البيانات بنجاح');
    } catch (error) {
      console.error('خطأ في إرسال البيانات:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-12 md:pt-8" dir="rtl">
      <div className="max-w-9xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-t-2xl  shadow-2xl p-8 pb-0 ">
          <div className=' w-fit mx-auto'>
          <div className="flex items-center justify-center mb-2 w-fit mx-auto">
          
            <div className="bg-blue-100 p-3 rounded-full ml-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-xl  md:text-3xl font-bold text-gray-800">إنشاء وكيل وعملاء</h1>
          </div>
          <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Sponsor Information Section */}
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 shadow-lg   border-blue-200 p-8 mb-0">
            <h2 className="text-xl font-bold text-blue-700 mb-6 flex items-center gap-2">
              <User className="h-6 w-6 text-blue-500" />
              بيانات الكفيل
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الكفيل
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="أدخل اسم الكفيل"
                    value={sponsor.name}
                    onChange={handleSponsorChange}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الجوال
                </label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    placeholder="أدخل رقم الجوال"
                    value={sponsor.phone}
                    onChange={handleSponsorChange}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم البطاقة (Card Number)
                </label>
                <div className="relative">
                  <CreditCard className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="id"
                    placeholder="أدخل رقم البطاقة"
                    value={sponsor.id}
                    onChange={handleSponsorChange}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
              </div>
              {/* في قسم بيانات الكفيل أضف حقول تاريخ الميلاد */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الميلاد</label>
                <div className="flex gap-2">
                  <div className="relative w-full md:w-fit mb-2">
                    <select
                      name="birthYear"
                      value={sponsor.birthYear}
                      onChange={handleSponsorChange}
                      className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400"
                    >
                      <option value="">السنة</option>
                      {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                    </span>
                  </div>
                  <div className="relative w-full md:w-fit mb-2">
                    <select
                      name="birthMonth"
                      value={sponsor.birthMonth}
                      onChange={handleSponsorChange}
                      className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400"
                    >
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
                    <select
                      name="birthDay"
                      value={sponsor.birthDay}
                      onChange={handleSponsorChange}
                      className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400"
                    >
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
            </div>
          </div>

          {/* Employees Section */}
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 shadow-lg rounded-b-2xl   p-8">
            <div className="flex items-center justify-between mb-6 md:flex-row flex-col">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <div className="bg-purple-100 p-2 rounded-lg ml-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                بيانات العملاء
              </h2>
              
              <button
                type="button"
                onClick={addEmployee}
                disabled={employees.length >= 4}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  employees.length >= 4 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                }`}
              >
                <Plus className="h-4 w-4" />
                إضافة عميل جديد
              </button>
            </div>

            <div className="space-y-6">
              {employees.map((emp, idx) => (
                <div key={idx} className="relative bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
                  {/* زر حذف العامل */}
                  <button
                    type="button"
                    onClick={() => handleRemoveEmployee(idx)}
                    className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 z-10"
                    title="حذف العامل"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">اسم العامل</label>
                      <div className="relative">
                        <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="name"
                          placeholder="اسم العامل"
                          value={emp.name}
                          onChange={e => handleEmployeeChange(idx, e)}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white text-base placeholder-gray-400 pr-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="phone"
                          placeholder="رقم الجوال"
                          value={emp.phone}
                          onChange={e => handleEmployeeChange(idx, e)}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white text-base placeholder-gray-400 pr-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">رقم الإقامة</label>
                      <div className="relative">
                        <CreditCard className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="residency"
                          placeholder="رقم الإقامة"
                          value={emp.residency}
                          onChange={e => handleEmployeeChange(idx, e)}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white text-base placeholder-gray-400 pr-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ المستحق</label>
                      <div className="relative">
                        <FileText className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          name="amount"
                          placeholder="المبلغ المستحق"
                          value={emp.amount}
                          onChange={e => handleEmployeeChange(idx, e)}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white text-base placeholder-gray-400 pr-10"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                  {/* تاريخ الميلاد وتاريخ انتهاء الإقامة جنب بعض */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* تاريخ الميلاد */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الميلاد</label>
                      <div className="w-full flex flex-col gap-1 md:flex-row md:gap-1 items-center overflow-y-auto">
                        <div className="relative w-full md:w-fit mb-2">
                          <select
                            name="birthYear"
                            value={emp.birthYear}
                            onChange={e => handleEmployeeChange(idx, e)}
                            className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400"
                          >
                            <option value="">السنة</option>
                            {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                          </span>
                        </div>
                        <div className="relative w-full md:w-fit mb-2">
                          <select
                            name="birthMonth"
                            value={emp.birthMonth}
                            onChange={e => handleEmployeeChange(idx, e)}
                            className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400"
                          >
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
                          <select
                            name="birthDay"
                            value={emp.birthDay}
                            onChange={e => handleEmployeeChange(idx, e)}
                            className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400"
                          >
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
                    {/* تاريخ انتهاء الإقامة */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ انتهاء الإقامة</label>
                      <div className="w-full flex flex-col gap-1 md:flex-row md:gap-1 items-center overflow-y-auto">
                        <div className="relative w-full md:w-fit mb-2">
                          <select
                            name="expiryYear"
                            value={emp.expiryYear}
                            onChange={e => handleEmployeeChange(idx, e)}
                            className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400"
                          >
                            <option value="">السنة</option>
                            {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() + i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                          <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                          </span>
                        </div>
                        <div className="relative w-full md:w-fit mb-2">
                          <select
                            name="expiryMonth"
                            value={emp.expiryMonth}
                            onChange={e => handleEmployeeChange(idx, e)}
                            className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400"
                          >
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
                          <select
                            name="expiryDay"
                            value={emp.expiryDay}
                            onChange={e => handleEmployeeChange(idx, e)}
                            className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400"
                          >
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
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
            <div className="flex justify-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateSponsorPage;