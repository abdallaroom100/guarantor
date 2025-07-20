import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Phone, CreditCard, Users, Edit, Trash2, Plus } from 'lucide-react';
import { useGetGuarantor } from './Dashboard/hooks/bag/useGetGuarantor';
import { useUpdateGuarantor } from './Dashboard/hooks/bag/useUpdateGuarantor';
import hotToast from '../common/hotToast';

interface Worker {
  _id: string;
  fullName: string;
  phone: number;
  residenceNumber: number;
  residenceEndDate: string;
  price: number;
  notice?: string;
  paysHistory?: Record<string, number[]>;
  // حقول تاريخ انتهاء الإقامة المنفصلة
  expiryYear?: string;
  expiryMonth?: string;
  expiryDay?: string;
}

const EditGuarantorPage: React.FC = () => {
  const { cardNumber } = useParams<{ cardNumber: string }>();
  const navigate = useNavigate();
  const { loading, error, guarantor, refetch } = useGetGuarantor(cardNumber || '');
  const { updateGuarantor, loading: updateLoading, error: updateError } = useUpdateGuarantor();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    cardNumber: '',
    workers: [] as Worker[]
  });

  const [editingWorker, setEditingWorker] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));

  useEffect(() => {
    if (guarantor) {
      // تحويل تاريخ انتهاء الإقامة إلى حقول منفصلة
      const workersWithExpiryFields = guarantor.workers?.map(worker => {
        let expiryYear = '', expiryMonth = '', expiryDay = '';
        if (worker.residenceEndDate) {
          const date = new Date(worker.residenceEndDate);
          expiryYear = date.getFullYear().toString();
          expiryMonth = (date.getMonth() + 1).toString().padStart(2, '0');
          expiryDay = date.getDate().toString().padStart(2, '0');
        }
        
        return {
          ...worker,
          expiryYear,
          expiryMonth,
          expiryDay
        };
      }) || [];

      setFormData({
        fullName: guarantor.fullName || '',
        phone: guarantor.phone?.toString() || '',
        cardNumber: guarantor.cardNumber?.toString() || '',
        workers: workersWithExpiryFields
      });
    }
  }, [guarantor]);

  const handleGuarantorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleWorkerChange = (index: number, field: string, value: string) => {
    const updatedWorkers = [...formData.workers];
    updatedWorkers[index] = {
      ...updatedWorkers[index],
      [field]: field === 'phone' || field === 'residenceNumber'
        ? parseInt(value) || 0 
        : field === 'price'
        ? value === '' ? '' : parseInt(value) || 0
        : value
    };
    setFormData({
      ...formData,
      workers: updatedWorkers
    });
  };

  const addWorker = () => {
    if (formData.workers.length < 4) {
      const newWorker = {
        _id: `temp_${Date.now()}`,
        fullName: '',
        phone: 0,
        residenceNumber: 0,
        residenceEndDate: '',
        price: '',
        notice: '',
        paysHistory: {},
        expiryYear: '',
        expiryMonth: '',
        expiryDay: ''
      };
      setFormData({
        ...formData,
        workers: [
          ...formData.workers,
          {
            ...newWorker,
            price: typeof newWorker.price === 'string' && newWorker.price !== '' ? parseInt(newWorker.price) || 0 : 0
          }
        ]
      });
    }
  };

  const removeWorker = (index: number) => {
    const updatedWorkers = formData.workers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      workers: updatedWorkers
    });
  };

  // دالة للتحكم في paysHistory
  const handlePaymentStatusChange = (workerIndex: number, year: string, month: number, isPaid: boolean) => {
    const updatedWorkers = [...formData.workers];
    const worker = updatedWorkers[workerIndex];
    
    if (!worker.paysHistory) {
      worker.paysHistory = {};
    }
    
    if (!worker.paysHistory[year]) {
      worker.paysHistory[year] = [];
    }
    
    if (isPaid) {
      // إضافة الشهر إذا لم يكن موجود
      if (!worker.paysHistory[year].includes(month)) {
        worker.paysHistory[year].push(month);
        worker.paysHistory[year].sort((a, b) => a - b); // ترتيب الشهور
      }
    } else {
      // إزالة الشهر إذا كان موجود
      worker.paysHistory[year] = worker.paysHistory[year].filter(m => m !== month);
      
      // إزالة السنة إذا لم تعد تحتوي على شهور
      if (worker.paysHistory[year].length === 0) {
        delete worker.paysHistory[year];
      }
    }
    
    setFormData({
      ...formData,
      workers: updatedWorkers
    });
  };

  // دالة للتحقق من حالة الدفع لشهر معين
  const isMonthPaid = (worker: Worker, year: string, month: number) => {
    return worker.paysHistory?.[year]?.includes(month) || false;
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        fullName: formData.fullName,
        phone: parseInt(formData.phone) || 0,
        cardNumber: parseInt(formData.cardNumber) || 0,
        workers: formData.workers.map(worker => {
          // تجميع تاريخ انتهاء الإقامة من الحقول المنفصلة
          const residenceEndDate = worker.expiryYear && worker.expiryMonth && worker.expiryDay 
            ? `${worker.expiryYear}-${worker.expiryMonth}-${worker.expiryDay}`
            : worker.residenceEndDate;

          return {
            fullName: worker.fullName,
            phone: worker.phone,
            residenceNumber: worker.residenceNumber,
            residenceEndDate,
            price: typeof worker.price === 'string' && worker.price === '' ? 0 : worker.price,
            notice: worker.notice || '',
            paysHistory: worker.paysHistory || {}
          };
        })
      };

      await updateGuarantor(cardNumber || '', submitData);
      refetch();
    } catch (error) {
      console.error('Error updating guarantor:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatPhone = (phone: number) => {
    return phone?.toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-t-[10px] shadow-lg p-8 pb-0">
          <div className='w-fit mx-auto'>
            <div className="flex items-center justify-center mb-2 w-fit mx-auto">
              <div className="bg-emerald-100 p-3 rounded-full ml-4">
                <Edit className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-xl md:text-xl md:text-3xl font-bold text-gray-800">تعديل بيانات الكفيل</h1>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg p-5 md:p-8">
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              رجوع
            </button>
          </div>

          {/* Guarantor Information */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="bg-emerald-100 p-2 rounded-lg ml-3">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
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
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleGuarantorChange}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
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
                    value={formData.phone}
                    onChange={handleGuarantorChange}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم البطاقة
                </label>
                <div className="relative">
                  <CreditCard className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleGuarantorChange}
                    className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Workers Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg ml-3">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                بيانات العمال ({formData.workers.length} عامل)
              </h2>
              
              <button
                type="button"
                onClick={addWorker}
                disabled={formData.workers.length >= 4}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                  formData.workers.length >= 4 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                }`}
              >
                <Plus className="h-4 w-4" />
                إضافة عامل جديد
              </button>
            </div>

            {formData.workers.length > 0 ? (
              <div className="space-y-4">
                {formData.workers.map((worker, index) => (
                  <div key={worker._id || index} className="bg-white rounded-lg p-4 border border-gray-200 relative">
                    {/* زر حذف العامل */}
                    <button
                      type="button"
                      onClick={() => removeWorker(index)}
                      className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 z-10"
                      title="حذف العامل"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">اسم العامل</label>
                        <input
                          type="text"
                          value={worker.fullName}
                          onChange={(e) => handleWorkerChange(index, 'fullName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
                        <input
                          type="text"
                          value={worker.phone}
                          onChange={(e) => handleWorkerChange(index, 'phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">رقم الإقامة</label>
                        <input
                          type="text"
                          value={worker.residenceNumber}
                          onChange={(e) => handleWorkerChange(index, 'residenceNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ</label>
                        <input
                          type="number"
                          value={worker.price === 0 ? '' : worker.price}
                          onChange={(e) => handleWorkerChange(index, 'price', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    
                    {/* تاريخ انتهاء الإقامة */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ انتهاء الإقامة</label>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={worker.expiryYear || ''}
                          onChange={(e) => handleWorkerChange(index, 'expiryYear', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">السنة</option>
                          {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <select
                          value={worker.expiryMonth || ''}
                          onChange={(e) => handleWorkerChange(index, 'expiryMonth', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">الشهر</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month.toString().padStart(2, '0')}>{month}</option>
                          ))}
                        </select>
                        <select
                          value={worker.expiryDay || ''}
                          onChange={(e) => handleWorkerChange(index, 'expiryDay', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">اليوم</option>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day.toString().padStart(2, '0')}>{day}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* نظام المدفوعات */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">حالة المدفوعات</label>
                      
                      {/* اختيار السنة والشهر */}
                      <div className="flex gap-4 mb-4">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">السنة</label>
                          <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">الشهر</label>
                          <select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          >
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <option key={month} value={month.toString().padStart(2, '0')}>{month}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => handlePaymentStatusChange(index, selectedYear, parseInt(selectedMonth), !isMonthPaid(worker, selectedYear, parseInt(selectedMonth)))}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                              isMonthPaid(worker, selectedYear, parseInt(selectedMonth))
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {isMonthPaid(worker, selectedYear, parseInt(selectedMonth)) ? 'إلغاء الدفع' : 'تحديد كمدفوع'}
                          </button>
                        </div>
                      </div>

                      {/* عرض المدفوعات الحالية */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">المدفوعات المسجلة:</h4>
                        {Object.keys(worker.paysHistory || {}).length > 0 ? (
                          <div className="space-y-2">
                            {Object.entries(worker.paysHistory || {}).map(([year, months]) => (
                              <div key={year} className="text-sm">
                                <span className="font-medium text-gray-700">{year}:</span>
                                <span className="text-gray-600 mr-2">
                                  {months.sort((a, b) => a - b).map(month => month.toString().padStart(2, '0')).join(', ')}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">لا توجد مدفوعات مسجلة</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                لا يوجد عمال مسجلين
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={updateLoading}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 ${
                updateLoading 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700'
              }`}
            >
              <Save className="h-5 w-5" />
              {updateLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>

          {/* Error Display */}
          {updateError && (
            <div className="flex justify-center mt-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {updateError}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditGuarantorPage; 