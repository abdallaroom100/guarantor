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

  // فلترة البيانات حسب البحث برقم البطاقة وحالة الإقامة
  const filteredBySearch = (filteredData || []).filter((item: any) => {
    // فلترة البحث برقم البطاقة
    let matchesSearch = false;
    if (filterType === 'workers') {
      const worker = item as Worker & { guarantorName: string; guarantorCardNumber: number };
      matchesSearch = worker.guarantorCardNumber?.toString().includes(searchTerm);
    } else {
      const guarantor = item as Guarantor;
      matchesSearch = guarantor.cardNumber?.toString().includes(searchTerm);
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Reset page to 1 when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, residenceStatusFilter, filterType]);

  // Paginated data
  const paginatedData = filteredBySearch.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const pageCount = Math.ceil(filteredBySearch.length / itemsPerPage);

  // Pagination controls
  const Pagination = () => (
    <div className="flex justify-center items-center gap-2 mt-6 select-none">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-5 h-10 rounded-full border-2 border-blue-500 bg-white text-blue-600 font-bold hover:bg-gradient-to-l hover:from-blue-100 hover:to-indigo-100 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        aria-label="السابق"
      >
        السابق
      </button>
      <span className="flex items-center justify-center min-w-[40px] h-10 px-3 rounded-lg border-2 mx-0.5 font-bold shadow-sm bg-gradient-to-l from-blue-500 to-indigo-500 text-white border-blue-600 scale-110 ">
        {currentPage}
      </span>
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
        disabled={currentPage === pageCount || pageCount === 0}
        className="px-5 h-10 rounded-full border-2 border-blue-500 bg-white text-blue-600 font-bold hover:bg-gradient-to-l hover:from-blue-100 hover:to-indigo-100 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        aria-label="التالي"
      >
        التالي
      </button>
    </div>
  );

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
      <div className="max-w-9xl mx-auto px-1 md:px-4">
        {/* Header */}
        <div className="bg-white rounded-t-[10px] shadow-lg p-8 pb-0">
          <div className='w-fit mx-auto'>
            <div className="flex items-center justify-center mb-2 w-fit mx-auto">
              <div className="bg-blue-100 p-3 rounded-full ml-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-xl  md:text-3xl font-bold text-gray-800">سجل الكفيلين والعملاء</h1>
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
                الكفيلين
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
                العملاء
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
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
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
                placeholder="البحث برقم البطاقة..."
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
                <>
                  <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم العميل</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الجوال</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الإقامة</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ انتهاء الإقامة</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الإقامة</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المبلغ</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الكفيل</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم حوال الكفيل</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((worker: any, index: number) => {
                          const residenceStatus = getResidenceStatus(worker.residenceEndDate);
                          return (
                            <tr key={worker._id || index} className={`hover:bg-gray-50 ${residenceStatus.bgColor}`}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <button
                                  onClick={() => navigate(`/worker-details/${worker.residenceNumber}`)}
                                  className="text-purple-600 hover:text-purple-800 hover:underline transition-all duration-200"
                                >
                                  {worker.fullName}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPhone(worker.phone)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.residenceNumber}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(worker.residenceEndDate)}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${residenceStatus.color}`}>
                                  {residenceStatus.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{worker.price} ريال</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                  onClick={() => navigate(`/guarantor-details/${worker.guarantorCardNumber}`)}
                                  className="text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200"
                                >
                                  {worker.guarantorName}
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPhone(worker.guarantorPhone)}</td>
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
                  <Pagination />
                </>
              ) : (
                // Guarantors Table
                <>
                  <div className="overflow-x-auto rounded-lg">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الكفيل</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الجوال</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم البطاقة</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد العملاء</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الإنشاء</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((item: any, index: number) => {
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
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPhone(guarantor.phone)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guarantor.cardNumber}</td>
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
                  <Pagination />
                </>
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