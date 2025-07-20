import "./App.css";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import { config } from "@fortawesome/fontawesome-svg-core";
import Layout from "./Layout";
// import "@fortawesome/fontawesome-svg-core/styles.css";
import axios from "axios";
import { Suspense, lazy } from "react";

// Import all components directly


import "@fortawesome/fontawesome-svg-core/styles.css";
import Dashboard from "./pages/Dashboard";
import { WorkerDetailsPage, GuarantorDetailsPage } from "./pages/beneficiaryDetails";

import RecordsPage from "./pages/RecordsPage";
import WorkersDetailsPage from "./pages/WorkersDetailsPage";
import EditGuarantorPage from "./pages/EditGuarantorPage";
import { MoonLoader } from "react-spinners";
import { DashboardProvider } from "./contexts/DashboardContext";

 

const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));

axios.defaults.withCredentials = true;   
config.autoAddCss = false;

function App() { 

  
  return ( 
    <BrowserRouter>
      <DashboardProvider>
        <Suspense fallback={<div className="w-full h-screen flex justify-center items-center">
          <MoonLoader />
        </div>}>
          <Routes>
          
           
            <Route element={<Layout><AdminLayout /></Layout>}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/guarantor/:id" element={<GuarantorDetailsPage />} />
              <Route path="/records" element={<RecordsPage />} />
              <Route path="/guarantor-details/:cardId" element={<GuarantorDetailsPage />} />
              <Route path="/workers-details" element={<WorkersDetailsPage />} />
              <Route path="/worker-details/:residenceNumber" element={<WorkerDetailsPage />} />
              <Route path="/edit-guarantor/:cardNumber" element={<EditGuarantorPage />} />
            </Route>
          </Routes>
        </Suspense>
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;