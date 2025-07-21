import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import BeneficiariesList from "./components/BeneficiariesList";
import Reports from "./components/Reports";
import EditReports from "./components/EditReports";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutAdmin } from "../../store/slices/dashboard/AdminSlice";
import FinalReportsTable from "./components/FinalReportsTable";
import AcceptedRecords from "./components/AcceptedRecords";
import ProcessFlow from "./components/ProcessFlow";
import { usePersistentState } from "../../hooks/usePersistentState";
import DeletedList from "./components/DeletedList";
import CreateSponsorPage from "../CreateSponsorPage";
import RecordsPage from "../RecordsPage";
import CreateAgentPage from '../CreateAgentPage';
import EditAgentPage from '../EditAgentPage';

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [admin, setAdmin] = useState<any>(null);
  const history = useNavigate()
  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = usePersistentState('dashboard_activeTab', 'beneficiaries');
  useEffect(() => {
    try {
      const adminData = JSON.parse(localStorage.getItem("admin") || "null");
      setAdmin(adminData);
      
      // If user is not manager or committee and current tab is processFlow, redirect to beneficiaries
      if (adminData && adminData.rule !== "manager" && adminData.rule !== "committee" && activeTab === "processFlow") {
        setActiveTab("beneficiaries");
      }
    } catch (e) {
      setAdmin(null);
    }
  }, [activeTab, setActiveTab]);

  const handleTabClick = (tab:string) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "beneficiaries":
        return <CreateSponsorPage />;
      case "reports":
        return <Reports />;
      case "editReports":
        return <EditReports />;
      case "acceptedRecords":
        return <RecordsPage />;
      case "createAgent":
        return <CreateAgentPage />;
      case "editAgent":
        return <EditAgentPage />;
      case "processFlow":
        // Only allow access to ProcessFlow if user is manager or committee
        if (admin && (admin.rule === "manager" || admin.rule === "committee")) {
          return <ProcessFlow />;
        } else {
          setActiveTab("beneficiaries");
          return <BeneficiariesList />;
        }
      case "deletedList":
        // Only allow access to DeletedList if user is reviewer
        if (admin && admin.rule === "reviewer") {
          return <DeletedList />;
        } else {
          setActiveTab("beneficiaries");
          return <BeneficiariesList />;
        }
      default:
        return <BeneficiariesList />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50" style={{ direction: 'rtl' }}>
      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Hamburger button for mobile */}
      <button
        className="fixed top-4 right-4 z-50 p-3 rounded-lg bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg hover:from-blue-600 hover:to-emerald-600 transition-colors lg:hidden"
        onClick={() => setIsMenuOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-80 bg-gradient-to-br from-gray-50 to-blue-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
      } flex flex-col h-full`}>
        {/* Header */}
        <div className="px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold !text-gray-800 !mb-[20px] !mt-[19px]">لوحة تحكم حقيبة الإنجاز</h2>
            {/* Close button for mobile */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>
          {/* Admin Info Section */}
           
            <div className="mt-4 mb-4 p-4 rounded-2xl bg-gradient-to-r from-blue-100 to-emerald-100 text-right shadow border-2 border-blue-300">
              <div className="text-lg font-bold text-blue-800 mb-1">
                <span className="text-gray-600 font-bold">الاسم: </span>
                <span>يوسف القاسمي</span>
              </div>
              <div className="text-base font-semibold text-gray-700">
                <span className="text-gray-600 font-bold">الدور: </span>
                <span className="text-green-600 font-extrabold">المدير</span>
              </div>
            </div>
          
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
          <button
            className={`w-full p-3 mb-2  md:px-4 md:py-3 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
              activeTab === "beneficiaries"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:shadow-md"
            }`}
            onClick={() => handleTabClick("beneficiaries")}
          >
            انشاء كفيل وعمال
          </button>
          <button
            className={`w-full p-3 mb-2  md:px-4 md:py-3 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
              activeTab === "createAgent"
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:shadow-md"
            }`}
            onClick={() => handleTabClick("createAgent")}
          >
             طلب تأشيرة
          </button>
          
          <button
            className={`w-full p-3 mb-1 md:px-4 md:py-3 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
              activeTab === "reports"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:shadow-md"
            }`}
            onClick={() => handleTabClick("reports")}
          >
            تقارير المدفوعات
          </button>

          <button
            className={`w-full p-3 mb-1 md:px-4 md:py-3 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
              activeTab === "acceptedRecords"
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:shadow-md"
            }`}
            onClick={() => handleTabClick("acceptedRecords")}
          >
            السجل 
          </button>

          {/* Only show Process Flow button if admin.rule === 'manager' */}
          {/* {admin && (admin.rule === "manager" || admin.rule === "committee") && (
            <button
            className={`w-full p-3 mb-1 md:px-4 md:py-3 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
              activeTab === "processFlow"
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:shadow-md"
              }`}
              onClick={() => handleTabClick("processFlow")}
              >
              سير العمليات
              </button>
              )} */}

          {/* Only show this button if admin.rule === 'manager' */}
          
            <button
              className={`w-full p-3  md:px-4 md:py-3 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
                activeTab === "editReports"
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:shadow-md"
              }`}
              onClick={() => handleTabClick("editReports")}
            >
              تعديل البيانات
            </button>
          
          {/* قائمة المحذوفين */}
         
              <button
                className={`w-full p-3 mb-1 md:px-4 md:py-3 rounded-xl text-lg font-semibold text-right transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "editAgent"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200 hover:shadow-md"
                }`}
                onClick={() => handleTabClick("editAgent")}
              >
                تعديل  التأشيرات
              </button>
          
          <div className="pt-2 space-y-3">
            {/* External Links Section */}
            {/* <div className="border-t border-gray-200 pt-4 ">
              <h4 className="text-sm font-semibold text-gray-600 mb-3 px-2">روابط خارجية</h4>
              
              <a
                href="https://docs.google.com/spreadsheets/d/1WORSmVcCuDVbGKs2tdMa7y8KTxRfSuJKbgK4WihrnG8/edit?resourcekey=&gid=181545746#gid=181545746"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-3 rounded-xl text-sm font-semibold text-right bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 transition-all duration-300 transform hover:scale-105 hover:from-red-600 hover:to-red-700 flex items-center justify-center gap-2"
              >
                <span>📊</span>
                قائمة المرفوضين
              </a>
              
              <a
                href="https://docs.google.com/spreadsheets/d/1PfXGfu5ByUYymI8qYyd6TG7PDxjbCMqS1NOG0eD1GGc/edit?resourcekey=&gid=1831758013#gid=1831758013"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-3 rounded-xl text-sm font-semibold text-right bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/30 transition-all duration-300 transform hover:scale-105 hover:from-green-600 hover:to-green-700 flex items-center justify-center gap-2 mt-3"
              >
                <span>📈</span>
                قائمة المقبولين
              </a>
            </div> */}
            
            <button
              className="w-full p-3  md:px-4 md:py-3 rounded-xl text-lg font-semibold text-right bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 transition-all duration-300 transform hover:scale-105 hover:from-red-600 hover:to-red-700"
              onClick={() => {
                setIsMenuOpen(false);
                
           
                localStorage.removeItem("admin");
                localStorage.removeItem('dashboard_activeTab');
                localStorage.removeItem('processFlow_currentPage');
                localStorage.removeItem('acceptedRecords_currentPage');
                localStorage.removeItem('acceptedRecords_filters');
                localStorage.removeItem('acceptedRecords_viewMode');
                localStorage.removeItem('acceptedRecords_showFilters');
                localStorage.removeItem('editReports_currentPage');
                localStorage.removeItem('editReports_filters');
                localStorage.removeItem('editReports_showFilters');
                localStorage.removeItem('beneficiaries_currentPage');
                localStorage.removeItem('beneficiaries_filters');
                localStorage.removeItem('beneficiaries_showFilters');
                localStorage.removeItem('reports_currentPage');
                localStorage.removeItem('reports_filters');
                localStorage.removeItem('reports_showFilters');
                
                dispatch(logoutAdmin())
                history("/login")
              }}
            >
              تسجيل الخروج
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="w-[97%] max-w-[1400px] mx-auto">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;