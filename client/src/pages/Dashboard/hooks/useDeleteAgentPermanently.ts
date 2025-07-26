import { useState } from 'react';
import axios from 'axios';

export function useDeleteAgentPermanently() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteAgentPermanently = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await axios.delete(`/agent/${id}`);
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

  return { deleteAgentPermanently, loading, error, success };
} 