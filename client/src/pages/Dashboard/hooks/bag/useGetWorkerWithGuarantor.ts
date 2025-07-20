import hotToast from "../../../../common/hotToast";
import axios from "axios";
import { useState, useEffect } from "react";

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

export interface Guarantor {
  _id: string;
  fullName: string;
  phone: number;
  cardNumber: number;
  price: number;
  workers: Worker[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkerWithGuarantorResponse {
  guarantor: Guarantor;
  worker: Worker;
}

export const useGetWorkerWithGuarantor = (residenceNumber: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WorkerWithGuarantorResponse | null>(null);

  const fetchWorkerWithGuarantor = async () => {
    if (!residenceNumber) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching worker with residenceNumber:', residenceNumber);
      
      const response = await axios.get(`/guarantor/find/worker/${residenceNumber}`);
      
      console.log('API Response:', response.data);
      setData(response.data);
      
    } catch (error: any) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'حدث خطأ في جلب بيانات العامل';
      setError(errorMessage);
      hotToast({type:"error",message: errorMessage});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (residenceNumber) {
      fetchWorkerWithGuarantor();
    }
  }, [residenceNumber]);

  return {
    loading,
    error,
    data,
    refetch: fetchWorkerWithGuarantor
  };
}; 