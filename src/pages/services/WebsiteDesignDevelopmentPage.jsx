import { Link } from "react-router-dom";
import MarketingLayout from "../../components/MarketingLayout.jsx";
import RelatedPages from "../../components/RelatedPages.jsx";
import GradientCtaStrip from "../../components/marketing/GradientCtaStrip.jsx";
import HeroSplitSection from "../../components/marketing/HeroSplitSection.jsx";
import { getSeoRoute } from "../../seo/routes.js";
import useSeoPage from "../../seo/useSeoPage.js";
import {
  sectionEyebrowLightClass,
  sectionHeadingClass,
  sectionSubheadingClass,
  surfaceCardClass,
  surfaceHoverClass
} from "../../styles/marketingTokens.js";

const deliverables = [
  "Conversion-focused page structure and UX flow",
  "Responsive frontend development across devices",
  "Technical SEO-ready HTML structure and metadata support",
  "Speed and performance optimization baseline",
  "QA pass with launch readiness checklist"
];

const processPhases = [
  {
    step: "01",
    title: "Discovery",
    detail: "Define business goals, audience priorities, and conversion objectives."
  },
  {
    step: "02",
    title: "Design + Build",
    detail: "Implement branded layouts, content hierarchy, and production-ready frontend code."
  },
  {
    step: "03",
    title: "Launch Support",
    detail: "Deploy confidently with pre-launch checks, fixes, and post-release review."
  }
];

export default function WebsiteDesignDevelopmentPage() {
  const page = getSeoRoute("serviceWebsiteDesignDevelopment");
  useSeoPage("serviceWebsiteDesignDevelopment");

  return (
    <MarketingLayout>
      <HeroSplitSection
        eyebrow="Service Detail"
        title="Website Design & Development"
        description="Build a modern website that communicates clearly, loads fast, and guides visitors toward real business actions."
        quickSummary={page.quickSummary}
        primaryAction={{ to: "/free-quote", label: "Get a Custom Quote" }}
        secondaryAction={{ to: "/contact", label: "Book Discovery Call" }}
        panel={{
          eyebrow: "What You Gain",
          title: "Built for conversion and trust.",
          body: "This service is ideal when your current website does not communicate value clearly or lacks consistent lead flow.",
          points: [
            "Clear message hierarchy",
            "Mobile-first user experience",
            "SEO-friendly technical foundation"
          ]
        }}
      />

      <section className="reveal py-14 sm:py-16">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <p className={sectionEyebrowLightClass}>Deliverables</p>
          <h2 className={sectionHeadingClass}>What this service covers</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {deliverables.map((item) => (
              <div key={item} className={`${surfaceHoverClass} px-4 py-3 text-sm text-cream/65`}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal py-12 sm:py-14">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <p className={sectionEyebrowLightClass}>Implementation Flow</p>
          <h2 className={sectionHeadingClass}>From plan to launch</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {processPhases.map((phase) => (
              <article key={phase.step} className={`${surfaceHoverClass} p-5`}>
                <p className="font-mono text-xs text-blue">{phase.step}</p>
                <h3 className={`mt-2 ${sectionSubheadingClass}`}>{phase.title}</h3>
                <p className="mt-2 text-sm text-cream/65">{phase.detail}</p>
              </article>
            ))}
          </div>
          <p className="mt-6 text-sm text-cream/65">
            Need continued support after launch? Review{" "}
            <Link className="font-semibold text-blue underline" to="/services/website-maintenance">
              website maintenance plans
            </Link>
            .
          </p>
        </div>
      </section>

      <GradientCtaStrip
        text="Tell us what you want to launch and we will map the build scope with timeline and next steps."
        actionTo="/free-quote"
        actionLabel="Start Your Quote"
      />

      <RelatedPages pageId="serviceWebsiteDesignDevelopment" />
    </MarketingLayout>
  );
}

