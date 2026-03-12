import Breadcrumbs from "../components/Breadcrumbs.jsx";
import MarketingLayout from "../components/MarketingLayout.jsx";
import RelatedPages from "../components/RelatedPages.jsx";
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

const termsSections = [
  {
    number: "1",
    title: "Scope of Work",
    body: "The services provided will be limited to the items listed in the quotation or invoice. Any additional features, functionality, revisions, or services not specified in the quotation will be treated as additional work and may be charged separately."
  },
  {
    number: "2",
    title: "Payment Terms",
    body: "All work requires payment according to the agreed quotation.",
    points: [
      "A 50% deposit is required before work begins.",
      "The remaining balance must be paid upon completion or before delivery of final files, website launch, or system access.",
      "For monthly services such as social media management, advertising management, hosting, or maintenance, payment must be made in advance at the start of each month.",
      "Late payments may result in suspension of services until payment is received."
    ],
    pointsNote: "Unless otherwise agreed:"
  },
  {
    number: "3",
    title: "Client Responsibilities",
    body: "The client agrees to:",
    points: [
      "Provide all required information, images, branding material, and content in a timely manner.",
      "Ensure they have the legal rights to use any images, text, or materials they provide.",
      "Review and approve work within a reasonable timeframe."
    ],
    footer: "The service provider is not responsible for delays caused by missing information, incomplete instructions, or slow client responses."
  },
  {
    number: "4",
    title: "Revisions and Changes",
    body: "Reasonable revisions may be included as agreed in the quotation. Additional changes beyond the agreed scope may incur additional charges."
  },
  {
    number: "5",
    title: "Social Media and Advertising Services",
    body: "For social media management and advertising campaigns:",
    points: [
      "The client is responsible for the advertising budget, which is paid directly to the advertising platform (for example Meta/Facebook/Instagram).",
      "The service provider is responsible for creating and managing advertising campaigns based on the agreed scope.",
      "The service provider does not guarantee specific results, including but not limited to: sales, leads, website traffic, or engagement."
    ],
    footer: "Advertising performance can vary due to factors outside the service provider's control, including market conditions, audience behavior, competition, and platform algorithms."
  },
  {
    number: "6",
    title: "Website, Software, POS and System Services",
    body: "All websites, software systems, POS systems, and inventory systems are provided as developed and tested at the time of delivery. While reasonable care is taken to ensure functionality, the service provider cannot guarantee uninterrupted service due to factors such as:",
    points: [
      "Hosting provider issues",
      "Internet connectivity problems",
      "Platform or server outages",
      "Third-party software updates",
      "External integrations"
    ]
  },
  {
    number: "7",
    title: "Hosting and Maintenance Services",
    body: "If the client selects a hosting and/or maintenance plan, the website, software system, or application will remain hosted and managed under the service provider's infrastructure and accounts. Administrative access to servers, databases, source code repositories, or system infrastructure may remain restricted while the system is hosted or maintained by the service provider.",
    points: [
      "The client must provide written notice of cancellation.",
      "Any outstanding invoices must be paid in full.",
      "If the client requests the system to be transferred to their own hosting or infrastructure, a transfer or migration fee may apply.",
      "Once the transfer process has been completed and all outstanding fees have been settled, the website or software system becomes the property of the client, and the client assumes full responsibility for hosting, maintenance, updates, and operation."
    ],
    pointsNote: "If the client chooses to cancel the hosting or maintenance plan, the following conditions apply:",
    footer: "The service provider will not be responsible for any issues that arise after the system has been transferred to third-party hosting or infrastructure."
  },
  {
    number: "8",
    title: "Third-Party Services",
    body: "Projects may rely on third-party services including but not limited to:",
    points: [
      "Hosting providers",
      "Payment gateways",
      "Advertising platforms",
      "Plugins or external software tools"
    ],
    footer: "The service provider is not responsible for failures, outages, changes, or issues caused by third-party services."
  },
  {
    number: "9",
    title: "Limitation of Liability",
    body: "The service provider will not be held liable for any:",
    points: [
      "Loss of revenue",
      "Loss of business",
      "Loss of profits",
      "Loss of data",
      "Platform outages",
      "Advertising performance issues",
      "Technical issues caused by third-party services"
    ],
    footer: "Total liability, if any, will be limited to the amount paid by the client for the specific service provided."
  },
  {
    number: "10",
    title: "Intellectual Property",
    body: "All work created remains the property of the service provider until full payment has been received. Once full payment has been made, the client receives the agreed rights to use the delivered work."
  },
  {
    number: "11",
    title: "Termination",
    body: "Either party may terminate the agreement with written notice.",
    points: [
      "Any work completed up to the termination date must still be paid in full.",
      "Monthly services may be cancelled with 30 days written notice."
    ]
  },
  {
    number: "12",
    title: "Acceptance of Terms",
    body: "By accepting a quotation, invoice, or service agreement, the client acknowledges that they have read, understood, and agreed to these Terms and Conditions."
  }
];

export default function TermsAndConditions() {
  const page = getSeoRoute("termsAndConditions");
  useSeoPage("termsAndConditions");

  return (
    <MarketingLayout>
      <Breadcrumbs items={page.breadcrumbs} />

      <HeroSplitSection
        eyebrow="Legal"
        title="Terms and Conditions"
        description="These terms govern all services provided by Binary Baker. By accepting a quotation or invoice, the client agrees to the conditions outlined below."
        quickSummary={page.quickSummary}
        panel={{
          eyebrow: "Service Agreement",
          title: "Clear terms for every project and service.",
          body: "These conditions apply to all website, software, advertising, hosting, and maintenance services delivered by Binary Baker.",
          points: ["Scope and payment terms", "Client responsibilities", "Liability and intellectual property"]
        }}
      />

      <section className="reveal py-14 sm:py-16">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <p className={sectionEyebrowLightClass}>Service Terms</p>
          <h2 className={sectionHeadingClass}>Terms governing all Binary Baker services</h2>
          <div className="mt-6 grid gap-4">
            {termsSections.map((section) => (
              <article key={section.number} className={`${surfaceHoverClass} p-5`}>
                <h3 className={sectionSubheadingClass}>
                  {section.number}. {section.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">{section.body}</p>
                {section.pointsNote && (
                  <p className="mt-3 text-sm font-medium text-cream/80">{section.pointsNote}</p>
                )}
                {section.points && (
                  <ul className="mt-2 space-y-1.5 pl-4">
                    {section.points.map((point, i) => (
                      <li key={i} className="flex gap-2 text-sm leading-relaxed text-cream/75">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}
                {section.footer && (
                  <p className="mt-3 text-sm leading-relaxed text-cream/75">{section.footer}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal py-12 sm:py-14">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <p className={sectionEyebrowLightClass}>Questions</p>
          <h2 className={sectionHeadingClass}>Contact us about these terms</h2>
          <p className="mt-4 text-sm leading-relaxed text-cream/75">
            For questions or clarifications regarding these terms, email{" "}
            <a className="font-semibold text-deep-blue underline" href="mailto:bradley@binarybaker.co.za">
              bradley@binarybaker.co.za
            </a>
            {" "}before accepting a quotation or commencing work.
          </p>
        </div>
      </section>

      <RelatedPages pageId="termsAndConditions" />
    </MarketingLayout>
  );
}
