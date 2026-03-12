import { BRAND_NAME, SITE_URL, toAbsoluteUrl } from "./siteConfig.js";

export function buildSiteSchemaGraph() {
  const companyDescription =
    "Binary Baker builds business websites, web apps, client portals, and custom software solutions for South African businesses.";
  const serviceOffers = [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Business Websites" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web App Development" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Software Solutions" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "E-Commerce Integrations" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Website Maintenance" } }
  ];

  return [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND_NAME,
      url: `${SITE_URL}/`,
      logo: toAbsoluteUrl("/android-chrome-512x512.png"),
      description: companyDescription,
      email: "bradley@binarybaker.co.za",
      telephone: "+27611011669",
      address: {
        "@type": "PostalAddress",
        addressRegion: "Gauteng",
        addressCountry: "ZA"
      },
      sameAs: ["https://wa.me/27611011669"]
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: BRAND_NAME,
      url: `${SITE_URL}/`,
      inLanguage: "en-ZA",
      description: companyDescription,
      publisher: {
        "@id": `${SITE_URL}/#organization`
      }
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#professional-service`,
      name: BRAND_NAME,
      url: `${SITE_URL}/`,
      image: toAbsoluteUrl("/android-chrome-512x512.png"),
      telephone: "+27611011669",
      email: "bradley@binarybaker.co.za",
      description: companyDescription,
      areaServed: [
        { "@type": "AdministrativeArea", name: "Gauteng" },
        { "@type": "Country", name: "South Africa" }
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Binary Baker digital services",
        itemListElement: serviceOffers
      },
      makesOffer: serviceOffers
    }
  ];
}

export function buildBreadcrumbSchema(breadcrumbs = []) {
  if (!Array.isArray(breadcrumbs) || breadcrumbs.length < 2) {
    return null;
  }

  return {
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: toAbsoluteUrl(crumb.path)
    }))
  };
}

export function buildPageSchema(route, canonicalUrl, description) {
  if (!route || !canonicalUrl) {
    return [];
  }

  const pageType = route.schemaType === "Service" ? "WebPage" : route.schemaType || "WebPage";
  const schemas = [
    {
      "@type": pageType,
      "@id": `${canonicalUrl}#webpage`,
      name: route.pageName,
      url: canonicalUrl,
      description,
      isPartOf: {
        "@id": `${SITE_URL}/#website`
      },
      ...(route.schemaType === "Service"
        ? {
            mainEntity: {
              "@id": `${canonicalUrl}#service`
            }
          }
        : {}),
      ...(route.schemaType === "AboutPage" || route.schemaType === "ContactPage"
        ? {
            about: {
              "@id": `${SITE_URL}/#organization`
            }
          }
        : {})
    }
  ];

  if (route.schemaType === "Service") {
    schemas.push({
      "@type": "Service",
      "@id": `${canonicalUrl}#service`,
      name: route.serviceName || route.pageName,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Country", name: "South Africa" },
      serviceType: route.serviceName || route.pageName,
      description
    });
  }

  const breadcrumbSchema = buildBreadcrumbSchema(route.breadcrumbs);
  if (breadcrumbSchema) {
    schemas.push(breadcrumbSchema);
  }

  return schemas;
}
