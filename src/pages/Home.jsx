import { useState } from "react";
import { Link } from "react-router-dom";
import MarketingLayout from "../components/MarketingLayout.jsx";
import useSeoPage from "../seo/useSeoPage.js";
import {
  invertButtonClass,
  surfaceHoverClass,
} from "../styles/marketingTokens.js";
import { buttonGhost, buttonPrimary } from "../styles/uiTokens.js";

const ServiceIconMonitor = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="16" height="11" rx="1.5" />
    <path d="M6 18h8M10 14v4" />
  </svg>
);
const ServiceIconGrid = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="7" height="7" rx="1" />
    <rect x="11" y="2" width="7" height="7" rx="1" />
    <rect x="2" y="11" width="7" height="7" rx="1" />
    <rect x="11" y="11" width="7" height="7" rx="1" />
  </svg>
);
const ServiceIconBag = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2h8l2 5H4L6 2z" />
    <path d="M4 7h12v10a1 1 0 01-1 1H5a1 1 0 01-1-1V7z" />
    <path d="M8 11a2 2 0 104 0" />
  </svg>
);
const ServiceIconWrench = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="2.5" />
    <path d="M10 2v2M10 16v2M3.51 5.51l1.42 1.42M15.07 14.07l1.42 1.42M2 10h2M16 10h2M3.51 14.49l1.42-1.42M15.07 5.93l1.42-1.42" />
  </svg>
);

const services = [
  {
    id: "01",
    title: "Website Design & Development",
    description: "A clean, fast website that looks professional and actually brings in customers.",
    href: "/services/website-design-development",
    Icon: ServiceIconMonitor,
  },
  {
    id: "02",
    title: "Custom Business Software",
    description: "Apps, portals, and tools built around how your business actually works — not how a template assumes it does.",
    href: "/services/business-systems",
    Icon: ServiceIconGrid,
  },
  {
    id: "03",
    title: "E-Commerce & Integrations",
    description: "Sell online properly — payments, product management, and the works.",
    href: "/services/ecommerce-integrations",
    Icon: ServiceIconBag,
  },
  {
    id: "04",
    title: "Website Maintenance",
    description: "We keep your site running while you focus on the actual business.",
    href: "/services/website-maintenance",
    Icon: ServiceIconWrench,
  },
];

const showcaseProjects = [
  {
    id: "bethany-blooms",
    name: "Bethany Blooms",
    websiteUrl: "https://www.bethanyblooms.co.za/",
    websiteLabel: "bethanyblooms.co.za",
    logoUrl: "https://www.bethanyblooms.co.za/bradb-favicon.png",
    category: "Creative commerce",
    summary: "Flower art workshops, DIY kits, and custom floral keepsakes — now with an online shop to match.",
  },
  {
    id: "the-crooked-fence",
    name: "The Crooked Fence",
    websiteUrl: "https://www.thecrookedfence.co.za/",
    websiteLabel: "thecrookedfence.co.za",
    logoUrl: "https://www.thecrookedfence.co.za/TCFLogoWhiteBackground.png",
    category: "Agricultural ordering",
    summary: "A purpose-built ordering system for fertile eggs — delivery routes, schedules, and all.",
  },
];

const homeFaqItems = [
  {
    question: "Do you only work with businesses in Gauteng?",
    answer:
      "No. We're based in Gauteng, but most of our work happens over video calls anyway. If you're in Cape Town, Durban, or anywhere else in South Africa — reach out.",
  },
  {
    question: "How do I get a price?",
    answer:
      "We start with a basic demo for R800 — no styling, just built to match what you give us. Once you've seen it and you're happy, we quote for the full build from there.",
  },
  {
    question: "Can you look after the site after it goes live?",
    answer:
      "Yes. We offer ongoing maintenance for clients who want someone to handle updates, fixes, and keep things running without the stress.",
  },
];

export default function Home() {
  useSeoPage("home");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <MarketingLayout>

      {/* ── Hero ── */}
      <section className="reveal pb-14 pt-4">
        <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-green-400/20 bg-green-400/[0.07] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-widest text-green-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
          Taking on new projects
        </span>

        <h1 className="font-serif text-5xl leading-[1.08] text-cream sm:text-6xl lg:text-[4.2rem]">
          Websites and software<br />
          <span className="text-cream/55">built for your business.</span>
        </h1>

        <p className="mt-6 max-w-lg text-base leading-relaxed text-cream/72">
          Binary Baker is a software and web studio.
          We build websites, web apps, and custom business software -
          the kind that actually speeds up how you work, not just looks good on a screen.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link className={buttonPrimary} to="/free-quote">
            Start with a demo
          </Link>
          <Link
            className="text-sm font-semibold text-cream/65 underline underline-offset-4 transition-colors hover:text-cream"
            to="/portfolio"
          >
            See our work
          </Link>
        </div>
      </section>

      {/* ── What we do ── */}
      <section className="reveal border-t border-cream/[0.10] py-14 sm:py-16" id="services">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl text-cream sm:text-3xl">What we do</h2>
          <Link className="text-sm text-cream/50 transition-colors hover:text-cream" to="/services">
            All services →
          </Link>
        </div>

        <div className="divide-y divide-cream/[0.08]">
          {services.map((service) => (
            <Link
              key={service.id}
              to={service.href}
              className="group flex items-center gap-5 py-5 transition-colors hover:bg-cream/[0.04] -mx-2 px-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] border border-blue/20 bg-blue/[0.08] text-blue transition-colors group-hover:border-blue/40 group-hover:bg-blue/[0.14]">
                <service.Icon />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-cream transition-colors group-hover:text-blue">
                  {service.title}
                </h3>
                <p className="mt-0.5 text-sm text-cream/60">{service.description}</p>
              </div>
              <span aria-hidden="true" className="shrink-0 text-cream/30 transition-colors group-hover:text-blue">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent work ── */}
      <section className="reveal py-14 sm:py-16" id="work">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-serif text-2xl text-cream sm:text-3xl">Recent work</h2>
          <Link className="text-sm text-cream/50 transition-colors hover:text-cream" to="/portfolio">
            Full portfolio →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {showcaseProjects.map((project) => (
            <article key={project.id} className={`${surfaceHoverClass} p-6`}>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-violet/80">
                {project.category}
              </p>
              <div className="mt-4 flex h-20 items-center justify-center rounded-[10px] border border-black/[0.06] bg-[#f8f5ef] px-6">
                <img
                  src={project.logoUrl}
                  alt={`${project.name} logo`}
                  className="max-h-11 w-auto object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3 className="mt-4 font-semibold text-cream">{project.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-cream/65">{project.summary}</p>
              <a
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue transition hover:text-blue/75"
                href={project.websiteUrl}
                target="_blank"
                rel="noreferrer"
              >
                {project.websiteLabel} →
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="reveal border-t border-cream/[0.10] py-14 sm:py-16" id="faq">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 className="font-serif text-2xl text-cream sm:text-3xl">Got questions?</h2>
            <p className="mt-3 text-sm leading-relaxed text-cream/60">
              The ones we hear most often. If yours isn't here,{" "}
              <Link className="text-blue underline underline-offset-2" to="/contact">
                just ask
              </Link>
              .
            </p>
          </div>

          <div className="divide-y divide-cream/[0.08]">
            {homeFaqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              const panelId = `home-faq-panel-${index}`;
              return (
                <article key={item.question}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-[0.95rem] font-semibold text-cream">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`shrink-0 text-lg leading-none text-blue/75 transition-transform duration-200 ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    id={panelId}
                    className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 text-sm leading-relaxed text-cream/65">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="reveal py-12 sm:py-14">
        <div className="rounded-[16px] border border-blue/20 bg-gradient-to-br from-[#060e35] to-[#150944] p-8 sm:p-12">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.35em] text-blue">Let's talk</p>
          <h2 className="mt-4 max-w-lg font-serif text-3xl leading-tight text-cream sm:text-4xl">
            Tell us what you need built.
          </h2>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-cream/70">
            We start with a basic demo for R800 so you can see exactly what you're getting. If you're happy, we quote for the full build from there. No risk, no pressure.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className={invertButtonClass} to="/free-quote">
              Start with a demo
            </Link>
            <Link className={buttonGhost} to="/contact">
              Send us a message
            </Link>
          </div>
        </div>
      </section>

    </MarketingLayout>
  );
}
