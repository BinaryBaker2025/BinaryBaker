// vite.config.js
import { defineConfig } from "file:///C:/Users/Bradley/OneDrive/Desktop/Work/BinaryBaker/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/Bradley/OneDrive/Desktop/Work/BinaryBaker/node_modules/@vitejs/plugin-react/dist/index.js";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

// src/seo/routes.js
var seoRoutes = [
  {
    id: "home",
    routePath: "/",
    pageName: "Home",
    slug: "",
    indexable: true,
    seoTitle: "Web Design & Website Development South Africa | Binary Baker",
    metaDescription: "Binary Baker builds websites, business systems, and e-commerce platforms for South African teams, with delivery from Gauteng and remote conferencing nationwide.",
    canonicalPath: "/",
    ogTitle: "Web Design & Website Development South Africa | Binary Baker",
    ogDescription: "Conversion-focused website design, development, and maintenance with clear scoping and implementation support.",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Binary Baker designs and develops business-ready websites and systems.",
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
    metaDescription: "Learn how Binary Baker scopes, designs, and builds reliable website and system projects for businesses across South Africa.",
    canonicalPath: "/about",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Binary Baker is a Gauteng-based studio focused on practical, conversion-driven digital delivery.",
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
    metaDescription: "Explore Binary Baker service lines: website design and development, business systems, e-commerce integrations, and website maintenance.",
    canonicalPath: "/services",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Our services are built around clear business outcomes, scalable architecture, and practical implementation.",
      "Choose the service track that matches your stage and growth goals."
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
    metaDescription: "Professional website design and development for South African businesses that need speed, clarity, and measurable lead generation.",
    canonicalPath: "/services/website-design-development",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "We build high-performance business websites with clear conversion paths.",
      "Every build is responsive, SEO-ready, and aligned to your growth goals."
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
    metaDescription: "Custom business systems including client portals, dashboards, workflow tools, and automation aligned to your operations.",
    canonicalPath: "/services/business-systems",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "We develop workflow-driven portals and dashboards that reduce manual friction.",
      "Systems are scoped for security, reliability, and long-term maintainability."
    ],
    relatedPages: ["services", "serviceEcommerceIntegrations", "freeQuote"],
    breadcrumbs: [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: "Business Systems", path: "/services/business-systems" }
    ],
    schemaType: "Service",
    serviceName: "Business Systems Development"
  },
  {
    id: "serviceEcommerceIntegrations",
    routePath: "/services/ecommerce-integrations",
    pageName: "E-Commerce & Integrations",
    slug: "ecommerce-integrations",
    indexable: true,
    metaDescription: "E-commerce websites with secure checkout, product management, and integration support to help your team scale online sales.",
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
    metaDescription: "Website maintenance plans covering updates, performance checks, security hardening, and ongoing support for active business websites.",
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
    metaDescription: "Review selected Binary Baker projects and case snapshots covering South African business websites and conversion-focused systems.",
    canonicalPath: "/portfolio",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Explore recent delivery examples and project outcomes.",
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
    metaDescription: "Contact Binary Baker for website development, e-commerce, systems, and maintenance support. Based in Gauteng with remote conferencing across South Africa.",
    canonicalPath: "/contact",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Reach us via email or WhatsApp to discuss your project requirements.",
      "We are based in Gauteng and support clients nationwide through remote conferencing."
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
    metaDescription: "Request a custom project quote from Binary Baker and get a scoped implementation plan matched to your goals, timeline, and budget.",
    canonicalPath: "/free-quote",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Submit your requirements to receive a structured quote and delivery roadmap.",
      "Quotes are tailored to your business goals, scope complexity, and implementation timeline."
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
    metaDescription: "Read the Binary Baker privacy policy on information collection, contact data usage, security practices, and your rights.",
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
    metaDescription: "Join the Binary Baker newsletter for practical website growth insights, launch checklists, and service updates.",
    canonicalPath: "/newsletter",
    ogImage: "/android-chrome-512x512.png",
    quickSummary: [
      "Subscribe for periodic insights on web strategy, conversion, and technical delivery.",
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
var seoRouteMap = Object.fromEntries(seoRoutes.map((route) => [route.id, route]));
var indexableSeoRoutes = seoRoutes.filter(
  (route) => route.indexable && route.routePath !== "*" && !route.routePath.includes(":")
);
var prerenderRoutes = indexableSeoRoutes.map((route) => route.routePath);

// vite.config.js
var __vite_injected_original_import_meta_url = "file:///C:/Users/Bradley/OneDrive/Desktop/Work/BinaryBaker/vite.config.js";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var vitePrerender = require2("vite-plugin-prerender");
var Renderer = vitePrerender.PuppeteerRenderer;
var browserCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
].filter(Boolean);
var executablePath = browserCandidates.find((candidate) => fs.existsSync(candidate));
var vite_config_default = defineConfig({
  plugins: [
    react(),
    vitePrerender({
      staticDir: path.resolve("dist"),
      routes: prerenderRoutes,
      renderer: new Renderer({
        maxConcurrentRoutes: 2,
        renderAfterTime: 1500,
        ...executablePath ? { executablePath } : {}
      })
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiLCAic3JjL3Nlby9yb3V0ZXMuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxCcmFkbGV5XFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcV29ya1xcXFxCaW5hcnlCYWtlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQnJhZGxleVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFdvcmtcXFxcQmluYXJ5QmFrZXJcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0JyYWRsZXkvT25lRHJpdmUvRGVza3RvcC9Xb3JrL0JpbmFyeUJha2VyL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCBmcyBmcm9tIFwibm9kZTpmc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcIm5vZGU6cGF0aFwiO1xuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gXCJub2RlOm1vZHVsZVwiO1xuaW1wb3J0IHsgcHJlcmVuZGVyUm91dGVzIH0gZnJvbSBcIi4vc3JjL3Nlby9yb3V0ZXMuanNcIjtcblxuY29uc3QgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKTtcbmNvbnN0IHZpdGVQcmVyZW5kZXIgPSByZXF1aXJlKFwidml0ZS1wbHVnaW4tcHJlcmVuZGVyXCIpO1xuY29uc3QgUmVuZGVyZXIgPSB2aXRlUHJlcmVuZGVyLlB1cHBldGVlclJlbmRlcmVyO1xuXG5jb25zdCBicm93c2VyQ2FuZGlkYXRlcyA9IFtcbiAgcHJvY2Vzcy5lbnYuUFVQUEVURUVSX0VYRUNVVEFCTEVfUEFUSCxcbiAgXCJDOlxcXFxQcm9ncmFtIEZpbGVzXFxcXEdvb2dsZVxcXFxDaHJvbWVcXFxcQXBwbGljYXRpb25cXFxcY2hyb21lLmV4ZVwiLFxuICBcIkM6XFxcXFByb2dyYW0gRmlsZXMgKHg4NilcXFxcR29vZ2xlXFxcXENocm9tZVxcXFxBcHBsaWNhdGlvblxcXFxjaHJvbWUuZXhlXCIsXG4gIFwiQzpcXFxcUHJvZ3JhbSBGaWxlc1xcXFxNaWNyb3NvZnRcXFxcRWRnZVxcXFxBcHBsaWNhdGlvblxcXFxtc2VkZ2UuZXhlXCIsXG4gIFwiQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDg2KVxcXFxNaWNyb3NvZnRcXFxcRWRnZVxcXFxBcHBsaWNhdGlvblxcXFxtc2VkZ2UuZXhlXCJcbl0uZmlsdGVyKEJvb2xlYW4pO1xuXG5jb25zdCBleGVjdXRhYmxlUGF0aCA9IGJyb3dzZXJDYW5kaWRhdGVzLmZpbmQoKGNhbmRpZGF0ZSkgPT4gZnMuZXhpc3RzU3luYyhjYW5kaWRhdGUpKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgdml0ZVByZXJlbmRlcih7XG4gICAgICBzdGF0aWNEaXI6IHBhdGgucmVzb2x2ZShcImRpc3RcIiksXG4gICAgICByb3V0ZXM6IHByZXJlbmRlclJvdXRlcyxcbiAgICAgIHJlbmRlcmVyOiBuZXcgUmVuZGVyZXIoe1xuICAgICAgICBtYXhDb25jdXJyZW50Um91dGVzOiAyLFxuICAgICAgICByZW5kZXJBZnRlclRpbWU6IDE1MDAsXG4gICAgICAgIC4uLihleGVjdXRhYmxlUGF0aCA/IHsgZXhlY3V0YWJsZVBhdGggfSA6IHt9KVxuICAgICAgfSlcbiAgICB9KVxuICBdXG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQnJhZGxleVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFdvcmtcXFxcQmluYXJ5QmFrZXJcXFxcc3JjXFxcXHNlb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcQnJhZGxleVxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXFdvcmtcXFxcQmluYXJ5QmFrZXJcXFxcc3JjXFxcXHNlb1xcXFxyb3V0ZXMuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0JyYWRsZXkvT25lRHJpdmUvRGVza3RvcC9Xb3JrL0JpbmFyeUJha2VyL3NyYy9zZW8vcm91dGVzLmpzXCI7LyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBCcmVhZGNydW1iSXRlbVxuICogQHByb3BlcnR5IHtzdHJpbmd9IG5hbWVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwYXRoXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBTZW9Sb3V0ZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcm91dGVQYXRoXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcGFnZU5hbWVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzbHVnXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGluZGV4YWJsZVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtzZW9UaXRsZV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbbWV0YURlc2NyaXB0aW9uXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtjYW5vbmljYWxQYXRoXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtvZ1RpdGxlXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtvZ0Rlc2NyaXB0aW9uXVxuICogQHByb3BlcnR5IHtzdHJpbmd9IFtvZ0ltYWdlXVxuICogQHByb3BlcnR5IHtzdHJpbmdbXX0gW3F1aWNrU3VtbWFyeV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nW119IFtyZWxhdGVkUGFnZXNdXG4gKiBAcHJvcGVydHkge0JyZWFkY3J1bWJJdGVtW119IFticmVhZGNydW1ic11cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2NoZW1hVHlwZV1cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbc2VydmljZU5hbWVdXG4gKi9cblxuLyoqIEB0eXBlIHtTZW9Sb3V0ZVtdfSAqL1xuZXhwb3J0IGNvbnN0IHNlb1JvdXRlcyA9IFtcbiAge1xuICAgIGlkOiBcImhvbWVcIixcbiAgICByb3V0ZVBhdGg6IFwiL1wiLFxuICAgIHBhZ2VOYW1lOiBcIkhvbWVcIixcbiAgICBzbHVnOiBcIlwiLFxuICAgIGluZGV4YWJsZTogdHJ1ZSxcbiAgICBzZW9UaXRsZTogXCJXZWIgRGVzaWduICYgV2Vic2l0ZSBEZXZlbG9wbWVudCBTb3V0aCBBZnJpY2EgfCBCaW5hcnkgQmFrZXJcIixcbiAgICBtZXRhRGVzY3JpcHRpb246XG4gICAgICBcIkJpbmFyeSBCYWtlciBidWlsZHMgd2Vic2l0ZXMsIGJ1c2luZXNzIHN5c3RlbXMsIGFuZCBlLWNvbW1lcmNlIHBsYXRmb3JtcyBmb3IgU291dGggQWZyaWNhbiB0ZWFtcywgd2l0aCBkZWxpdmVyeSBmcm9tIEdhdXRlbmcgYW5kIHJlbW90ZSBjb25mZXJlbmNpbmcgbmF0aW9ud2lkZS5cIixcbiAgICBjYW5vbmljYWxQYXRoOiBcIi9cIixcbiAgICBvZ1RpdGxlOiBcIldlYiBEZXNpZ24gJiBXZWJzaXRlIERldmVsb3BtZW50IFNvdXRoIEFmcmljYSB8IEJpbmFyeSBCYWtlclwiLFxuICAgIG9nRGVzY3JpcHRpb246XG4gICAgICBcIkNvbnZlcnNpb24tZm9jdXNlZCB3ZWJzaXRlIGRlc2lnbiwgZGV2ZWxvcG1lbnQsIGFuZCBtYWludGVuYW5jZSB3aXRoIGNsZWFyIHNjb3BpbmcgYW5kIGltcGxlbWVudGF0aW9uIHN1cHBvcnQuXCIsXG4gICAgb2dJbWFnZTogXCIvYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmdcIixcbiAgICBxdWlja1N1bW1hcnk6IFtcbiAgICAgIFwiQmluYXJ5IEJha2VyIGRlc2lnbnMgYW5kIGRldmVsb3BzIGJ1c2luZXNzLXJlYWR5IHdlYnNpdGVzIGFuZCBzeXN0ZW1zLlwiLFxuICAgICAgXCJXZSBhcmUgYmFzZWQgaW4gR2F1dGVuZyBhbmQgZGVsaXZlciBwcm9qZWN0cyBhY3Jvc3MgU291dGggQWZyaWNhLlwiXG4gICAgXSxcbiAgICByZWxhdGVkUGFnZXM6IFtcInNlcnZpY2VzXCIsIFwicG9ydGZvbGlvXCIsIFwiZnJlZVF1b3RlXCJdLFxuICAgIHNjaGVtYVR5cGU6IFwiV2ViUGFnZVwiXG4gIH0sXG4gIHtcbiAgICBpZDogXCJhYm91dFwiLFxuICAgIHJvdXRlUGF0aDogXCIvYWJvdXRcIixcbiAgICBwYWdlTmFtZTogXCJBYm91dFwiLFxuICAgIHNsdWc6IFwiYWJvdXRcIixcbiAgICBpbmRleGFibGU6IHRydWUsXG4gICAgbWV0YURlc2NyaXB0aW9uOlxuICAgICAgXCJMZWFybiBob3cgQmluYXJ5IEJha2VyIHNjb3BlcywgZGVzaWducywgYW5kIGJ1aWxkcyByZWxpYWJsZSB3ZWJzaXRlIGFuZCBzeXN0ZW0gcHJvamVjdHMgZm9yIGJ1c2luZXNzZXMgYWNyb3NzIFNvdXRoIEFmcmljYS5cIixcbiAgICBjYW5vbmljYWxQYXRoOiBcIi9hYm91dFwiLFxuICAgIG9nSW1hZ2U6IFwiL2FuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nXCIsXG4gICAgcXVpY2tTdW1tYXJ5OiBbXG4gICAgICBcIkJpbmFyeSBCYWtlciBpcyBhIEdhdXRlbmctYmFzZWQgc3R1ZGlvIGZvY3VzZWQgb24gcHJhY3RpY2FsLCBjb252ZXJzaW9uLWRyaXZlbiBkaWdpdGFsIGRlbGl2ZXJ5LlwiLFxuICAgICAgXCJFdmVyeSBwcm9qZWN0IGZvbGxvd3MgYSBzY29wZWQgcm9hZG1hcCwgc3RydWN0dXJlZCBtaWxlc3RvbmVzLCBhbmQgdHJhbnNwYXJlbnQgY29tbXVuaWNhdGlvbi5cIlxuICAgIF0sXG4gICAgcmVsYXRlZFBhZ2VzOiBbXCJzZXJ2aWNlc1wiLCBcInBvcnRmb2xpb1wiLCBcImNvbnRhY3RcIl0sXG4gICAgYnJlYWRjcnVtYnM6IFtcbiAgICAgIHsgbmFtZTogXCJIb21lXCIsIHBhdGg6IFwiL1wiIH0sXG4gICAgICB7IG5hbWU6IFwiQWJvdXRcIiwgcGF0aDogXCIvYWJvdXRcIiB9XG4gICAgXSxcbiAgICBzY2hlbWFUeXBlOiBcIkFib3V0UGFnZVwiXG4gIH0sXG4gIHtcbiAgICBpZDogXCJzZXJ2aWNlc1wiLFxuICAgIHJvdXRlUGF0aDogXCIvc2VydmljZXNcIixcbiAgICBwYWdlTmFtZTogXCJTZXJ2aWNlc1wiLFxuICAgIHNsdWc6IFwic2VydmljZXNcIixcbiAgICBpbmRleGFibGU6IHRydWUsXG4gICAgbWV0YURlc2NyaXB0aW9uOlxuICAgICAgXCJFeHBsb3JlIEJpbmFyeSBCYWtlciBzZXJ2aWNlIGxpbmVzOiB3ZWJzaXRlIGRlc2lnbiBhbmQgZGV2ZWxvcG1lbnQsIGJ1c2luZXNzIHN5c3RlbXMsIGUtY29tbWVyY2UgaW50ZWdyYXRpb25zLCBhbmQgd2Vic2l0ZSBtYWludGVuYW5jZS5cIixcbiAgICBjYW5vbmljYWxQYXRoOiBcIi9zZXJ2aWNlc1wiLFxuICAgIG9nSW1hZ2U6IFwiL2FuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nXCIsXG4gICAgcXVpY2tTdW1tYXJ5OiBbXG4gICAgICBcIk91ciBzZXJ2aWNlcyBhcmUgYnVpbHQgYXJvdW5kIGNsZWFyIGJ1c2luZXNzIG91dGNvbWVzLCBzY2FsYWJsZSBhcmNoaXRlY3R1cmUsIGFuZCBwcmFjdGljYWwgaW1wbGVtZW50YXRpb24uXCIsXG4gICAgICBcIkNob29zZSB0aGUgc2VydmljZSB0cmFjayB0aGF0IG1hdGNoZXMgeW91ciBzdGFnZSBhbmQgZ3Jvd3RoIGdvYWxzLlwiXG4gICAgXSxcbiAgICByZWxhdGVkUGFnZXM6IFtcbiAgICAgIFwic2VydmljZVdlYnNpdGVEZXNpZ25EZXZlbG9wbWVudFwiLFxuICAgICAgXCJzZXJ2aWNlQnVzaW5lc3NTeXN0ZW1zXCIsXG4gICAgICBcInNlcnZpY2VFY29tbWVyY2VJbnRlZ3JhdGlvbnNcIixcbiAgICAgIFwic2VydmljZVdlYnNpdGVNYWludGVuYW5jZVwiLFxuICAgICAgXCJmcmVlUXVvdGVcIlxuICAgIF0sXG4gICAgYnJlYWRjcnVtYnM6IFtcbiAgICAgIHsgbmFtZTogXCJIb21lXCIsIHBhdGg6IFwiL1wiIH0sXG4gICAgICB7IG5hbWU6IFwiU2VydmljZXNcIiwgcGF0aDogXCIvc2VydmljZXNcIiB9XG4gICAgXSxcbiAgICBzY2hlbWFUeXBlOiBcIldlYlBhZ2VcIlxuICB9LFxuICB7XG4gICAgaWQ6IFwic2VydmljZVdlYnNpdGVEZXNpZ25EZXZlbG9wbWVudFwiLFxuICAgIHJvdXRlUGF0aDogXCIvc2VydmljZXMvd2Vic2l0ZS1kZXNpZ24tZGV2ZWxvcG1lbnRcIixcbiAgICBwYWdlTmFtZTogXCJXZWJzaXRlIERlc2lnbiAmIERldmVsb3BtZW50XCIsXG4gICAgc2x1ZzogXCJ3ZWJzaXRlLWRlc2lnbi1kZXZlbG9wbWVudFwiLFxuICAgIGluZGV4YWJsZTogdHJ1ZSxcbiAgICBtZXRhRGVzY3JpcHRpb246XG4gICAgICBcIlByb2Zlc3Npb25hbCB3ZWJzaXRlIGRlc2lnbiBhbmQgZGV2ZWxvcG1lbnQgZm9yIFNvdXRoIEFmcmljYW4gYnVzaW5lc3NlcyB0aGF0IG5lZWQgc3BlZWQsIGNsYXJpdHksIGFuZCBtZWFzdXJhYmxlIGxlYWQgZ2VuZXJhdGlvbi5cIixcbiAgICBjYW5vbmljYWxQYXRoOiBcIi9zZXJ2aWNlcy93ZWJzaXRlLWRlc2lnbi1kZXZlbG9wbWVudFwiLFxuICAgIG9nSW1hZ2U6IFwiL2FuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nXCIsXG4gICAgcXVpY2tTdW1tYXJ5OiBbXG4gICAgICBcIldlIGJ1aWxkIGhpZ2gtcGVyZm9ybWFuY2UgYnVzaW5lc3Mgd2Vic2l0ZXMgd2l0aCBjbGVhciBjb252ZXJzaW9uIHBhdGhzLlwiLFxuICAgICAgXCJFdmVyeSBidWlsZCBpcyByZXNwb25zaXZlLCBTRU8tcmVhZHksIGFuZCBhbGlnbmVkIHRvIHlvdXIgZ3Jvd3RoIGdvYWxzLlwiXG4gICAgXSxcbiAgICByZWxhdGVkUGFnZXM6IFtcInNlcnZpY2VzXCIsIFwic2VydmljZVdlYnNpdGVNYWludGVuYW5jZVwiLCBcImZyZWVRdW90ZVwiXSxcbiAgICBicmVhZGNydW1iczogW1xuICAgICAgeyBuYW1lOiBcIkhvbWVcIiwgcGF0aDogXCIvXCIgfSxcbiAgICAgIHsgbmFtZTogXCJTZXJ2aWNlc1wiLCBwYXRoOiBcIi9zZXJ2aWNlc1wiIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6IFwiV2Vic2l0ZSBEZXNpZ24gJiBEZXZlbG9wbWVudFwiLFxuICAgICAgICBwYXRoOiBcIi9zZXJ2aWNlcy93ZWJzaXRlLWRlc2lnbi1kZXZlbG9wbWVudFwiXG4gICAgICB9XG4gICAgXSxcbiAgICBzY2hlbWFUeXBlOiBcIlNlcnZpY2VcIixcbiAgICBzZXJ2aWNlTmFtZTogXCJXZWJzaXRlIERlc2lnbiAmIERldmVsb3BtZW50XCJcbiAgfSxcbiAge1xuICAgIGlkOiBcInNlcnZpY2VCdXNpbmVzc1N5c3RlbXNcIixcbiAgICByb3V0ZVBhdGg6IFwiL3NlcnZpY2VzL2J1c2luZXNzLXN5c3RlbXNcIixcbiAgICBwYWdlTmFtZTogXCJCdXNpbmVzcyBTeXN0ZW1zXCIsXG4gICAgc2x1ZzogXCJidXNpbmVzcy1zeXN0ZW1zXCIsXG4gICAgaW5kZXhhYmxlOiB0cnVlLFxuICAgIG1ldGFEZXNjcmlwdGlvbjpcbiAgICAgIFwiQ3VzdG9tIGJ1c2luZXNzIHN5c3RlbXMgaW5jbHVkaW5nIGNsaWVudCBwb3J0YWxzLCBkYXNoYm9hcmRzLCB3b3JrZmxvdyB0b29scywgYW5kIGF1dG9tYXRpb24gYWxpZ25lZCB0byB5b3VyIG9wZXJhdGlvbnMuXCIsXG4gICAgY2Fub25pY2FsUGF0aDogXCIvc2VydmljZXMvYnVzaW5lc3Mtc3lzdGVtc1wiLFxuICAgIG9nSW1hZ2U6IFwiL2FuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nXCIsXG4gICAgcXVpY2tTdW1tYXJ5OiBbXG4gICAgICBcIldlIGRldmVsb3Agd29ya2Zsb3ctZHJpdmVuIHBvcnRhbHMgYW5kIGRhc2hib2FyZHMgdGhhdCByZWR1Y2UgbWFudWFsIGZyaWN0aW9uLlwiLFxuICAgICAgXCJTeXN0ZW1zIGFyZSBzY29wZWQgZm9yIHNlY3VyaXR5LCByZWxpYWJpbGl0eSwgYW5kIGxvbmctdGVybSBtYWludGFpbmFiaWxpdHkuXCJcbiAgICBdLFxuICAgIHJlbGF0ZWRQYWdlczogW1wic2VydmljZXNcIiwgXCJzZXJ2aWNlRWNvbW1lcmNlSW50ZWdyYXRpb25zXCIsIFwiZnJlZVF1b3RlXCJdLFxuICAgIGJyZWFkY3J1bWJzOiBbXG4gICAgICB7IG5hbWU6IFwiSG9tZVwiLCBwYXRoOiBcIi9cIiB9LFxuICAgICAgeyBuYW1lOiBcIlNlcnZpY2VzXCIsIHBhdGg6IFwiL3NlcnZpY2VzXCIgfSxcbiAgICAgIHsgbmFtZTogXCJCdXNpbmVzcyBTeXN0ZW1zXCIsIHBhdGg6IFwiL3NlcnZpY2VzL2J1c2luZXNzLXN5c3RlbXNcIiB9XG4gICAgXSxcbiAgICBzY2hlbWFUeXBlOiBcIlNlcnZpY2VcIixcbiAgICBzZXJ2aWNlTmFtZTogXCJCdXNpbmVzcyBTeXN0ZW1zIERldmVsb3BtZW50XCJcbiAgfSxcbiAge1xuICAgIGlkOiBcInNlcnZpY2VFY29tbWVyY2VJbnRlZ3JhdGlvbnNcIixcbiAgICByb3V0ZVBhdGg6IFwiL3NlcnZpY2VzL2Vjb21tZXJjZS1pbnRlZ3JhdGlvbnNcIixcbiAgICBwYWdlTmFtZTogXCJFLUNvbW1lcmNlICYgSW50ZWdyYXRpb25zXCIsXG4gICAgc2x1ZzogXCJlY29tbWVyY2UtaW50ZWdyYXRpb25zXCIsXG4gICAgaW5kZXhhYmxlOiB0cnVlLFxuICAgIG1ldGFEZXNjcmlwdGlvbjpcbiAgICAgIFwiRS1jb21tZXJjZSB3ZWJzaXRlcyB3aXRoIHNlY3VyZSBjaGVja291dCwgcHJvZHVjdCBtYW5hZ2VtZW50LCBhbmQgaW50ZWdyYXRpb24gc3VwcG9ydCB0byBoZWxwIHlvdXIgdGVhbSBzY2FsZSBvbmxpbmUgc2FsZXMuXCIsXG4gICAgY2Fub25pY2FsUGF0aDogXCIvc2VydmljZXMvZWNvbW1lcmNlLWludGVncmF0aW9uc1wiLFxuICAgIG9nSW1hZ2U6IFwiL2FuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nXCIsXG4gICAgcXVpY2tTdW1tYXJ5OiBbXG4gICAgICBcIkxhdW5jaCBvciB1cGdyYWRlIGUtY29tbWVyY2Ugc3lzdGVtcyB3aXRoIHN0YWJsZSBpbnRlZ3JhdGlvbnMgYW5kIGNvbnZlcnNpb24tZm9jdXNlZCBVWC5cIixcbiAgICAgIFwiRnJvbSBjaGVja291dCB0byBmdWxmaWxtZW50IGZsb3dzLCB3ZSBkZXNpZ24gZm9yIG9wZXJhdGlvbmFsIGNsYXJpdHkgYW5kIGdyb3d0aC5cIlxuICAgIF0sXG4gICAgcmVsYXRlZFBhZ2VzOiBbXCJzZXJ2aWNlc1wiLCBcInNlcnZpY2VCdXNpbmVzc1N5c3RlbXNcIiwgXCJmcmVlUXVvdGVcIl0sXG4gICAgYnJlYWRjcnVtYnM6IFtcbiAgICAgIHsgbmFtZTogXCJIb21lXCIsIHBhdGg6IFwiL1wiIH0sXG4gICAgICB7IG5hbWU6IFwiU2VydmljZXNcIiwgcGF0aDogXCIvc2VydmljZXNcIiB9LFxuICAgICAgeyBuYW1lOiBcIkUtQ29tbWVyY2UgJiBJbnRlZ3JhdGlvbnNcIiwgcGF0aDogXCIvc2VydmljZXMvZWNvbW1lcmNlLWludGVncmF0aW9uc1wiIH1cbiAgICBdLFxuICAgIHNjaGVtYVR5cGU6IFwiU2VydmljZVwiLFxuICAgIHNlcnZpY2VOYW1lOiBcIkUtQ29tbWVyY2UgJiBJbnRlZ3JhdGlvbnNcIlxuICB9LFxuICB7XG4gICAgaWQ6IFwic2VydmljZVdlYnNpdGVNYWludGVuYW5jZVwiLFxuICAgIHJvdXRlUGF0aDogXCIvc2VydmljZXMvd2Vic2l0ZS1tYWludGVuYW5jZVwiLFxuICAgIHBhZ2VOYW1lOiBcIldlYnNpdGUgTWFpbnRlbmFuY2VcIixcbiAgICBzbHVnOiBcIndlYnNpdGUtbWFpbnRlbmFuY2VcIixcbiAgICBpbmRleGFibGU6IHRydWUsXG4gICAgbWV0YURlc2NyaXB0aW9uOlxuICAgICAgXCJXZWJzaXRlIG1haW50ZW5hbmNlIHBsYW5zIGNvdmVyaW5nIHVwZGF0ZXMsIHBlcmZvcm1hbmNlIGNoZWNrcywgc2VjdXJpdHkgaGFyZGVuaW5nLCBhbmQgb25nb2luZyBzdXBwb3J0IGZvciBhY3RpdmUgYnVzaW5lc3Mgd2Vic2l0ZXMuXCIsXG4gICAgY2Fub25pY2FsUGF0aDogXCIvc2VydmljZXMvd2Vic2l0ZS1tYWludGVuYW5jZVwiLFxuICAgIG9nSW1hZ2U6IFwiL2FuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nXCIsXG4gICAgcXVpY2tTdW1tYXJ5OiBbXG4gICAgICBcIktlZXAgeW91ciB3ZWJzaXRlIHN0YWJsZSwgc2VjdXJlLCBhbmQgZmFzdCB3aXRoIHN0cnVjdHVyZWQgbWFpbnRlbmFuY2Ugc3VwcG9ydC5cIixcbiAgICAgIFwiQ2hvb3NlIGEgY2FyZSBwbGFuIGJhc2VkIG9uIHlvdXIgb3BlcmF0aW9uYWwgZGVtYW5kcyBhbmQgc3VwcG9ydCBleHBlY3RhdGlvbnMuXCJcbiAgICBdLFxuICAgIHJlbGF0ZWRQYWdlczogW1wic2VydmljZXNcIiwgXCJzZXJ2aWNlV2Vic2l0ZURlc2lnbkRldmVsb3BtZW50XCIsIFwiY29udGFjdFwiXSxcbiAgICBicmVhZGNydW1iczogW1xuICAgICAgeyBuYW1lOiBcIkhvbWVcIiwgcGF0aDogXCIvXCIgfSxcbiAgICAgIHsgbmFtZTogXCJTZXJ2aWNlc1wiLCBwYXRoOiBcIi9zZXJ2aWNlc1wiIH0sXG4gICAgICB7IG5hbWU6IFwiV2Vic2l0ZSBNYWludGVuYW5jZVwiLCBwYXRoOiBcIi9zZXJ2aWNlcy93ZWJzaXRlLW1haW50ZW5hbmNlXCIgfVxuICAgIF0sXG4gICAgc2NoZW1hVHlwZTogXCJTZXJ2aWNlXCIsXG4gICAgc2VydmljZU5hbWU6IFwiV2Vic2l0ZSBNYWludGVuYW5jZVwiXG4gIH0sXG4gIHtcbiAgICBpZDogXCJwb3J0Zm9saW9cIixcbiAgICByb3V0ZVBhdGg6IFwiL3BvcnRmb2xpb1wiLFxuICAgIHBhZ2VOYW1lOiBcIlBvcnRmb2xpb1wiLFxuICAgIHNsdWc6IFwicG9ydGZvbGlvXCIsXG4gICAgaW5kZXhhYmxlOiB0cnVlLFxuICAgIG1ldGFEZXNjcmlwdGlvbjpcbiAgICAgIFwiUmV2aWV3IHNlbGVjdGVkIEJpbmFyeSBCYWtlciBwcm9qZWN0cyBhbmQgY2FzZSBzbmFwc2hvdHMgY292ZXJpbmcgU291dGggQWZyaWNhbiBidXNpbmVzcyB3ZWJzaXRlcyBhbmQgY29udmVyc2lvbi1mb2N1c2VkIHN5c3RlbXMuXCIsXG4gICAgY2Fub25pY2FsUGF0aDogXCIvcG9ydGZvbGlvXCIsXG4gICAgb2dJbWFnZTogXCIvYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmdcIixcbiAgICBxdWlja1N1bW1hcnk6IFtcbiAgICAgIFwiRXhwbG9yZSByZWNlbnQgZGVsaXZlcnkgZXhhbXBsZXMgYW5kIHByb2plY3Qgb3V0Y29tZXMuXCIsXG4gICAgICBcIk91ciBwb3J0Zm9saW8gaGlnaGxpZ2h0cyByZWFsIGJ1c2luZXNzIGNvbnRleHRzIGFuZCBwcmFjdGljYWwgaW1wbGVtZW50YXRpb24gY2hvaWNlcy5cIlxuICAgIF0sXG4gICAgcmVsYXRlZFBhZ2VzOiBbXCJzZXJ2aWNlc1wiLCBcImFib3V0XCIsIFwiZnJlZVF1b3RlXCJdLFxuICAgIGJyZWFkY3J1bWJzOiBbXG4gICAgICB7IG5hbWU6IFwiSG9tZVwiLCBwYXRoOiBcIi9cIiB9LFxuICAgICAgeyBuYW1lOiBcIlBvcnRmb2xpb1wiLCBwYXRoOiBcIi9wb3J0Zm9saW9cIiB9XG4gICAgXSxcbiAgICBzY2hlbWFUeXBlOiBcIkNvbGxlY3Rpb25QYWdlXCJcbiAgfSxcbiAge1xuICAgIGlkOiBcImNvbnRhY3RcIixcbiAgICByb3V0ZVBhdGg6IFwiL2NvbnRhY3RcIixcbiAgICBwYWdlTmFtZTogXCJDb250YWN0XCIsXG4gICAgc2x1ZzogXCJjb250YWN0XCIsXG4gICAgaW5kZXhhYmxlOiB0cnVlLFxuICAgIG1ldGFEZXNjcmlwdGlvbjpcbiAgICAgIFwiQ29udGFjdCBCaW5hcnkgQmFrZXIgZm9yIHdlYnNpdGUgZGV2ZWxvcG1lbnQsIGUtY29tbWVyY2UsIHN5c3RlbXMsIGFuZCBtYWludGVuYW5jZSBzdXBwb3J0LiBCYXNlZCBpbiBHYXV0ZW5nIHdpdGggcmVtb3RlIGNvbmZlcmVuY2luZyBhY3Jvc3MgU291dGggQWZyaWNhLlwiLFxuICAgIGNhbm9uaWNhbFBhdGg6IFwiL2NvbnRhY3RcIixcbiAgICBvZ0ltYWdlOiBcIi9hbmRyb2lkLWNocm9tZS01MTJ4NTEyLnBuZ1wiLFxuICAgIHF1aWNrU3VtbWFyeTogW1xuICAgICAgXCJSZWFjaCB1cyB2aWEgZW1haWwgb3IgV2hhdHNBcHAgdG8gZGlzY3VzcyB5b3VyIHByb2plY3QgcmVxdWlyZW1lbnRzLlwiLFxuICAgICAgXCJXZSBhcmUgYmFzZWQgaW4gR2F1dGVuZyBhbmQgc3VwcG9ydCBjbGllbnRzIG5hdGlvbndpZGUgdGhyb3VnaCByZW1vdGUgY29uZmVyZW5jaW5nLlwiXG4gICAgXSxcbiAgICByZWxhdGVkUGFnZXM6IFtcImZyZWVRdW90ZVwiLCBcInNlcnZpY2VzXCIsIFwiYWJvdXRcIl0sXG4gICAgYnJlYWRjcnVtYnM6IFtcbiAgICAgIHsgbmFtZTogXCJIb21lXCIsIHBhdGg6IFwiL1wiIH0sXG4gICAgICB7IG5hbWU6IFwiQ29udGFjdFwiLCBwYXRoOiBcIi9jb250YWN0XCIgfVxuICAgIF0sXG4gICAgc2NoZW1hVHlwZTogXCJDb250YWN0UGFnZVwiXG4gIH0sXG4gIHtcbiAgICBpZDogXCJmcmVlUXVvdGVcIixcbiAgICByb3V0ZVBhdGg6IFwiL2ZyZWUtcXVvdGVcIixcbiAgICBwYWdlTmFtZTogXCJGcmVlIFF1b3RlXCIsXG4gICAgc2x1ZzogXCJmcmVlLXF1b3RlXCIsXG4gICAgaW5kZXhhYmxlOiB0cnVlLFxuICAgIG1ldGFEZXNjcmlwdGlvbjpcbiAgICAgIFwiUmVxdWVzdCBhIGN1c3RvbSBwcm9qZWN0IHF1b3RlIGZyb20gQmluYXJ5IEJha2VyIGFuZCBnZXQgYSBzY29wZWQgaW1wbGVtZW50YXRpb24gcGxhbiBtYXRjaGVkIHRvIHlvdXIgZ29hbHMsIHRpbWVsaW5lLCBhbmQgYnVkZ2V0LlwiLFxuICAgIGNhbm9uaWNhbFBhdGg6IFwiL2ZyZWUtcXVvdGVcIixcbiAgICBvZ0ltYWdlOiBcIi9hbmRyb2lkLWNocm9tZS01MTJ4NTEyLnBuZ1wiLFxuICAgIHF1aWNrU3VtbWFyeTogW1xuICAgICAgXCJTdWJtaXQgeW91ciByZXF1aXJlbWVudHMgdG8gcmVjZWl2ZSBhIHN0cnVjdHVyZWQgcXVvdGUgYW5kIGRlbGl2ZXJ5IHJvYWRtYXAuXCIsXG4gICAgICBcIlF1b3RlcyBhcmUgdGFpbG9yZWQgdG8geW91ciBidXNpbmVzcyBnb2Fscywgc2NvcGUgY29tcGxleGl0eSwgYW5kIGltcGxlbWVudGF0aW9uIHRpbWVsaW5lLlwiXG4gICAgXSxcbiAgICByZWxhdGVkUGFnZXM6IFtcInNlcnZpY2VzXCIsIFwiY29udGFjdFwiLCBcInBvcnRmb2xpb1wiXSxcbiAgICBicmVhZGNydW1iczogW1xuICAgICAgeyBuYW1lOiBcIkhvbWVcIiwgcGF0aDogXCIvXCIgfSxcbiAgICAgIHsgbmFtZTogXCJGcmVlIFF1b3RlXCIsIHBhdGg6IFwiL2ZyZWUtcXVvdGVcIiB9XG4gICAgXSxcbiAgICBzY2hlbWFUeXBlOiBcIldlYlBhZ2VcIlxuICB9LFxuICB7XG4gICAgaWQ6IFwicHJpdmFjeVBvbGljeVwiLFxuICAgIHJvdXRlUGF0aDogXCIvcHJpdmFjeS1wb2xpY3lcIixcbiAgICBwYWdlTmFtZTogXCJQcml2YWN5IFBvbGljeVwiLFxuICAgIHNsdWc6IFwicHJpdmFjeS1wb2xpY3lcIixcbiAgICBpbmRleGFibGU6IHRydWUsXG4gICAgbWV0YURlc2NyaXB0aW9uOlxuICAgICAgXCJSZWFkIHRoZSBCaW5hcnkgQmFrZXIgcHJpdmFjeSBwb2xpY3kgb24gaW5mb3JtYXRpb24gY29sbGVjdGlvbiwgY29udGFjdCBkYXRhIHVzYWdlLCBzZWN1cml0eSBwcmFjdGljZXMsIGFuZCB5b3VyIHJpZ2h0cy5cIixcbiAgICBjYW5vbmljYWxQYXRoOiBcIi9wcml2YWN5LXBvbGljeVwiLFxuICAgIG9nSW1hZ2U6IFwiL2FuZHJvaWQtY2hyb21lLTUxMng1MTIucG5nXCIsXG4gICAgcXVpY2tTdW1tYXJ5OiBbXG4gICAgICBcIk91ciBwcml2YWN5IHBvbGljeSBleHBsYWlucyB3aGF0IGluZm9ybWF0aW9uIHdlIGNvbGxlY3QgYW5kIHdoeS5cIixcbiAgICAgIFwiSXQgYWxzbyBjb3ZlcnMgZGF0YSBwcm90ZWN0aW9uIHByYWN0aWNlcyBhbmQgaG93IHRvIGNvbnRhY3QgdXMgYWJvdXQgeW91ciBkYXRhLlwiXG4gICAgXSxcbiAgICByZWxhdGVkUGFnZXM6IFtcImNvbnRhY3RcIiwgXCJhYm91dFwiLCBcIm5ld3NsZXR0ZXJcIl0sXG4gICAgYnJlYWRjcnVtYnM6IFtcbiAgICAgIHsgbmFtZTogXCJIb21lXCIsIHBhdGg6IFwiL1wiIH0sXG4gICAgICB7IG5hbWU6IFwiUHJpdmFjeSBQb2xpY3lcIiwgcGF0aDogXCIvcHJpdmFjeS1wb2xpY3lcIiB9XG4gICAgXSxcbiAgICBzY2hlbWFUeXBlOiBcIldlYlBhZ2VcIlxuICB9LFxuICB7XG4gICAgaWQ6IFwibmV3c2xldHRlclwiLFxuICAgIHJvdXRlUGF0aDogXCIvbmV3c2xldHRlclwiLFxuICAgIHBhZ2VOYW1lOiBcIk5ld3NsZXR0ZXJcIixcbiAgICBzbHVnOiBcIm5ld3NsZXR0ZXJcIixcbiAgICBpbmRleGFibGU6IHRydWUsXG4gICAgbWV0YURlc2NyaXB0aW9uOlxuICAgICAgXCJKb2luIHRoZSBCaW5hcnkgQmFrZXIgbmV3c2xldHRlciBmb3IgcHJhY3RpY2FsIHdlYnNpdGUgZ3Jvd3RoIGluc2lnaHRzLCBsYXVuY2ggY2hlY2tsaXN0cywgYW5kIHNlcnZpY2UgdXBkYXRlcy5cIixcbiAgICBjYW5vbmljYWxQYXRoOiBcIi9uZXdzbGV0dGVyXCIsXG4gICAgb2dJbWFnZTogXCIvYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmdcIixcbiAgICBxdWlja1N1bW1hcnk6IFtcbiAgICAgIFwiU3Vic2NyaWJlIGZvciBwZXJpb2RpYyBpbnNpZ2h0cyBvbiB3ZWIgc3RyYXRlZ3ksIGNvbnZlcnNpb24sIGFuZCB0ZWNobmljYWwgZGVsaXZlcnkuXCIsXG4gICAgICBcIlJlY2VpdmUgcHJhY3RpY2FsIHVwZGF0ZXMgZGVzaWduZWQgZm9yIGdyb3dpbmcgU291dGggQWZyaWNhbiBidXNpbmVzc2VzLlwiXG4gICAgXSxcbiAgICByZWxhdGVkUGFnZXM6IFtcImZyZWVRdW90ZVwiLCBcInNlcnZpY2VzXCIsIFwiYWJvdXRcIl0sXG4gICAgYnJlYWRjcnVtYnM6IFtcbiAgICAgIHsgbmFtZTogXCJIb21lXCIsIHBhdGg6IFwiL1wiIH0sXG4gICAgICB7IG5hbWU6IFwiTmV3c2xldHRlclwiLCBwYXRoOiBcIi9uZXdzbGV0dGVyXCIgfVxuICAgIF0sXG4gICAgc2NoZW1hVHlwZTogXCJXZWJQYWdlXCJcbiAgfSxcbiAge1xuICAgIGlkOiBcInNlb1N0YXR1c1wiLFxuICAgIHJvdXRlUGF0aDogXCIvc2VvLXN0YXR1c1wiLFxuICAgIHBhZ2VOYW1lOiBcIlNFTyBTdGF0dXNcIixcbiAgICBzbHVnOiBcInNlby1zdGF0dXNcIixcbiAgICBpbmRleGFibGU6IGZhbHNlLFxuICAgIGNhbm9uaWNhbFBhdGg6IFwiL3Nlby1zdGF0dXNcIixcbiAgICBvZ0ltYWdlOiBcIi9hbmRyb2lkLWNocm9tZS01MTJ4NTEyLnBuZ1wiLFxuICAgIHF1aWNrU3VtbWFyeTogW1xuICAgICAgXCJJbnRlcm5hbCBTRU8gaGVhbHRoIGRhc2hib2FyZCBmb3IgaW5kZXhpbmcgcmVhZGluZXNzIGNoZWNrcy5cIixcbiAgICAgIFwiVGhpcyBwYWdlIGlzIGhpZGRlbiBmcm9tIHNlYXJjaCBpbmRleGluZy5cIlxuICAgIF0sXG4gICAgcmVsYXRlZFBhZ2VzOiBbXCJob21lXCJdXG4gIH0sXG4gIHtcbiAgICBpZDogXCJwdWJsaWNJbnZvaWNlXCIsXG4gICAgcm91dGVQYXRoOiBcIi9wL2ludm9pY2UvOnRva2VuXCIsXG4gICAgcGFnZU5hbWU6IFwiSW52b2ljZVwiLFxuICAgIHNsdWc6IFwiaW52b2ljZVwiLFxuICAgIGluZGV4YWJsZTogZmFsc2UsXG4gICAgY2Fub25pY2FsUGF0aDogXCIvXCIsXG4gICAgb2dJbWFnZTogXCIvYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmdcIixcbiAgICBxdWlja1N1bW1hcnk6IFtcIlNlY3VyZSBpbnZvaWNlIGFjY2VzcyBwYWdlLlwiLCBcIlNlYXJjaCBpbmRleGluZyBpcyBkaXNhYmxlZCBmb3IgdGhpcyByb3V0ZS5cIl1cbiAgfSxcbiAge1xuICAgIGlkOiBcIm5vdEZvdW5kXCIsXG4gICAgcm91dGVQYXRoOiBcIipcIixcbiAgICBwYWdlTmFtZTogXCJOb3QgRm91bmRcIixcbiAgICBzbHVnOiBcIjQwNFwiLFxuICAgIGluZGV4YWJsZTogZmFsc2UsXG4gICAgY2Fub25pY2FsUGF0aDogXCIvXCIsXG4gICAgb2dJbWFnZTogXCIvYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmdcIixcbiAgICBxdWlja1N1bW1hcnk6IFtcIlBhZ2Ugbm90IGZvdW5kIHN0YXRlLlwiLCBcIlNlYXJjaCBpbmRleGluZyBpcyBkaXNhYmxlZCBmb3IgdGhpcyByb3V0ZS5cIl1cbiAgfVxuXTtcblxuZXhwb3J0IGNvbnN0IHNlb1JvdXRlTWFwID0gT2JqZWN0LmZyb21FbnRyaWVzKHNlb1JvdXRlcy5tYXAoKHJvdXRlKSA9PiBbcm91dGUuaWQsIHJvdXRlXSkpO1xuXG5leHBvcnQgY29uc3QgaW5kZXhhYmxlU2VvUm91dGVzID0gc2VvUm91dGVzLmZpbHRlcihcbiAgKHJvdXRlKSA9PiByb3V0ZS5pbmRleGFibGUgJiYgcm91dGUucm91dGVQYXRoICE9PSBcIipcIiAmJiAhcm91dGUucm91dGVQYXRoLmluY2x1ZGVzKFwiOlwiKVxuKTtcblxuZXhwb3J0IGNvbnN0IHByZXJlbmRlclJvdXRlcyA9IGluZGV4YWJsZVNlb1JvdXRlcy5tYXAoKHJvdXRlKSA9PiByb3V0ZS5yb3V0ZVBhdGgpO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VvUm91dGUocm91dGVJZCkge1xuICByZXR1cm4gc2VvUm91dGVNYXBbcm91dGVJZF0gfHwgbnVsbDtcbn1cblxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzVixTQUFTLG9CQUFvQjtBQUNuWCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxVQUFVO0FBQ2pCLFNBQVMscUJBQXFCOzs7QUN1QnZCLElBQU0sWUFBWTtBQUFBLEVBQ3ZCO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixXQUFXO0FBQUEsSUFDWCxVQUFVO0FBQUEsSUFDVixNQUFNO0FBQUEsSUFDTixXQUFXO0FBQUEsSUFDWCxVQUFVO0FBQUEsSUFDVixpQkFDRTtBQUFBLElBQ0YsZUFBZTtBQUFBLElBQ2YsU0FBUztBQUFBLElBQ1QsZUFDRTtBQUFBLElBQ0YsU0FBUztBQUFBLElBQ1QsY0FBYztBQUFBLE1BQ1o7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYyxDQUFDLFlBQVksYUFBYSxXQUFXO0FBQUEsSUFDbkQsWUFBWTtBQUFBLEVBQ2Q7QUFBQSxFQUNBO0FBQUEsSUFDRSxJQUFJO0FBQUEsSUFDSixXQUFXO0FBQUEsSUFDWCxVQUFVO0FBQUEsSUFDVixNQUFNO0FBQUEsSUFDTixXQUFXO0FBQUEsSUFDWCxpQkFDRTtBQUFBLElBQ0YsZUFBZTtBQUFBLElBQ2YsU0FBUztBQUFBLElBQ1QsY0FBYztBQUFBLE1BQ1o7QUFBQSxNQUNBO0FBQUEsSUFDRjtBQUFBLElBQ0EsY0FBYyxDQUFDLFlBQVksYUFBYSxTQUFTO0FBQUEsSUFDakQsYUFBYTtBQUFBLE1BQ1gsRUFBRSxNQUFNLFFBQVEsTUFBTSxJQUFJO0FBQUEsTUFDMUIsRUFBRSxNQUFNLFNBQVMsTUFBTSxTQUFTO0FBQUEsSUFDbEM7QUFBQSxJQUNBLFlBQVk7QUFBQSxFQUNkO0FBQUEsRUFDQTtBQUFB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
