import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, CreditCard, Calendar, Users, DollarSign, FileText, Edit, Trash2, Plus } from 'lucide-react';
import hotToast from '../../common/hotToast';
import { useGetGuarantor } from '../Dashboard/hooks/bag/useGetGuarantor';
import moment from 'moment-hijri';

interface Worker {
  _id: string;
  fullName: string;
  phone: number;
  residenceNumber: number;
  residenceEndDate: string;
  price: number;
  notice?: string;
  paysHistory?: Record<string, number[]>;
  birthDate?: string; // Added birthDate to Worker interface
}

interface Guarantor {
  _id: string;
  fullName: string;
  phone: number;
  cardNumber: number;
  recordNumber?: string;
  unifiedNumber?: string;
  workers: Worker[];
  createdAt?: string;
  birthDate?: string; // Added birthDate to Guarantor interface
}

const GuarantorDetailsPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const { guarantor, loading, error, refetch } = useGetGuarantor(cardId || '');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));

  // حذف useEffect وfetchGuarantorDetails وstate المرتبطة بها
 useEffect(() => {
  refetch()
 }, []);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // صيغة اليوم/الشهر/السنة بالميلادي
    return date.toLocaleDateString('ar-us', { year: 'numeric', month: '2-digit', day: '2-digit' });
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

  const handlePaymentStatusChange = (workerIndex: number, year: string, month: number, isPaid: boolean) => {
    if (!guarantor) return;

    const updatedGuarantor = { ...guarantor };
    const worker = updatedGuarantor.workers[workerIndex];
    
    if (!worker.paysHistory) {
      worker.paysHistory = {};
    }
    
    if (!worker.paysHistory[year]) {
      worker.paysHistory[year] = [];
    }
    
    if (isPaid) {
      if (!worker.paysHistory[year].includes(month)) {
        worker.paysHistory[year].push(month);
        worker.paysHistory[year].sort((a, b) => a - b);
      }
    } else {
      worker.paysHistory[year] = worker.paysHistory[year].filter(m => m !== month);
      if (worker.paysHistory[year].length === 0) {
        delete worker.paysHistory[year];
      }
    }
    
  };

  const isMonthPaid = (worker: Worker, year: string, month: number) => {
    return worker.paysHistory?.[year]?.includes(month) || false;
  };

  const getTotalWorkers = () => guarantor?.workers?.length || 0;
  const getTotalAmount = () => guarantor?.workers?.reduce((total, worker) => total + worker.price, 0) || 0;
  const getExpiredWorkers = () => guarantor?.workers?.filter(worker => {
    const status = getResidenceStatus(worker.residenceEndDate);
    return status.status === 'منتهية';
  }).length || 0;

  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة',
    'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];
  function formatHijriDate(dateString: string) {
    if (!dateString) return '';
    const m = moment(dateString, 'YYYY-MM-DD').format('iYYYY-iMM-iDD');
    const [year, month, day] = m.split('-');
    const monthName = hijriMonths[parseInt(month, 10) - 1] || '';
    return `${day} ${monthName} ${year} هـ`;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !guarantor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'لم يتم العثور على الكفيل'}
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
              <div className="bg-blue-100 p-3 rounded-full ml-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">تفاصيل الكفيل</h1>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <div className="bg-blue-100 p-2 rounded-lg ml-3">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                بيانات الكفيل
              </h2>
              <button
                onClick={() => navigate(`/edit-guarantor/${guarantor.cardNumber}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-colors duration-200"
              >
                تعديل البيانات
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-500">اسم الكفيل</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{guarantor.fullName}</p>
              </div>
              {/* تاريخ ميلاد الكفيل */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-500">تاريخ ميلاد الكفيل</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{guarantor.birthDate ? String(guarantor.birthDate) : '-'}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-500">رقم الجوال</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{guarantor.phone}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-gray-500">رقم الهوية</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{guarantor.cardNumber}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-500">رقم السجل</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{guarantor.recordNumber || 'غير محدد'}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm text-gray-500">الرقم الموحد</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{guarantor.unifiedNumber || 'غير محدد'}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-500">تاريخ الإنشاء</span>
                </div>
                <p className="text-lg font-semibold text-gray-800">{guarantor.createdAt ? formatDate(guarantor.createdAt).split("/").join("-") : '-'}</p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="bg-green-100 p-2 rounded-lg ml-3">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              الإحصائيات
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-500">إجمالي العمال</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{getTotalWorkers()}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-500">إجمالي المبالغ</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{getTotalAmount()} ريال</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-500">الإقامات المنتهية</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{getExpiredWorkers()}</p>
              </div>
            </div>
          </div>

          {/* Workers List */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <div className="bg-purple-100 p-2 rounded-lg ml-3">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              قائمة العمال ({guarantor.workers?.length || 0} عامل)
            </h2>
            
            {guarantor.workers && guarantor.workers.length > 0 ? (
              <div className="space-y-4">
                {guarantor.workers.map((worker, index) => {
                  const residenceStatus = getResidenceStatus(worker.residenceEndDate);
                  return (
                    <div key={worker._id || index} className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">اسم العامل</label>
                          <p className="text-lg font-semibold text-gray-800">{worker.fullName}</p>
                        </div>
                        {/* تاريخ ميلاد العامل */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ ميلاد العامل</label>
                          <p className="text-lg font-semibold text-gray-800">{worker.birthDate ? String(worker.birthDate) : '-'}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
                          <p className="text-lg font-semibold text-gray-800">{worker.phone}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الإقامة</label>
                          <p className="text-lg font-semibold text-gray-800">{worker.residenceNumber}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ</label>
                          <p className="text-lg font-semibold text-gray-800">{worker.price} ريال</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">الملاحظات</label>
                          <p className="text-lg font-semibold text-gray-800 max-w-xs">
                            {worker.notice ? (
                              <span className="text-blue-600 break-words">{worker.notice}</span>
                            ) : (
                              <span className="text-gray-400">لا توجد ملاحظات</span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ انتهاء الإقامة</label>
                          <p className="text-lg font-semibold text-gray-800">{formatHijriDate(worker.residenceEndDate)}</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">حالة الإقامة</label>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${residenceStatus.color}`}>
                            {residenceStatus.status}
                          </span>
                        </div>
                      </div>

                      {/* Payment Controls */}
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">إدارة المدفوعات:</h4>
                        {/* تم تعطيل التعديل، فقط عرض المدفوعات */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">المدفوعات المسجلة:</h5>
                          {Object.keys(worker.paysHistory || {}).length > 0 ? (
                            <div className="space-y-1">
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
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                لا يوجد عمال مسجلين لهذا الكفيل
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuarantorDetailsPage; 