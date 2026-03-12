import { Link, useLocation } from "react-router-dom";
import MarketingLayout from "../components/MarketingLayout.jsx";
import useSeoPage from "../seo/useSeoPage.js";
import {
  sectionBodyClass,
  sectionEyebrowLightClass,
  sectionHeadingClass,
  splitPanelDarkClass,
  surfaceCardClass,
  surfaceHoverClass
} from "../styles/marketingTokens.js";
import { buttonGhost, buttonPrimary } from "../styles/uiTokens.js";

const quickHelp = [
  "Return to Home to view active service pages.",
  "Open Contact if you need direct assistance.",
  "Use Free Quote to send your project requirements."
];

export default function NotFound() {
  const location = useLocation();
  const requestedPath = `${location.pathname}${location.search}${location.hash}` || "/";
  useSeoPage("notFound", { indexable: false });

  return (
    <MarketingLayout>
      <section className="reveal py-12 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className={`${surfaceCardClass} p-6 sm:p-8`}>
            <p className={sectionEyebrowLightClass}>Error 404</p>
            <h1 className={sectionHeadingClass}>We could not find this page.</h1>
            <p className={`${sectionBodyClass} max-w-2xl`}>
              The URL may be incorrect, the page could have moved, or it may no longer exist.
            </p>

            <div className="mt-5 rounded-[14px] border border-cream/10 bg-cream/5 px-4 py-3">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-cream/50">
                Requested path
              </p>
              <p className="mt-2 break-all font-mono text-xs text-blue">{requestedPath}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link className={buttonPrimary} to="/">
                Back to Home
              </Link>
              <Link className={buttonGhost} to="/contact">
                Contact Us
              </Link>
            </div>
          </div>

          <div className={splitPanelDarkClass}>
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-cream/75">
              Quick Help
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-cream">Find what you need fast</h2>
            <div className="mt-5 grid gap-3">
              {quickHelp.map((item) => (
                <article key={item} className="rounded-xl border border-cream/25 bg-cream/10 px-4 py-3 text-sm text-cream/90">
                  {item}
                </article>
              ))}
            </div>
            <Link className={`${buttonGhost} mt-5 border-cream/40 bg-cream/10 text-cream`} to="/free-quote">
              Go to Free Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="reveal pb-4">
        <div className={`${surfaceCardClass} p-4 sm:p-5`}>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link className={`${surfaceHoverClass} px-4 py-3 text-sm text-blue`} to="/services">
              Explore Services
            </Link>
            <Link className={`${surfaceHoverClass} px-4 py-3 text-sm text-blue`} to="/portfolio">
              View Portfolio
            </Link>
            <Link className={`${surfaceHoverClass} px-4 py-3 text-sm text-blue`} to="/about">
              Read About Binary Baker
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
