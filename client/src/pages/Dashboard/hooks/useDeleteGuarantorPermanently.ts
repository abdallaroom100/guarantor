import { useState } from 'react';
import axios from 'axios';

export function useDeleteGuarantorPermanently() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteGuarantorPermanently = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await axios.delete(`/guarantor/${id}`);
      setSuccess(true);
      setLoading(false);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء الحذف النهائي');
      setLoading(false);
      setSuccess(false);
      throw err;
    }
  };

  return { deleteGuarantorPermanently, loading, error, success };
} 