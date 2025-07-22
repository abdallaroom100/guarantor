import hotToast from "../../../../common/hotToast";
import axios from "axios";
import { useState } from "react";

export const useCreateGuarantor = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreated, setIsCreated] = useState<boolean>();

  const createGuarantor = async (formData: Record<string, any>) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Sending request to /guarantor/create with data:', formData);
      
              const response = await axios.post("/guarantor/create", formData);
      
      console.log('API Response:', response.data);
      setIsCreated(true);
      hotToast({type:"success",message:"تم انشاء البيانات بنجاح"});
      
      return response.data;
    } catch (error: any) {
      console.error('API Error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'حدث خطأ غير متوقع';
      setError(errorMessage);
      hotToast({type:"error",message: errorMessage});
      throw error;
    } finally {
      setLoading(false);
    }
  };

 return {loading,error,isCreated,createGuarantor,setIsCreated}

};
