import hotToast from "../../../../common/hotToast";
import axios from "axios";
import { useState, useEffect } from "react";

export interface Worker {
  birthDate: String;

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
  birthDate: String;
  _id: string;
  fullName: string;
  phone: number;
  cardNumber: number;
  price: number;
  workers: Worker[];
  createdAt: string;
  updatedAt: string;
}

export const useGetGuarantor = (cardId: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [guarantor, setGuarantor] = useState<Guarantor | null>(null);

  const fetchGuarantor = async () => {
    if (!cardId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching guarantor with cardId:', cardId);
      
      const response = await axios.get(`/guarantor/${cardId}`);
      
      console.log('API Response:', response.data);
      setGuarantor(response.data);
      
    } catch (error: any) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'حدث خطأ في جلب بيانات الكفيل';
      setError(errorMessage);
      hotToast({type:"error",message: errorMessage});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cardId) {
      fetchGuarantor();
    }
  }, [cardId]);

  return {
    loading,
    error,
    guarantor,
    refetch: fetchGuarantor
  };
}; 