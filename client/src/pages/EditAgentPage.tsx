import React, { useState, useEffect } from 'react';
import { User, Phone, CreditCard, Edit } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditAgentPage: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any | null>(null);
  const [search, setSearch] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const filteredAgents = Array.isArray(agents) ? agents.filter(agent =>
    String(agent.cardNumber || '').includes(search) ||
    String(agent.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    String(agent.phone || '').includes(search)
  ) : [];

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/agent');
      setAgents(res.data);
      setLoading(false);
    } catch (err: any) {
      setError('تعذر تحميل بيانات الوكلاء');
      setLoading(false);
    }
  };

  const handleEditClick = async (cardNumber: string) => {
    navigate(`/edit-agent/${cardNumber}`);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    setError('');
    setSuccess(false);
    try {
      const birthDate = editForm.birthYear && editForm.birthMonth && editForm.birthDay
        ? `${editForm.birthYear}-${editForm.birthMonth.padStart(2, '0')}-${editForm.birthDay.padStart(2, '0')}`
        : '';
      await axios.put(`/agent/${selectedAgent.cardNumber}`, {
        fullName: editForm.fullName,
        phone: editForm.phone,
        cardNumber: editForm.cardNumber,
        managerName: editForm.managerName,
        managerPhone: editForm.managerPhone,
        birthDate
      });
      setSuccess(true);
      setSelectedAgent(null);
      setEditForm(null);
      fetchAgents();
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 10px;
          border: 2px solid #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #059669, #047857);
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #10b981 #f1f5f9;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-t-[10px] shadow-lg p-8 pb-0">
          <div className='w-fit mx-auto'>
            <div className="flex items-center justify-center mb-2 w-fit mx-auto">
              <div className="bg-emerald-100 p-3 rounded-full ml-4">
                <Edit className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-xl  md:text-3xl font-bold text-gray-800">تعديل التأشيرات </h1>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-b-xl shadow-lg p-5 md:p-8">
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
            <input
              type="text"
              placeholder="البحث ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="overflow-x-auto rounded-lg max-h-[69vh] overflow-y-auto custom-scrollbar">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[150px]">اسم الوكيل</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الحدود</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم الجوال</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider max-w-[150px]">اسم الوكيل</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">رقم جوال الوكيل</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاريخ الميلاد</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">حالة الطلب</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نوع التأشيرة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تعديل</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAgents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500 text-lg">
                      <div className="flex flex-col items-center justify-center">
                        <User className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد بيانات وكلاء حالياً</h3>
                        <p className="mt-1 text-sm text-gray-500">{search ? 'لا توجد نتائج للبحث المطلوب' : 'لم يتم العثور على أي وكلاء'}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAgents.map(agent => (
                    <tr key={agent._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 max-w-[150px]">
                        <span className="truncate block w-full" title={agent.fullName}>
                          {agent.fullName}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.cardNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agent.phone}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[150px]">
                        <span className="truncate block w-full" title={agent.managerName}>
                          {agent.managerName}
                        </span>
                      </td>
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
                        <button
                          className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-1 rounded-lg hover:from-emerald-600 hover:to-blue-600 transition"
                          onClick={() => handleEditClick(agent._id)}
                        >
                          تعديل
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* فورم التعديل */}
          {editForm && (
            <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h2 className="text-lg font-bold mb-4">تعديل بيانات التأشيرة</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم الكفيل</label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    <input type="text" name="fullName" value={editForm.fullName} onChange={handleEditChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجوال</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    <input type="text" name="phone" value={editForm.phone} onChange={handleEditChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم الحدود</label>
                  <div className="relative">
                    <CreditCard className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    <input type="text" name="cardNumber" value={editForm.cardNumber} onChange={handleEditChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">اسم الوكيل</label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    <input type="text" name="managerName" value={editForm.managerName} onChange={handleEditChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">رقم جوال الوكيل</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                    <input type="text" name="managerPhone" value={editForm.managerPhone} onChange={handleEditChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الميلاد</label>
                  <div className="flex gap-2">
                    <select name="birthYear" value={editForm.birthYear} onChange={handleEditChange} className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400">
                      <option value="">السنة</option>
                      {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    <select name="birthMonth" value={editForm.birthMonth} onChange={handleEditChange} className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400">
                      <option value="">الشهر</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <option key={month} value={month.toString().padStart(2, '0')}>{month}</option>
                      ))}
                    </select>
                    <select name="birthDay" value={editForm.birthDay} onChange={handleEditChange} className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400">
                      <option value="">اليوم</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day.toString().padStart(2, '0')}>{day}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <button type="button" onClick={handleEditSubmit} className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700">
                  <Edit className="h-5 w-5" />
                  حفظ التعديلات
                </button>
                <button type="button" onClick={() => { setSelectedAgent(null); setEditForm(null); }} className="ml-4 px-6 py-3 rounded-xl font-semibold text-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all duration-200">إلغاء</button>
              </div>
              {error && <div className="flex justify-center mt-4"><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div></div>}
              {success && <div className="flex justify-center mt-4"><div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">تم تحديث بيانات التأشيرة بنجاح</div></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditAgentPage; 