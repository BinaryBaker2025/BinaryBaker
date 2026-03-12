import { Link } from "react-router-dom";
import MarketingLayout from "../components/MarketingLayout.jsx";
import RelatedPages from "../components/RelatedPages.jsx";
import GradientCtaStrip from "../components/marketing/GradientCtaStrip.jsx";
import HeroSplitSection from "../components/marketing/HeroSplitSection.jsx";
import { getSeoRoute } from "../seo/routes.js";
import useSeoPage from "../seo/useSeoPage.js";
import {
  sectionEyebrowLightClass,
  sectionHeadingClass,
  sectionSubheadingClass,
  splitPanelDarkClass,
  surfaceCardClass,
  surfaceHoverClass
} from "../styles/marketingTokens.js";
import { buttonGhost } from "../styles/uiTokens.js";

const whatsappLink = "https://wa.me/27611011669";

const contactChannels = [
  {
    title: "Email",
    detail: "Best for detailed requirements, documents, and project context.",
    actionLabel: "bradley@binarybaker.co.za",
    actionHref: "mailto:bradley@binarybaker.co.za"
  },
  {
    title: "WhatsApp",
    detail: "Best for quick coordination and short project clarifications.",
    actionLabel: "+27 61 101 1669",
    actionHref: whatsappLink
  }
];

const serviceAreaCards = [
  {
    name: "Gauteng",
    description: "Primary operating base for in-person planning when required."
  },
  {
    name: "Johannesburg & Pretoria",
    description: "Focused support for teams needing direct website, app, or software delivery."
  },
  {
    name: "South Africa (Remote)",
    description: "Professional remote conferencing for teams across all provinces."
  },
  {
    name: "International Remote",
    description: "Remote delivery support for businesses outside South Africa."
  }
];

export default function Contact() {
  const page = getSeoRoute("contact");
  useSeoPage("contact");

  return (
    <MarketingLayout>
      <HeroSplitSection
        eyebrow="Contact"
        title="Contact Binary Baker"
        description="Reach us to discuss your website, business system, e-commerce build, or maintenance requirements."
        quickSummary={page.quickSummary}
        primaryAction={{ to: "/free-quote", label: "Start a Free Quote" }}
        secondaryAction={{ to: "/services", label: "View Service Lines" }}
        panel={{
          eyebrow: "Response Window",
          title: "Expect a first response within 48 hours.",
          body: "We review each enquiry against your goals and recommend a practical next step, whether that is scoping, support, or rollout planning.",
          points: ["Scoped guidance", "Email or WhatsApp follow-up", "Clear next actions"]
        }}
      />

      <section className="reveal py-14 sm:py-16">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <p className={sectionEyebrowLightClass}>Contact Channels</p>
          <h2 className={sectionHeadingClass}>Choose the channel that fits your workflow</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {contactChannels.map((channel) => (
              <article key={channel.title} className={`${surfaceHoverClass} p-5`}>
                <h3 className={sectionSubheadingClass}>{channel.title}</h3>
                <p className="mt-2 text-sm text-cream/65">{channel.detail}</p>
                <a className={`${buttonGhost} mt-5`} href={channel.actionHref}>
                  {channel.actionLabel}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal py-12 sm:py-14">
        <div className={splitPanelDarkClass}>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-cream/70">Service Area</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-cream">
            Based in Gauteng, delivering remotely across South Africa
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-cream/85">
            We support businesses in Gauteng and beyond through structured remote conferencing. If you
            are ready to move into scoping, use the
            {" "}
            <Link className="font-semibold text-cream underline decoration-cream/40" to="/free-quote">
              free quote page
            </Link>
            {" "}
            with your requirements summary.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {serviceAreaCards.map((item) => (
              <article key={item.name} className="rounded-xl border border-cream/25 bg-cream/10 px-4 py-3">
                <h3 className="text-base font-semibold text-cream">{item.name}</h3>
                <p className="mt-1.5 text-sm text-cream/82">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <GradientCtaStrip
        text="Need a full project plan instead of a quick message? Submit your goals on our quote form."
        actionTo="/free-quote"
        actionLabel="Get a Tailored Quote"
      />

      <RelatedPages pageId="contact" />
    </MarketingLayout>
  );
}
