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

const carePlans = [
  {
    title: "Essential Care",
    detail: "Routine updates, compatibility checks, and issue resolution for stable day-to-day operation."
  },
  {
    title: "Business Care",
    detail: "Priority support, deeper performance analysis, and faster turnaround during growth cycles."
  },
  {
    title: "Critical Care",
    detail: "High-priority response handling for operationally sensitive websites and systems."
  }
];

const maintenanceCoverage = [
  "Scheduled platform and plugin updates",
  "Security hardening and vulnerability response",
  "Performance monitoring with practical optimization actions",
  "Operational support guidance and issue triage"
];

export default function WebsiteMaintenancePage() {
  const page = getSeoRoute("serviceWebsiteMaintenance");
  useSeoPage("serviceWebsiteMaintenance");

  return (
    <MarketingLayout>
      <HeroSplitSection
        eyebrow="Service Detail"
        title="Website Maintenance"
        description="Keep your website reliable, secure, and conversion-ready with structured maintenance aligned to your business operations."
        quickSummary={page.quickSummary}
        primaryAction={{ to: "/free-quote", label: "Request Maintenance Plan" }}
        secondaryAction={{ to: "/contact", label: "Speak to Support Team" }}
        panel={{
          eyebrow: "Continuity Focus",
          title: "Protect uptime while your business scales.",
          body: "Maintenance is not only about fixes. It ensures your site remains stable as traffic, features, and customer expectations evolve.",
          points: ["Proactive checks", "Structured response", "Performance continuity"]
        }}
      />

      <section className="reveal py-14 sm:py-16">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <p className={sectionEyebrowLightClass}>Coverage</p>
          <h2 className={sectionHeadingClass}>What ongoing maintenance includes</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {maintenanceCoverage.map((item) => (
              <div key={item} className={`${surfaceHoverClass} px-4 py-3 text-sm text-cream/65`}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal py-12 sm:py-14">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <p className={sectionEyebrowLightClass}>Care Levels</p>
          <h2 className={sectionHeadingClass}>Support plans by operational demand</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {carePlans.map((plan) => (
              <article key={plan.title} className={`${surfaceHoverClass} p-5`}>
                <h3 className={sectionSubheadingClass}>{plan.title}</h3>
                <p className="mt-2 text-sm text-cream/65">{plan.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <GradientCtaStrip
        text="Tell us your current stack and support expectations. We will recommend the right maintenance tier."
        actionTo="/free-quote"
        actionLabel="Scope My Care Plan"
      />

      <RelatedPages pageId="serviceWebsiteMaintenance" />
    </MarketingLayout>
  );
}
