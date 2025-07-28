import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Guarantor {
  _id: string;
  fullName: string;
  phone: number;
  cardNumber: number;
  recordNumber?: string;
  unifiedNumber?: string;
  workers: Worker[];
  createdAt?: string;
}

export interface Worker {
  _id: string;
  fullName: string;
  phone: number;
  residenceNumber: number;
  residenceEndDate: string;
  price: number;
  notice?: string;
  paysHistory?: Record<string, number[]>;
}

export const useGetAllGuarantors = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [guarantors, setGuarantors] = useState<Guarantor[]>([]);
  const [filterType, setFilterType] = useState<'guarantors' | 'workers'>('guarantors');

  const fetchGuarantors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get('/guarantor/all');
      console.log('All Guarantors Response:', response.data);
      
      // ترتيب الكفلاء حسب الأحدث أولاً
      const sortedGuarantors = response.data.sort((a: Guarantor, b: Guarantor) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
      
      setGuarantors(sortedGuarantors);
    } catch (error: any) {
      console.error('Error fetching guarantors:', error);
      const errorMessage = error.response?.data?.error || error.message || 'حدث خطأ في جلب البيانات';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchGuarantors();
  };

  // دالة لفلترة البيانات
  const filterData = (type: 'guarantors' | 'workers') => {
    setFilterType(type);
  };

  // تحضير البيانات المفلترة
  const getFilteredData = () => {
    if (filterType === 'guarantors') {
      return guarantors;
    } else {
      // تحويل العمال إلى مصفوفة مع معلومات الكفيل
      const workersWithGuarantor = guarantors.flatMap(guarantor => 
        guarantor.workers?.map(worker => ({
          ...worker,
          guarantorName: guarantor.fullName,
          guarantorCardNumber: guarantor.cardNumber,
          guarantorPhone: guarantor.phone
        })) || []
      );
      return workersWithGuarantor;
    }
  };

  useEffect(() => {
    fetchGuarantors();
  }, []);

  return { 
    loading, 
    error, 
    guarantors, 
    refetch, 
    filterType, 
    filterData, 
    filteredData: getFilteredData() 
  };
}; 