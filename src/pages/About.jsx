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

const IcoTarget = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="8" />
    <circle cx="10" cy="10" r="4" />
    <circle cx="10" cy="10" r="1" />
  </svg>
);
const IcoLayers = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 10l8 5 8-5M2 14l8 5 8-5M2 6l8-4 8 4-8 5-8-5z" />
  </svg>
);
const IcoShield = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2l7 3v5c0 4-3 7-7 8C7 17 4 14 3 10V5l7-3z" />
    <path d="M7 10l2 2 4-4" />
  </svg>
);
const IcoMapPin = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 2a6 6 0 016 6c0 5-6 10-6 10S4 13 4 8a6 6 0 016-6z" />
    <circle cx="10" cy="8" r="2" />
  </svg>
);
const IcoGlobe = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="8" />
    <path d="M2 10h16M10 2a14 14 0 010 16M10 2a14 14 0 000 16" />
  </svg>
);
const IcoTerminal = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="16" height="14" rx="2" />
    <path d="M6 8l3 3-3 3M11 14h4" />
  </svg>
);

const deliveryPrinciples = [
  {
    title: "Quote before we touch anything",
    detail: "We don't start building until you've agreed on a price. No surprises at the end.",
    Icon: IcoTarget,
  },
  {
    title: "You see progress as it happens",
    detail: "Work is delivered in stages with review points — not handed over all at once at the end.",
    Icon: IcoLayers,
  },
  {
    title: "Built to last, not just to launch",
    detail: "We build things that are easy to update and maintain — not just good on demo day.",
    Icon: IcoShield,
  }
];

const operatingModel = [
  {
    title: "Based in Gauteng",
    detail: "We're local — available for in-person meetings where needed.",
    Icon: IcoMapPin,
  },
  {
    title: "Working remotely across SA",
    detail: "Most of our work happens over video calls. If you're not in Joburg, that's no problem.",
    Icon: IcoGlobe,
  },
  {
    title: "Practical over pretty",
    detail: "Design decisions are made with your customers in mind, not design awards.",
    Icon: IcoTerminal,
  }
];

export default function About() {
  const page = getSeoRoute("about");
  useSeoPage("about");

  return (
    <MarketingLayout>
      <HeroSplitSection
        eyebrow="About"
        title="A software and web studio that solves real business problems."
        description="Binary Baker is based in Gauteng. We build websites, web apps, and custom software for businesses that need things done properly — not just shipped and forgotten."
        quickSummary={page.quickSummary}
        primaryAction={{ to: "/services", label: "See what we build" }}
        secondaryAction={{ to: "/free-quote", label: "Get a free quote" }}
        panel={{
          eyebrow: "The short version",
          title: "We care about whether it solves your problem, not just whether it looks good.",
          body: "A site that wins a design award but doesn't bring in business is still a bad site. Same goes for software that's pretty but slow to use.",
          points: ["Clear price before we start", "You review it before it goes live", "Support available after launch"]
        }}
      />

      <section className="reveal py-14 sm:py-16">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <h2 className={sectionHeadingClass}>How we work</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {deliveryPrinciples.map((item) => (
              <article key={item.title} className={`${surfaceHoverClass} p-5`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-blue/20 bg-blue/[0.08] text-blue">
                  <item.Icon />
                </div>
                <h3 className={`mt-3 ${sectionSubheadingClass}`}>{item.title}</h3>
                <p className="mt-2 text-sm text-cream/65">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal py-12 sm:py-14">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <h2 className={sectionHeadingClass}>Where we work</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {operatingModel.map((item) => (
              <article key={item.title} className={`${surfaceHoverClass} p-5`}>
                <div className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-violet/20 bg-violet/[0.08] text-violet">
                  <item.Icon />
                </div>
                <h3 className={`mt-3 ${sectionSubheadingClass}`}>{item.title}</h3>
                <p className="mt-2 text-sm text-cream/65">{item.detail}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-sm text-cream/65">
            Review real delivery examples on the
            {" "}
            <Link className="font-semibold text-blue underline" to="/portfolio">
              portfolio page
            </Link>
            {" "}
            or move straight into scoping on the
            {" "}
            <Link className="font-semibold text-blue underline" to="/free-quote">
              free quote form
            </Link>
            .
          </p>
        </div>
      </section>

      <GradientCtaStrip
        text="Know what you need? Or just have a rough idea? Either way, get in touch."
        actionTo="/free-quote"
        actionLabel="Get a free quote"
      />

      <RelatedPages pageId="about" />
    </MarketingLayout>
  );
}
