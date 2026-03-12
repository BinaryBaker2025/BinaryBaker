import { useState } from "react";
import { Link } from "react-router-dom";
import MarketingLayout from "../components/MarketingLayout.jsx";
import RelatedPages from "../components/RelatedPages.jsx";
import GradientCtaStrip from "../components/marketing/GradientCtaStrip.jsx";
import HeroSplitSection from "../components/marketing/HeroSplitSection.jsx";
import { getSeoRoute } from "../seo/routes.js";
import useSeoPage from "../seo/useSeoPage.js";
import {
  contactInputClass,
  contactLabelClass,
  contactSubmitButtonClass,
  sectionEyebrowLightClass,
  sectionHeadingClass,
  splitPanelDarkClass,
  surfaceCardClass,
  surfaceHoverClass
} from "../styles/marketingTokens.js";

const valuePoints = [
  "Practical website, web app, and conversion insights.",
  "Launch and maintenance checklists for business teams.",
  "Updates on Binary Baker service capabilities and delivery patterns."
];

export default function Newsletter() {
  const page = getSeoRoute("newsletter");
  useSeoPage("newsletter");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus(
      "Signup captured. Connect this form to your mailing provider before promotion campaigns go live."
    );
    setEmail("");
  };

  return (
    <MarketingLayout>
      <HeroSplitSection
        eyebrow="Newsletter"
        title="Newsletter Signup"
        description="Subscribe for practical updates on web strategy, implementation, and digital growth delivery."
        quickSummary={page.quickSummary}
        primaryAction={{ to: "/free-quote", label: "Need Project Scope Now" }}
        secondaryAction={{ to: "/services", label: "Explore Services" }}
        panel={{
          eyebrow: "Update Style",
          title: "Short, practical, and implementation-focused.",
          body: "You receive useful guidance, not noise, with content designed for business owners and operators.",
          points: ["Actionable insights", "Clear release notes", "Growth-focused topics"]
        }}
      />

      <section className="reveal py-14 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <form className={`${splitPanelDarkClass} grid gap-4`} onSubmit={handleSubmit}>
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-cream/70">
              Subscribe
            </p>
            <label className={contactLabelClass}>
              Work email *
              <input
                className={contactInputClass}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@business.co.za"
                required
              />
            </label>
            <button type="submit" className={contactSubmitButtonClass}>
              Join Newsletter
            </button>
            {status ? (
              <p className="rounded-[12px] border border-cream/25 bg-cream/10 px-3 py-2 text-sm text-cream/88">
                {status}
              </p>
            ) : null}
          </form>

          <div className={`${surfaceCardClass} p-6 sm:p-8`}>
            <p className={sectionEyebrowLightClass}>What You Receive</p>
            <h2 className={sectionHeadingClass}>Content designed for growth decisions</h2>
            <div className="mt-5 grid gap-3">
              {valuePoints.map((point) => (
                <article key={point} className={`${surfaceHoverClass} px-4 py-3 text-sm text-cream/65`}>
                  {point}
                </article>
              ))}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-cream/65">
              If you need immediate implementation support instead of updates, submit requirements via the
              {" "}
              <Link className="font-semibold text-blue underline" to="/free-quote">
                free quote page
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <GradientCtaStrip
        text="Want strategic updates and hands-on implementation support? Start with a scoped quote request."
        actionTo="/free-quote"
        actionLabel="Request a Project Quote"
      />

      <RelatedPages pageId="newsletter" />
    </MarketingLayout>
  );
}
