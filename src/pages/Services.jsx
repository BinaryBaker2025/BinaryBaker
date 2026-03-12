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
  surfaceCardClass,
  surfaceHoverClass
} from "../styles/marketingTokens.js";
import { buttonGhost } from "../styles/uiTokens.js";

const IcoMonitor = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="16" height="11" rx="1.5" />
    <path d="M6 18h8M10 14v4" />
  </svg>
);
const IcoGrid = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="7" height="7" rx="1" />
    <rect x="11" y="2" width="7" height="7" rx="1" />
    <rect x="2" y="11" width="7" height="7" rx="1" />
    <rect x="11" y="11" width="7" height="7" rx="1" />
  </svg>
);
const IcoBag = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2h8l2 5H4L6 2z" />
    <path d="M4 7h12v10a1 1 0 01-1 1H5a1 1 0 01-1-1V7z" />
    <path d="M8 11a2 2 0 104 0" />
  </svg>
);
const IcoWrench = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="2.5" />
    <path d="M10 2v2M10 16v2M3.51 5.51l1.42 1.42M15.07 14.07l1.42 1.42M2 10h2M16 10h2M3.51 14.49l1.42-1.42M15.07 5.93l1.42-1.42" />
  </svg>
);
const IcoClipboard = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V4a1 1 0 00-1-1h-3" />
    <rect x="7" y="1" width="6" height="4" rx="1" />
    <path d="M7 10h6M7 14h4" />
  </svg>
);
const IcoCode = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 7L3 10l4 4M13 7l4 3-4 4M11 4l-2 12" />
  </svg>
);
const IcoRocket = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2c0 0-6 5-6 10a6 6 0 0012 0C16 7 10 2 10 2z" />
    <circle cx="10" cy="12" r="2" />
    <path d="M7 17l-2 2M13 17l2 2" />
  </svg>
);

const serviceCards = [
  {
    id: "01",
    to: "/services/website-design-development",
    title: "Website Design & Development",
    summary: "A proper website — fast, clean, works on mobile, and designed to get you more customers.",
    points: ["Custom design", "Mobile-first build", "SEO foundations included"],
    Icon: IcoMonitor,
  },
  {
    id: "02",
    to: "/services/business-systems",
    title: "Custom Business Software",
    summary: "Got a process that's slow, messy, or stuck in spreadsheets? We turn it into software that actually works.",
    points: ["Web apps and portals", "Automation and workflows", "Custom admin tools"],
    Icon: IcoGrid,
  },
  {
    id: "03",
    to: "/services/ecommerce-integrations",
    title: "E-Commerce & Integrations",
    summary: "Sell online with a proper checkout — not a bolted-on plugin that breaks on weekends.",
    points: ["Secure payments", "Product management", "Third-party integrations"],
    Icon: IcoBag,
  },
  {
    id: "04",
    to: "/services/website-maintenance",
    title: "Website Maintenance",
    summary: "We handle updates, fixes, and keeping things running so you don't have to think about it.",
    points: ["Regular updates", "Performance monitoring", "Fast turnaround on fixes"],
    Icon: IcoWrench,
  }
];

const deliverySteps = [
  {
    step: "01",
    title: "You tell us what you need",
    detail: "Fill in the quote form or send us a message. We'll review what you're after and come back to you.",
    Icon: IcoClipboard,
  },
  {
    step: "02",
    title: "We build it",
    detail: "Work happens in stages so you can see progress and give feedback before it's done.",
    Icon: IcoCode,
  },
  {
    step: "03",
    title: "It goes live",
    detail: "We handle deployment, make sure everything works, and hand it over clearly. Support available after.",
    Icon: IcoRocket,
  }
];

export default function Services() {
  const page = getSeoRoute("services");
  useSeoPage("services");

  return (
    <MarketingLayout>
      <HeroSplitSection
        eyebrow="Services"
        title="Websites, web apps, and custom business software."
        description="We build what your business actually needs — not what fits a template. A website, a custom ordering system, a client portal, or all three."
        quickSummary={page.quickSummary}
        primaryAction={{ to: "/free-quote", label: "Get a free quote" }}
        secondaryAction={{ to: "/contact", label: "Ask a question" }}
        panel={{
          eyebrow: "How it works",
          title: "We quote before we build. Always.",
          body: "No hourly rates, no generic packages. Tell us what you need and we'll come back with a straight number.",
          points: ["Free quote, no obligation", "Built around your actual requirements", "You know the price before we start"]
        }}
      />

      <section className="reveal py-14 sm:py-16">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <h2 className={sectionHeadingClass}>Pick a service</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {serviceCards.map((item) => (
              <article key={item.to} className={`${surfaceHoverClass} p-5`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-blue/20 bg-blue/[0.08] text-blue">
                    <item.Icon />
                  </div>
                  <p className="font-mono text-xs text-blue/60">{item.id}</p>
                </div>
                <h3 className={`mt-3 ${sectionSubheadingClass}`}>{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/68">{item.summary}</p>
                <ul className="mt-4 grid gap-2 text-sm text-cream/65">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-violet/70"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link className={`${buttonGhost} mt-5`} to={item.to}>
                  View {item.title}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal py-12 sm:py-14">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <h2 className={sectionHeadingClass}>How a project actually runs</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {deliverySteps.map((step) => (
              <article key={step.step} className={`${surfaceHoverClass} p-5`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-violet/20 bg-violet/[0.08] text-violet">
                    <step.Icon />
                  </div>
                  <p className="font-mono text-xs text-violet/60">{step.step}</p>
                </div>
                <h3 className={`mt-3 ${sectionSubheadingClass}`}>{step.title}</h3>
                <p className="mt-2 text-sm text-cream/65">{step.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <GradientCtaStrip
        text="Not sure what you need? Tell us what you're trying to do and we'll figure out the right approach."
        actionTo="/free-quote"
        actionLabel="Start with a free quote"
      />

      <RelatedPages pageId="services" />
    </MarketingLayout>
  );
}
