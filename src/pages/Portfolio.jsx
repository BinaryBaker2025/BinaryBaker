import { useMemo } from "react";
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

const cases = [
  {
    name: "Bethany Blooms",
    url: "https://www.bethanyblooms.co.za/",
    category: "Creative commerce",
    summary: "Pressed flower workshop and commerce experience with clear inquiry and purchase flows."
  },
  {
    name: "The Crooked Fence",
    url: "https://www.thecrookedfence.co.za/",
    category: "Agricultural ordering",
    summary: "Structured online ordering experience for agricultural product demand management."
  }
];

const caseOutcomes = [
  "Clearer conversion journeys and simplified customer actions.",
  "Operational workflows aligned to real business processes.",
  "Launch-ready experiences with long-term improvement potential."
];

function buildShareLinks(targetUrl) {
  const encoded = encodeURIComponent(targetUrl);
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    x: `https://twitter.com/intent/tweet?url=${encoded}`
  };
}

export default function Portfolio() {
  const page = getSeoRoute("portfolio");
  useSeoPage("portfolio");

  const shareLinks = useMemo(
    () =>
      cases.reduce((acc, item) => {
        acc[item.url] = buildShareLinks(item.url);
        return acc;
      }, {}),
    []
  );

  return (
    <MarketingLayout>
      <HeroSplitSection
        eyebrow="Portfolio"
        title="Portfolio & Case Highlights"
        description="Review selected projects that show how strategy, design, and engineering come together in real business contexts."
        quickSummary={page.quickSummary}
        primaryAction={{ to: "/free-quote", label: "Start Similar Project" }}
        secondaryAction={{ to: "/services", label: "Explore Service Lines" }}
        panel={{
          eyebrow: "Case Focus",
          title: "Built for measurable business outcomes.",
          body: "Each project balances customer experience goals with operational requirements behind the scenes.",
          points: ["Conversion-first flows", "Operational clarity", "Scalable implementation"]
        }}
      />

      <section className="reveal py-14 sm:py-16">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <p className={sectionEyebrowLightClass}>Selected Projects</p>
          <h2 className={sectionHeadingClass}>Recent delivery examples</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {cases.map((project) => (
              <article key={project.name} className={`${surfaceHoverClass} p-5`}>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-violet">{project.category}</p>
                <h3 className={`mt-2 ${sectionSubheadingClass}`}>{project.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/65">{project.summary}</p>
                <a className={`${buttonGhost} mt-5`} href={project.url} target="_blank" rel="noreferrer">
                  Visit project site
                </a>
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                  <a
                    className="rounded-full border border-cream/15 bg-cream/5 px-3 py-1.5 transition hover:border-blue/40 hover:text-blue"
                    href={shareLinks[project.url].linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Share on LinkedIn
                  </a>
                  <a
                    className="rounded-full border border-cream/15 bg-cream/5 px-3 py-1.5 transition hover:border-blue/40 hover:text-blue"
                    href={shareLinks[project.url].x}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Share on X
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal py-12 sm:py-14">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <p className={sectionEyebrowLightClass}>Outcome Patterns</p>
          <h2 className={sectionHeadingClass}>What these engagements are built to deliver</h2>
          <div className="mt-5 grid gap-3">
            {caseOutcomes.map((outcome) => (
              <article key={outcome} className={`${surfaceHoverClass} px-4 py-3 text-sm text-cream/65`}>
                {outcome}
              </article>
            ))}
          </div>
        </div>
      </section>

      <GradientCtaStrip
        text="Want this same structure for your business? We can scope the right platform and rollout path."
        actionTo="/free-quote"
        actionLabel="Request Portfolio-Style Build"
      />

      <RelatedPages pageId="portfolio" />
    </MarketingLayout>
  );
}
