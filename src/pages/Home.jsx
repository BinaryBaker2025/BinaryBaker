import { httpsCallable } from "firebase/functions";
import { useEffect, useMemo, useState } from "react";
import { functions } from "../firebase.js";
import {
  brandLink,
  buttonBase,
  buttonGhost,
  buttonPrimary,
  pageHeader,
  pageShell
} from "../styles/uiTokens.js";
import BrandLogo from "../components/BrandLogo.jsx";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#showcase", label: "Showcase" },
  { href: "#process", label: "Process" },
  { href: "#locations", label: "Locations" },
  { href: "#contact", label: "Contact" }
];

const whatsappNumberDisplay = "+27 61 101 1669";
const whatsappLink =
  "https://wa.me/27611011669?text=Hi%20Binary%20Baker%2C%20I%20would%20like%20to%20chat%20about%20my%20project.";

const metrics = [
  { value: "48 hrs", label: "response window" },
  { value: "Custom", label: "quote per project" },
  { value: "End-to-end", label: "delivery support" }
];

const services = [
  {
    id: "01",
    title: "Website Design & Development",
    description:
      "Web design and website development for South African businesses focused on speed, clarity, and lead conversion.",
    timeline: "Custom scope"
  },
  {
    id: "02",
    title: "Business Systems",
    description: "Portals, dashboards, booking flows, and internal tools tailored to your workflow.",
    timeline: "Project-based"
  },
  {
    id: "03",
    title: "E-Commerce & Integrations",
    description:
      "E-commerce website development with payments, forms, and third-party integrations.",
    timeline: "Scalable build"
  },
  {
    id: "04",
    title: "Support & Optimisation",
    description:
      "Website maintenance, performance optimisation, and bug fixes after launch.",
    timeline: "Ongoing"
  }
];

const showcaseProjects = [
  {
    id: "bethany-blooms",
    name: "Bethany Blooms",
    websiteUrl: "https://www.bethanyblooms.co.za/",
    websiteLabel: "bethanyblooms.co.za",
    logoUrl: "https://www.bethanyblooms.co.za/bradb-favicon.png",
    summary: "Pressed flower art workshops, curated DIY kits, and custom floral keepsakes."
  },
  {
    id: "the-crooked-fence",
    name: "The Crooked Fence",
    websiteUrl: "https://www.thecrookedfence.co.za/",
    websiteLabel: "thecrookedfence.co.za",
    logoUrl: "https://www.thecrookedfence.co.za/TCFLogoWhiteBackground.png",
    summary: "Fertile egg ordering with structured delivery planning."
  }
];

const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description: "Define scope, integrations, and success criteria.",
    microPoints: [
      "Business and technical requirements mapping",
      "Integration planning",
      "Risk identification",
      "Clear implementation roadmap"
    ]
  },
  {
    step: "02",
    title: "Build",
    description: "Structured development with milestone reviews.",
    microPoints: [
      "Modular, scalable architecture",
      "Secure coding standards",
      "Staged milestone reviews",
      "Internal QA and performance testing"
    ]
  },
  {
    step: "03",
    title: "Launch",
    description: "Secure deployment with optional ongoing support.",
    microPoints: [
      "Production deployment",
      "Monitoring configuration",
      "Handover documentation",
      "Post-launch optimisation window"
    ]
  }
];

const whyBinaryBakerPoints = [
  "We build systems, not just websites.",
  "We understand local requirements for South African businesses.",
  "Every project is scoped, documented, and delivered professionally.",
  "Infrastructure, security, and scalability are built in from day one.",
  "No rushed builds, no hidden costs, and no guesswork.",
  "We focus on long-term partnerships, not one-off projects."
];

const includedProjectItems = [
  {
    title: "Production-ready responsive build",
    detail: "Built for desktop, tablet, and mobile."
  },
  {
    title: "Performance & security best practices",
    detail: "Fast loading and secure defaults."
  },
  {
    title: "Secure deployment & infrastructure setup",
    detail: "Stable launch environment configuration."
  },
  {
    title: "Analytics & monitoring configuration",
    detail: "Visibility into usage and reliability."
  },
  {
    title: "Structured documentation & handover",
    detail: "Clear guides for your team."
  },
  {
    title: "Post-launch support window",
    detail: "Short-term support after go-live."
  }
];

const industriesWeServe = [
  {
    id: "professional_services",
    name: "Professional services",
    microBenefit: "Client portals + workflow",
    featuredDescription: "Client onboarding, proposals, approvals, and service delivery systems.",
    icon: "PS"
  },
  {
    id: "retail_ecommerce",
    name: "Retail & e-commerce",
    microBenefit: "Orders + inventory",
    featuredDescription: "Payments, inventory, fulfillment, automation.",
    icon: "RE"
  },
  {
    id: "agriculture_farming",
    name: "Agriculture & farming",
    microBenefit: "Tracking + automation",
    featuredDescription: "Field operations, supplier flows, and performance visibility in one hub.",
    icon: "AF"
  },
  {
    id: "hospitality",
    name: "Hospitality",
    microBenefit: "Bookings + POS",
    featuredDescription: "Bookings, customer touchpoints, and operational coordination for service teams.",
    icon: "HO"
  },
  {
    id: "creatives",
    name: "Creatives",
    microBenefit: "Portfolios + payments",
    featuredDescription: "Portfolio showcases, inquiry funnels, and streamlined client payment flows.",
    icon: "CR"
  },
  {
    id: "startups",
    name: "Startups",
    microBenefit: "MVP -> scale",
    featuredDescription: "Launch MVPs quickly, then scale architecture without rebuilding from scratch.",
    icon: "ST"
  },
  {
    id: "subscription_businesses",
    name: "Subscription businesses",
    microBenefit: "Billing + delivery",
    featuredDescription: "Recurring billing, customer lifecycle automation, and delivery operations.",
    icon: "SB"
  }
];

const infrastructureTrustIndicators = [
  "99.9% Uptime Target",
  "Automated Backups",
  "Scalable by Design"
];

const infrastructureColumns = [
  {
    title: "Hosting & Scaling",
    description: "Elastic hosting matched to real usage requirements.",
    items: [
      "Scalable cloud hosting",
      "Usage-based scaling",
      "Environment separation (dev / staging / production)",
      "Global CDN support (if applicable)"
    ]
  },
  {
    title: "Security & Protection",
    description: "Layered security and redundancy by default.",
    items: [
      "Automated backups",
      "Secure email delivery",
      "SSL & encrypted traffic",
      "Firewall & access control policies"
    ]
  },
  {
    title: "Monitoring & Management",
    description: "Continuous oversight to maintain reliability.",
    items: [
      "System monitoring",
      "Database management (where required)",
      "Performance optimisation",
      "Incident visibility & reporting"
    ]
  }
];

const carePlans = [
  {
    title: "Basic Care",
    bullets: [
      "Regular updates",
      "Bug fixes",
      "Performance checks",
      "Standard support response times",
      "Included monthly support hours"
    ]
  },
  {
    title: "Business Care",
    bullets: [
      "Regular updates",
      "Priority bug fixes",
      "Performance and stability checks",
      "Faster support response times",
      "Expanded monthly support hours"
    ]
  },
  {
    title: "Priority Care",
    bullets: [
      "Regular updates",
      "Critical issue handling",
      "Proactive performance checks",
      "Priority support response times",
      "Highest included support hours"
    ]
  }
];

const qualityAssuranceFramework = [
  {
    title: "Structured Delivery",
    paragraph:
      "We begin every engagement with clearly defined scope documentation, written timelines, and agreed milestone checkpoints. Expectations are formalised before development begins to ensure alignment on outputs, cost structure, and delivery responsibility."
  },
  {
    title: "Technical & Data Controls",
    paragraph:
      "Security and system integrity are embedded into our development practices. We apply disciplined access control, controlled deployment procedures, and secure handling of all client data to ensure operational reliability."
  },
  {
    title: "Communication & Accountability",
    paragraph:
      "Projects are managed with defined review cycles and consistent reporting. Escalation paths are clear, decisions are documented, and communication remains professional and structured throughout the lifecycle of the engagement."
  }
];

const faqItems = [
  {
    question: "Do you offer web design and website development in South Africa?",
    answer:
      "Yes. Binary Baker provides web design and website development for businesses across South Africa, including Johannesburg, Cape Town, Durban, Pretoria, and remote teams."
  },
  {
    question: "Do you include hosting and website maintenance?",
    answer:
      "Yes. We provide managed hosting options and structured website maintenance plans that include updates, performance monitoring, and issue handling."
  },
  {
    question: "Can you build e-commerce websites?",
    answer:
      "Yes. We build e-commerce websites with payment integrations, product management, and scalable architecture based on your business requirements."
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Ongoing support is available through structured care plans. These include updates, performance monitoring, and issue handling depending on your operational needs. Support scope is defined clearly at handover."
  },
  {
    question: "What happens after launch?",
    answer:
      "After launch, we provide structured handover documentation and deployment validation. Where applicable, we configure monitoring and backup systems. Clients can transition to internal management or continue with managed support."
  },
  {
    question: "How long does a typical build take?",
    answer:
      "Project timelines depend on system complexity, integrations, and review cycles. Smaller builds may complete within several weeks, while more complex systems require phased development. A detailed timeline is provided after discovery."
  }
];

const serviceAreas = [
  {
    name: "Johannesburg",
    detail: "Web design and website development for teams that need reliable lead flow."
  },
  {
    name: "Cape Town",
    detail: "Conversion-focused websites and digital systems for growing businesses."
  },
  {
    name: "Durban",
    detail: "Website builds, hosting, and maintenance for service and retail teams."
  },
  {
    name: "Pretoria",
    detail: "Business websites and internal tools designed for clear operations."
  }
];

const buttonInvert = `${buttonBase} w-full bg-cream text-ink`;
const contactSubmitButton =
  `${buttonBase} w-full border border-white/70 bg-gradient-to-r from-cream to-white text-deep-blue shadow-soft hover:brightness-105`;
const navLinkClass =
  "relative pb-1 text-sm after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-blue after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100";
const mobileNavLinkClass =
  "rounded-[12px] border border-ink/10 bg-white/75 px-4 py-2.5 text-sm font-medium text-ink transition hover:border-blue/30 hover:text-deep-blue";
const contactInputClass =
  "h-11 w-full rounded-[12px] border border-cream/40 bg-white/95 px-3 py-2 text-[0.95rem] text-ink placeholder:text-ink/45 transition focus:border-blue/70 focus:outline-none focus:ring-2 focus:ring-blue/50";
const contactTextareaClass =
  "w-full rounded-[12px] border border-cream/40 bg-white/95 px-3 py-3 text-[0.95rem] text-ink placeholder:text-ink/45 transition focus:border-blue/70 focus:outline-none focus:ring-2 focus:ring-blue/50 min-h-[120px] resize-y";
const contactLabelClass = "grid gap-1.5 text-sm font-medium text-cream";
const surfaceCardClass =
  "rounded-[18px] border border-ink/10 bg-gradient-to-br from-white/90 to-cream/90 shadow-soft backdrop-blur-sm";
const surfaceHoverClass =
  "rounded-[16px] border border-ink/10 bg-white/80 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-bb";
const sectionEyebrowClass = "font-mono text-xs uppercase tracking-[0.3em]";
const sectionEyebrowLightClass = `${sectionEyebrowClass} text-violet`;
const sectionEyebrowDarkClass = `${sectionEyebrowClass} text-cream/70`;
const sectionHeadingClass = "mt-2.5 font-serif text-3xl sm:text-4xl";
const sectionBodyClass = "mt-2.5 text-base leading-relaxed text-ink/70";
const sectionBodyDarkClass = "mt-2.5 text-base leading-relaxed text-cream/80";
const sectionSubheadingClass = "text-lg font-semibold text-ink";
const panelEyebrowDarkClass = "font-mono text-[0.65rem] uppercase tracking-[0.2em] text-cream/70";
const INDUSTRY_CYCLE_INTERVAL_MS = 3200;

const inquiryTypeOptions = [
  { value: "system_quote", label: "System quote" },
  { value: "general_enquiry", label: "General enquiry" },
  { value: "support", label: "Support" }
];

const contactMethodOptions = [
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "either", label: "Either" }
];

const systemTypeOptions = [
  { value: "crm", label: "CRM" },
  { value: "erp", label: "ERP" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "booking", label: "Booking platform" },
  { value: "internal_tool", label: "Internal tool" },
  { value: "mobile_app", label: "Mobile app" },
  { value: "website_platform", label: "Website platform" },
  { value: "automation", label: "Automation" },
  { value: "other", label: "Other" }
];

const budgetOptions = [
  { value: "under_5k", label: "Simple website" },
  { value: "5k_15k", label: "Business website" },
  { value: "15k_50k", label: "Growth website" },
  { value: "50k_100k", label: "Advanced platform" },
  { value: "100k_plus", label: "E-commerce or web app" },
  { value: "not_sure", label: "Not sure yet" }
];

const timelineOptions = [
  { value: "asap", label: "ASAP" },
  { value: "1_2_months", label: "1-2 months" },
  { value: "3_6_months", label: "3-6 months" },
  { value: "6_plus_months", label: "6+ months" },
  { value: "not_sure", label: "Not sure yet" }
];

const defaultContactForm = {
  inquiryType: "system_quote",
  fullName: "",
  email: "",
  phone: "",
  preferredContactMethod: "email",
  consentToContact: false,
  website: "",
  companyName: "",
  systemType: "",
  systemTypeOther: "",
  budgetRange: "",
  timeline: "",
  requirementsSummary: "",
  message: ""
};

export default function Home() {
  const [contactValues, setContactValues] = useState(defaultContactForm);
  const [contactStatus, setContactStatus] = useState({
    loading: false,
    error: "",
    success: ""
  });
  const submitWebsiteInquiry = useMemo(
    () => httpsCallable(functions, "submitWebsiteInquiry"),
    []
  );
  const isSystemQuote = contactValues.inquiryType === "system_quote";
  const [activeIndustryIndex, setActiveIndustryIndex] = useState(1);
  const [hoverIndustryIndex, setHoverIndustryIndex] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const featuredIndustry = industriesWeServe[hoverIndustryIndex ?? activeIndustryIndex];

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

  useEffect(() => {
    if (hoverIndustryIndex !== null) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndustryIndex((prev) => (prev + 1) % industriesWeServe.length);
    }, INDUSTRY_CYCLE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [hoverIndustryIndex]);

  const handleContactChange = (event) => {
    const { name, type, checked, value } = event.target;
    const nextValue = type === "checkbox" ? checked : value;
    setContactValues((prev) => {
      const next = { ...prev, [name]: nextValue };
      if (name === "inquiryType" && value !== "system_quote") {
        next.companyName = "";
        next.systemType = "";
        next.systemTypeOther = "";
        next.budgetRange = "";
        next.timeline = "";
        next.requirementsSummary = "";
      }
      if (name === "inquiryType" && value === "system_quote") {
        next.message = "";
      }
      if (name === "systemType" && value !== "other") {
        next.systemTypeOther = "";
      }
      return next;
    });
  };

  const resolveContactError = (error) => {
    const code = error?.code || "";
    if (code === "functions/invalid-argument") {
      return "Please review your details and try again.";
    }
    if (code === "functions/resource-exhausted") {
      return "Too many requests from this connection. Please wait a bit and try again.";
    }
    return "We could not send your request right now. Please try again in a moment.";
  };

  const validateContactForm = () => {
    if (!contactValues.fullName.trim()) {
      return "Full name is required.";
    }
    if (!contactValues.email.trim() || !/\S+@\S+\.\S+/.test(contactValues.email)) {
      return "A valid email is required.";
    }
    if (!contactValues.preferredContactMethod) {
      return "Please choose a preferred contact method.";
    }
    if (!contactValues.consentToContact) {
      return "Please confirm consent so we can contact you.";
    }
    if (isSystemQuote) {
      if (!contactValues.companyName.trim()) {
        return "Company name is required for system quote requests.";
      }
      if (!contactValues.phone.trim()) {
        return "WhatsApp number is required for system quote requests.";
      }
      if (!contactValues.systemType) {
        return "Please select a system type.";
      }
      if (contactValues.systemType === "other" && !contactValues.systemTypeOther.trim()) {
        return "Please specify your system type.";
      }
      if (!contactValues.budgetRange) {
        return "Please select a project type.";
      }
      if (!contactValues.timeline) {
        return "Please select a timeline.";
      }
      if (!contactValues.requirementsSummary.trim()) {
        return "Please share your requirements summary.";
      }
    } else if (!contactValues.message.trim()) {
      return "Please provide a message for your enquiry.";
    }

    return "";
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setContactStatus({ loading: true, error: "", success: "" });

    const validationError = validateContactForm();
    if (validationError) {
      setContactStatus({ loading: false, error: validationError, success: "" });
      return;
    }

    const payload = {
      inquiryType: contactValues.inquiryType,
      fullName: contactValues.fullName.trim(),
      email: contactValues.email.trim(),
      preferredContactMethod: contactValues.preferredContactMethod,
      consentToContact: true,
      website: contactValues.website.trim()
    };
    const trimmedPhone = contactValues.phone.trim();
    if (trimmedPhone) {
      payload.phone = trimmedPhone;
    }

    if (isSystemQuote) {
      payload.companyName = contactValues.companyName.trim();
      payload.systemType = contactValues.systemType;
      if (contactValues.systemType === "other") {
        payload.systemTypeOther = contactValues.systemTypeOther.trim();
      }
      payload.budgetRange = contactValues.budgetRange;
      payload.timeline = contactValues.timeline;
      payload.requirementsSummary = contactValues.requirementsSummary.trim();
    } else {
      payload.message = contactValues.message.trim();
    }

    try {
      await submitWebsiteInquiry(payload);
      setContactValues(defaultContactForm);
      setContactStatus({
        loading: false,
        error: "",
        success: "Thanks, your request has been sent. We will respond within 48 hours."
      });
    } catch (error) {
      setContactStatus({ loading: false, error: resolveContactError(error), success: "" });
    }
  };

  const handleResetContactForm = () => {
    setContactValues(defaultContactForm);
    setContactStatus({ loading: false, error: "", success: "" });
  };

  const handleMobileNavClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={pageShell}>
      <header
        className={`${pageHeader} sticky top-3 z-40 flex-col gap-3 rounded-[18px] border border-ink/10 bg-cream/80 px-4 py-3 shadow-soft backdrop-blur-md lg:flex-row lg:flex-nowrap lg:items-center lg:gap-6 lg:py-4`}
      >
        <div className="flex w-full items-center justify-between gap-3 lg:w-auto">
          <a className={brandLink} href="#top" onClick={handleMobileNavClose}>
            <BrandLogo />
          </a>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] border border-ink/15 bg-white/75 text-ink transition hover:border-blue/35 hover:text-deep-blue focus:outline-none focus:ring-2 focus:ring-blue/40 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-controls="mobile-site-nav"
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">Toggle navigation</span>
            {isMobileMenuOpen ? (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        <nav className="hidden flex-wrap gap-5 lg:flex">
          {navLinks.map((link) => (
            <a key={link.href} className={navLinkClass} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden flex-wrap gap-3 lg:flex">
          <a className={buttonPrimary} href="#contact">
            Get a Custom Quote
          </a>
        </div>

        <div
          id="mobile-site-nav"
          className={`${isMobileMenuOpen ? "mt-3 grid" : "hidden"} w-full gap-3 lg:hidden`}
        >
          <nav className="grid gap-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                className={mobileNavLinkClass}
                href={link.href}
                onClick={handleMobileNavClose}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a className={`${buttonPrimary} w-full`} href="#contact" onClick={handleMobileNavClose}>
            Get a Custom Quote
          </a>
        </div>
      </header>

      <main id="top">
        <section className="relative grid items-center gap-8 py-12 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 lg:py-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-deep-blue">
              Web design and website development South Africa
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
              Web design, website development, hosting, and maintenance in South Africa.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink/80">
              Binary Baker helps South African businesses launch fast, secure websites and business
              systems with managed hosting and ongoing website maintenance.
            </p>
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
              <a className={buttonPrimary} href="#contact">
                Start Your Project
              </a>
              <a className={buttonGhost} href="#contact">
                Book a Discovery Call
              </a>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className={`${surfaceHoverClass} px-4 py-3`}>
                  <span className="text-base font-semibold text-ink">{metric.value}</span>
                  <span className="mt-1 block text-[0.7rem] uppercase tracking-[0.2em] text-ink/60">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 rounded-[28px] border border-cream/20 bg-gradient-to-br from-ink to-deep-blue p-6 text-cream shadow-bb sm:p-7 lg:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cream/70">Quote-first</p>
            <h3 className="mt-2 text-2xl font-semibold">Every project is scoped properly</h3>
            <p className="mt-3 text-cream/80">
              We do not publish fixed pricing on the website. We scope your requirements first, then
              provide a tailored quote.
            </p>
            <ul className="mt-5 list-disc space-y-2 pl-5 pb-5 text-sm text-cream/80">
              <li>Clear scope and realistic timeline</li>
              <li>Recommendations based on your actual needs</li>
              <li>Transparent quote before build starts</li>
            </ul>
            <a className={buttonInvert} href="#contact">
              Request System Review
            </a>
          </div>

          <div
            className="pointer-events-none absolute -top-6 right-20 hidden h-44 w-44 animate-float rounded-full bg-gradient-to-br from-blue to-violet opacity-60 blur-[0.5px] lg:block"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="pointer-events-none absolute bottom-4 -right-5 hidden h-36 w-36 animate-float rounded-full bg-gradient-to-br from-deep-blue to-blue opacity-60 blur-[0.5px] lg:block"
          ></div>
        </section>

        <section className="reveal py-12 sm:py-14 lg:py-14" id="why">
          <div className={`${surfaceCardClass} p-6 sm:p-8`}>
            <p className={sectionEyebrowLightClass}>Why Binary Baker</p>
            <h2 className={sectionHeadingClass}>Why Choose Binary Baker</h2>
            <p className={`${sectionBodyClass} max-w-3xl`}>
              We are a web design and website development partner for South African businesses that need
              clear execution, strong technical standards, and long-term support.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {whyBinaryBakerPoints.map((point, index) => (
                <div key={point} className={`${surfaceHoverClass} flex items-start gap-3 px-4 py-3`}>
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-deep-blue text-xs font-semibold text-cream">
                    {index + 1}
                  </span>
                  <p className="text-sm text-ink/80">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="reveal py-14 sm:py-16 lg:py-16" id="services">
          <div className="max-w-2xl">
            <p className={sectionEyebrowLightClass}>Services</p>
            <h2 className={sectionHeadingClass}>
              Web design, development, and support services built for growth.
            </h2>
            <p className={sectionBodyClass}>
              Choose the model that matches your website development, e-commerce, hosting, and
              maintenance requirements.
            </p>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.id}
                className={`${surfaceHoverClass} p-6`}
              >
                <span className="font-mono text-xs text-deep-blue">{service.id}</span>
                <h3 className={`mt-3 ${sectionSubheadingClass}`}>{service.title}</h3>
                <p className="mt-2 text-sm text-ink/70">{service.description}</p>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-ink/70">
                  {service.timeline}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="reveal py-14 sm:py-16 lg:py-16" id="showcase">
          <div className="max-w-2xl">
            <p className={sectionEyebrowLightClass}>Client Showcase</p>
            <h2 className={sectionHeadingClass}>A look at recent projects</h2>
            <p className={sectionBodyClass}>
              Examples of businesses we have helped launch online so far.
            </p>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {showcaseProjects.map((project) => (
              <article key={project.id} className={`${surfaceHoverClass} flex flex-col p-5 sm:p-6`}>
                <div className="flex h-24 items-center justify-center rounded-[14px] border border-ink/10 bg-white/95 px-4">
                  <img
                    src={project.logoUrl}
                    alt={`${project.name} logo`}
                    className="max-h-16 w-auto object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <h3 className={`mt-4 ${sectionSubheadingClass}`}>{project.name}</h3>
                <p className="mt-2 text-sm text-ink/70">{project.summary}</p>
                <a
                  className="mt-4 inline-flex w-full items-center justify-center rounded-[12px] border border-blue/30 bg-blue/5 px-4 py-2.5 text-sm font-semibold text-deep-blue transition hover:border-blue/50 hover:bg-blue/10"
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit {project.websiteLabel}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="reveal py-12 sm:py-14 lg:py-14" id="industries">
          <div className={`${surfaceCardClass} relative overflow-hidden p-5 sm:p-6 lg:p-8`}>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(83,54,239,0.05),transparent_54%),radial-gradient(circle_at_100%_0%,rgba(29,159,242,0.05),transparent_56%)]"
            ></div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-6 right-6 top-0 h-[1.5px] bg-gradient-to-r from-[rgba(83,54,239,0.32)] to-[rgba(29,159,242,0.32)]"
            ></div>

            <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div>
                <p className={`${sectionEyebrowLightClass} mb-3`}>
                  INDUSTRIES WE WORK WITH
                </p>
                <h2 className={sectionHeadingClass}>Industries We Work With</h2>
                <p className={`${sectionBodyClass} mb-5 max-w-[650px] text-[1.1rem]`}>
                  We build systems that fit real-world operations - not just pretty websites.
                </p>
              </div>

              <aside className="w-full lg:max-w-[320px] lg:justify-self-end">
                <div className="rounded-[20px] bg-gradient-to-r from-[#5336EF] to-[#1D9FF2] p-px">
                  <div className="relative min-h-[180px] overflow-hidden rounded-[19px] border border-white/80 bg-white/95 p-4 text-[#010205] sm:h-[220px]">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_8%,rgba(29,159,242,0.07),transparent_56%),radial-gradient(circle_at_8%_92%,rgba(83,54,239,0.06),transparent_56%)]"
                    ></div>

                    <div className="relative flex h-full flex-col">
                      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[rgba(83,54,239,0.8)]">
                        Currently Featured
                      </p>
                      <h3 className="mt-2 min-h-0 text-[1.65rem] font-semibold leading-tight text-[#010205] sm:min-h-[70px] sm:text-[29px]">
                        {featuredIndustry.name}
                      </h3>
                      <p className="min-h-0 text-base leading-relaxed text-[rgba(1,2,5,0.66)] sm:min-h-[58px]">
                        {featuredIndustry.featuredDescription}
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>

            <div
              className="relative mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              onMouseLeave={() => setHoverIndustryIndex(null)}
            >
              {industriesWeServe.map((industry, index) => {
                const isActive = (hoverIndustryIndex ?? activeIndustryIndex) === index;
                return (
                  <button
                    key={industry.id}
                    type="button"
                    onMouseEnter={() => setHoverIndustryIndex(index)}
                    onFocus={() => setHoverIndustryIndex(index)}
                    onBlur={() => setHoverIndustryIndex(null)}
                    onClick={() => setActiveIndustryIndex(index)}
                    className="group relative rounded-[16px] p-px text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(29,159,242,0.45)]"
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 rounded-[16px] bg-gradient-to-r from-[rgba(83,54,239,0.28)] to-[rgba(29,159,242,0.28)] transition-opacity duration-200 ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    ></span>
                    <span
                      className={`relative flex h-[66px] items-center rounded-[15px] border border-black/[0.1] px-3.5 py-2.5 shadow-[0_4px_12px_rgba(1,2,5,0.05)] transition duration-200 group-hover:-translate-y-[1px] ${
                        isActive ? "bg-[linear-gradient(135deg,rgba(83,54,239,0.06),rgba(29,159,242,0.06))]" : "bg-white"
                      }`}
                    >
                      <span className="mr-2.5 flex items-center gap-1.5">
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#5336EF] to-[#1D9FF2] text-[10px] font-bold text-white transition-transform duration-200 group-hover:translate-x-[1px]">
                          {industry.icon}
                        </span>
                        <span className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-[rgba(83,54,239,0.15)] bg-[rgba(83,54,239,0.1)] font-mono text-[11px] font-bold text-[#5336EF]">
                          {(index + 1).toString().padStart(2, "0")}
                        </span>
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-[rgba(1,2,5,0.9)]">
                          {industry.name}
                        </span>
                        <span
                          className={`block text-[12px] transition-colors duration-200 ${
                            isActive ? "text-[rgba(1,2,5,0.7)]" : "text-[rgba(1,2,5,0.5)] group-hover:text-[rgba(1,2,5,0.66)]"
                          }`}
                        >
                          {industry.microBenefit}
                        </span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative mt-6 flex flex-col items-start gap-3 rounded-[14px] border border-black/[0.07] bg-white/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-[rgba(1,2,5,0.72)]">
                Not sure what you need? Let&apos;s map it.
              </p>
              <a
                className="inline-flex items-center justify-center rounded-[14px] bg-gradient-to-r from-[#5336EF] to-[#1D9FF2] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_18px_rgba(83,54,239,0.16)] transition duration-200 hover:-translate-y-0.5 hover:brightness-105"
                href="#contact"
              >
                Book a Discovery Call
              </a>
            </div>
          </div>
        </section>

        <section className="reveal py-14 sm:py-16 lg:py-16" id="included">
          <div className="rounded-[22px] border border-black/[0.06] bg-white/92 p-6 shadow-[0_10px_28px_rgba(1,2,5,0.05)] sm:p-8">
            <div className="max-w-3xl">
              <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-[#5336EF]">
                DELIVERY STANDARD
              </p>
              <h2 className="mt-3 text-[36px] font-serif font-bold leading-tight text-[#010205] sm:text-[40px]">
                What&apos;s Included
              </h2>
              <p className="mt-3 text-base text-[rgba(1,2,5,0.7)]">Clear deliverables. No surprises.</p>
            </div>

            <div className="mt-7 grid gap-x-10 gap-y-5 md:grid-cols-2">
              {includedProjectItems.map((item) => (
                <article key={item.title} className="flex items-start gap-3 border-b border-black/[0.07] pb-4">
                  <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#5336EF]"></span>
                  <div>
                    <h3 className="text-base font-semibold text-[#010205]">{item.title}</h3>
                    <p className="mt-1 text-sm text-[rgba(1,2,5,0.62)]">{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="reveal py-16 sm:py-16 lg:py-20" id="process">
          <div className="relative mx-auto max-w-[1160px] rounded-[24px] border border-black/[0.06] bg-white/88 p-6 shadow-[0_12px_30px_rgba(1,2,5,0.05)] sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(83,54,239,0.06),rgba(29,159,242,0.04),transparent_74%)] blur-2xl"
            ></div>

            <div className="max-w-3xl">
              <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-[rgba(83,54,239,0.88)]">
                PROCESS
              </p>
              <h2 className="mt-3 font-serif text-[32px] leading-[1.14] text-[#010205] sm:text-[36px] lg:text-[44px]">
                Clear delivery from discovery to launch.
              </h2>
              <p className="mt-3 text-base text-[rgba(1,2,5,0.68)]">
                A structured workflow with defined milestones and handover.
              </p>
              <div
                aria-hidden="true"
                className="mt-5 h-px max-w-[340px] bg-gradient-to-r from-[rgba(83,54,239,0.28)] to-transparent"
              ></div>
            </div>

            <div className="relative mt-7 pl-3 sm:pl-4">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-5 left-[22px] top-5 w-px bg-gradient-to-b from-[rgba(83,54,239,0.24)] to-[rgba(29,159,242,0.2)]"
              ></div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {processSteps.map((step, index) => (
                  <article
                    key={step.step}
                    className={`group relative overflow-hidden rounded-[20px] border border-black/[0.07] bg-white/92 px-5 py-5 shadow-[0_8px_16px_rgba(1,2,5,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(83,54,239,0.28)] hover:shadow-[0_12px_24px_rgba(1,2,5,0.06)] sm:px-6 sm:py-6 ${
                      index === 2 ? "md:col-span-2 xl:col-span-1" : ""
                    }`}
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[rgba(83,54,239,0.28)] to-[rgba(29,159,242,0.24)] opacity-0 transition duration-200 group-hover:opacity-100"
                    ></div>
                    <div className="flex items-start gap-4">
                      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(83,54,239,0.22)] bg-[rgba(83,54,239,0.12)] font-mono text-[0.76rem] font-semibold tracking-[0.1em] text-[#5336EF]">
                        {step.step}
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-[17px] font-semibold text-[#010205]">{step.title}</h3>
                        <p className="mt-1.5 text-[14px] font-medium leading-relaxed text-[rgba(1,2,5,0.84)]">
                          {step.description}
                        </p>
                        <ul className="mt-3 divide-y divide-black/[0.06] rounded-[12px] border border-black/[0.06] bg-[rgba(248,245,238,0.58)] px-3">
                          {step.microPoints.map((point) => (
                            <li
                              key={point}
                              className="flex items-start gap-2 py-2 text-[14px] text-[rgba(1,2,5,0.62)]"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[rgba(83,54,239,0.5)]"></span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="reveal py-14 sm:py-16 lg:py-16" id="platform">
          <div className="mx-auto max-w-[1160px]">
            <div className="max-w-3xl">
              <p className={sectionEyebrowLightClass}>Infrastructure</p>
              <h2 className={sectionHeadingClass}>Managed Website Hosting in South Africa</h2>
              <p className={sectionBodyClass}>
                Managed website hosting designed for uptime, security, and scalable growth.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {infrastructureTrustIndicators.map((indicator) => (
                <span
                  key={indicator}
                  className="inline-flex items-center rounded-full border border-black/[0.08] bg-white/80 px-3.5 py-1.5 text-[0.8rem] font-medium text-[rgba(1,2,5,0.78)]"
                >
                  {indicator}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {infrastructureColumns.map((column) => (
                <article
                  key={column.title}
                  className="relative overflow-hidden rounded-[20px] border border-black/[0.06] bg-white/85 p-7 shadow-[0_8px_20px_rgba(1,2,5,0.04)]"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[rgba(83,54,239,0.42)] to-[rgba(29,159,242,0.42)]"
                  ></div>
                  <h3 className="text-[1.05rem] font-semibold text-[#010205]">{column.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[rgba(1,2,5,0.64)]">
                    {column.description}
                  </p>
                  <ul className="mt-4 grid gap-2.5 text-[0.92rem] text-[rgba(1,2,5,0.76)]">
                    {column.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[rgba(83,54,239,0.55)]"></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <p className="mt-5 text-sm text-[rgba(1,2,5,0.62)]">
              Infrastructure is matched to your system&apos;s size, traffic profile, and risk
              requirements.
            </p>
          </div>
        </section>

        <section className="reveal relative py-14 sm:py-16 lg:py-16" id="care-plans">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-6 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(83,54,239,0.09),rgba(29,159,242,0.07),transparent_72%)] blur-3xl"
          ></div>

          <div className="relative max-w-3xl">
            <p className={sectionEyebrowLightClass}>Support</p>
            <h2 className={sectionHeadingClass}>Website Maintenance & Ongoing Support</h2>
            <p className={sectionBodyClass}>
              Website maintenance is optional but recommended to keep your platform stable, secure, and
              performing well over time.
            </p>
          </div>

          <div className="relative mt-6 grid gap-6 lg:grid-cols-3">
            {carePlans.map((plan) => {
              const isRecommended = plan.title === "Business Care";
              const tierLabel = plan.title.split(" ")[0].toUpperCase();

              return (
                <article
                  key={plan.title}
                  className={`group relative overflow-hidden rounded-[22px] border border-black/[0.06] bg-white/[0.88] p-8 shadow-[0_12px_28px_rgba(1,2,5,0.05)] transition duration-200 ease-out hover:-translate-y-[3px] hover:border-[rgba(83,54,239,0.24)] hover:shadow-[0_18px_34px_rgba(1,2,5,0.08)] ${
                    isRecommended ? "shadow-[0_16px_34px_rgba(1,2,5,0.08)]" : ""
                  }`}
                >
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[rgba(83,54,239,0.4)] to-[rgba(29,159,242,0.4)] ${
                      isRecommended ? "opacity-100" : "opacity-90"
                    }`}
                  ></div>
                  {isRecommended && (
                    <span className="absolute right-5 top-5 rounded-full bg-[rgba(83,54,239,0.12)] px-2.5 py-1 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[#5336EF]">
                      Recommended
                    </span>
                  )}
                  <p className="font-mono text-[12px] uppercase tracking-[0.24em] text-[rgba(83,54,239,0.72)]">
                    {tierLabel}
                  </p>
                  <h3 className="mt-2 text-[1.3rem] font-semibold leading-tight text-[#010205]">
                    {plan.title}
                  </h3>
                  <ul className="mt-5 grid gap-2.5 text-[0.93rem] leading-relaxed text-ink/75">
                    {plan.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5">
                        <span className="mt-[0.38rem] h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-[#5336EF] to-[#1D9FF2]"></span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-black/[0.06] bg-[rgba(248,245,238,0.62)] px-6 py-4">
            <p className="text-sm text-[rgba(1,2,5,0.76)]">Ask about care plans in your quote.</p>
            <a
              className="inline-flex h-11 items-center justify-center rounded-[14px] bg-gradient-to-r from-[#5336EF] to-[#1D9FF2] px-5 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(83,54,239,0.2)] transition duration-200 hover:brightness-105"
              href="#contact"
            >
              Get a Custom Quote
            </a>
          </div>
        </section>

        <section className="reveal py-14 sm:py-16 lg:py-16" id="locations">
          <div className={`${surfaceCardClass} p-6 sm:p-8`}>
            <div className="max-w-3xl">
              <p className={sectionEyebrowLightClass}>Service Areas</p>
              <h2 className={sectionHeadingClass}>
                Website Development Services Across South Africa
              </h2>
              <p className={sectionBodyClass}>
                We work with businesses in Johannesburg, Cape Town, Durban, Pretoria, and remotely
                across South Africa.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {serviceAreas.map((area) => (
                <article key={area.name} className={`${surfaceHoverClass} p-5`}>
                  <h3 className="text-lg font-semibold text-ink">{area.name}</h3>
                  <p className="mt-2 text-sm text-ink/70">{area.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="reveal py-14 sm:py-16 lg:py-16" id="assurance">
          <div className="mx-auto max-w-[1120px] rounded-[24px] border border-black/[0.05] bg-white/92 p-6 sm:p-8 lg:px-14 lg:py-10">
            <div className="relative pl-4 sm:pl-5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-0 top-0 w-[2px] rounded-full bg-[rgba(83,54,239,0.15)]"
              ></div>

              <div className="max-w-[760px]">
                <p className={sectionEyebrowLightClass}>QUALITY ASSURANCE</p>
                <h2 className={sectionHeadingClass}>Our Commitment to Quality</h2>
                <p className="mt-3 text-[16px] leading-[1.7] text-[rgba(1,2,5,0.72)]">
                  Every engagement is structured around clarity, accountability, and technical
                  discipline.
                </p>
              </div>

              <div className="mt-8 h-px bg-black/[0.06]"></div>

              <div className="mt-8 grid gap-8">
                {qualityAssuranceFramework.map((section, index) => (
                  <article
                    key={section.title}
                    className={index === 0 ? "" : "border-t border-black/[0.06] pt-8"}
                  >
                    <div className="grid gap-3 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-12">
                      <h3 className="text-[1.18rem] font-semibold leading-tight text-[#010205]">
                        {section.title}
                      </h3>
                      <p className="text-[16px] leading-[1.78] text-[rgba(1,2,5,0.7)]">
                        {section.paragraph}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="reveal py-12 sm:py-14 lg:py-14" id="faq">
          <div className="max-w-4xl">
            <p className={sectionEyebrowLightClass}>Before We Build</p>
            <h2 className={sectionHeadingClass}>Common Questions & Clarifications</h2>
          </div>
          <div className="mt-6 overflow-hidden rounded-[18px] border-y border-black/[0.08]">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              const panelId = `faq-panel-${index}`;

              return (
                <article key={item.question} className="border-b border-black/[0.08] last:border-b-0">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                    className="group flex w-full items-center justify-between gap-4 px-1 py-4 text-left transition-colors duration-200 hover:bg-black/[0.02] sm:px-2"
                  >
                    <span className="text-[1.03rem] font-semibold leading-snug text-[#010205]">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-black/[0.12] text-[1.08rem] leading-none text-[#5336EF] transition-transform duration-200 ${
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
                      <p className="px-1 pb-5 text-[0.98rem] leading-relaxed text-[rgba(1,2,5,0.74)] sm:px-2">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-[16px] border border-black/[0.06] bg-white/75 px-5 py-4">
            <p className="text-sm text-[rgba(1,2,5,0.74)]">
              Still have questions? Let&apos;s clarify them before we build.
            </p>
            <a
              className="inline-flex h-10 items-center justify-center rounded-[12px] border border-black/[0.1] bg-white/90 px-4 text-sm font-medium text-[#010205] transition duration-200 hover:border-[rgba(83,54,239,0.3)] hover:text-[#1932BB]"
              href="#contact"
            >
              Book a Discovery Call
            </a>
          </div>
        </section>


        <section className="reveal py-14 sm:py-16 lg:py-16" id="contact">
          <div className="relative overflow-hidden rounded-[28px] border border-cream/20 bg-gradient-to-br from-deep-blue to-violet p-6 text-cream shadow-bb sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-12 h-44 w-44 rounded-full bg-cream/10 blur-2xl"
            ></div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-8 bottom-8 h-36 w-36 rounded-full bg-cream/10 blur-3xl"
            ></div>
            <div className="relative grid items-start gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-8 left-0 h-24 w-24 rounded-full bg-cream/10 blur-2xl"
              ></div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-6 top-24 h-28 w-28 rounded-full bg-cream/10 blur-3xl"
              ></div>

              <p className={sectionEyebrowDarkClass}>Get Started</p>
              <h2 className={sectionHeadingClass}>Ready to scope your project?</h2>
              <p className={`${sectionBodyDarkClass} max-w-xl`}>
                Tell us what you need built, ask a general question, or request support. We reply
                within 48 hours via Email or WhatsApp.
              </p>

              <div className="mt-5 rounded-[18px] border border-cream/25 bg-gradient-to-br from-cream/14 via-cream/10 to-cream/5 p-4 shadow-soft backdrop-blur-sm sm:p-5">
                <p className={panelEyebrowDarkClass}>How It Flows</p>
                <div className="mt-4 grid gap-3">
                  <div className="flex items-start gap-3 rounded-xl border border-cream/20 bg-deep-blue/35 px-3 py-2.5 transition hover:bg-deep-blue/45">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream/20 text-xs font-semibold text-cream">
                      1
                    </span>
                    <p className="text-sm leading-relaxed text-cream/90">
                      Submit your goals, project type, and contact preference.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-cream/20 bg-deep-blue/35 px-3 py-2.5 transition hover:bg-deep-blue/45">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream/20 text-xs font-semibold text-cream">
                      2
                    </span>
                    <p className="text-sm leading-relaxed text-cream/90">
                      We review your scope and confirm the right build, hosting, and support path.
                    </p>
                  </div>
                  <div className="flex items-start gap-3 rounded-xl border border-cream/20 bg-deep-blue/35 px-3 py-2.5 transition hover:bg-deep-blue/45">
                    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cream/20 text-xs font-semibold text-cream">
                      3
                    </span>
                    <p className="text-sm leading-relaxed text-cream/90">
                      You receive next steps, timeline, and a confirmed implementation plan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <div className="rounded-[14px] border border-cream/25 bg-cream/10 p-4 backdrop-blur-sm">
                  <p className={panelEyebrowDarkClass}>What To Include</p>
                  <ul className="mt-3 grid gap-2 text-sm text-cream/88">
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cream/75"></span>
                      <span>Your core business goal and the audience you want to serve.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cream/75"></span>
                      <span>Features you need now and any must-have integrations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-cream/75"></span>
                      <span>Your ideal launch window and preferred communication channel.</span>
                    </li>
                  </ul>
                </div>

                <div className="rounded-[14px] border border-cream/25 bg-cream/10 p-4 backdrop-blur-sm">
                  <p className={panelEyebrowDarkClass}>What You Are Looking For</p>
                  <div className="mt-3 grid gap-2">
                    <div className="rounded-lg border border-cream/20 bg-deep-blue/35 px-3 py-2.5 text-sm text-cream/88">
                      <span className="font-semibold text-cream">Simple website:</span> A clean online
                      presence to present your business and services.
                    </div>
                    <div className="rounded-lg border border-cream/20 bg-deep-blue/35 px-3 py-2.5 text-sm text-cream/88">
                      <span className="font-semibold text-cream">Business platform:</span> More pages,
                      lead forms, and key integrations for growth.
                    </div>
                    <div className="rounded-lg border border-cream/20 bg-deep-blue/35 px-3 py-2.5 text-sm text-cream/88">
                      <span className="font-semibold text-cream">Custom system:</span> Dashboards,
                      portals, e-commerce, or internal tools built around your workflow.
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-[14px] border border-cream/25 bg-cream/10 p-4 text-sm text-cream/88 backdrop-blur-sm">
                <p className={panelEyebrowDarkClass}>Availability</p>
                <p className="mt-2">
                  Monday to Thursday, 09:00 - 17:00; Friday and Saturday, 09:00 - 15:00 SAST
                </p>
                <p className="mt-1 text-cream/75">First response is sent via Email or WhatsApp.</p>
                <a
                  className="mt-3 inline-block underline decoration-cream/40 underline-offset-4"
                  href="mailto:bradley@binarybaker.co.za"
                >
                  bradley@binarybaker.co.za
                </a>
              </div>
            </div>
            {contactStatus.success ? (
              <div
                className="grid gap-4 rounded-[20px] border border-cream/25 bg-gradient-to-br from-deep-blue/45 via-violet/30 to-blue/25 p-5 text-cream shadow-soft backdrop-blur-sm sm:p-6"
                role="status"
                aria-live="polite"
              >
                <p className="text-xs font-mono uppercase tracking-[0.16em] text-cream/70">
                  Request received
                </p>
                <h3 className="font-serif text-2xl leading-tight text-cream">
                  Thanks, your enquiry has been sent successfully.
                </h3>
                <p className="rounded-[12px] border border-cream/20 bg-cream/10 px-3 py-3 text-sm leading-relaxed text-cream/88">
                  We will respond within 48 hours. For a faster reply, you can WhatsApp us on
                  {" "}
                  <a
                    className="font-semibold text-cream underline decoration-cream/45 underline-offset-2 transition hover:decoration-cream/75"
                    href="https://wa.me/27611011669"
                  >
                    +27 61 101 1669
                  </a>.
                </p>
                <button
                  className={contactSubmitButton}
                  type="button"
                  onClick={handleResetContactForm}
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form
                className="grid gap-4 rounded-[20px] border border-cream/25 bg-cream/10 p-4 shadow-soft backdrop-blur-sm sm:p-5"
                onSubmit={handleContactSubmit}
              >
                <p className="text-xs font-mono uppercase tracking-[0.16em] text-cream/70">
                  Fields marked * are required
                </p>

                <label className={contactLabelClass}>
                  Inquiry type *
                  <select
                    className={contactInputClass}
                    name="inquiryType"
                    value={contactValues.inquiryType}
                    onChange={handleContactChange}
                    required
                  >
                    {inquiryTypeOptions.map((option) => (
                      <option key={option.value} value={option.value} className="text-ink">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={contactLabelClass}>
                    Full name *
                    <input
                      className={contactInputClass}
                      type="text"
                      name="fullName"
                      value={contactValues.fullName}
                      onChange={handleContactChange}
                      placeholder="Thando Mokoena"
                      required
                    />
                  </label>
                  <label className={contactLabelClass}>
                    Email *
                    <input
                      className={contactInputClass}
                      type="email"
                      name="email"
                      value={contactValues.email}
                      onChange={handleContactChange}
                      placeholder="thando@company.co.za"
                      required
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={contactLabelClass}>
                    Preferred contact method *
                    <select
                      className={contactInputClass}
                      name="preferredContactMethod"
                      value={contactValues.preferredContactMethod}
                      onChange={handleContactChange}
                      required
                    >
                      {contactMethodOptions.map((option) => (
                        <option key={option.value} value={option.value} className="text-ink">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className={contactLabelClass}>
                    WhatsApp number {isSystemQuote ? "*" : "(optional)"}
                    <input
                      className={contactInputClass}
                      type="tel"
                      name="phone"
                      value={contactValues.phone}
                      onChange={handleContactChange}
                      placeholder="+27 82 123 4567"
                      required={isSystemQuote}
                    />
                  </label>
                </div>

                {isSystemQuote ? (
                  <>
                    <label className={contactLabelClass}>
                      Company name *
                      <input
                        className={contactInputClass}
                        type="text"
                        name="companyName"
                        value={contactValues.companyName}
                        onChange={handleContactChange}
                        placeholder="Your Company (Pty) Ltd"
                        required
                      />
                    </label>

                    <label className={contactLabelClass}>
                      System type *
                      <select
                        className={contactInputClass}
                        name="systemType"
                        value={contactValues.systemType}
                        onChange={handleContactChange}
                        required
                      >
                        <option value="" className="text-ink">
                          Select system type
                        </option>
                        {systemTypeOptions.map((option) => (
                          <option key={option.value} value={option.value} className="text-ink">
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    {contactValues.systemType === "other" && (
                      <label className={contactLabelClass}>
                        Other system type *
                        <input
                          className={contactInputClass}
                          type="text"
                          name="systemTypeOther"
                          value={contactValues.systemTypeOther}
                          onChange={handleContactChange}
                          placeholder="Describe the system"
                          required
                        />
                      </label>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className={contactLabelClass}>
                        Project type *
                        <select
                          className={contactInputClass}
                          name="budgetRange"
                          value={contactValues.budgetRange}
                          onChange={handleContactChange}
                          required
                        >
                          <option value="" className="text-ink">
                            Select project type
                          </option>
                          {budgetOptions.map((option) => (
                            <option key={option.value} value={option.value} className="text-ink">
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <span className="text-[0.7rem] uppercase tracking-[0.2em] text-cream/70">
                          Choose the option closest to your project scope
                        </span>
                      </label>

                      <label className={contactLabelClass}>
                        Timeline *
                        <select
                          className={contactInputClass}
                          name="timeline"
                          value={contactValues.timeline}
                          onChange={handleContactChange}
                          required
                        >
                          <option value="" className="text-ink">
                            Select timeline
                          </option>
                          {timelineOptions.map((option) => (
                            <option key={option.value} value={option.value} className="text-ink">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <label className={contactLabelClass}>
                      Requirements summary *
                      <textarea
                        className={contactTextareaClass}
                        name="requirementsSummary"
                        value={contactValues.requirementsSummary}
                        onChange={handleContactChange}
                        rows="4"
                        placeholder="Describe features, goals, users, integrations, and anything critical."
                        required
                      ></textarea>
                    </label>
                  </>
                ) : (
                  <label className={contactLabelClass}>
                    Message *
                    <textarea
                      className={contactTextareaClass}
                      name="message"
                      value={contactValues.message}
                      onChange={handleContactChange}
                      rows="4"
                      placeholder="Tell us what you need help with..."
                      required
                    ></textarea>
                  </label>
                )}

                <label className="inline-flex items-start gap-3 rounded-[12px] border border-cream/25 bg-cream/10 px-3 py-3 text-sm text-cream/90">
                  <input
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border border-cream/50 bg-white accent-deep-blue"
                    type="checkbox"
                    name="consentToContact"
                    checked={contactValues.consentToContact}
                    onChange={handleContactChange}
                    required
                  />
                  <span>I consent to Binary Baker contacting me about this enquiry.</span>
                </label>

                <label className="hidden" aria-hidden="true">
                  Website
                  <textarea
                    name="website"
                    tabIndex="-1"
                    autoComplete="off"
                    value={contactValues.website}
                    onChange={handleContactChange}
                  ></textarea>
                </label>

                {contactStatus.error && (
                  <p className="rounded-[12px] border border-rose-200 bg-rose-50/95 px-3 py-2 text-sm text-rose-700">
                    {contactStatus.error}
                  </p>
                )}

                <button
                  className={`${contactSubmitButton} ${contactStatus.loading ? "cursor-not-allowed opacity-70" : ""}`}
                  type="submit"
                  disabled={contactStatus.loading}
                >
                  {contactStatus.loading
                    ? "Sending..."
                    : isSystemQuote
                      ? "Get a Custom Quote"
                      : contactValues.inquiryType === "support"
                        ? "Request System Review"
                        : "Start Your Project"}
                </button>
              </form>
            )}
          </div>
          </div>
        </section>
      </main>

      <p className="rounded-[14px] border border-ink/10 bg-gradient-to-r from-cream/90 via-white/90 to-cream/90 px-5 py-4 text-center text-sm text-ink/80 shadow-soft">
        Trusted by growing businesses across South Africa and beyond.
      </p>

      <footer className="grid gap-6 py-16 text-sm sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-bold">Binary Baker</p>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-ink/70">
            Web design, website development, hosting, and support since 2024.
          </p>
        </div>
        <div className="grid gap-2">
          <a href="#services">Services</a>
          <a href="#showcase">Showcase</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="grid gap-2">
          <a href="mailto:bradley@binarybaker.co.za">bradley@binarybaker.co.za</a>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/70">
            Remote worldwide
          </p>
        </div>
      </footer>

      <a
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full border border-cream/35 bg-gradient-to-r from-deep-blue/95 via-violet/95 to-blue/95 p-2.5 text-cream shadow-bb backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-cream/45 sm:gap-3 sm:px-3.5 sm:py-3"
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label={`Chat with Binary Baker on WhatsApp at ${whatsappNumberDisplay}`}
      >
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream/35 bg-cream/15 text-cream">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M20.52 3.48A11.9 11.9 0 0 0 12.04 0C5.42 0 .04 5.39.04 12.01c0 2.12.55 4.2 1.61 6.04L0 24l6.15-1.61a11.95 11.95 0 0 0 5.89 1.5h.01c6.62 0 12-5.39 12-12 0-3.2-1.25-6.22-3.53-8.41zm-8.48 18.4h-.01a9.94 9.94 0 0 1-5.06-1.38l-.36-.21-3.65.96.97-3.56-.24-.37a9.94 9.94 0 0 1-1.52-5.31C2.17 6.5 6.54 2.13 12.04 2.13c2.65 0 5.14 1.03 7.01 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.5-4.48 9.86-9.9 9.86zm5.42-7.4c-.3-.15-1.78-.88-2.06-.98-.28-.11-.49-.15-.7.15-.2.3-.78.98-.96 1.18-.17.2-.35.23-.65.08-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.7-1.7-.96-2.33-.25-.61-.5-.53-.7-.54h-.6c-.2 0-.53.07-.8.38-.28.3-1.06 1.03-1.06 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.55.72.31 1.29.5 1.73.64.73.23 1.39.2 1.91.12.58-.08 1.78-.73 2.03-1.44.25-.71.25-1.32.18-1.44-.08-.11-.28-.18-.58-.33z" />
          </svg>
        </span>
        <span className="hidden leading-tight sm:grid">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.17em] text-cream/75">
            WhatsApp
          </span>
          <span className="text-sm font-semibold text-cream">{whatsappNumberDisplay}</span>
        </span>
      </a>
    </div>
  );
}
