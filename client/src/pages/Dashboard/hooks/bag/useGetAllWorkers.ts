import hotToast from "../../../../common/hotToast";
import axios from "axios";
import { useState, useEffect } from "react";

export interface Worker {
  guarantorName: any;
  createdAt: any;
  _id: string;
  fullName: string;
  phone: number;
  residenceNumber: number;
  residenceEndDate: string;
  price: number;
  notice?: string;
  paysHistory?: Record<string, number[]>;
}

export const useGetAllWorkers = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [workers, setWorkers] = useState<Worker[]>([]);

  const fetchWorkers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching all workers...');
      
      const response = await axios.get("/guarantor/workers/get");
      
      console.log('API Response:', response.data);
      setWorkers(response.data);
      
    } catch (error: any) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'حدث خطأ في جلب بيانات العمال';
      setError(errorMessage);
      hotToast({type:"error",message: errorMessage});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  return {
    loading,
    error,
    workers,
    refetch: fetchWorkers
  };
}; 