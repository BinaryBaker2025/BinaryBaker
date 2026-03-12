import { httpsCallable } from "firebase/functions";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MarketingLayout from "../components/MarketingLayout.jsx";
import RelatedPages from "../components/RelatedPages.jsx";
import GradientCtaStrip from "../components/marketing/GradientCtaStrip.jsx";
import HeroSplitSection from "../components/marketing/HeroSplitSection.jsx";
import { functions } from "../firebase.js";
import { getSeoRoute } from "../seo/routes.js";
import useSeoPage from "../seo/useSeoPage.js";
import {
  contactInputClass,
  contactLabelClass,
  contactSubmitButtonClass,
  contactTextareaClass,
  sectionEyebrowLightClass,
  sectionHeadingClass,
  splitPanelDarkClass,
  surfaceCardClass,
  surfaceHoverClass
} from "../styles/marketingTokens.js";

const defaultValues = {
  fullName: "",
  company: "",
  email: "",
  whatsapp: "",
  preferredContactMethod: "either",
  systemType: "",
  systemTypeOther: "",
  budget: "",
  timeline: "",
  summary: "",
  consentToContact: false,
  website: ""
};

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

function resolveContactError(error) {
  const code = error?.code || "";
  if (code === "functions/invalid-argument") {
    return "Please review your details and try again.";
  }
  if (code === "functions/resource-exhausted") {
    return "Too many requests from this connection. Please wait a bit and try again.";
  }
  return "We could not send your request right now. Please try again in a moment.";
}

export default function FreeQuote() {
  const page = getSeoRoute("freeQuote");
  useSeoPage("freeQuote");

  const [values, setValues] = useState(defaultValues);
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });
  const submitWebsiteInquiry = useMemo(
    () => httpsCallable(functions, "submitWebsiteInquiry"),
    []
  );

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target;
    const nextValue = type === "checkbox" ? checked : value;
    setValues((prev) => {
      const next = { ...prev, [name]: nextValue };
      if (name === "systemType" && value !== "other") {
        next.systemTypeOther = "";
      }
      return next;
    });
    if (status.error || status.success) {
      setStatus({ loading: false, error: "", success: "" });
    }
  };

  const validateForm = () => {
    const email = values.email.trim();
    const whatsapp = values.whatsapp.trim();
    const hasEmail = Boolean(email);
    const hasWhatsapp = Boolean(whatsapp);

    if (!values.fullName.trim()) {
      return "Full name is required.";
    }
    if (!values.company.trim()) {
      return "Company name is required.";
    }
    if (!hasEmail && !hasWhatsapp) {
      return "Please provide at least one contact method: Email or WhatsApp number.";
    }
    if (hasEmail && !/\S+@\S+\.\S+/.test(email)) {
      return "Please enter a valid email address.";
    }
    if (hasWhatsapp && !/^[+]?[0-9()\-\s]{7,}$/.test(whatsapp)) {
      return "Please enter a valid WhatsApp number.";
    }
    if (values.preferredContactMethod === "email" && !hasEmail) {
      return "Preferred contact is Email, so please provide an email address.";
    }
    if (values.preferredContactMethod === "whatsapp" && !hasWhatsapp) {
      return "Preferred contact is WhatsApp, so please provide a WhatsApp number.";
    }
    if (!values.systemType) {
      return "Please select a system type.";
    }
    if (values.systemType === "other" && !values.systemTypeOther.trim()) {
      return "Please specify your system type.";
    }
    if (!values.budget) {
      return "Please select a project type.";
    }
    if (!values.timeline) {
      return "Please select a timeline.";
    }
    if (!values.summary.trim()) {
      return "Requirements summary is required.";
    }
    if (!values.consentToContact) {
      return "Please confirm consent so we can contact you.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: "", success: "" });

    const validationError = validateForm();
    if (validationError) {
      setStatus({ loading: false, error: validationError, success: "" });
      return;
    }

    const payload = {
      inquiryType: "system_quote",
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.whatsapp.trim(),
      preferredContactMethod: values.preferredContactMethod,
      consentToContact: true,
      website: values.website,
      companyName: values.company.trim(),
      systemType: values.systemType,
      budgetRange: values.budget,
      timeline: values.timeline,
      requirementsSummary: values.summary.trim()
    };

    if (values.systemType === "other") {
      payload.systemTypeOther = values.systemTypeOther.trim();
    }

    try {
      await submitWebsiteInquiry(payload);
      setValues(defaultValues);
      setStatus({
        loading: false,
        error: "",
        success: "Thanks, we've received your demo request. We'll be in touch within 48 hours to confirm and get started."
      });
    } catch (error) {
      setStatus({ loading: false, error: resolveContactError(error), success: "" });
    }
  };

  return (
    <MarketingLayout>
      <HeroSplitSection
        eyebrow="Basic Demo — R800"
        title="See It Before You Commit"
        description="We build you a working demo based on your requirements for R800. No styling, just structure and function — so you can see exactly what you're getting before we quote for the full build."
        quickSummary={page.quickSummary}
        primaryAction={{ to: "/services", label: "Review Services First" }}
        secondaryAction={{ to: "/contact", label: "Contact Directly" }}
        panel={{
          eyebrow: "How It Works",
          title: "Demo first. Quote after.",
          body: "You fill in your details and tell us what you need. We build a basic working demo at R800 — matched to what you provide us. If you're happy and want to move forward, we then quote for the full build.",
          points: ["R800 flat fee for the basic demo", "Built to your content and requirements", "Full quote only once you're satisfied"]
        }}
      />

      <section className="reveal py-14 sm:py-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <form className={`${splitPanelDarkClass} grid gap-4`} onSubmit={handleSubmit}>
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.22em] text-cream/70">
              Project Brief
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={contactLabelClass}>
                Full name *
                <input
                  className={contactInputClass}
                  name="fullName"
                  value={values.fullName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label className={contactLabelClass}>
                Company name *
                <input
                  className={contactInputClass}
                  name="company"
                  value={values.company}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={contactLabelClass}>
                Email (optional)
                <input
                  className={contactInputClass}
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="you@business.co.za"
                />
              </label>
              <label className={contactLabelClass}>
                WhatsApp number (optional)
                <input
                  className={contactInputClass}
                  type="tel"
                  name="whatsapp"
                  value={values.whatsapp}
                  onChange={handleChange}
                  placeholder="+27 82 123 4567"
                />
              </label>
            </div>

            <label className={contactLabelClass}>
              Preferred contact method *
              <select
                className={contactInputClass}
                name="preferredContactMethod"
                value={values.preferredContactMethod}
                onChange={handleChange}
                required
              >
                {contactMethodOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-ink text-cream">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <p className="text-xs text-cream/75">
              Provide at least one contact method: Email or WhatsApp number.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={contactLabelClass}>
                System type *
                <select
                  className={contactInputClass}
                  name="systemType"
                  value={values.systemType}
                  onChange={handleChange}
                  required
                >
                  <option value="" className="bg-ink text-cream">
                    Select system type
                  </option>
                  {systemTypeOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-ink text-cream">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className={contactLabelClass}>
                Project type *
                <select className={contactInputClass} name="budget" value={values.budget} onChange={handleChange} required>
                  <option value="" className="bg-ink text-cream">
                    Select option
                  </option>
                  {budgetOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-ink text-cream">
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {values.systemType === "other" ? (
              <label className={contactLabelClass}>
                Other system type *
                <input
                  className={contactInputClass}
                  type="text"
                  name="systemTypeOther"
                  value={values.systemTypeOther}
                  onChange={handleChange}
                  placeholder="Describe the system"
                  required
                />
              </label>
            ) : null}

            <label className={contactLabelClass}>
              Timeline *
              <select className={contactInputClass} name="timeline" value={values.timeline} onChange={handleChange} required>
                <option value="" className="bg-ink text-cream">
                  Select timeline
                </option>
                {timelineOptions.map((option) => (
                  <option key={option.value} value={option.value} className="bg-ink text-cream">
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={contactLabelClass}>
              Requirements summary *
              <textarea
                className={contactTextareaClass}
                name="summary"
                value={values.summary}
                onChange={handleChange}
                placeholder="Describe your goals, audience, features, and integrations."
                required
              ></textarea>
            </label>

            <label className="inline-flex items-start gap-3 rounded-[12px] border border-cream/25 bg-cream/10 px-3 py-3 text-sm text-cream/90">
              <input
                className="mt-0.5 h-4 w-4 shrink-0 rounded border border-cream/30 bg-cream/5 accent-blue"
                type="checkbox"
                name="consentToContact"
                checked={values.consentToContact}
                onChange={handleChange}
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
                value={values.website}
                onChange={handleChange}
              ></textarea>
            </label>

            <button
              type="submit"
              className={`${contactSubmitButtonClass} ${status.loading ? "cursor-not-allowed opacity-70" : ""}`}
              disabled={status.loading}
            >
              {status.loading ? "Sending..." : "Request Your Basic Demo"}
            </button>

            {status.error ? (
              <p className="rounded-[12px] border border-red-400/40 bg-red-900/20 px-3 py-2 text-sm text-red-300">
                {status.error}
              </p>
            ) : null}

            {status.success ? (
              <p className="rounded-[12px] border border-cream/25 bg-cream/10 px-3 py-2 text-sm text-cream/88">
                {status.success}
              </p>
            ) : null}
          </form>

          <div className={`${surfaceCardClass} p-6 sm:p-8`}>
            <p className={sectionEyebrowLightClass}>What to Expect</p>
            <h2 className={sectionHeadingClass}>Demo first, full quote after</h2>
            <div className="mt-5 grid gap-3">
              <article className={`${surfaceHoverClass} p-4 text-sm text-cream/65`}>
                <strong className="text-cream/80">Step 1 — R800 basic demo.</strong> We build a working demo based on your info — no polish, just structure and function so you can see the direction.
              </article>
              <article className={`${surfaceHoverClass} p-4 text-sm text-cream/65`}>
                <strong className="text-cream/80">Step 2 — You review it.</strong> If you're happy and want to move forward, we scope the full build and send a proper quote.
              </article>
              <article className={`${surfaceHoverClass} p-4 text-sm text-cream/65`}>
                <strong className="text-cream/80">No surprises.</strong> The R800 is a flat fee for the demo. The full quote only comes once you've seen what we can do.
              </article>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-cream/65">
              Want to talk it through first? Use the
              {" "}
              <Link className="font-semibold text-blue underline" to="/contact">
                contact page
              </Link>
              {" "}
              and we can chat before you commit to anything.
            </p>
          </div>
        </div>
      </section>

      <GradientCtaStrip
        text="Not sure what you need yet? Browse our services and see what fits before you request a demo."
        actionTo="/services"
        actionLabel="View Services"
      />

      <RelatedPages pageId="freeQuote" />
    </MarketingLayout>
  );
}
