import React, { useState, useEffect } from 'react';
import { Users, Calendar, Search, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useGetAllWorkers } from '../hooks/bag/useGetAllWorkers';

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
  createdAt?: string;
}

const Reports: React.FC = () => {
  const { loading, error, workers, refetch } = useGetAllWorkers();
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatPhone = (phone: number) => {
    return phone?.toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
  };

  // دالة لتحديد حالة الدفع للعامل في الشهر المحدد
  const getPaymentStatus = (worker: Worker) => {
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

  // فلترة العمال حسب البحث
  const filteredWorkers = workers.filter(worker => 
    worker.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.phone?.toString().includes(searchTerm) ||
    worker.residenceNumber?.toString().includes(searchTerm) ||
    worker.guarantorName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // إحصائيات الدفع
  const paymentStats = {
    total: filteredWorkers.length,
    paid: filteredWorkers.filter(w => getPaymentStatus(w).status === 'paid').length,
    unpaid: filteredWorkers.filter(w => getPaymentStatus(w).status === 'unpaid').length,
    notExists: filteredWorkers.filter(w => getPaymentStatus(w).status === 'not-exists').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
      <div className="max-w-9xl mx-auto px-1 md:px-4">
        {/* Header */}
        <div className="bg-white rounded-t-[10px] shadow-lg p-8 pb-0">
          <div className='w-fit mx-auto'>
            <div className="flex items-center justify-center mb-2 w-fit mx-auto">
              <div className="bg-green-100 p-3 rounded-full ml-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-xl md:text-xl md:text-3xl font-bold text-gray-800">تقارير الدفع الشهرية</h1>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
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
                  placeholder="البحث في العمال..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 disabled:bg-gray-400"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </button>
          </div>

          {/* Stats Cards */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 mb-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-500">إجمالي العمال</span>
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Workers Table */}
          {!loading && !error && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                 <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                   <Users className="h-5 w-5 ml-2 text-green-600" />
                   تقرير الدفع لشهر {months.find(m => m.value === selectedMonth)?.label} {selectedYear} ({filteredWorkers.length} عامل)
                 </h3>
              </div>

              {filteredWorkers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم العامل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الجوال</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الإقامة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الكفيل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الإنشاء</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الدفع</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredWorkers.map((worker, index) => {
                        const paymentStatus = getPaymentStatus(worker);
                        return (
                          <tr key={worker._id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{worker.fullName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPhone(worker.phone)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.residenceNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.guarantorName || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {worker.createdAt ? formatDate(worker.createdAt) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.price} ريال</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${paymentStatus.color}`}>
                                {paymentStatus.icon}
                                {paymentStatus.text}
                              </span>
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
                    {searchTerm ? 'لا توجد نتائج للبحث' : 'لا يوجد عمال'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'جرب البحث بكلمات مختلفة' : 'لم يتم تسجيل أي عمال بعد'}
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

export default Reports; 