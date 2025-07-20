import hotToast from "../../../../common/hotToast";
import axios from "axios";
import { useState } from "react";

export const useUpdateGuarantor = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateGuarantor = async (cardNumber: string, formData: Record<string, any>) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Updating guarantor with card number:', cardNumber);
      console.log('Update data:', formData);
      
      const response = await axios.patch(`/guarantor/update/${cardNumber}`, formData);
      
      console.log('Update Response:', response.data);
      hotToast({type:"success",message:"تم تحديث البيانات بنجاح"});
      
      return response.data;
    } catch (error: any) {
      console.error('Update Error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'حدث خطأ في تحديث البيانات';
      setError(errorMessage);
      hotToast({type:"error",message: errorMessage});
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, updateGuarantor };
}; 