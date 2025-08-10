// import "./App.css";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { config } from "@fortawesome/fontawesome-svg-core";
// import axios from "axios";
// import { Suspense, lazy } from "react";
// import { MoonLoader } from "react-spinners";
// import { DashboardProvider } from "./contexts/DashboardContext";
// import Landing from "./pages/Landing";
// import Layout from "./Layout";

// import "@fortawesome/fontawesome-svg-core/styles.css";
// config.autoAddCss = false;
// axios.defaults.withCredentials = true;

// // Lazy load for dashboard-related pages
// const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
// const AdminLogin = lazy(() => import("./pages/AdminLogin"));
// const Dashboard = lazy(() => import("./pages/Dashboard"));
// const WorkerDetailsPage = lazy(() => import("./pages/beneficiaryDetails").then(m => ({ default: m.WorkerDetailsPage })));
// const GuarantorDetailsPage = lazy(() => import("./pages/beneficiaryDetails").then(m => ({ default: m.GuarantorDetailsPage })));
// const RecordsPage = lazy(() => import("./pages/RecordsPage"));
// const WorkersDetailsPage = lazy(() => import("./pages/WorkersDetailsPage"));
// const EditGuarantorPage = lazy(() => import("./pages/EditGuarantorPage"));
// const EditSingleAgentPage = lazy(() => import("./pages/EditSingleAgentPage"));

// function App() {
//   return (
//     <BrowserRouter>
//       <DashboardProvider>
//         <Suspense
//           fallback={
//             <div className="w-full h-screen flex justify-center items-center">
//               <MoonLoader />
//             </div>
//           }
//         >
//           <Routes>
//             {/* Landing page loads instantly */}
//             <Route path="/" element={<Landing />} />

//             {/* Dashboard pages are lazy loaded */}
//             <Route element={<Layout><AdminLayout /></Layout>}>
//               <Route path="/dashboard" element={<Dashboard />} />
//               <Route path="/login" element={<AdminLogin />} />
//               <Route path="/guarantor/:id" element={<GuarantorDetailsPage />} />
//               <Route path="/records" element={<RecordsPage />} />
//               <Route path="/guarantor-details/:cardId" element={<GuarantorDetailsPage />} />
//               <Route path="/workers-details" element={<WorkersDetailsPage />} />
//               <Route path="/worker-details/:residenceNumber" element={<WorkerDetailsPage />} />
//               <Route path="/edit-guarantor/:cardNumber" element={<EditGuarantorPage />} />
//               <Route path="/edit-agent/:id" element={<EditSingleAgentPage />} />
//             </Route>
//           </Routes>
//         </Suspense>
//       </DashboardProvider>
//     </BrowserRouter>
//   );
// }

// export default App;

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { config } from "@fortawesome/fontawesome-svg-core";
import axios from "axios";
import { Suspense, lazy } from "react";
import { MoonLoader } from "react-spinners";
import { DashboardProvider } from "./contexts/DashboardContext";
import Landing from "./pages/Landing";
import Layout from "./Layout";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;
axios.defaults.withCredentials = true;

// Lazy load كل صفحات الـ dashboard
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const WorkerDetailsPage = lazy(() =>
  import("./pages/beneficiaryDetails").then((m) => ({
    default: m.WorkerDetailsPage,
  }))
);
const GuarantorDetailsPage = lazy(() =>
  import("./pages/beneficiaryDetails").then((m) => ({
    default: m.GuarantorDetailsPage,
  }))
);
const RecordsPage = lazy(() => import("./pages/RecordsPage"));
const WorkersDetailsPage = lazy(() => import("./pages/WorkersDetailsPage"));
const EditGuarantorPage = lazy(() => import("./pages/EditGuarantorPage"));
const EditSingleAgentPage = lazy(() => import("./pages/EditSingleAgentPage"));

function Loading() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <MoonLoader />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <DashboardProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* صفحة الهوم العامة */}
            <Route path="/" element={<Landing />} />

            {/* صفحات الـ dashboard (كلها lazy load) */}
            <Route element={<Layout><AdminLayout /></Layout>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/guarantor/:id" element={<GuarantorDetailsPage />} />
              <Route path="/records" element={<RecordsPage />} />
              <Route path="/guarantor-details/:cardId" element={<GuarantorDetailsPage />} />
              <Route path="/workers-details" element={<WorkersDetailsPage />} />
              <Route path="/worker-details/:residenceNumber" element={<WorkerDetailsPage />} />
              <Route path="/edit-guarantor/:cardNumber" element={<EditGuarantorPage />} />
              <Route path="/edit-agent/:id" element={<EditSingleAgentPage />} />
            </Route>
          </Routes>
        </Suspense>
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;
