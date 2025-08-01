import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Phone, CreditCard, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useDeleteAgent } from './Dashboard/hooks/useDeleteAgent';
import { useDeleteAgentPermanently } from './Dashboard/hooks/useDeleteAgentPermanently';
import Modal from '../components/Modal';

const statusOptions = [
  { value: 'pending', label: 'قيد التنفيذ' },
  { value: 'accepted', label: 'مقبول' },
  { value: 'rejected', label: 'مرفوض' },
];

const EditSingleAgentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    cardNumber: '',
    managerName: '',
    managerPhone: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    status: 'pending',
    passportNumber: '',
    visaType: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { deleteAgent, loading: deleteLoading, error: deleteError, success: deleteSuccess } = useDeleteAgent();
  const { deleteAgentPermanently, loading: deletePermanentLoading, error: deletePermanentError, success: deletePermanentSuccess } = useDeleteAgentPermanently();
  const [showModal, setShowModal] = useState(false);
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false);

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/agent/${id}`);
        const agent = res.data;
        let birthYear = '', birthMonth = '', birthDay = '';
        if (agent.birthDate) {
          const [y, m, d] = agent.birthDate.split('-');
          birthYear = y || '';
          birthMonth = m || '';
          birthDay = d || '';
        }
        setForm({
          fullName: agent.fullName || '',
          phone: agent.phone || '',
          cardNumber: agent.cardNumber || '',
          managerName: agent.managerName || '',
          managerPhone: agent.managerPhone || '',
          birthYear,
          birthMonth,
          birthDay,
          status: agent.status || 'pending',
          passportNumber: agent.passportNumber || '',
          visaType: agent.visaType || ''
        });
        setLoading(false);
      } catch (err: any) {
        setError('تعذر تحميل بيانات الوكيل');
        setLoading(false);
      }
    };
    fetchAgent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const birthDate = form.birthYear && form.birthMonth && form.birthDay
        ? `${form.birthYear}-${form.birthMonth.padStart(2, '0')}-${form.birthDay.padStart(2, '0')}`
        : '';
      await axios.put(`/agent/${id}`, {
        fullName: form.fullName,
        phone: form.phone,
        cardNumber: form.cardNumber,
        managerName: form.managerName,
        managerPhone: form.managerPhone,
        birthDate,
        status: form.status,
        passportNumber: form.passportNumber,
        visaType: form.visaType
      });
      setSuccess(true);
      setLoading(false);
     
    } catch (err: any) {
      setError(err.response?.data?.error || 'حدث خطأ');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setShowModal(false);
    try {
      await deleteAgent(id!);
      setTimeout(() => {
        navigate(-1);
      }, 200);
    } catch {}
  };

  const handleDeletePermanently = async () => {
    setShowPermanentDeleteModal(false);
    try {
      await deleteAgentPermanently(id!);
      setTimeout(() => {
        navigate(-1);
      }, 200);
    } catch {}
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-8" dir="rtl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-t-[10px] shadow-lg p-8 pb-0">
          <div className='w-fit mx-auto'>
            <div className="flex items-center justify-center mb-2 w-fit mx-auto">
              <div className="bg-emerald-100 p-3 rounded-full ml-4">
                <Edit className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-xl  md:text-3xl font-bold text-gray-800">تعديل بيانات التأشيرة</h1>
            </div>
            <div className="w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
        </div>
        <div className="bg-white rounded-b-xl shadow-lg p-5 md:p-8">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              رجوع
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم طالب التأشيرة</label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجوال</label>
              <div className="relative">
                <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم الحدود</label>
              <div className="relative">
                <CreditCard className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <input type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم الوكيل</label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <input type="text" name="managerName" value={form.managerName} onChange={handleChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم جوال الوكيل</label>
              <div className="relative">
                <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <input type="text" name="managerPhone" value={form.managerPhone} onChange={handleChange} className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجواز</label>
              <div className="relative">
                <input type="text" name="passportNumber" placeholder="رقم الجواز" value={form.passportNumber} onChange={handleChange} className="w-full pr-4 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الميلاد</label>
              <div className="flex gap-2">
                <div className="relative w-full md:w-fit mb-2">
                  <select name="birthYear" value={form.birthYear} onChange={handleChange} className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400">
                    <option value="">السنة</option>
                    {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </div>
                <div className="relative w-full md:w-fit mb-2">
                  <select name="birthMonth" value={form.birthMonth} onChange={handleChange} className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400">
                    <option value="">الشهر</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                      <option key={month} value={month.toString().padStart(2, '0')}>{month}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </div>
                <div className="relative w-full md:w-fit mb-2">
                  <select name="birthDay" value={form.birthDay} onChange={handleChange} className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400">
                    <option value="">اليوم</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                      <option key={day} value={day.toString().padStart(2, '0')}>{day}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">حالة الطلب</label>
              <div className="relative">
                <select name="status" value={form.status} onChange={handleChange} className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400">
                  <option value="pending">قيد الانتظار</option>
                  <option value="accepted">مقبول</option>
                  <option value="rejected">مرفوض</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع التأشيرة</label>
              <div className="relative">
                <select name="visaType" value={form.visaType} onChange={handleChange} className="bg-white shadow-sm rounded-lg border-2 border-blue-200 focus:border-blue-500 px-2 py-2 pr-12 text-sm appearance-none transition-all duration-200 hover:border-blue-400">
                  <option value="">اختر نوع التأشيرة</option>
                  <option value="زيارة">زيارة</option>
                  <option value="عمرة">عمرة</option>
                  <option value="عمل">عمل</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center flex-col items-center gap-2 mt-8">
            <button type="button" onClick={handleSubmit} disabled={loading} className={`flex  items-center gap-2 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 ${loading ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r  from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700'}`}>
              <Save className="h-5 w-5" />
              {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
            <div className='flex gap-2'>
            <button type="button" onClick={() => setShowModal(true)} disabled={deleteLoading} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 ml-4 bg-gradient-to-r from-orange-600 to-yellow-600 text-white hover:from-orange-700 hover:to-yellow-700">
              <Trash2 className="h-5 w-5" />
              {deleteLoading ? 'جاري الحذف...' : 'حذف مؤقت'}
            </button>
            <button type="button" onClick={() => setShowPermanentDeleteModal(true)} disabled={deletePermanentLoading} className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 ml-4 bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700">
              <Trash2 className="h-5 w-5" />
              {deletePermanentLoading ? 'جاري الحذف...' : 'حذف نهائي'}
            </button>
            </div>
          </div>
          {error && <div className="flex justify-center mt-4"><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div></div>}
          {success && <div className="flex justify-center mt-4"><div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">تم تحديث بيانات التأشيرة بنجاح</div></div>}
          {deleteError && <div className="flex justify-center mt-4"><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{deleteError}</div></div>}
          {deleteSuccess && <div className="flex justify-center mt-4"><div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded ">تم حذف الوكيل مؤقتاً بنجاح</div></div>}
          {deletePermanentError && <div className="flex justify-center mt-4"><div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{deletePermanentError}</div></div>}
          {deletePermanentSuccess && <div className="flex justify-center mt-4"><div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded ">تم حذف الوكيل نهائياً بنجاح</div></div>}
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold text-gray-800">تأكيد الحذف المؤقت</div>
          <div className="mb-6 text-gray-600">هل أنت متأكد أنك تريد حذف هذه التأشيرة مؤقتاً؟ يمكنك إرجاعها لاحقاً من صفحة التأشيرات المحذوفة.</div>
          <div className="flex justify-center gap-4">
            <button onClick={handleDelete} className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-yellow-600 text-white font-bold hover:from-orange-700 hover:to-yellow-700 transition">تأكيد الحذف المؤقت</button>
            <button onClick={() => setShowModal(false)} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition">إلغاء</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showPermanentDeleteModal} onClose={() => setShowPermanentDeleteModal(false)}>
        <div className="text-center">
          <div className="mb-4 text-2xl font-bold text-red-800">تأكيد الحذف النهائي</div>
          <div className="mb-6 text-gray-600">هل أنت متأكد أنك تريد حذف هذه التأشيرة نهائياً؟ هذا الإجراء لا يمكن التراجع عنه.</div>
          <div className="flex justify-center gap-4">
            <button onClick={handleDeletePermanently} className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold hover:from-red-700 hover:to-pink-700 transition">تأكيد الحذف النهائي</button>
            <button onClick={() => setShowPermanentDeleteModal(false)} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition">إلغاء</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EditSingleAgentPage; 