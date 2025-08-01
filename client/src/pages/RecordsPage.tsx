import React, { useState, useEffect, useRef } from 'react';
import { Users, User, Filter, RefreshCw, Calendar, Phone, CreditCard, FileText, ExternalLink, Menu, X, Building } from 'lucide-react';
import { useGetAllGuarantors, Guarantor, Worker } from './Dashboard/hooks/bag/useGetAllGuarantors';
import { useNavigate } from 'react-router-dom';

const RecordsPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading, error, filteredData, filterType, filterData, refetch } = useGetAllGuarantors();
  const [searchTerm, setSearchTerm] = useState('');
  const [residenceStatusFilter, setResidenceStatusFilter] = useState<'all' | 'renewed' | 'expiring' | 'expired'>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // فلترة البيانات حسب البحث برقم الهوية وحالة الإقامة
  const filteredBySearch = (filteredData || []).filter((item: any) => {
    let matchesSearch = false;
    if (filterType === 'workers') {
      const worker = item as Worker & { guarantorName: string; guarantorCardNumber: number };
      matchesSearch =
        worker.guarantorCardNumber?.toString().includes(searchTerm) ||
        worker.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.phone?.toString().includes(searchTerm) ||
        worker.residenceNumber?.toString().includes(searchTerm) ||
        worker.guarantorName?.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      const guarantor = item as Guarantor;
      matchesSearch =
        guarantor.cardNumber?.toString().includes(searchTerm) ||
        guarantor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guarantor.phone?.toString().includes(searchTerm);
    }

    // فلترة حالة الإقامة (فقط للعمال)
    if (filterType === 'workers' && residenceStatusFilter !== 'all') {
      const worker = item as Worker;
      const status = getResidenceStatus(worker.residenceEndDate);
      
      let matchesStatus = false;
      switch (residenceStatusFilter) {
        case 'renewed':
          matchesStatus = status.status === 'مجددة';
          break;
        case 'expiring':
          matchesStatus = status.status === 'قريب الانتهاء';
          break;
        case 'expired':
          matchesStatus = status.status === 'منتهية';
          break;
        default:
          matchesStatus = true;
      }
      
      return matchesSearch && matchesStatus;
    }

    return matchesSearch;
  });

  // Use all filtered data without pagination
  const displayData = filteredBySearch;

  useEffect(() => {
    try {
      const adminData = JSON.parse(localStorage.getItem("admin") || "null");
      setAdmin(adminData);
    } catch (e) {
      setAdmin(null);
    }
  }, []);

  // دالة لتحديد حالة الإقامة
  const getResidenceStatus = (endDate: string) => {
    const today = new Date();
    const endDateObj = new Date(endDate);
    
    // إذا كان التاريخ منتهي
    if (today > endDateObj) {
      return {
        status: 'منتهية',
        color: 'bg-red-100 text-red-800 border-red-200',
        bgColor: 'bg-red-50'
      };
    }
    
    // حساب الفرق بالأيام
    const diffTime = endDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // أقل من 3 شهور (90 يوم)
    if (diffDays <= 90) {
      return {
        status: 'قريب الانتهاء',
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        bgColor: 'bg-orange-50'
      };
    }
    
    // أكثر من 3 شهور
    return {
      status: 'مجددة',
      color: 'bg-green-100 text-green-800 border-green-200',
      bgColor: 'bg-green-50'
    };
  };

  // دالة لتحديد النص المعروض في الـ dropdown
  const getFilterDisplayText = () => {
    switch (residenceStatusFilter) {
      case 'all':
        return 'الكل';
      case 'renewed':
        return 'مجددة';
      case 'expiring':
        return 'قريب الانتهاء';
      case 'expired':
        return 'منتهية';
      default:
        return 'الكل';
    }
  };

  // دالة لتحديد لون الـ dropdown
  const getFilterColor = () => {
    switch (residenceStatusFilter) {
      case 'all':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'renewed':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'expiring':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'expired':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  // إغلاق الـ dropdown عند النقر خارجه
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
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
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border-radius: 10px;
          border: 2px solid #f1f5f9;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2563eb, #4f46e5);
        }
        
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #3b82f6 #f1f5f9;
        }
      `}</style>
      <div className="max-w-9xl mx-auto px-1 md:px-4">
        {/* Header */}
        <div className="bg-white rounded-t-[10px] shadow-lg p-8 pb-0">
          <div className='w-fit mx-auto'>
            <div className="flex items-center justify-center mb-2 w-fit mx-auto">
              <div className="bg-blue-100 p-3 rounded-full ml-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-xl  md:text-3xl font-bold text-gray-800">سجل الكفلاء والعمال</h1>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg p-5 md:p-8">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => filterData('guarantors')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  filterType === 'guarantors'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <User className="h-4 w-4" />
                الكفلاء 
              </button>
              <button
                onClick={() => filterData('workers')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  filterType === 'workers'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Users className="h-4 w-4" />
                العمال
              </button>
            </div>

            {/* Residence Status Filter (only for workers) */}
            {filterType === 'workers' && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">حالة الإقامة:</label>
                <div className="relative" ref={dropdownRef}>
                  {/* Custom Dropdown Button */}
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center justify-between w-36 px-3 py-2 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getFilterColor()}`}
                  >
                    <span className="text-sm font-medium">{getFilterDisplayText()}</span>
                    
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setResidenceStatusFilter('all');
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-right px-3 py-2 text-sm hover:bg-blue-50 transition-colors duration-150 ${
                            residenceStatusFilter === 'all' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          الكل
                        </button>
                        <button
                          onClick={() => {
                            setResidenceStatusFilter('renewed');
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-right px-3 py-2 text-sm hover:bg-green-50 transition-colors duration-150 ${
                            residenceStatusFilter === 'renewed' ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          مجددة
                        </button>
                        <button
                          onClick={() => {
                            setResidenceStatusFilter('expiring');
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-right px-3 py-2 text-sm hover:bg-orange-50 transition-colors duration-150 ${
                            residenceStatusFilter === 'expiring' ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          قريب الانتهاء
                        </button>
                        <button
                          onClick={() => {
                            setResidenceStatusFilter('expired');
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-right px-3 py-2 text-sm hover:bg-red-50 transition-colors duration-150 ${
                            residenceStatusFilter === 'expired' ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700'
                          }`}
                        >
                          منتهية
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Search */}
            <div className="w-64">
              <input
                type="text"
                placeholder="البحث..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
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

          {/* Data Table */}
          {!loading && !error && (
            <div>
              {filterType === 'workers' ? (
                // Workers Table
                <div className="overflow-x-auto rounded-lg max-h-[68vh] overflow-y-auto custom-scrollbar">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[150px]">اسم العميل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الجوال</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الإقامة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ انتهاء الإقامة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الإقامة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الملاحظات</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[120px]">اسم الكفيل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم حوال الكفيل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayData.map((worker: any, index: number) => {
                        const residenceStatus = getResidenceStatus(worker.residenceEndDate);
                        return (
                          <tr key={worker._id || index} className={`hover:bg-gray-50 ${residenceStatus.bgColor}`}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-[150px]">
                              <button
                                onClick={() => navigate(`/worker-details/${worker.residenceNumber}`)}
                                className="text-purple-600 hover:text-purple-800 hover:underline transition-all duration-200 truncate block w-full"
                                title={worker.fullName}
                              >
                                {worker.fullName}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.residenceNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(worker.residenceEndDate)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${residenceStatus.color}`}>
                                {residenceStatus.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.price} ريال</td>
                            <td className="px-6 py-4 text-sm text-gray-500 min-w-[300px]">
                              {worker.notice ? (
                                <span className="text-blue-600 font-medium break-words">{worker.notice}</span>
                              ) : (
                                <span className="text-gray-400">لا توجد ملاحظات</span>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[120px]">
                              <button
                                onClick={() => navigate(`/guarantor-details/${worker.guarantorCardNumber}`)}
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200 truncate block w-full"
                                title={worker.guarantorName}
                              >
                                {worker.guarantorName}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.guarantorPhone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => navigate(`/worker-details/${worker.residenceNumber}`)}
                                className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 text-xs"
                                title="عرض تفاصيل العامل"
                              >
                                <ExternalLink className="h-3 w-3" />
                                عرض البيانات
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                // Guarantors Table
                <div className="overflow-x-auto rounded-lg max-h-[69vh] overflow-y-auto custom-scrollbar">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الكفيل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الجوال</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الهوية</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم السجل</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الرقم الموحد</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد العملاء</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الإنشاء</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayData.map((item: any, index: number) => {
                        if (!('cardNumber' in item)) return null;
                        const guarantor = item as Guarantor;
                        return (
                          <tr key={guarantor._id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              <button
                                onClick={() => navigate(`/guarantor-details/${guarantor.cardNumber}`)}
                                className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200"
                              >
                                {guarantor.fullName}
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guarantor.phone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guarantor.cardNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guarantor.recordNumber || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guarantor.unifiedNumber || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guarantor.workers?.length || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guarantor.createdAt ? formatDate(guarantor.createdAt) : '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                onClick={() => navigate(`/guarantor-details/${guarantor.cardNumber}`)}
                                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-xs"
                              >
                                <ExternalLink className="h-3 w-3" />
                                عرض البيانات
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredBySearch.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد بيانات</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'لا توجد نتائج للبحث المطلوب' : 'لم يتم العثور على أي بيانات'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordsPage; 