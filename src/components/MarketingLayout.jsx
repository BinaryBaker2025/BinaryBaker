import { useState } from "react";
import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo.jsx";
import FloatingWhatsApp from "./FloatingWhatsApp.jsx";
import useRevealOnScroll from "../hooks/useRevealOnScroll.js";
import { navLinkClass, mobileNavLinkClass, trustStripClass } from "../styles/marketingTokens.js";
import { brandLink, buttonPrimary, pageShell } from "../styles/uiTokens.js";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const footerLinks = [
  { to: "/services", label: "Services" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/about", label: "About" },
  { to: "/privacy-policy", label: "Privacy Policy" },
];

export default function MarketingLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useRevealOnScroll();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen">
      {/* Sticky nav — full width */}
      <header className="sticky top-0 z-50 border-b border-cream/[0.07] bg-ink/96 backdrop-blur-md">
        <div className={`${pageShell} flex items-center justify-between py-4`}>
          <Link
            className={brandLink}
            to="/"
            aria-label="Binary Baker home"
            onClick={closeMobileMenu}
          >
            <BrandLogo />
          </Link>

          {/* Desktop links */}
          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link key={item.to} className={navLinkClass} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              className={`${buttonPrimary} hidden lg:inline-flex`}
              to="/free-quote"
            >
              Free Quote
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-[7px] border border-cream/[0.1] transition-colors duration-200 hover:border-cream/25 hover:bg-cream/[0.06] lg:hidden"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav"
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
            >
              <span className="flex flex-col items-center justify-center gap-[6px]" aria-hidden="true">
                <span className={`h-[1.5px] w-4 rounded-full bg-cream/70 transition-all duration-300 origin-center ${isMobileMenuOpen ? "translate-y-[7px] rotate-45 bg-cream" : ""}`} />
                <span className={`h-[1.5px] w-4 rounded-full bg-cream/70 transition-all duration-300 ${isMobileMenuOpen ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`h-[1.5px] w-4 rounded-full bg-cream/70 transition-all duration-300 origin-center ${isMobileMenuOpen ? "-translate-y-[7px] -rotate-45 bg-cream" : ""}`} />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div id="mobile-nav" className="menu-slide-down border-t border-cream/[0.06] bg-ink lg:hidden">
            <nav>
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  className={mobileNavLinkClass}
                  to={item.to}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="px-5 py-4">
              <Link
                className={`${buttonPrimary} w-full`}
                to="/free-quote"
                onClick={closeMobileMenu}
              >
                Get a Free Quote
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <div className={`${pageShell} pb-24 pt-10 sm:pt-14`}>
        <main>{children}</main>

        <p className={`reveal ${trustStripClass} mt-16`}>
          <span className="mr-2 inline-block text-blue">✦</span>
          Helping South African businesses move faster with better websites and software.
          <span className="ml-2 inline-block text-blue">✦</span>
        </p>

        <footer className="grid gap-8 border-t border-cream/[0.08] py-12 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-serif text-base font-bold text-cream">Binary Baker</p>
            <p className="mt-1.5 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-cream/35">
              Web &amp; software solutions · Gauteng
            </p>
            <p className="mt-3 text-[0.85rem] leading-relaxed text-cream/50">
              Websites, web apps, and custom software — built to speed up and simplify how your business runs.
            </p>
          </div>
          <div>
            <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-cream/35">Pages</p>
            <div className="grid gap-2.5">
              {footerLinks.map((item) => (
                <Link
                  key={item.to}
                  className="text-cream/55 transition-colors hover:text-cream"
                  to={item.to}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-cream/35">Contact</p>
            <div className="grid gap-2.5">
              <a
                className="flex items-center gap-2 text-cream/55 transition-colors hover:text-cream"
                href="mailto:bradley@binarybaker.co.za"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="14" height="10" rx="1.5" />
                  <path d="M1 4l7 5 7-5" />
                </svg>
                bradley@binarybaker.co.za
              </a>
              <a
                className="flex items-center gap-2 text-cream/55 transition-colors hover:text-cream"
                href="https://wa.me/27611011669"
              >
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 1a7 7 0 017 7c0 3.87-3.13 7-7 7a6.97 6.97 0 01-3.67-1.03L1 15l1.06-3.23A6.96 6.96 0 011 8a7 7 0 017-7z" />
                  <path d="M5.5 7.5c0 2.21 1.79 4 4 4 .55 0 1-.45 1-1v-.5a.5.5 0 00-.5-.5h-.5a.5.5 0 01-.5-.5v-.5a.5.5 0 00-.5-.5h-.5C5.95 8 5.5 7.78 5.5 7.5z" />
                </svg>
                WhatsApp
              </a>
              <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.28em] text-cream/25">
                Remote worldwide
              </p>
            </div>
          </div>
        </footer>
      </div>

      <FloatingWhatsApp />
    </div>
  );
}
