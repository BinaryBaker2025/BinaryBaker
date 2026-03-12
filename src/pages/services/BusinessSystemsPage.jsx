import MarketingLayout from "../../components/MarketingLayout.jsx";
import RelatedPages from "../../components/RelatedPages.jsx";
import GradientCtaStrip from "../../components/marketing/GradientCtaStrip.jsx";
import HeroSplitSection from "../../components/marketing/HeroSplitSection.jsx";
import { getSeoRoute } from "../../seo/routes.js";
import useSeoPage from "../../seo/useSeoPage.js";
import {
  sectionHeadingClass,
  sectionSubheadingClass,
  surfaceCardClass,
  surfaceHoverClass
} from "../../styles/marketingTokens.js";

const capabilities = [
  {
    title: "Client & Staff Portals",
    detail: "A secure login area for your clients or team — view jobs, upload documents, check statuses, without emailing back and forth all day."
  },
  {
    title: "Operations Dashboards",
    detail: "See what's happening in your business in real time. Jobs, orders, approvals — all in one place instead of five spreadsheets."
  },
  {
    title: "Workflow Automation",
    detail: "If your team does the same repetitive steps on repeat, we can automate them. Less manual work, fewer mistakes."
  },
  {
    title: "Custom Admin Tools",
    detail: "Internal tools built for how your business actually runs — not a generic SaaS subscription you need to work around."
  }
];

const useCases = [
  "You're managing clients or orders and the spreadsheet is a mess",
  "Your team wastes time on repetitive manual steps that could be automated",
  "You need a client portal but off-the-shelf tools don't fit your process",
  "You want internal visibility — jobs, statuses, workloads — without piecing it together yourself",
];

export default function BusinessSystemsPage() {
  const page = getSeoRoute("serviceBusinessSystems");
  useSeoPage("serviceBusinessSystems");

  return (
    <MarketingLayout>
      <HeroSplitSection
        eyebrow="Custom Software"
        title="Software built around how your business actually works."
        description="If your team is fighting spreadsheets, doing the same steps on repeat, or managing clients through a chain of emails — we can build something better."
        quickSummary={page.quickSummary}
        primaryAction={{ to: "/free-quote", label: "Tell us what you need" }}
        secondaryAction={{ to: "/contact", label: "Ask a question" }}
        panel={{
          eyebrow: "Good fit for",
          title: "Businesses with a process that needs a proper system.",
          body: "If you can describe the problem, we can usually build a solution for it.",
          points: [
            "Growing teams that have outgrown manual processes",
            "Businesses managing clients, orders, or job tracking",
            "Anyone tired of spreadsheets doing the work of a real system",
          ]
        }}
      />

      <section className="reveal py-14 sm:py-16">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <h2 className={sectionHeadingClass}>What we build</h2>
          <p className="mt-2 text-sm leading-relaxed text-cream/65">
            Every system is different — but here's the kind of thing we build most often.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {capabilities.map((capability) => (
              <article key={capability.title} className={`${surfaceHoverClass} p-5`}>
                <h3 className={sectionSubheadingClass}>{capability.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/65">{capability.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal py-12 sm:py-14">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <h2 className={sectionHeadingClass}>Signs you need this</h2>
          <ul className="mt-5 grid gap-3">
            {useCases.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-cream/70">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue/70" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-cream/55">
            If any of those sound familiar, get in touch. We'll ask a few questions and tell you whether we can help — and roughly what it would cost.
          </p>
        </div>
      </section>

      <GradientCtaStrip
        text="Describe your process and we'll tell you what's possible — and what it would cost."
        actionTo="/free-quote"
        actionLabel="Get a free quote"
      />

      <RelatedPages pageId="serviceBusinessSystems" />
    </MarketingLayout>
  );
}
