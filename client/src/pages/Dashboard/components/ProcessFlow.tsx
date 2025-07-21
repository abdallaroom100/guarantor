import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Calendar, RefreshCw, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import { useGetAllGuarantors } from '../hooks/bag/useGetAllGuarantors';

const ProcessFlow: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, guarantors, refetch } = useGetAllGuarantors();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));

  // إنشاء قائمة السنوات (من 2025 إلى 2035)
  const years = Array.from({ length: 11 }, (_, i) => (2025 + i).toString());
  
  // إنشاء قائمة الشهور
  const months = [
    { value: '01', label: 'يناير' },
    { value: '02', label: 'فبراير' },
    { value: '03', label: 'مارس' },
    { value: '04', label: 'أبريل' },
    { value: '05', label: 'مايو' },
    { value: '06', label: 'يونيو' },
    { value: '07', label: 'يوليو' },
    { value: '08', label: 'أغسطس' },
    { value: '09', label: 'سبتمبر' },
    { value: '10', label: 'أكتوبر' },
    { value: '11', label: 'نوفمبر' },
    { value: '12', label: 'ديسمبر' }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatPhone = (phone: number) => {
    return phone?.toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
  };

  // دالة لتحديد حالة الدفع للعامل في الشهر المحدد
  const getPaymentStatus = (worker: any) => {
    const workerCreatedAt = worker.createdAt || new Date().toISOString();
    const workerCreatedDate = new Date(workerCreatedAt);

    // إذا كان الشهر والسنة المحددين قبل تاريخ إنشاء العامل، لا يعرض
    const selectedYearMonth = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, 1);
    const workerCreatedYearMonth = new Date(workerCreatedDate.getFullYear(), workerCreatedDate.getMonth(), 1);
    
    if (selectedYearMonth < workerCreatedYearMonth) {
      return {
        status: 'not-exists',
        text: 'غير موجود',
        color: 'bg-gray-100 text-gray-600 border-gray-200',
        icon: null
      };
    }

    // التحقق من الدفع
    const paysHistory = worker.paysHistory || {};
    const yearPayments = paysHistory[selectedYear] || [];
    const monthNumber = parseInt(selectedMonth);

    if (yearPayments.includes(monthNumber)) {
      return {
        status: 'paid',
        text: 'مدفوع',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-4 w-4 text-green-600" />
      };
    } else {
      return {
        status: 'unpaid',
        text: 'غير مدفوع',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-4 w-4 text-red-600" />
      };
    }
  };

  // فلترة الكفلاء حسب البحث
  const filteredGuarantors = guarantors.filter(guarantor => 
    guarantor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guarantor.phone?.toString().includes(searchTerm) ||
    guarantor.cardNumber?.toString().includes(searchTerm)
  );

  // إحصائيات الدفع
  const paymentStats = {
    total: filteredGuarantors.length,
    paid: filteredGuarantors.reduce((total, guarantor) => 
      total + (guarantor.workers?.filter(w => getPaymentStatus(w).status === 'paid').length || 0), 0
    ),
    unpaid: filteredGuarantors.reduce((total, guarantor) => 
      total + (guarantor.workers?.filter(w => getPaymentStatus(w).status === 'unpaid').length || 0), 0
    ),
    notExists: filteredGuarantors.reduce((total, guarantor) => 
      total + (guarantor.workers?.filter(w => getPaymentStatus(w).status === 'not-exists').length || 0), 0
    )
  };

  const handleViewClick = (cardNumber: number) => {
    navigate(`/guarantor-details/${cardNumber}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
      <div className="max-w-9xl mx-auto px-1 md:px-4">
        {/* Header */}
        <div className="bg-white rounded-t-[10px] shadow-lg p-8 pb-0">
          <div className='w-fit mx-auto'>
            <div className="flex items-center justify-center mb-2 w-fit mx-auto">
              <div className="bg-blue-100 p-3 rounded-full ml-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">سير العمليات - حالة الدفع</h1>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg p-5 md:p-8">
          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Year and Month Filters */}
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">السنة:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">الشهر:</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في الكفلاء..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </button>
          </div>

          {/* Stats Cards */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-500">إجمالي الكفلاء</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{paymentStats.total}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-500">مدفوع</span>
                </div>
                <p className="text-2xl font-bold text-green-600">{paymentStats.paid}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-gray-500">غير مدفوع</span>
                </div>
                <p className="text-2xl font-bold text-red-600">{paymentStats.unpaid}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">غير موجود</span>
                </div>
                <p className="text-2xl font-bold text-gray-600">{paymentStats.notExists}</p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Guarantors Table */}
          {!loading && !error && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Users className="h-5 w-5 ml-2 text-blue-600" />
                  حالة الدفع لشهر {months.find(m => m.value === selectedMonth)?.label} {selectedYear} ({filteredGuarantors.length} كفيل)
                </h3>
              </div>

              {filteredGuarantors.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الكفيل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الجوال</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الهوية</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد العمال</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الدفع</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الإنشاء</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredGuarantors.map((guarantor, index) => {
                        const workers = guarantor.workers || [];
                        const paidWorkers = workers.filter(w => getPaymentStatus(w).status === 'paid').length;
                        const unpaidWorkers = workers.filter(w => getPaymentStatus(w).status === 'unpaid').length;
                        
                        return (
                          <tr key={guarantor._id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {guarantor.fullName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatPhone(guarantor.phone)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {guarantor.cardNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {workers.length} عامل
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                {paidWorkers > 0 && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                    <CheckCircle className="h-3 w-3" />
                                    {paidWorkers} مدفوع
                                  </span>
                                )}
                                {unpaidWorkers > 0 && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                    <XCircle className="h-3 w-3" />
                                    {unpaidWorkers} غير مدفوع
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {guarantor.createdAt ? formatDate(guarantor.createdAt) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleViewClick(guarantor.cardNumber)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                              >
                                <Eye className="h-4 w-4" />
                                عرض
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {searchTerm ? 'لا توجد نتائج للبحث' : 'لا يوجد كفلاء'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'جرب البحث بكلمات مختلفة' : 'لم يتم تسجيل أي كفلاء بعد'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessFlow; 