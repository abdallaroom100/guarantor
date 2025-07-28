import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Edit, Phone, CreditCard, Calendar, RefreshCw } from 'lucide-react';
import { useGetAllGuarantors } from '../hooks/bag/useGetAllGuarantors';

const EditReports: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, guarantors, refetch } = useGetAllGuarantors();
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US');
  };

  const formatPhone = (phone: number) => {
    return phone?.toString().replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
  };

  const filteredGuarantors = guarantors.filter(guarantor => 
    guarantor.cardNumber?.toString().includes(searchTerm) ||
    guarantor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guarantor.phone?.toString().includes(searchTerm)
  );

  const handleEditClick = (cardNumber: number) => {
    navigate(`/edit-guarantor/${cardNumber}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
      <div className="max-w-9xl mx-auto px-1 md:px-4">
        {/* Header */}
        <div className="bg-white rounded-t-[10px] shadow-lg p-8 pb-0">
          <div className='w-fit mx-auto'>
            <div className="flex items-center justify-center mb-2 w-fit mx-auto">
              <div className="bg-emerald-100 p-3 rounded-full ml-4">
                <Edit className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">تعديل بيانات الكفلاء</h1>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg p-5 md:p-8">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="w-64">
              <div className="relative">
               
                <input
                  type="text"
                  placeholder="البحث..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all duration-200 disabled:bg-gray-400"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              تحديث
            </button>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200 mb-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-gray-500">إجمالي الكفلاء</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{filteredGuarantors.length}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-500">إجمالي العمال</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredGuarantors.reduce((total, guarantor) => total + (guarantor.workers?.length || 0), 0)}
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-500">آخر تحديث</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {guarantors.length > 0 ? formatDate(guarantors[0].createdAt || '') : '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
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
                  <Users className="h-5 w-5 ml-2 text-emerald-600" />
                  قائمة الكفلاء ({filteredGuarantors.length} كفيل)
                </h3>
              </div>

              {filteredGuarantors.length > 0 ? (
                <div className="overflow-x-auto rounded-lg max-h-[69vh] overflow-y-auto custom-scrollbar">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[150px]">اسم الكفيل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الجوال</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الهوية</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد العمال</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الإنشاء</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredGuarantors.map((guarantor, index) => (
                        <tr key={guarantor._id || index} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-[150px]">
                            <span className="truncate block w-full" title={guarantor.fullName}>
                              {guarantor.fullName}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {guarantor.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {guarantor.cardNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {guarantor.workers?.length || 0} عامل
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {guarantor.createdAt ? formatDate(guarantor.createdAt) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleEditClick(guarantor.cardNumber)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium"
                            >
                              <Edit className="h-4 w-4" />
                              تعديل
                            </button>
                          </td>
                        </tr>
                      ))}
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
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 10px;
          border: 2px solid #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #059669, #047857);
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #10b981 #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default EditReports; 