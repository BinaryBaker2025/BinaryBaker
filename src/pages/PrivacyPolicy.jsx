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

const policySections = [
  {
    title: "Information We Collect",
    body: "We collect information submitted through contact and quote forms, including names, email addresses, phone numbers, and project details required to respond."
  },
  {
    title: "How Information Is Used",
    body: "Submitted data is used to respond to enquiries, prepare project scopes, and provide delivery communication. We do not sell personal information."
  },
  {
    title: "Storage and Security",
    body: "We use access controls and operational safeguards to protect submitted information and reduce unauthorized access risk."
  },
  {
    title: "Your Rights",
    body: "You may request updates, corrections, or deletion of personal information previously provided through this website."
  }
];

export default function PrivacyPolicy() {
  const page = getSeoRoute("privacyPolicy");
  useSeoPage("privacyPolicy");

  return (
    <MarketingLayout>
      <Breadcrumbs items={page.breadcrumbs} />

      <HeroSplitSection
        eyebrow="Policy"
        title="Privacy Policy"
        description="This page explains what information Binary Baker collects, how it is used, and how to request updates to your data."
        quickSummary={page.quickSummary}
        panel={{
          eyebrow: "Policy Scope",
          title: "Clear and practical data handling guidance.",
          body: "Our policy is written for readability while preserving legal clarity for enquiries and project communications.",
          points: ["Contact form data", "Use limitations", "Access and correction rights"]
        }}
      />

      <section className="reveal py-14 sm:py-16">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <p className={sectionEyebrowLightClass}>Policy Details</p>
          <h2 className={sectionHeadingClass}>How privacy is managed at Binary Baker</h2>
          <div className="mt-6 grid gap-4">
            {policySections.map((section) => (
              <article key={section.title} className={`${surfaceHoverClass} p-5`}>
                <h3 className={sectionSubheadingClass}>{section.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal py-12 sm:py-14">
        <div className={`${surfaceCardClass} p-6 sm:p-8`}>
          <p className={sectionEyebrowLightClass}>Privacy Contact</p>
          <h2 className={sectionHeadingClass}>Requests and updates</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink/75">
            For privacy-related requests, email
            {" "}
            <a className="font-semibold text-deep-blue underline" href="mailto:bradley@binarybaker.co.za">
              bradley@binarybaker.co.za
            </a>
            {" "}
            with enough detail for verification and response.
          </p>
        </div>
      </section>

      <RelatedPages pageId="privacyPolicy" />
    </MarketingLayout>
  );
}
