import { useEffect, useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import FreeQuote from "./pages/FreeQuote.jsx";
import Home from "./pages/Home.jsx";
import Newsletter from "./pages/Newsletter.jsx";
import NotFound from "./pages/NotFound.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsAndConditions from "./pages/TermsAndConditions.jsx";
import SeoStatus from "./pages/SeoStatus.jsx";
import Services from "./pages/Services.jsx";
import BusinessSystemsPage from "./pages/services/BusinessSystemsPage.jsx";
import EcommerceIntegrationsPage from "./pages/services/EcommerceIntegrationsPage.jsx";
import WebsiteDesignDevelopmentPage from "./pages/services/WebsiteDesignDevelopmentPage.jsx";
import WebsiteMaintenancePage from "./pages/services/WebsiteMaintenancePage.jsx";
import PublicInvoicePage from "./modules/billing/pages/PublicInvoicePage.tsx";
import { analytics } from "./firebase.js";

function FirebaseAnalyticsRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (!analytics) {
      return;
    }

    logEvent(analytics, "page_view", {
      page_path: `${location.pathname}${location.search}${location.hash}`,
      page_location: window.location.href,
      page_title: document.title
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}

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
      <FirebaseAnalyticsRouteTracker />
      <MetaPixelRouteTracker />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route
          path="/services/website-design-development"
          element={<WebsiteDesignDevelopmentPage />}
        />
        <Route path="/services/business-systems" element={<BusinessSystemsPage />} />
        <Route
          path="/services/ecommerce-integrations"
          element={<EcommerceIntegrationsPage />}
        />
        <Route path="/services/website-maintenance" element={<WebsiteMaintenancePage />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/free-quote" element={<FreeQuote />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/seo-status" element={<SeoStatus />} />
        <Route path="/portal" element={<Navigate to="/" replace />} />
        <Route path="/admin/*" element={<Navigate to="/" replace />} />
        <Route path="/customer" element={<Navigate to="/" replace />} />
        <Route path="/client" element={<Navigate to="/" replace />} />
        <Route path="/p/invoice/:token" element={<PublicInvoicePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
