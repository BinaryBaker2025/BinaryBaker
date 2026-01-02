import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Portal from "./pages/Portal.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminLayout from "./pages/AdminLayout.jsx";
import AdminProjects from "./pages/AdminProjects.jsx";
import AdminClients from "./pages/AdminClients.jsx";
import AdminAccess from "./pages/AdminAccess.jsx";
import AdminBilling from "./pages/AdminBilling.jsx";
import AdminManagement from "./pages/AdminManagement.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";
import PublicInvoicePage from "./modules/billing/pages/PublicInvoicePage.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="access" element={<AdminAccess />} />
          <Route path="billing" element={<AdminBilling />} />
          <Route path="management" element={<AdminManagement />} />
        </Route>
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/p/invoice/:token" element={<PublicInvoicePage />} />
      </Routes>
    </BrowserRouter>
  );
}
