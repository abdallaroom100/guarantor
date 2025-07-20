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
}

const CreateSponsorPage: React.FC = () => {
  const { createGuarantor, loading, error, isCreated } = useCreateGuarantor();
  const [sponsor, setSponsor] = useState({ name: '', phone: '', id: '' });
  const [employees, setEmployees] = useState<Employee[]>([
    { name: '', phone: '', residency: '', amount: '', expiryYear: '', expiryMonth: '', expiryDay: '' },

  ]);

  // دالة لتفريغ جميع الحقول
  const resetForm = () => {
    setSponsor({ name: '', phone: '', id: '' });
    setEmployees([{ name: '', phone: '', residency: '', amount: '', expiryYear: '', expiryMonth: '', expiryDay: '' }]);
  };

  // مراقبة حالة النجاح وتفريغ النموذج
  useEffect(() => {
    if (isCreated) {
      resetForm();
    }
  }, [isCreated]);

  const handleSponsorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSponsor({ ...sponsor, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = (idx: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newEmployees = [...employees];
    newEmployees[idx][e.target.name as keyof Employee] = e.target.value;
    setEmployees(newEmployees);
  };

  const addEmployee = () => {
    if (employees.length < 4) {
      setEmployees([...employees, { name: '', phone: '', residency: '', amount: '', expiryYear: '', expiryMonth: '', expiryDay: '' }]);
    }
  };

  const handleRemoveEmployee = (idx: number) => {
    setEmployees(employees.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    try {
      // تحويل تواريخ انتهاء الإقامة لصيغة YYYY-MM-DD
      const employeesWithFormattedDates = employees.map(emp => ({
        fullName: emp.name,
        phone: parseInt(emp.phone) || 0,
        residenceNumber: parseInt(emp.residency) || 0,
        residenceEndDate: emp.expiryYear && emp.expiryMonth && emp.expiryDay 
          ? `${emp.expiryYear}-${emp.expiryMonth.padStart(2, '0')}-${emp.expiryDay.padStart(2, '0')}`
          : '',
        price: parseInt(emp.amount) || 0
      }));
      
      // تجهيز البيانات بالشكل المطلوب
      const formData = {
        fullName: sponsor.name,
        phone: parseInt(sponsor.phone) || 0,
        cardNumber: parseInt(sponsor.id) || 0,
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
        <div className="bg-white rounded-t-[10px]  shadow-lg p-8 pb-0 ">
          <div className=' w-fit mx-auto'>
          <div className="flex items-center justify-center mb-2 w-fit mx-auto">
          
            <div className="bg-blue-100 p-3 rounded-full ml-4">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-xl md:text-xl md:text-3xl font-bold text-gray-800">إنشاء وكيل وعملاء</h1>
          </div>
          <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Sponsor Information Section */}
          <div className="bg-white shadow-lg p-8 mb-0 pb-0">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="bg-green-100 p-2  ml-3">
                <User className="h-5 w-5 text-green-600" />
              </div>
              بيانات الوكيل
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الوكيل
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="أدخل اسم الوكيل"
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
            </div>
          </div>

          {/* Employees Section */}
          <div className="bg-white rounded-b-xl shadow-lg p-5 md:p-8">
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
 
            <div className="overflow-x-auto">
              <div className="min-w-fit">
                {/* Table Header */}
                <div className="hidden md:!grid grid-cols-5 gap-4 bg-gray-50 p-4 rounded-t-lg border-b-2 border-gray-200 !w-full">
                  <div className="font-semibold text-gray-700 text-center">الاسم</div>
                  <div className="font-semibold text-gray-700 text-center">رقم الجوال</div>
                  <div className="font-semibold text-gray-700 text-center">رقم الإقامة</div>
                  <div className="font-semibold text-gray-700 text-center">المبلغ المستحق</div>
                  <div className="font-semibold text-gray-700 text-center">تاريخ انتهاء الإقامة</div>
                </div>

                {/* Table Body */}
                <div className="space-y-2 ">
                  {employees.map((emp, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3  relative bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                          {/* زر حذف العامل - للديسكتوب فقط */}
    <button
      type="button"
      onClick={() => handleRemoveEmployee(idx)}
      className="absolute top-1/4 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 z-10 hidden md:!block"
      title="حذف العامل"
    >
      <X className="h-4 w-4" />
    </button>
                      <div className="md:pr-8">
                        <label className="block md:hidden text-xs text-gray-500 mb-1">الاسم</label>
                        <input
                          type="text"
                          name="name"
                          placeholder="اسم العامل"
                          value={emp.name}
                          onChange={e => handleEmployeeChange(idx, e)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block md:hidden text-xs text-gray-500 mb-1">رقم الجوال</label>
                        <input
                          type="text"
                          name="phone"
                          placeholder="رقم الجوال"
                          value={emp.phone}
                          onChange={e => handleEmployeeChange(idx, e)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block md:hidden text-xs text-gray-500 mb-1">رقم الإقامة</label>
                        <input
                          type="text"
                          name="residency"
                          placeholder="رقم الإقامة"
                          value={emp.residency}
                          onChange={e => handleEmployeeChange(idx, e)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block md:hidden text-xs text-gray-500 mb-1">المبلغ المستحق</label>
                        <input
                          type="number"
                          name="amount"
                          placeholder="المبلغ المستحق"
                          value={emp.amount}
                          onChange={e => handleEmployeeChange(idx, e)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                          min="0"
                        />
                      </div>
                      {/* تاريخ انتهاء الإقامة */}
                      <div>
                        <label className="block md:hidden text-xs text-gray-500 mb-1">تاريخ انتهاء الإقامة</label>
                        <div className="w-full flex flex-col gap-1 md:flex-row md:gap-1 items-center overflow-y-auto">
                          <select
                            name="expiryYear"
                            value={emp.expiryYear}
                            onChange={e => handleEmployeeChange(idx, e)}
                            className="w-full md:w-fit px-1 py-2 border border-gray-300 rounded-md text-sm min-w-[60px]"
                          >
                            <option value="">السنة</option>
                            {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() + i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                          <select
                            name="expiryMonth"
                            value={emp.expiryMonth}
                            onChange={e => handleEmployeeChange(idx, e)}
                            className="w-full md:w-fit px-1 py-2 border border-gray-300 rounded-md text-sm min-w-[60px]"
                          >
                            <option value="">الشهر</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <option key={month} value={month.toString().padStart(2, '0')}>{month}</option>
                            ))}
                          </select>
                          <select
                            name="expiryDay"
                            value={emp.expiryDay}
                            onChange={e => handleEmployeeChange(idx, e)}
                            className="w-full md:w-fit px-1 py-2 border border-gray-300 rounded-md text-sm min-w-[60px]"
                          >
                            <option value="">اليوم</option>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                              <option key={day} value={day.toString().padStart(2, '0')}>{day}</option>
                            ))}
                                  </select>
      </div>
    </div>
    {/* زر حذف العامل - للموبايل فقط */}
    <div className="col-span-1 md:hidden mt-3">
      <button
        type="button"
        onClick={() => handleRemoveEmployee(idx)}
        className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        حذف العميل
      </button>
    </div>
  </div>
))}
                </div>
              </div>
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