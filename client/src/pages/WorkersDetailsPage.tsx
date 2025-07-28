import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Phone, Calendar, RefreshCw, Search, FileText } from 'lucide-react';
import { useGetAllWorkers } from './Dashboard/hooks/bag/useGetAllWorkers';

const WorkersDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, workers, refetch } = useGetAllWorkers();
  const [searchTerm, setSearchTerm] = useState('');

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

  // دالة لتحديد حالة الإقامة
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

  // فلترة العمال حسب البحث
  const filteredWorkers = workers.filter(worker => 
    worker.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    worker.phone?.toString().includes(searchTerm) ||
    worker.residenceNumber?.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
      <div className="max-w-9xl mx-auto px-1 md:px-4">
        {/* Header */}
        <div className="bg-white rounded-t-[10px] shadow-lg p-8 pb-0">
          <div className='w-fit mx-auto'>
            <div className="flex items-center justify-center mb-2 w-fit mx-auto">
              <div className="bg-purple-100 p-3 rounded-full ml-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">تفاصيل العمال</h1>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg p-5 md:p-8">
          {/* Back Button and Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              رجوع
            </button>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="البحث في العمال..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Refresh Button */}
              <button
                onClick={refetch}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 disabled:bg-gray-400"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                تحديث
              </button>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 mb-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm text-gray-500">إجمالي العمال</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{workers.length}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-gray-500">إقامات مجددة</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {workers.filter(w => getResidenceStatus(w.residenceEndDate).status === 'مجددة').length}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                  <span className="text-sm text-gray-500">قريب الانتهاء</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {workers.filter(w => getResidenceStatus(w.residenceEndDate).status === 'قريب الانتهاء').length}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-sm text-gray-500">إقامات منتهية</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {workers.filter(w => getResidenceStatus(w.residenceEndDate).status === 'منتهية').length}
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
                  <Users className="h-5 w-5 ml-2 text-purple-600" />
                  قائمة العمال ({filteredWorkers.length} من {workers.length})
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
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ انتهاء الإقامة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الإقامة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الملاحظات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredWorkers.map((worker, index) => {
                        const residenceStatus = getResidenceStatus(worker.residenceEndDate);
                        return (
                          <tr key={worker._id || index} className={`hover:bg-gray-50 ${residenceStatus.bgColor}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{worker.fullName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPhone(worker.phone)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.residenceNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(worker.residenceEndDate)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${residenceStatus.color}`}>
                                {residenceStatus.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.price} ريال</td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                              {worker.notice ? (
                                <span className="text-blue-600 font-medium break-words">{worker.notice}</span>
                              ) : (
                                <span className="text-gray-400">لا توجد ملاحظات</span>
                              )}
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

export default WorkersDetailsPage; 