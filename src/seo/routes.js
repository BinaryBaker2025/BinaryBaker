/**
 * @typedef {Object} BreadcrumbItem
 * @property {string} name
 * @property {string} path
 */

/**
 * @typedef {Object} SeoRoute
 * @property {string} id
 * @property {string} routePath
 * @property {string} pageName
 * @property {string} slug
 * @property {boolean} indexable
 * @property {string} [seoTitle]
 * @property {string} [metaDescription]
 * @property {string} [canonicalPath]
 * @property {string} [ogTitle]
 * @property {string} [ogDescription]
 * @property {string} [ogImage]
 * @property {string[]} [quickSummary]
 * @property {string[]} [relatedPages]
 * @property {BreadcrumbItem[]} [breadcrumbs]
 * @property {string} [schemaType]
 * @property {string} [serviceName]
 */

/** @type {SeoRoute[]} */
export const seoRoutes = [
  {
    id: "home",
    routePath: "/",
    pageName: "Home",
    slug: "",
    indexable: true,
    seoTitle: "Web Apps, Software & Business Websites | Binary Baker",
    metaDescription:
      "Binary Baker builds business websites, web apps, client portals, and custom software solutions for South African businesses, with delivery from Gauteng and remote support nationwide.",
    canonicalPath: "/",
    ogTitle: "Web Apps, Software & Business Websites | Binary Baker",
    ogDescription:
      "Custom web apps, software solutions, business websites, and practical support for South African businesses.",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Binary Baker builds business websites, web apps, and software solutions for companies that need practical digital systems.",
      "We are based in Gauteng and deliver projects across South Africa."
    ],
    relatedPages: ["services", "portfolio", "freeQuote"],
    schemaType: "WebPage"
  },
  {
    id: "about",
    routePath: "/about",
    pageName: "About",
    slug: "about",
    indexable: true,
    seoTitle: "About Binary Baker | Web Apps, Software & Websites",
    metaDescription:
      "Learn how Binary Baker scopes, designs, and builds business websites, web apps, and software solutions for businesses across South Africa.",
    canonicalPath: "/about",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Binary Baker is a Gauteng-based studio focused on practical websites, web apps, and business software.",
      "Every project follows a scoped roadmap, structured milestones, and transparent communication."
    ],
    relatedPages: ["services", "portfolio", "contact"],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" }
    ],
    schemaType: "AboutPage"
  },
  {
    id: "services",
    routePath: "/services",
    pageName: "Services",
    slug: "services",
    indexable: true,
    seoTitle: "Website, Web App & Software Services | Binary Baker",
    metaDescription:
      "Explore Binary Baker services: business websites, web apps, custom software systems, e-commerce integrations, and maintenance support.",
    canonicalPath: "/services",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Our services are built around clear business outcomes, scalable architecture, and practical implementation.",
      "We deliver business websites, web apps, software systems, and support aligned to your growth goals."
    ],
    relatedPages: [
      "serviceWebsiteDesignDevelopment",
      "serviceBusinessSystems",
      "serviceEcommerceIntegrations",
      "serviceWebsiteMaintenance",
      "freeQuote"
    ],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" }
    ],
    schemaType: "WebPage"
  },
  {
    id: "serviceWebsiteDesignDevelopment",
    routePath: "/services/website-design-development",
    pageName: "Website Design & Development",
    slug: "website-design-development",
    indexable: true,
    metaDescription:
      "Professional website design and development for South African businesses that need speed, clarity, and measurable lead generation.",
    canonicalPath: "/services/website-design-development",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "We build high-performance business websites with clear conversion paths.",
      "Every build is responsive, SEO-ready, and designed to support your wider software and growth goals."
    ],
    relatedPages: ["services", "serviceWebsiteMaintenance", "freeQuote"],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      {
        name: "Website Design & Development",
        path: "/services/website-design-development"
      }
    ],
    schemaType: "Service",
    serviceName: "Website Design & Development"
  },
  {
    id: "serviceBusinessSystems",
    routePath: "/services/business-systems",
    pageName: "Business Systems",
    slug: "business-systems",
    indexable: true,
    seoTitle: "Business Systems & Web App Development | Binary Baker",
    metaDescription:
      "Custom business systems, web apps, client portals, dashboards, and automation aligned to your operations.",
    canonicalPath: "/services/business-systems",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "We develop workflow-driven web apps, portals, and dashboards that reduce manual friction.",
      "Systems are scoped for security, reliability, and long-term maintainability."
    ],
    relatedPages: ["services", "serviceEcommerceIntegrations", "freeQuote"],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Business Systems", path: "/services/business-systems" }
    ],
    schemaType: "Service",
    serviceName: "Business Systems & Web App Development"
  },
  {
    id: "serviceEcommerceIntegrations",
    routePath: "/services/ecommerce-integrations",
    pageName: "E-Commerce & Integrations",
    slug: "ecommerce-integrations",
    indexable: true,
    metaDescription:
      "E-commerce platforms with secure checkout, product management, and integration support to help your team scale online sales.",
    canonicalPath: "/services/ecommerce-integrations",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Launch or upgrade e-commerce systems with stable integrations and conversion-focused UX.",
      "From checkout to fulfilment flows, we design for operational clarity and growth."
    ],
    relatedPages: ["services", "serviceBusinessSystems", "freeQuote"],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "E-Commerce & Integrations", path: "/services/ecommerce-integrations" }
    ],
    schemaType: "Service",
    serviceName: "E-Commerce & Integrations"
  },
  {
    id: "serviceWebsiteMaintenance",
    routePath: "/services/website-maintenance",
    pageName: "Website Maintenance",
    slug: "website-maintenance",
    indexable: true,
    metaDescription:
      "Website maintenance plans covering updates, performance checks, security hardening, and ongoing support for active business websites and digital platforms.",
    canonicalPath: "/services/website-maintenance",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Keep your website stable, secure, and fast with structured maintenance support.",
      "Choose a care plan based on your operational demands and support expectations."
    ],
    relatedPages: ["services", "serviceWebsiteDesignDevelopment", "contact"],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Website Maintenance", path: "/services/website-maintenance" }
    ],
    schemaType: "Service",
    serviceName: "Website Maintenance"
  },
  {
    id: "portfolio",
    routePath: "/portfolio",
    pageName: "Portfolio",
    slug: "portfolio",
    indexable: true,
    seoTitle: "Portfolio | Website, Web App & Software Projects",
    metaDescription:
      "Review selected Binary Baker projects and case snapshots covering business websites, web apps, and conversion-focused software solutions.",
    canonicalPath: "/portfolio",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Explore recent delivery examples and project outcomes across websites, web apps, and digital systems.",
      "Our portfolio highlights real business contexts and practical implementation choices."
    ],
    relatedPages: ["services", "about", "freeQuote"],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Portfolio", path: "/portfolio" }
    ],
    schemaType: "CollectionPage"
  },
  {
    id: "contact",
    routePath: "/contact",
    pageName: "Contact",
    slug: "contact",
    indexable: true,
    seoTitle: "Contact | Websites, Web Apps & Software | Binary Baker",
    metaDescription:
      "Contact Binary Baker for websites, web apps, software solutions, e-commerce builds, and maintenance support. Based in Gauteng with remote delivery across South Africa.",
    canonicalPath: "/contact",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Reach us via email or WhatsApp to discuss your website, web app, or software requirements.",
      "We are based in Gauteng and support clients nationwide through remote delivery."
    ],
    relatedPages: ["freeQuote", "services", "about"],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" }
    ],
    schemaType: "ContactPage"
  },
  {
    id: "freeQuote",
    routePath: "/free-quote",
    pageName: "Free Quote",
    slug: "free-quote",
    indexable: true,
    seoTitle: "Get a Quote | Websites, Web Apps & Software | Binary Baker",
    metaDescription:
      "Start with an R800 basic demo from Binary Baker for your website, web app, or software idea - review the structure before committing to the full project quote.",
    canonicalPath: "/free-quote",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "We build a working demo for R800 based on your website, web app, or software requirements - no styling, just structure.",
      "If you are happy with the demo, we then quote for the full build."
    ],
    relatedPages: ["services", "contact", "portfolio"],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Free Quote", path: "/free-quote" }
    ],
    schemaType: "WebPage"
  },
  {
    id: "privacyPolicy",
    routePath: "/privacy-policy",
    pageName: "Privacy Policy",
    slug: "privacy-policy",
    indexable: true,
    metaDescription:
      "Read the Binary Baker privacy policy on information collection, contact data usage, security practices, and your rights.",
    canonicalPath: "/privacy-policy",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Our privacy policy explains what information we collect and why.",
      "It also covers data protection practices and how to contact us about your data."
    ],
    relatedPages: ["contact", "about", "newsletter"],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path: "/privacy-policy" }
    ],
    schemaType: "WebPage"
  },
  {
    id: "newsletter",
    routePath: "/newsletter",
    pageName: "Newsletter",
    slug: "newsletter",
    indexable: true,
    seoTitle: "Newsletter | Web, App & Software Insights | Binary Baker",
    metaDescription:
      "Join the Binary Baker newsletter for practical insights on websites, web apps, software delivery, and digital growth.",
    canonicalPath: "/newsletter",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Subscribe for periodic insights on websites, software delivery, conversion, and technical implementation.",
      "Receive practical updates designed for growing South African businesses."
    ],
    relatedPages: ["freeQuote", "services", "about"],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Newsletter", path: "/newsletter" }
    ],
    schemaType: "WebPage"
  },
  {
    id: "seoStatus",
    routePath: "/seo-status",
    pageName: "SEO Status",
    slug: "seo-status",
    indexable: false,
    canonicalPath: "/seo-status",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Internal SEO health dashboard for indexing readiness checks.",
      "This page is hidden from search indexing."
    ],
    relatedPages: ["home"]
  },
  {
    id: "publicInvoice",
    routePath: "/p/invoice/:token",
    pageName: "Invoice",
    slug: "invoice",
    indexable: false,
    canonicalPath: "/",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: ["Secure invoice access page.", "Search indexing is disabled for this route."]
  },
  {
    id: "termsAndConditions",
    routePath: "/terms-and-conditions",
    pageName: "Terms and Conditions",
    slug: "terms-and-conditions",
    indexable: true,
    metaDescription:
      "Read the Binary Baker terms and conditions covering scope of work, payment, client responsibilities, liability, intellectual property, and service agreements.",
    canonicalPath: "/terms-and-conditions",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "These terms apply to all Binary Baker website, software, advertising, and hosting services.",
      "By accepting a quotation or invoice, the client agrees to the conditions outlined on this page."
    ],
    relatedPages: ["privacyPolicy", "contact", "freeQuote"],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Terms and Conditions", path: "/terms-and-conditions" }
    ],
    schemaType: "WebPage"
  },
  {
    id: "notFound",
    routePath: "*",
    pageName: "Not Found",
    slug: "404",
    indexable: false,
    canonicalPath: "/",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: ["Page not found state.", "Search indexing is disabled for this route."]
  }
];

export const seoRouteMap = Object.fromEntries(seoRoutes.map((route) => [route.id, route]));

export const indexableSeoRoutes = seoRoutes.filter(
  (route) => route.indexable && route.routePath !== "*" && !route.routePath.includes(":")
);

export const prerenderRoutes = indexableSeoRoutes.map((route) => route.routePath);

export function getSeoRoute(routeId) {
  return seoRouteMap[routeId] || null;
}

