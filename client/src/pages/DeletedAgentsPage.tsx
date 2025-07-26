import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

const DeletedAgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchAgents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/agent/temp');
      setAgents(res.data);
    } catch (err: any) {
      setError('تعذر تحميل التأشيرات المحذوفة');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleReturn = async () => {
    if (!selectedId) return;
    setError('');
    setSuccess('');
    try {
      await axios.post(`/agent/back/${selectedId}`);
      setSuccess('تم إرجاع التأشيرة بنجاح');
      setShowModal(false);
      setSelectedId(null);
      fetchAgents();
    } catch (err: any) {
      setError('حدث خطأ أثناء الإرجاع');
      setShowModal(false);
      setSelectedId(null);
    }
  };

  const handleDeletePermanently = async () => {
    if (!selectedId) return;
    setError('');
    setSuccess('');
    try {
      await axios.delete(`/agent/${selectedId}`);
      setSuccess('تم حذف التأشيرة نهائياً بنجاح');
      setShowDeleteModal(false);
      setSelectedId(null);
      fetchAgents();
    } catch (err: any) {
      setError('حدث خطأ أثناء الحذف النهائي');
      setShowDeleteModal(false);
      setSelectedId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-t-[10px] shadow-lg p-8 pb-0">
          <h1 className="text-2xl font-bold text-gray-800 ">التأشيرات المحذوفة</h1>
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
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الوكيل</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم البطاقة</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الجوال</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم الوكيل</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم جوال الوكيل</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الميلاد</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الطلب</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع التأشيرة</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-8 text-gray-500 font-bold">لا توجد تأشيرات محذوفة</td>
                      </tr>
                    ) : (
                      agents.map(agent => (
                        <tr key={agent._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{agent.fullName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.cardNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.managerName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.managerPhone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.birthDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{
                            agent.status === 'pending' ? 'قيد الانتظار' :
                            agent.status === 'accepted' ? 'مقبول' :
                            agent.status === 'rejected' ? 'مرفوض' :
                            agent.status
                          }</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.visaType}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex gap-2">
                              <button
                                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-1 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition"
                                onClick={() => { setSelectedId(agent._id); setShowModal(true); }}
                              >
                                ارجاع
                              </button>
                              <button
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-1 rounded-lg hover:from-red-600 hover:to-red-700 transition"
                                onClick={() => { setSelectedId(agent._id); setShowDeleteModal(true); }}
                              >
                                حذف نهائي
                              </button>
                            </div>
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
      </div>
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); setSelectedId(null); }}>
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold text-gray-800">تأكيد إرجاع التأشيرة</div>
          <div className="mb-6 text-gray-600">هل أنت متأكد أنك تريد إرجاع هذه التأشيرة؟</div>
          <div className="flex justify-center gap-4">
            <button onClick={handleReturn} className="px-6 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold hover:from-emerald-600 hover:to-blue-600 transition">تأكيد الإرجاع</button>
            <button onClick={() => { setShowModal(false); setSelectedId(null); }} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition">إلغاء</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDeleteModal} onClose={() => { setShowDeleteModal(false); setSelectedId(null); }}>
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold text-red-800">تأكيد الحذف النهائي</div>
          <div className="mb-6 text-gray-600">هل أنت متأكد أنك تريد حذف هذه التأشيرة نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.</div>
          <div className="flex justify-center gap-4">
            <button onClick={handleDeletePermanently} className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:from-red-600 hover:to-red-700 transition">تأكيد الحذف</button>
            <button onClick={() => { setShowDeleteModal(false); setSelectedId(null); }} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition">إلغاء</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeletedAgentsPage; 