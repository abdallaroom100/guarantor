import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

const DeletedGuarantorsPage: React.FC = () => {
  const [guarantors, setGuarantors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchGuarantors = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/guarantor/temp');
      setGuarantors(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      setError('تعذر تحميل الكفلاء المحذوفين');
      setGuarantors([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGuarantors();
  }, []);

  const handleReturn = async () => {
    if (!selectedId) return;
    setError('');
    setSuccess('');
    try {
      await axios.post(`/guarantor/back/${selectedId}`);
      setSuccess('تم إرجاع الكفيل بنجاح');
      setShowModal(false);
      setSelectedId(null);
      fetchGuarantors();
    } catch (err: any) {
      setError('حدث خطأ أثناء الإرجاع');
      setShowModal(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-t-[10px] shadow-lg p-8 pb-0">
          <h1 className="text-2xl font-bold text-gray-800">الكفلاء المحذوفين</h1>
        </div>
        <div className="bg-white rounded-b-xl shadow-lg p-5 md:p-8 mt-0">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 font-bold">{error}</div>
          ) : (
            <>
              {success && <div className="text-center text-green-600 font-bold mb-4">{success}</div>}
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الكفيل</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم البطاقة</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الجوال</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الميلاد</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عدد العمال</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(guarantors) && guarantors.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500 font-bold">لا يوجد كفلاء محذوفين</td>
                      </tr>
                    ) : (
                      Array.isArray(guarantors) && guarantors.map(guarantor => (
                        <tr key={guarantor._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{guarantor.fullName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guarantor.cardNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guarantor.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guarantor.birthDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{guarantor.workers?.length || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button
                              className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-1 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition"
                              onClick={() => { setSelectedId(guarantor._id); setShowModal(true); }}
                            >
                              ارجاع
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
        <Modal isOpen={showModal} onClose={() => { setShowModal(false); setSelectedId(null); }}>
          <div className="text-center">
            <div className="mb-4 text-2xl font-bold text-gray-800">تأكيد إرجاع الكفيل</div>
            <div className="mb-6 text-gray-600">هل أنت متأكد أنك تريد إرجاع هذا الكفيل؟</div>
            <div className="flex justify-center gap-4">
              <button onClick={handleReturn} className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold hover:from-emerald-600 hover:to-blue-600 transition">تأكيد الإرجاع</button>
              <button onClick={() => { setShowModal(false); setSelectedId(null); }} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition">إلغاء</button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DeletedGuarantorsPage; 