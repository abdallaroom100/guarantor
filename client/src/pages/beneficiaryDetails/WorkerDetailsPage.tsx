import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, CreditCard, Calendar, DollarSign, FileText, Edit, Trash2, Plus } from 'lucide-react';
import hotToast from '../../common/hotToast';

interface Worker {
  _id: string;
  fullName: string;
  phone: number;
  residenceNumber: number;
  residenceEndDate: string;
  price: number;
  notice?: string;
  paysHistory?: Record<string, number[]>;
  guarantorName?: string;
  guarantorCardNumber?: number;
  guarantorPhone?: number;
}

const WorkerDetailsPage: React.FC = () => {
  const { residenceNumber } = useParams<{ residenceNumber: string }>();
  const navigate = useNavigate();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));

  useEffect(() => {
    fetchWorkerDetails();
  }, [residenceNumber]);

  const fetchWorkerDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/guarantor/find/worker/${residenceNumber}`);
      if (!response.ok) {
        throw new Error('لم يتم العثور على العامل');
      }
      const data = await response.json();
      setWorker(data);
    } catch (error: any) {
      setError(error.message);
      hotToast({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatPhone = (phone: number) => {
    return phone?.toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
  };

  const getResidenceStatus = (endDate: string) => {
    const today = new Date();
    const endDateObj = new Date(endDate);
    
    if (today > endDateObj) {
      return {
        status: 'منتهية',
        color: 'bg-red-100 text-red-800 border-red-200',
        bgColor: 'bg-red-50'
      };
    }
    
    const diffTime = endDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 90) {
      return {
        status: 'قريب الانتهاء',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        bgColor: 'bg-orange-50'
      };
    }
    
    return {
      status: 'مجددة',
      color: 'bg-green-100 text-green-800 border-green-200',
      bgColor: 'bg-green-50'
    };
  };

  const handlePaymentStatusChange = (year: string, month: number, isPaid: boolean) => {
    if (!worker) return;

    const updatedWorker = { ...worker };
    if (!updatedWorker.paysHistory) {
      updatedWorker.paysHistory = {};
    }
    
    if (!updatedWorker.paysHistory[year]) {
      updatedWorker.paysHistory[year] = [];
    }
    
    if (isPaid) {
      if (!updatedWorker.paysHistory[year].includes(month)) {
        updatedWorker.paysHistory[year].push(month);
        updatedWorker.paysHistory[year].sort((a, b) => a - b);
      }
    } else {
      updatedWorker.paysHistory[year] = updatedWorker.paysHistory[year].filter(m => m !== month);
      if (updatedWorker.paysHistory[year].length === 0) {
        delete updatedWorker.paysHistory[year];
      }
    }
    
    setWorker(updatedWorker);
  };

  const isMonthPaid = (year: string, month: number) => {
    return worker?.paysHistory?.[year]?.includes(month) || false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'لم يتم العثور على العامل'}
          </div>
        </div>
      </div>
    );
  }

  const residenceStatus = getResidenceStatus(worker.residenceEndDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-t-[10px] shadow-lg p-8 pb-0">
          <div className='w-fit mx-auto'>
            <div className="flex items-center justify-center mb-2 w-fit mx-auto">
              <div className="bg-purple-100 p-3 rounded-full ml-4">
                <User className="h-8 w-8 text-purple-600" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">تفاصيل العامل</h1>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
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

          {/* Worker Information */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg ml-3">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              بيانات العامل
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-gray-500">اسم العامل</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{worker.fullName}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-500">رقم الجوال</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{formatPhone(worker.phone)}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-500">رقم الإقامة</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{worker.residenceNumber}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-500">المبلغ</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{worker.price} ريال</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-500">تاريخ انتهاء الإقامة</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{formatDate(worker.residenceEndDate)}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm text-gray-500">حالة الإقامة</span>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${residenceStatus.color}`}>
                  {residenceStatus.status}
                </span>
              </div>
            </div>
          </div>

          {/* Guarantor Information */}
          {worker.guarantorName && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg ml-3">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                بيانات الكفيل
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-500">اسم الكفيل</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{worker.guarantorName}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-500">رقم البطاقة</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{worker.guarantorCardNumber}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-gray-500">رقم الجوال</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{formatPhone(worker.guarantorPhone || 0)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Payment History */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="bg-green-100 p-2 rounded-lg ml-3">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              سجل المدفوعات
            </h2>
            
            {/* Payment Controls */}
            <div className="flex gap-4 mb-6">
              <div>
                <label className="block text-xs text-gray-500 mb-1">السنة</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month.toString().padStart(2, '0')}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => handlePaymentStatusChange(selectedYear, parseInt(selectedMonth), !isMonthPaid(selectedYear, parseInt(selectedMonth)))}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isMonthPaid(selectedYear, parseInt(selectedMonth))
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {isMonthPaid(selectedYear, parseInt(selectedMonth)) ? 'إلغاء الدفع' : 'تحديد كمدفوع'}
                </button>
              </div>
            </div>

            {/* Payment History Display */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">المدفوعات المسجلة:</h4>
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
      </div>
    </div>
  );
};

export default WorkerDetailsPage; 