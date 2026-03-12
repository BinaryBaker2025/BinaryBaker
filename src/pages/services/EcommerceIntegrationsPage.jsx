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

const integrationAreas = [
  {
    title: "Checkout & Payments",
    detail: "Secure checkout flows with payment providers that match your sales model."
  },
  {
    title: "Product & Inventory",
    detail: "Structured catalog management and visibility for operational control."
  },
  {
    title: "Fulfilment Workflow",
    detail: "Order processing flows and status visibility for faster delivery coordination."
  },
  {
    title: "Third-Party Integrations",
    detail: "Connect commerce workflows to your internal systems and external tools."
  }
];

const outcomes = [
  "Reduce checkout abandonment with clear purchase pathways.",
  "Improve operational visibility for order and inventory management.",
  "Create scalable infrastructure for catalog and transaction growth."
];

export default function EcommerceIntegrationsPage() {
  const page = getSeoRoute("serviceEcommerceIntegrations");
  useSeoPage("serviceEcommerceIntegrations");

  return (
    <MarketingLayout>
      <HeroSplitSection
        eyebrow="Service Detail"
        title="E-Commerce & Integrations"
        description="Launch or optimize your commerce platform with reliable integrations, conversion-focused UX, and operations-friendly tooling."
        quickSummary={page.quickSummary}
        primaryAction={{ to: "/free-quote", label: "Get E-Commerce Quote" }}
        secondaryAction={{ to: "/contact", label: "Talk to Our Team" }}
        panel={{
          eyebrow: "Commerce Focus",
          title: "From product to payment to delivery.",
          body: "We design connected commerce experiences that support both customer conversion and internal execution.",
          points: ["Checkout optimization", "Integration stability", "Operational clarity"]
        }}
      />

      <section className="reveal py-14 sm:py-16">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <p className={sectionEyebrowLightClass}>Integration Scope</p>
          <h2 className={sectionHeadingClass}>Key system areas we implement</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {integrationAreas.map((item) => (
              <article key={item.title} className={`${surfaceHoverClass} p-5`}>
                <h3 className={sectionSubheadingClass}>{item.title}</h3>
                <p className="mt-2 text-sm text-cream/65">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal py-12 sm:py-14">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <p className={sectionEyebrowLightClass}>Business Outcomes</p>
          <h2 className={sectionHeadingClass}>What success looks like</h2>
          <div className="mt-5 grid gap-3">
            {outcomes.map((outcome) => (
              <div key={outcome} className={`${surfaceHoverClass} px-4 py-3 text-sm text-cream/65`}>
                {outcome}
              </div>
            ))}
          </div>
        </div>
      </section>

      <GradientCtaStrip
        text="Tell us your product, payment, and fulfillment requirements and we will map a practical implementation plan."
        actionTo="/free-quote"
        actionLabel="Scope My Store"
      />

      <RelatedPages pageId="serviceEcommerceIntegrations" />
    </MarketingLayout>
  );
}

