import { useEffect } from "react";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" }
];

const portalUrl = "/portal";

const metrics = [
  { value: "4", label: "service tracks" },
  { value: "2 weeks", label: "to first deliverable" },
  { value: "100%", label: "custom design" }
];

const services = [
  {
    id: "01",
    title: "Proof + Mix",
    description: "Discovery, positioning, and UX mapping to get alignment fast.",
    timeline: "2 weeks"
  },
  {
    id: "02",
    title: "Oven Build",
    description: "High-fidelity UI, interaction design, and component systems.",
    timeline: "3-5 weeks"
  },
  {
    id: "03",
    title: "Icing + Launch",
    description: "Motion, copy polish, performance tuning, and deployment.",
    timeline: "1-2 weeks"
  },
  {
    id: "04",
    title: "Batch Ops",
    description: "Ongoing design support, feature builds, and product evolution.",
    timeline: "Monthly"
  }
];

const workItems = [
  {
    tags: ["Fintech", "Brand + Site"],
    title: "Signal Crumb",
    description: "A homepage and onboarding flow that boosted demo bookings by 38%."
  },
  {
    tags: ["Consumer", "Product UI"],
    title: "Pantry Portal",
    description: "Built a clean, fast checkout experience with a modular design system."
  },
  {
    tags: ["B2B", "Design Sprint"],
    title: "Batchline",
    description: "A rapid prototype to test a new product idea and secure funding."
  }
];

const processSteps = [
  {
    step: "01",
    title: "Discovery bake-off",
    description: "Workshops, user interviews, and market scans to define the recipe."
  },
  {
    step: "02",
    title: "Design and prototype",
    description: "High-fidelity UX, motion direction, and clickable prototypes."
  },
  {
    step: "03",
    title: "Build and launch",
    description: "Production-ready code, QA, and handoff with growth-friendly tooling."
  }
];

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-1 hover:shadow-bb";
const buttonPrimary = `${buttonBase} bg-gradient-to-br from-deep-blue to-violet text-cream`;
const buttonGhost = `${buttonBase} border border-ink/20 bg-cream/70`;
const buttonInvert = `${buttonBase} w-full bg-cream text-ink`;
const navLinkClass =
  "relative pb-1 text-sm after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-blue after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100";

export default function Home() {
  useEffect(() => {
    const revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );

      revealItems.forEach((item) => observer.observe(item));

      return () => observer.disconnect();
    }

    revealItems.forEach((item) => item.classList.add("in-view"));
    return undefined;
  }, []);

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 pb-12 pt-6">
      <header className="flex flex-wrap items-center justify-between gap-6 py-4">
        <a className="flex items-center gap-3 font-serif text-lg font-bold" href="#top">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-deep-blue to-violet font-mono text-sm uppercase tracking-[0.12em] text-cream">
            BB
          </span>
          Binary Baker
        </a>
        <nav className="flex flex-wrap gap-5">
          {navLinks.map((link) => (
            <a key={link.href} className={navLinkClass} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-wrap gap-3">
          <a className={buttonGhost} href={portalUrl}>
            Client portal
          </a>
          <a className={buttonPrimary} href="#contact">
            Start a bake
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative grid items-center gap-12 py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-deep-blue">
              Digital bakery for modern brands
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              We craft digital products that feel handmade and scale like software.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/80">
              Binary Baker is a boutique studio blending engineering rigor with design warmth. Think
              pixel-perfect interfaces, fast builds, and launches that smell like success.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <a className={buttonPrimary} href="#contact">
                Book a consult
              </a>
              <a className={buttonGhost} href="#work">
                See the menu
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-6">
              {metrics.map((metric) => (
                <div key={metric.label} className="flex flex-col gap-1">
                  <span className="text-lg font-semibold">{metric.value}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-ink/60">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 rounded-[28px] bg-ink p-8 text-cream shadow-bb">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cream/70">
              Currently baking
            </p>
            <h3 className="mt-2 text-2xl font-semibold">Launch Kit</h3>
            <p className="mt-3 text-cream/80">
              A full stack of brand, site, and product design for founders ready to ship in six weeks.
            </p>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-cream/80">
              <li>Brand voice + visual system</li>
              <li>Responsive marketing site</li>
              <li>Prototype and handoff</li>
            </ul>
            <button className={buttonInvert} type="button">
              See packages
            </button>
          </div>

          <div
            className="pointer-events-none absolute -top-6 right-20 hidden h-44 w-44 animate-float rounded-full bg-gradient-to-br from-blue to-violet opacity-60 blur-[0.5px] lg:block"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="pointer-events-none absolute bottom-4 -right-5 hidden h-36 w-36 animate-float rounded-full bg-gradient-to-br from-deep-blue to-blue opacity-60 blur-[0.5px] lg:block"
          ></div>
        </section>

        <section className="reveal py-20" id="services">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">Services</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              Pick your blend of strategy, design, and build.
            </h2>
            <p className="mt-3 text-ink/70">
              Every engagement starts with clarity. We map the recipe, then bake the product in focused,
              fast-moving sprints.
            </p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.id}
                className="rounded-[18px] border border-ink/10 bg-cream/80 p-6 shadow-soft"
              >
                <span className="font-mono text-xs text-deep-blue">{service.id}</span>
                <h3 className="mt-3 text-lg font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{service.description}</p>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-ink/70">
                  {service.timeline}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="reveal py-20" id="work">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">Featured Work</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              Concept bakes built for clarity, speed, and flavor.
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {workItems.map((work) => (
              <article
                key={work.title}
                className="flex min-h-[220px] flex-col justify-between rounded-[18px] bg-ink/95 p-7 text-cream shadow-bb"
              >
                <div className="flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-blue/20 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div>
                  <h3 className="mt-6 text-xl font-semibold">{work.title}</h3>
                  <p className="mt-3 text-sm text-cream/80">{work.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="reveal py-20" id="process">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-violet">Process</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
              From ingredient list to fresh-out-the-oven.
            </h2>
          </div>
          <div className="mt-8 grid gap-4">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="flex flex-col gap-4 rounded-[18px] border border-ink/10 bg-cream/90 p-6 sm:flex-row"
              >
                <span className="font-mono text-lg text-violet">{step.step}</span>
                <div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink/70">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="reveal py-20" id="contact">
          <div className="grid gap-8 rounded-[28px] bg-gradient-to-br from-deep-blue to-violet p-8 text-cream shadow-bb sm:p-10 lg:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-cream/70">Get Started</p>
              <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Ready for a fresh batch?</h2>
              <p className="mt-3 text-cream/80">
                Tell us about your product and timeline. We will respond within 48 hours.
              </p>
            </div>
            <form className="grid gap-4">
              <label className="grid gap-2 text-sm">
                Name
                <input
                  className="w-full rounded-[12px] border border-cream/40 bg-cream/10 px-3 py-2 text-cream placeholder:text-cream/70 focus:outline-none focus:ring-2 focus:ring-blue/70"
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                />
              </label>
              <label className="grid gap-2 text-sm">
                Email
                <input
                  className="w-full rounded-[12px] border border-cream/40 bg-cream/10 px-3 py-2 text-cream placeholder:text-cream/70 focus:outline-none focus:ring-2 focus:ring-blue/70"
                  type="email"
                  name="email"
                  placeholder="jane@company.com"
                />
              </label>
              <label className="grid gap-2 text-sm">
                Project Notes
                <textarea
                  className="w-full rounded-[12px] border border-cream/40 bg-cream/10 px-3 py-2 text-cream placeholder:text-cream/70 focus:outline-none focus:ring-2 focus:ring-blue/70"
                  name="project"
                  rows="3"
                  placeholder="Launch in Q3, need brand and web build..."
                ></textarea>
              </label>
              <button className={buttonPrimary} type="submit">
                Send inquiry
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="grid gap-6 py-16 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-bold">Binary Baker</p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-ink/70">
            Crafting digital products since 2024.
          </p>
        </div>
        <div className="grid gap-2">
          <a href="#services">Services</a>
          <a href="#work">Work</a>
          <a href="#process">Process</a>
          <a href={portalUrl}>Portal</a>
        </div>
        <div className="grid gap-2">
          <a href="mailto:hello@binarybaker.com">hello@binarybaker.com</a>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/70">
            Remote worldwide
          </p>
        </div>
      </footer>
    </div>
  );
}
