import { useEffect, useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import PublicInvoicePage from "./modules/billing/pages/PublicInvoicePage.tsx";

function MetaPixelRouteTracker() {
  const location = useLocation();
  const isFirstRoute = useRef(true);

  useEffect(() => {
    if (isFirstRoute.current) {
      isFirstRoute.current = false;
      return;
    }

    if (typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [location.pathname, location.search, location.hash]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <MetaPixelRouteTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portal" element={<Navigate to="/" replace />} />
        <Route path="/admin/*" element={<Navigate to="/" replace />} />
        <Route path="/customer" element={<Navigate to="/" replace />} />
        <Route path="/client" element={<Navigate to="/" replace />} />
        <Route path="/p/invoice/:token" element={<PublicInvoicePage />} />
      </Routes>
    </BrowserRouter>
  );
}
