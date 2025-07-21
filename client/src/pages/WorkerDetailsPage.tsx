import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Phone, CreditCard, Users, Calendar, RefreshCw, FileText, Building, ExternalLink } from 'lucide-react';
import { useGetWorkerWithGuarantor } from './Dashboard/hooks/bag/useGetWorkerWithGuarantor';

const WorkerDetailsPage: React.FC = () => {
  const { residenceNumber } = useParams<{ residenceNumber: string }>();
  const navigate = useNavigate();
  const { loading, error, data, refetch } = useGetWorkerWithGuarantor(residenceNumber || '');

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
  console.log(data)
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
              <div className="bg-purple-100 p-3 rounded-full ml-4">
                <Building className="h-8 w-8 text-purple-600" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">تفاصيل العامل</h1>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Worker and Guarantor Details */}
          {!loading && !error && data && (
            <div className="space-y-8">
              {/* Worker Info Card */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Building className="h-6 w-6 ml-2 text-purple-600" />
                    بيانات العامل
                  </h2>
                  <button
                    onClick={refetch}
                    disabled={loading}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 disabled:bg-gray-400"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    تحديث
                  </button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">اسم العامل</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{data.worker.fullName}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">رقم الجوال</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{formatPhone(data.worker.phone)}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">رقم الإقامة</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{data.worker.residenceNumber}</p>
                  </div>
                </div>

                <div className="mt-4 grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">تاريخ انتهاء الإقامة</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{formatDate(data.worker.residenceEndDate)}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-3 h-3 rounded-full"></span>
                      <span className="text-sm text-gray-500">حالة الإقامة</span>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getResidenceStatus(data.worker.residenceEndDate).color}`}>
                      {getResidenceStatus(data.worker.residenceEndDate).status}
                    </span>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-gray-500">المبلغ</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{data.worker.price} ريال</p>
                  </div>
                </div>
              </div>

              {/* Guarantor Info Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <User className="h-6 w-6 ml-2 text-blue-600" />
                    بيانات الكفيل
                  </h2>
                  <button
                    onClick={() => navigate(`/guarantor-details/${data.guarantor.cardNumber}`)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    عرض تفاصيل الكفيل
                  </button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">اسم الكفيل</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{data.guarantor.fullName}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">رقم الجوال</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{formatPhone(data.guarantor.phone)}</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">رقم الهوية</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{data.guarantor.cardNumber}</p>
                  </div>
                </div>

                <div className="mt-4 grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">عدد العمال</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{data.guarantor.workers?.length || 0} عامل</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">تاريخ الإنشاء</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-800">{formatDate(data.guarantor.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerDetailsPage; 