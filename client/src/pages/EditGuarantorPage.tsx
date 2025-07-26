import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Phone, CreditCard, Users, Edit, Trash2, Plus } from 'lucide-react';
import { useGetGuarantor } from './Dashboard/hooks/bag/useGetGuarantor';
import { useUpdateGuarantor } from './Dashboard/hooks/bag/useUpdateGuarantor';
import { useDeleteGuarantorPermanently } from './Dashboard/hooks/useDeleteGuarantorPermanently';
import hotToast from '../common/hotToast';
import Modal from '../components/Modal';
import axios from 'axios';
// @ts-ignore
import HijriDate from 'hijri-date';
import moment from 'moment-hijri';

interface Worker {
  _id: string;
  fullName: string;
  phone: string;
  residenceNumber: string;
  residenceEndDate: string;
  price: string;
  notice?: string;
  paysHistory?: Record<string, number[]>;
  expiryYear?: string;
  expiryMonth?: string;
  expiryDay?: string;
  birthDate?: string;
  birthYear?: string;
  birthMonth?: string;
  birthDay?: string;
}

interface Guarantor {
  _id: string;
  fullName: string;
  phone: string;
  cardNumber: string;
  birthDate?: string;
  birthYear?: string;
  birthMonth?: string;
  birthDay?: string;
  workers: Worker[];
}

// دالة تحويل ميلادي إلى هجري
function gregorianToHijri(dateString: string) {
  if (!dateString) return { year: '', month: '', day: '' };
  const m = moment(dateString, 'YYYY-MM-DD').format('iYYYY-iMM-iDD');
  const [year, month, day] = m.split('-');
  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];
  const monthName = hijriMonths[parseInt(month, 10) - 1] || '';
  return { year, month: monthName, day };
}

// استيراد HijriDate وقائمة hijriMonths كما في صفحة الإنشاء
const hijriMonths = [
  'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
  'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
];
function hijriToGregorian(year: string, monthName: string, day: string) {
  let monthIndex = hijriMonths.indexOf(monthName);
  if (monthIndex === -1) monthIndex = 0;
  try {
    const hijriDate = new HijriDate(Number(year), monthIndex, Number(day));
    if (hijriDate.__proxy__ instanceof Date) {
      const gDate = hijriDate.__proxy__;
      const gYear = gDate.getFullYear();
      const gMonth = gDate.getMonth() + 2;
      const gDay = gDate.getDate();
      const result = `${gYear}-${String(gMonth).padStart(2, '0')}-${String(gDay).padStart(2, '0')}`;
      return result;
    } else if (typeof hijriDate.toGregorian === 'function') {
      const g = hijriDate.toGregorian();
      const result = `${g.gy}-${String(g.gm).padStart(2, '0')}-${String(g.gd).padStart(2, '0')}`;
      return result;
    } else {
      return '';
    }
  } catch (e) {
    return '';
  }
}

const EditGuarantorPage: React.FC = () => {
  const { cardNumber } = useParams<{ cardNumber: string }>();
  const navigate = useNavigate();
  const { loading, error, guarantor, refetch } = useGetGuarantor(cardNumber || '');
  const { updateGuarantor, loading: updateLoading, error: updateError } = useUpdateGuarantor();
  const { deleteGuarantorPermanently, loading: deletePermanentLoading, error: deletePermanentError, success: deletePermanentSuccess } = useDeleteGuarantorPermanently();

  // تحديث حالة الكفيل لتشمل تاريخ الميلاد
  const [formData, setFormData] = useState({
    _id: '', // Add _id to formData
    fullName: '',
    phone: '',
    cardNumber: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    workers: [] as Worker[]
  });

  // إضافة حالة الأخطاء للحقول الرقمية للكفيل
  const [guarantorErrors, setGuarantorErrors] = useState({
    phone: '',
    cardNumber: ''
  });
  // إضافة حالة الأخطاء للحقول الرقمية للعمال (مصفوفة)
  const [workerErrors, setWorkerErrors] = useState<{phone: string; residenceNumber: string; price: string;}[]>([]);

  const [editingWorker, setEditingWorker] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(formData.workers.length / itemsPerPage);
  const paginatedWorkers = formData.workers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await axios.post(`/guarantor/temp/${formData._id}`);
      setDeleteLoading(false);
      setShowDeleteModal(false);
      navigate(-1);
    } catch (err: any) {
      setDeleteError('حدث خطأ أثناء الحذف');
      setDeleteLoading(false);
    }
  };

  const handleDeletePermanently = async () => {
    try {
      await deleteGuarantorPermanently(formData._id);
      setShowPermanentDeleteModal(false);
      setTimeout(() => {
        navigate(-1);
      }, 200);
    } catch {}
  };

  useEffect(() => {
    if (guarantor) {
      // تحويل تاريخ انتهاء الإقامة وتاريخ الميلاد إلى حقول منفصلة
      const workersWithExpiryFields = guarantor.workers?.map(worker => {
        let expiryYear = '', expiryMonth = '', expiryDay = '';
        let birthYear = '', birthMonth = '', birthDay = '';
        
        if (worker.residenceEndDate) {
          // تحويل ميلادي إلى هجري
          const hijri = gregorianToHijri(worker.residenceEndDate);
          expiryYear = hijri.year;
          expiryMonth = hijri.month;
          expiryDay = hijri.day;
        
        }
        if (worker.birthDate) {
          const [y, m, d] = worker.birthDate.split('-');
          birthYear = y || '';
          birthMonth = m || '';
          birthDay = d || '';
        }
        return {
          ...worker,
          phone: worker.phone?.toString() || '',
          residenceNumber: worker.residenceNumber?.toString() || '',
          price: worker.price?.toString() || '',
          expiryYear,
          expiryMonth,
          expiryDay,
          birthYear,
          birthMonth,
          birthDay
        };
      }) || [];
      let birthYear = '', birthMonth = '', birthDay = '';
      if (guarantor.birthDate) {
        const [y, m, d] = guarantor.birthDate.split('-');
        birthYear = y || '';
        birthMonth = m || '';
        birthDay = d || '';
      }
      setFormData({
        _id: guarantor._id, // Set _id
        fullName: guarantor.fullName || '',
        phone: guarantor.phone?.toString() || '',
        cardNumber: guarantor.cardNumber?.toString() || '',
        birthYear,
        birthMonth,
        birthDay,
        workers: workersWithExpiryFields as Worker[]
      });
    }
  }, [guarantor]);

  const handleGuarantorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'phone' || name === 'cardNumber') {
      if (/^\d*$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value
        });
        setGuarantorErrors({
          ...guarantorErrors,
          [name]: ''
        });
      } else {
        setGuarantorErrors({
          ...guarantorErrors,
          [name]: 'يجب إدخال أرقام فقط'
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleWorkerChange = (index: number, field: string, value: string) => {
    const updatedWorkers = [...formData.workers];
    const updatedErrors = [...workerErrors];
    if (field === 'phone' || field === 'residenceNumber' || field === 'price') {
      if (/^\d*$/.test(value)) {
        updatedWorkers[index] = {
          ...updatedWorkers[index],
          [field]: value
        };
        if (!updatedErrors[index]) updatedErrors[index] = {phone: '', residenceNumber: '', price: ''};
        updatedErrors[index][field] = '';
      } else {
        if (!updatedErrors[index]) updatedErrors[index] = {phone: '', residenceNumber: '', price: ''};
        updatedErrors[index][field] = 'يجب إدخال أرقام فقط';
      }
    } else {
      updatedWorkers[index] = {
        ...updatedWorkers[index],
        [field]: value
      };
    }
    setFormData({
      ...formData,
      workers: updatedWorkers
    });
    setWorkerErrors(updatedErrors);
  };

  const addWorker = () => {
    if (formData.workers.length < 4) {
      const newWorker = {
        _id: `temp_${Date.now()}`,
        fullName: '',
        phone: '',
        residenceNumber: '',
        residenceEndDate: '',
        price: '',
        notice: '',
        paysHistory: {},
        expiryYear: '',
        expiryMonth: '',
        expiryDay: '',
        birthYear: '',
        birthMonth: '',
        birthDay: ''
      };
      setFormData({
        ...formData,
        workers: [
          ...formData.workers,
          newWorker
        ]
      });
      setWorkerErrors([...workerErrors, {phone: '', residenceNumber: '', price: ''}]);
    }
  };

  const removeWorker = (index: number) => {
    const updatedWorkers = formData.workers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      workers: updatedWorkers
    });
    setWorkerErrors(workerErrors.filter((_, i) => i !== index));
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
    // تحقق من عدم وجود أخطاء
    if (guarantorErrors.phone || guarantorErrors.cardNumber || workerErrors.some(e => e && (e.phone || e.residenceNumber || e.price))) {
      hotToast({type: 'error', message: 'يرجى تصحيح جميع الأخطاء قبل الحفظ'});
      return;
    }
    try {
      const submitData = {
        fullName: formData.fullName,
        phone: formData.phone,
        cardNumber: formData.cardNumber,
        birthDate: formData.birthYear && formData.birthMonth && formData.birthDay
          ? `${formData.birthYear}-${formData.birthMonth.padStart(2, '0')}-${formData.birthDay.padStart(2, '0')}`
          : '',
        workers: formData.workers.map(worker => {
          // تحويل هجري إلى ميلادي
          const residenceEndDate = worker.expiryYear && worker.expiryMonth && worker.expiryDay
            ? hijriToGregorian(worker.expiryYear, worker.expiryMonth, worker.expiryDay)
            : worker.residenceEndDate;
          const birthDate = worker.birthYear && worker.birthMonth && worker.birthDay
            ? `${worker.birthYear}-${worker.birthMonth.padStart(2, '0')}-${worker.birthDay.padStart(2, '0')}`
            : '';
          return {
            fullName: worker.fullName,
            phone: worker.phone,
            residenceNumber: worker.residenceNumber,
            residenceEndDate,
            birthDate,
            price: worker.price,
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

  const arabicMonths = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  // قائمة الأشهر الهجرية
  const hijriStartYear = 1447;
  const hijriYears = Array.from({ length: 16 }, (_, i) => (hijriStartYear + i).toString());

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
              <h1 className="text-xl  md:text-3xl font-bold text-gray-800">تعديل بيانات الكفيل</h1>
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
                {guarantorErrors.phone && (
                  <div className="text-red-500 text-xs mt-1">{guarantorErrors.phone}</div>
                )}
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهوية
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
                {guarantorErrors.cardNumber && (
                  <div className="text-red-500 text-xs mt-1">{guarantorErrors.cardNumber}</div>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الميلاد</label>
                <div className="flex gap-2">
                  <select name="birthYear" value={formData.birthYear} onChange={handleGuarantorChange} className="w-1/3 px-2 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="">السنة</option>
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <select name="birthMonth" value={formData.birthMonth} onChange={handleGuarantorChange} className="w-1/3 px-2 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="">الشهر</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month.toString().padStart(2, '0')}>{month}</option>
                    ))}
                  </select>
                  <select name="birthDay" value={formData.birthDay} onChange={handleGuarantorChange} className="w-1/3 px-2 py-2 border border-gray-300 rounded-md text-sm">
                    <option value="">اليوم</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day.toString().padStart(2, '0')}>{day}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Workers Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-0 md:px-6 p-6 border border-blue-200 mb-6 ">
            <div className="flex items-center justify-between mb-6 md:flex-row flex-col">
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

            {paginatedWorkers.length > 0 ? (
              <div className="space-y-4">
                {paginatedWorkers.map((worker, index) => (
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

                    <div className="grid md:grid-cols-2 mt-2 lg:grid-cols-4 gap-4">
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
                        {workerErrors[index] && workerErrors[index].phone && (
                          <div className="text-red-500 text-xs mt-1">{workerErrors[index].phone}</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">رقم الإقامة</label>
                        <input
                          type="text"
                          value={worker.residenceNumber}
                          onChange={(e) => handleWorkerChange(index, 'residenceNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {workerErrors[index] && workerErrors[index].residenceNumber && (
                          <div className="text-red-500 text-xs mt-1">{workerErrors[index].residenceNumber}</div>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ</label>
                        <input
                          type="text"
                          value={worker.price}
                          onChange={(e) => handleWorkerChange(index, 'price', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {workerErrors[index] && workerErrors[index].price && (
                          <div className="text-red-500 text-xs mt-1">{workerErrors[index].price}</div>
                        )}
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
                          {hijriYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <select
                          value={worker.expiryMonth || ''}
                          onChange={(e) => handleWorkerChange(index, 'expiryMonth', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">الشهر</option>
                          {hijriMonths.map((month, i) => (
                            <option key={month} value={month}>{month}</option>
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

                    {/* تاريخ الميلاد */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الميلاد</label>
                      <div className="w-full flex flex-col gap-1 md:flex-row md:gap-1 items-center overflow-y-auto">
                        <select
                          name="birthYear"
                          value={worker.birthYear || ''}
                          onChange={e => handleWorkerChange(index, 'birthYear', e.target.value)}
                          className="w-full md:w-fit px-1 py-2 border border-gray-300 rounded-md text-sm min-w-[60px]"
                        >
                          <option value="">السنة</option>
                          {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>
                        <select
                          name="birthMonth"
                          value={worker.birthMonth || ''}
                          onChange={e => handleWorkerChange(index, 'birthMonth', e.target.value)}
                          className="w-full md:w-fit px-1 py-2 border border-gray-300 rounded-md text-sm min-w-[60px]"
                        >
                          <option value="">الشهر</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month.toString().padStart(2, '0')}>{month}</option>
                          ))}
                        </select>
                        <select
                          name="birthDay"
                          value={worker.birthDay || ''}
                          onChange={e => handleWorkerChange(index, 'birthDay', e.target.value)}
                          className="w-full md:w-fit px-1 py-2 border border-gray-300 rounded-md text-sm min-w-[60px]"
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
                      <div className="flex justify-between md:justify-start md:gap-4 mb-4">
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
                            className={`px-4 py-2 rounded-md text-[12px] font-medium transition-all duration-200 ${
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
                              <div key={year} className="text-sm mb-1">
                                <span className="font-medium text-gray-700 mr-2">{year}:</span>
                                <span className="flex flex-wrap gap-1">
                                  {months.sort((a, b) => a - b).map(month => (
                                    <span key={month} className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs font-semibold border border-blue-200">
                                      {arabicMonths[Number(month) - 1]}
                                    </span>
                                  ))}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">لا توجد مدفوعات مسجلة</p>
                        )}
                      </div>
                    </div>

                    {/* الملاحظة */}
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">الملاحظة</label>
                      <input
                        type="text"
                        value={worker.notice || ''}
                        onChange={e => handleWorkerChange(index, 'notice', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="أدخل ملاحظة للعامل (اختياري)"
                      />
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              >
                السابق
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center flex-col items-center gap-2 mt-8">
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
            <div className='flex gap-2'>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={deleteLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 bg-gradient-to-r from-orange-600 to-yellow-600 text-white hover:from-orange-700 hover:to-yellow-700"
              >
                <Trash2 className="h-5 w-5" />
                {deleteLoading ? 'جاري الحذف...' : 'حذف مؤقت'}
              </button>
              <button
                type="button"
                onClick={() => setShowPermanentDeleteModal(true)}
                disabled={deletePermanentLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700"
              >
                <Trash2 className="h-5 w-5" />
                {deletePermanentLoading ? 'جاري الحذف...' : 'حذف نهائي'}
              </button>
            </div>
          </div>

          {/* Error Display */}
          {updateError && (
            <div className="flex justify-center mt-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {updateError}
              </div>
            </div>
          )}
          {deletePermanentError && (
            <div className="flex justify-center mt-4">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {deletePermanentError}
              </div>
            </div>
          )}
          {deletePermanentSuccess && (
            <div className="flex justify-center mt-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                تم حذف الكفيل نهائياً بنجاح
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold text-gray-800">تأكيد الحذف المؤقت</div>
          <div className="mb-6 text-gray-600">هل أنت متأكد أنك تريد حذف هذا الكفيل مؤقتاً؟ يمكنك إرجاعه لاحقاً من صفحة الكفلاء المحذوفين.</div>
          <div className="flex justify-center gap-4">
            <button onClick={handleDelete} disabled={deleteLoading} className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-bold hover:from-orange-700 hover:to-yellow-700 transition">
              {deleteLoading ? 'جاري الحذف...' : 'تأكيد الحذف المؤقت'}
            </button>
            <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition">إلغاء</button>
          </div>
          {deleteError && <div className="text-red-600 mt-4 font-bold">{deleteError}</div>}
        </div>
      </Modal>

      <Modal isOpen={showPermanentDeleteModal} onClose={() => setShowPermanentDeleteModal(false)}>
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold text-red-800">تأكيد الحذف النهائي</div>
          <div className="mb-6 text-gray-600">هل أنت متأكد أنك تريد حذف هذا الكفيل نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.</div>
          <div className="flex justify-center gap-4">
            <button onClick={handleDeletePermanently} disabled={deletePermanentLoading} className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold hover:from-red-700 hover:to-pink-700 transition">
              {deletePermanentLoading ? 'جاري الحذف...' : 'تأكيد الحذف النهائي'}
            </button>
            <button onClick={() => setShowPermanentDeleteModal(false)} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition">إلغاء</button>
          </div>
          {deletePermanentError && <div className="text-red-600 mt-4 font-bold">{deletePermanentError}</div>}
        </div>
      </Modal>
    </div>
  );
};

export default EditGuarantorPage; 