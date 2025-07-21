import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, CreditCard, Users, Calendar, RefreshCw, FileText } from 'lucide-react';
import { useGetGuarantor } from './Dashboard/hooks/bag/useGetGuarantor';

const GuarantorDetailsPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const navigate = useNavigate();
  const { loading, error, guarantor, refetch } = useGetGuarantor(cardId || '');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
      <div className="max-w-9xl mx-auto px-1 md:px-4">
        {/* Header */}
        <div className="bg-white rounded-t-[10px] shadow-lg p-8 pb-0">
          <div className='w-fit mx-auto'>
            <div className="flex items-center justify-center mb-2 w-fit mx-auto">
              <div className="bg-blue-100 p-3 rounded-full ml-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-xl  md:text-3xl font-bold text-gray-800">تفاصيل الكفيل</h1>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg p-5 md:p-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              رجوع
            </button>
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

          {/* Guarantor Details */}
          {!loading && !error && guarantor && (
            <div className="space-y-8">
              {/* Guarantor Info Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <User className="h-6 w-6 ml-2 text-blue-600" />
                    بيانات الكفيل
                  </h2>
                  <button
                    onClick={refetch}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    تحديث
                  </button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">اسم الكفيل</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{guarantor.fullName}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">رقم الجوال</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{guarantor.phone}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">رقم الهوية</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{guarantor.cardNumber}</p>
                  </div>
                </div>

                <div className="mt-4 grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">عدد العمال</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{guarantor.workers?.length || 0} عامل</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">تاريخ الإنشاء</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{formatDate(guarantor.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Workers Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Users className="h-5 w-5 ml-2 text-blue-600" />
                    العمال التابعين
                  </h3>
                </div>

                {guarantor.workers && guarantor.workers.length > 0 ? (
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
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">سجل المدفوعات</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {guarantor.workers.map((worker, index) => {
                          const residenceStatus = getResidenceStatus(worker.residenceEndDate);
                          return (
                            <tr key={worker._id || index} className={`hover:bg-gray-50 ${residenceStatus.bgColor}`}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{worker.fullName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.phone}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.residenceNumber}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(worker.residenceEndDate)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${residenceStatus.color}`}>
                                  {residenceStatus.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.price} ريال</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {worker.paysHistory && Object.keys(worker.paysHistory).length > 0 ? (
                                  <div>
                                    {Object.entries(worker.paysHistory).map(([year, months]) => (
                                      <div key={year}>
                                        <span className="font-semibold">{year}:</span> {Array.isArray(months) ? months.sort((a, b) => a - b).map((month) => month.toString().padStart(2, '0')).join(', ') : ''}
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">لا توجد مدفوعات</span>
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
                    <h3 className="mt-2 text-sm font-medium text-gray-900">لا يوجد عمال</h3>
                    <p className="mt-1 text-sm text-gray-500">لم يتم تسجيل أي عمال لهذا الكفيل</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuarantorDetailsPage; 