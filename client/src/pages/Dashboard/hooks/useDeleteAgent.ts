import { useState } from 'react';
import axios from 'axios';

export function useDeleteAgent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteAgent = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await axios.post(`/agent/temp/${id}`);
      setSuccess(true);
      setLoading(false);
      return res.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ أثناء الحذف');
      setLoading(false);
      setSuccess(false);
      throw err;
    }
  };

  return { deleteAgent, loading, error, success };
} 