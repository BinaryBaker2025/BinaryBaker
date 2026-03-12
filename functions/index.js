const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret, defineString } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { FieldValue, getFirestore, Timestamp } = require("firebase-admin/firestore");
const { createHash } = require("crypto");
const { Resend } = require("resend");

initializeApp();

const auth = getAuth();
const db = getFirestore();

const resendApiKey = defineSecret("RESEND_API_KEY");
const resendFrom = defineString("RESEND_FROM", {
  default: "Binary Baker <bradley@binarybaker.co.za>"
});
const portalUrl = defineString("CLIENT_PORTAL_URL", {
  default: "https://yourdomain.com/portal"
});
const contactInquiryOrgId = defineString("CONTACT_INQUIRY_ORG_ID", {
  default: "default"
});
const contactInboxEmail = defineString("CONTACT_INBOX_EMAIL", {
  default: "bradley@binarybaker.co.za"
});
const contactWhatsappNumber = defineString("CONTACT_WHATSAPP_NUMBER", {
  default: "+27611011669"
});

const DEFAULT_CURRENCY = "ZAR";
const ALLOWED_CREATE_ROLES = ["owner", "admin", "finance", "sales"];
const ALLOWED_INQUIRY_TYPES = ["system_quote", "general_enquiry", "support"];
const ALLOWED_CONTACT_METHODS = ["email", "whatsapp", "either", "phone"];
const ALLOWED_SYSTEM_TYPES = [
  "crm",
  "erp",
  "ecommerce",
  "booking",
  "internal_tool",
  "mobile_app",
  "website_platform",
  "automation",
  "other"
];
const ALLOWED_BUDGET_RANGES = [
  "under_5k",
  "5k_15k",
  "15k_50k",
  "50k_100k",
  "100k_plus",
  "not_sure"
];
const ALLOWED_TIMELINES = ["asap", "1_2_months", "3_6_months", "6_plus_months", "not_sure"];
const LEAD_STATUSES = ["new", "in_review", "replied", "closed"];
const BUDGET_RANGE_LABELS = {
  under_5k: "Lite - Showcase",
  "5k_15k": "Starter - Business",
  "15k_50k": "Business - Growth",
  "50k_100k": "Advanced - Authority",
  "100k_plus": "E-Commerce or Custom Web App",
  not_sure: "Not sure yet"
};
const TIMELINE_LABELS = {
  asap: "ASAP",
  "1_2_months": "1-2 months",
  "3_6_months": "3-6 months",
  "6_plus_months": "6+ months",
  not_sure: "Not sure yet"
};
const INQUIRY_TYPE_LABELS = {
  system_quote: "System quote",
  general_enquiry: "General enquiry",
  support: "Support"
};
const CONTACT_METHOD_LABELS = {
  email: "Email",
  whatsapp: "WhatsApp",
  either: "Email or WhatsApp",
  phone: "Phone"
};

const roundMoney = (value) => Math.round(value);

const resolveDiscountMinor = (baseMinor, discountType, discountValue) => {
  if (!discountType || discountValue == null) {
    return 0;
  }
  if (discountType === "percent") {
    const percent = Number(discountValue);
    if (!Number.isFinite(percent)) {
      return 0;
    }
    return roundMoney((baseMinor * Math.max(0, percent)) / 100);
  }
  if (discountType === "amount") {
    const amount = Number(discountValue);
    if (!Number.isFinite(amount)) {
      return 0;
    }
    return roundMoney(amount);
  }
  return 0;
};

const computeLineItem = (line, taxRatePercent, taxMode) => {
  const baseMinor = roundMoney(line.quantity * line.unitPriceMinor);
  const discountMinor = Math.min(
    baseMinor,
    Math.max(0, resolveDiscountMinor(baseMinor, line.discountType, line.discountValue))
  );
  const netMinor = Math.max(0, baseMinor - discountMinor);
  const safeRate = Math.max(0, Number(taxRatePercent) || 0);
  let taxMinor = 0;

  if (safeRate > 0 && netMinor > 0) {
    if (taxMode === "inclusive") {
      taxMinor = roundMoney((netMinor * safeRate) / (100 + safeRate));
    } else {
      taxMinor = roundMoney((netMinor * safeRate) / 100);
    }
  }

  const totalMinor = taxMode === "inclusive" ? netMinor : netMinor + taxMinor;

  return {
    baseMinor,
    discountMinor,
    netMinor,
    taxMinor,
    totalMinor
  };
};

const resolveTaxRate = (taxesById, taxId) => {
  if (!taxId) {
    return 0;
  }
  const entry = taxesById[taxId];
  if (entry == null) {
    return 0;
  }
  if (typeof entry === "number") {
    return entry;
  }
  if (typeof entry.ratePercent === "number") {
    return entry.ratePercent;
  }
  return 0;
};

const computeTotals = (lines, taxesById, taxMode) => {
  let subtotalMinor = 0;
  let discountTotalMinor = 0;
  let taxTotalMinor = 0;
  let totalMinor = 0;

  lines.forEach((line) => {
    const taxRate = resolveTaxRate(taxesById, line.taxId);
    const computed = computeLineItem(line, taxRate, taxMode);
    const lineSubtotal =
      taxMode === "inclusive" ? computed.netMinor - computed.taxMinor : computed.netMinor;

    subtotalMinor += lineSubtotal;
    discountTotalMinor += computed.discountMinor;
    taxTotalMinor += computed.taxMinor;
    totalMinor += computed.totalMinor;
  });

  return {
    subtotalMinor,
    discountTotalMinor,
    taxTotalMinor,
    totalMinor
  };
};

const normalizeLineItem = (line) => {
  const quantity = Number(line?.quantity ?? 0);
  const unitPriceMinor = Number(line?.unitPriceMinor ?? 0);
  const discountType =
    line?.discountType === "percent" || line?.discountType === "amount"
      ? line.discountType
      : undefined;
  const discountValue =
    line?.discountValue != null && Number.isFinite(Number(line.discountValue))
      ? Number(line.discountValue)
      : undefined;

  return {
    itemId: line?.itemId ?? null,
    name: String(line?.name || line?.description || "Line item"),
    description: line?.description || "",
    quantity: Number.isFinite(quantity) ? quantity : 0,
    unitPriceMinor: Number.isFinite(unitPriceMinor) ? unitPriceMinor : 0,
    discountType,
    discountValue,
    taxId: line?.taxId ?? null
  };
};

const parseTimestamp = (value, fallback) => {
  if (!value) {
    return fallback;
  }
  if (value instanceof Timestamp) {
    return value;
  }
  if (value && typeof value.seconds === "number") {
    return new Timestamp(value.seconds, value.nanoseconds || 0);
  }
  if (value && typeof value._seconds === "number") {
    return new Timestamp(value._seconds, value.nanoseconds || 0);
  }
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return Timestamp.fromDate(date);
    }
  }
  return fallback;
};

const getSettingsData = async (orgId) => {
  const settingsRef = db.doc(`orgs/${orgId}/settings/main`);
  const snapshot = await settingsRef.get();
  return snapshot.exists ? snapshot.data() || {} : {};
};

const getAndIncrementInvoiceNumber = async (orgId) => {
  const settingsRef = db.doc(`orgs/${orgId}/settings/main`);
  return db.runTransaction(async (tx) => {
    const snapshot = await tx.get(settingsRef);
    const data = snapshot.exists ? snapshot.data() || {} : {};
    const prefix = data.invoicePrefix || "INV-";
    const next = typeof data.nextInvoiceNumber === "number" ? data.nextInvoiceNumber : 1;
    const now = FieldValue.serverTimestamp();
    tx.set(
      settingsRef,
      {
        invoicePrefix: prefix,
        nextInvoiceNumber: next + 1,
        updatedAt: now,
        ...(snapshot.exists ? {} : { createdAt: now })
      },
      { merge: true }
    );
    return `${prefix}${next}`;
  });
};

const buildClientSnapshot = (client) => {
  if (!client) {
    return { name: "Unknown client" };
  }
  const primaryEmail =
    Array.isArray(client.emails) && client.emails.length > 0
      ? client.emails[0]
      : client.email || undefined;
  const snapshot = {
    name: client.name || client.companyName || "Client"
  };
  if (primaryEmail) {
    snapshot.email = primaryEmail;
  }
  if (client.taxNumber) {
    snapshot.taxNumber = client.taxNumber;
  }
  if (client.billingAddress) {
    snapshot.billingAddress = client.billingAddress;
  }
  return snapshot;
};

const assertAuth = (request) => {
  const uid = request?.auth?.uid;
  if (!uid) {
    throw new HttpsError("unauthenticated", "Authentication required.");
  }
  return uid;
};

const assertMember = async (orgId, uid) => {
  const memberRef = db.doc(`orgs/${orgId}/members/${uid}`);
  const snapshot = await memberRef.get();
  if (!snapshot.exists) {
    throw new HttpsError("permission-denied", "Membership required.");
  }
  const data = snapshot.data() || {};
  if (data.status !== "active") {
    throw new HttpsError("permission-denied", "Membership is not active.");
  }
  return data;
};

const assertRole = async (orgId, uid, allowedRoles) => {
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    throw new HttpsError("invalid-argument", "allowedRoles must be provided.");
  }
  const member = await assertMember(orgId, uid);
  if (!allowedRoles.includes(member.role)) {
    throw new HttpsError("permission-denied", "Insufficient role.");
  }
  return member;
};

const fetchTaxesById = async (orgId, lines) => {
  const taxIds = Array.from(
    new Set(
      lines
        .map((line) => line.taxId)
        .filter((taxId) => Boolean(taxId && typeof taxId === "string"))
    )
  );
  if (taxIds.length === 0) {
    return {};
  }
  const refs = taxIds.map((taxId) => db.doc(`orgs/${orgId}/taxes/${taxId}`));
  const snapshots = await db.getAll(...refs);
  const taxesById = {};
  snapshots.forEach((snapshot) => {
    if (!snapshot.exists) {
      return;
    }
    const data = snapshot.data();
    if (typeof data?.ratePercent === "number") {
      taxesById[snapshot.id] = { ratePercent: data.ratePercent };
    }
  });
  return taxesById;
};

const buildInviteEmail = ({ name, resetLink }) => {
  const safeName = name || "there";
  return {
    subject: "Set up your Binary Baker client portal",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hi ${safeName},</p>
        <p>Your Binary Baker client portal is ready. Use the link below to set your password and access your dashboard.</p>
        <p><a href="${resetLink}" target="_blank" rel="noreferrer">Set your password</a></p>
        <p>If you did not request this, you can ignore this email.</p>
        <p>Thanks,<br/>Binary Baker</p>
      </div>
    `
  };
};

const toCleanString = (value, maxLength = 4000) => {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
};

const toOptionalString = (value, maxLength = 4000) => {
  const cleaned = toCleanString(value, maxLength);
  return cleaned || undefined;
};

const normalizeEnumValue = (value, allowed) => {
  const cleaned = toCleanString(value, 120);
  if (!cleaned) {
    return "";
  }
  return allowed.includes(cleaned) ? cleaned : "";
};

const isValidEmail = (value) => {
  if (!value) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const resolveRequestIp = (rawRequest) => {
  const forwardedFor = rawRequest?.headers?.["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }
  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return String(forwardedFor[0]).trim();
  }
  if (rawRequest?.ip) {
    return String(rawRequest.ip).trim();
  }
  return "unknown";
};

const hashIp = (ip) => createHash("sha256").update(String(ip)).digest("hex");

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const toEmailSafeText = (value, fallback = "N/A", maxLength = 4000) => {
  const cleaned = toCleanString(value, maxLength);
  return cleaned ? escapeHtml(cleaned) : fallback;
};

const toEmailSafeMultiline = (value, fallback = "N/A", maxLength = 4000) => {
  const cleaned = toCleanString(value, maxLength);
  return cleaned ? escapeHtml(cleaned).replace(/\n/g, "<br/>") : fallback;
};

const formatInquiryTypeLabel = (inquiryType) => {
  const normalized = normalizeEnumValue(inquiryType, ALLOWED_INQUIRY_TYPES);
  if (normalized) {
    return INQUIRY_TYPE_LABELS[normalized] || normalized;
  }
  const fallback = toCleanString(inquiryType, 120).replace(/_/g, " ");
  return fallback || "Enquiry";
};

const formatContactMethodLabel = (contactMethod) => {
  const normalized = normalizeEnumValue(contactMethod, ALLOWED_CONTACT_METHODS);
  if (normalized) {
    return CONTACT_METHOD_LABELS[normalized] || normalized;
  }
  return toCleanString(contactMethod, 120) || "N/A";
};

const formatSubmittedAtLabel = (submittedAt) => {
  if (submittedAt && typeof submittedAt.toDate === "function") {
    return submittedAt.toDate().toISOString();
  }
  return toCleanString(submittedAt ? String(submittedAt) : "", 120) || "N/A";
};

const formatSystemTypeLabel = (lead) => {
  if (lead.systemType === "other") {
    return toCleanString(lead.systemTypeOther, 180) || "Other";
  }
  return toCleanString(lead.systemType, 120) || "N/A";
};

const buildInfoRows = (rows) =>
  rows
    .map(([label, value], index) => {
      const borderStyle =
        index === rows.length - 1 ? "border-bottom:none;" : "border-bottom:1px solid #e7ebf3;";
      return `
        <tr>
          <td style="padding:12px 14px; width:38%; vertical-align:top; color:#4b5565; font-size:13px; font-weight:600; ${borderStyle}">
            ${escapeHtml(label)}
          </td>
          <td style="padding:12px 14px; vertical-align:top; color:#111827; font-size:14px; line-height:1.55; ${borderStyle}">
            ${value}
          </td>
        </tr>
      `;
    })
    .join("");

const buildInfoTable = (rows) => `
  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; border-collapse:separate; border-spacing:0; border:1px solid #e7ebf3; border-radius:12px; overflow:hidden; background:#ffffff;">
    ${buildInfoRows(rows)}
  </table>
`;

const buildInquiryAlertEmail = ({ lead, inquiryId }) => {
  const inquiryTypeLabel = formatInquiryTypeLabel(lead.inquiryType);
  const preferredPlanLabel = BUDGET_RANGE_LABELS[lead.budgetRange] || lead.budgetRange || "N/A";
  const timelineLabel = TIMELINE_LABELS[lead.timeline] || lead.timeline || "N/A";
  const sharedRows = [
    ["Inquiry ID", toEmailSafeText(inquiryId, "N/A", 120)],
    ["Type", toEmailSafeText(inquiryTypeLabel, "N/A", 120)],
    ["Submitted at (UTC)", toEmailSafeText(formatSubmittedAtLabel(lead.submittedAt), "N/A", 120)],
    ["Full name", toEmailSafeText(lead.fullName, "N/A", 120)],
    ["Email", toEmailSafeText(lead.email, "N/A", 254)],
    ["Phone / WhatsApp", toEmailSafeText(lead.phone, "N/A", 40)],
    ["Preferred contact", toEmailSafeText(formatContactMethodLabel(lead.preferredContactMethod), "N/A", 120)],
    ["Consent to contact", lead.consentToContact ? "Yes" : "No"]
  ];

  const typeSpecificRows =
    lead.inquiryType === "system_quote"
      ? [
          ["Company", toEmailSafeText(lead.companyName, "N/A", 180)],
          ["System type", toEmailSafeText(formatSystemTypeLabel(lead), "N/A", 180)],
          ["Preferred plan", toEmailSafeText(preferredPlanLabel, "N/A", 120)],
          ["Timeline", toEmailSafeText(timelineLabel, "N/A", 120)],
          ["Requirements", toEmailSafeMultiline(lead.requirementsSummary, "N/A", 4000)]
        ]
      : [["Message", toEmailSafeMultiline(lead.message, "N/A", 4000)]];

  return {
    subject: `New website enquiry (${toCleanString(inquiryId, 120) || "no-id"}) - ${inquiryTypeLabel}`,
    html: `
      <div style="margin:0; padding:26px 12px; background:#f3f6fb; font-family:Arial,'Segoe UI',sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; max-width:700px; margin:0 auto;">
          <tr>
            <td>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; border:1px solid #dbe3ef; border-radius:18px; overflow:hidden; background:#ffffff; box-shadow:0 8px 28px rgba(1,2,5,0.08);">
                <tr>
                  <td style="padding:24px 28px; background:linear-gradient(135deg,#1932BB 0%,#5336EF 100%); color:#ffffff;">
                    <p style="margin:0 0 8px; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; opacity:0.82;">
                      Binary Baker Lead Intake
                    </p>
                    <h1 style="margin:0; font-size:24px; line-height:1.25; font-weight:700;">
                      New website enquiry received
                    </h1>
                    <p style="margin:10px 0 0; font-size:14px; line-height:1.45; opacity:0.92;">
                      ${toEmailSafeText(inquiryTypeLabel, "Enquiry", 120)} enquiry submitted via the website.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 10px; font-size:13px; text-transform:uppercase; letter-spacing:0.14em; color:#4f46e5; font-weight:700;">
                      Contact Details
                    </p>
                    ${buildInfoTable(sharedRows)}
                    <p style="margin:20px 0 10px; font-size:13px; text-transform:uppercase; letter-spacing:0.14em; color:#4f46e5; font-weight:700;">
                      Enquiry Details
                    </p>
                    ${buildInfoTable(typeSpecificRows)}
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 28px 22px; border-top:1px solid #e7ebf3; color:#5f6b7c; font-size:12px; line-height:1.5;">
                    Generated automatically from the Binary Baker contact form.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `
  };
};

const buildInquiryReceiptEmail = ({ lead, inquiryId, whatsappNumber }) => {
  const inquiryTypeLabel = formatInquiryTypeLabel(lead.inquiryType);
  const preferredPlanLabel = BUDGET_RANGE_LABELS[lead.budgetRange] || lead.budgetRange || "N/A";
  const timelineLabel = TIMELINE_LABELS[lead.timeline] || lead.timeline || "N/A";
  const whatsappDisplay = toCleanString(whatsappNumber, 40) || "+27611011669";
  const whatsappLinkDigits = whatsappDisplay.replace(/\D/g, "");
  const whatsappHref = whatsappLinkDigits ? `https://wa.me/${whatsappLinkDigits}` : "";

  const summaryRows =
    lead.inquiryType === "system_quote"
      ? [
          ["Enquiry type", toEmailSafeText(inquiryTypeLabel, "N/A", 120)],
          ["Company", toEmailSafeText(lead.companyName, "N/A", 180)],
          ["System type", toEmailSafeText(formatSystemTypeLabel(lead), "N/A", 180)],
          ["Preferred plan", toEmailSafeText(preferredPlanLabel, "N/A", 120)],
          ["Timeline", toEmailSafeText(timelineLabel, "N/A", 120)],
          ["Requirements summary", toEmailSafeMultiline(lead.requirementsSummary, "N/A", 4000)]
        ]
      : [
          ["Enquiry type", toEmailSafeText(inquiryTypeLabel, "N/A", 120)],
          ["Message", toEmailSafeMultiline(lead.message, "N/A", 4000)]
        ];

  return {
    subject: `We received your enquiry (${toCleanString(inquiryId, 120) || "pending"})`,
    html: `
      <div style="margin:0; padding:26px 12px; background:#f3f6fb; font-family:Arial,'Segoe UI',sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; max-width:700px; margin:0 auto;">
          <tr>
            <td>
              <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; border:1px solid #dbe3ef; border-radius:18px; overflow:hidden; background:#ffffff; box-shadow:0 8px 28px rgba(1,2,5,0.08);">
                <tr>
                  <td style="padding:24px 28px; background:linear-gradient(135deg,#1932BB 0%,#5336EF 100%); color:#ffffff;">
                    <p style="margin:0 0 8px; font-size:11px; letter-spacing:0.18em; text-transform:uppercase; opacity:0.82;">
                      Binary Baker
                    </p>
                    <h1 style="margin:0; font-size:24px; line-height:1.25; font-weight:700;">
                      We received your enquiry
                    </h1>
                    <p style="margin:10px 0 0; font-size:14px; line-height:1.45; opacity:0.92;">
                      Thanks for your message. We will reply within 48 hours.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 28px;">
                    <p style="margin:0 0 12px; color:#111827; font-size:15px; line-height:1.6;">
                      Hi ${toEmailSafeText(lead.fullName, "there", 120)},
                    </p>
                    <p style="margin:0 0 12px; color:#374151; font-size:14px; line-height:1.65;">
                      Your enquiry has been logged and assigned for review. We will contact you through your selected channel with next steps.
                    </p>
                    <div style="margin:0 0 14px; padding:12px 14px; border:1px solid #d8e1ef; border-radius:12px; background:#f8fbff;">
                      <p style="margin:0; color:#1f2937; font-size:14px; line-height:1.6;">
                        Need a faster reply? Contact us on WhatsApp:
                        ${
                          whatsappHref
                            ? `<a href="${whatsappHref}" style="color:#1932BB; font-weight:700; text-decoration:underline;"> ${escapeHtml(whatsappDisplay)}</a>`
                            : `<strong style="color:#1932BB;"> ${escapeHtml(whatsappDisplay)}</strong>`
                        }
                      </p>
                    </div>
                    <p style="margin:0 0 10px; font-size:13px; text-transform:uppercase; letter-spacing:0.14em; color:#4f46e5; font-weight:700;">
                      Enquiry Summary
                    </p>
                    ${buildInfoTable([
                      ["Reference", toEmailSafeText(inquiryId, "N/A", 120)],
                      [
                        "Preferred contact",
                        toEmailSafeText(formatContactMethodLabel(lead.preferredContactMethod), "N/A", 120)
                      ],
                      ...summaryRows
                    ])}
                    <p style="margin:16px 0 0; color:#4b5565; font-size:14px; line-height:1.6;">
                      Regards,<br/><strong style="color:#111827;">Binary Baker</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 28px 22px; border-top:1px solid #e7ebf3; color:#5f6b7c; font-size:12px; line-height:1.5;">
                    This is an automated confirmation for your website enquiry.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `
  };
};

const resolveResendSendOutcome = (settledResult, fallbackError) => {
  if (settledResult.status === "fulfilled") {
    const value = settledResult.value || {};
    if (value.error) {
      return {
        status: "failed",
        error: toCleanString(String(value.error?.message || fallbackError), 500) || fallbackError,
        emailId: ""
      };
    }
    const emailId = toCleanString(value.data?.id || value.id, 200);
    return {
      status: "sent",
      error: "",
      emailId
    };
  }

  return {
    status: "failed",
    error:
      toCleanString(String(settledResult.reason?.message || fallbackError), 500) || fallbackError,
    emailId: ""
  };
};

exports.inviteClientOnCreate = onDocumentCreated(
  { document: "orgs/{orgId}/clients/{clientId}", retry: false, secrets: [resendApiKey] },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      return;
    }

    const client = snapshot.data();
    const emails = Array.isArray(client?.emails) ? client.emails : [];
    const primaryEmail = emails[0] || client?.email;
    if (!client || !primaryEmail) {
      return;
    }

    if (client.inviteSentAt) {
      return;
    }

    const resendKey = resendApiKey.value();
    if (!resendKey) {
      await snapshot.ref.set(
        {
          inviteStatus: "failed",
          inviteError: "RESEND_API_KEY is not configured.",
          inviteUpdatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
      return;
    }

    const email = String(primaryEmail).trim().toLowerCase();
    const displayName = client.contactName || client.name || client.companyName || "";
    const resend = new Resend(resendKey);
    const fromAddress = resendFrom.value();
    const portalLink = portalUrl.value();

    try {
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(email);
      } catch (error) {
        if (error.code === "auth/user-not-found") {
          userRecord = await auth.createUser({
            email,
            displayName,
            emailVerified: false,
            disabled: false
          });
        } else {
          throw error;
        }
      }

      await db.doc(`users/${userRecord.uid}`).set(
        {
          role: "client",
          displayName: userRecord.displayName || displayName,
          email,
          createdAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );

      const resetLink = await auth.generatePasswordResetLink(email, {
        url: portalLink,
        handleCodeInApp: false
      });

      const emailContent = buildInviteEmail({
        name: displayName || "there",
        resetLink
      });

      await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html
      });

      await snapshot.ref.set(
        {
          inviteStatus: "sent",
          inviteSentAt: FieldValue.serverTimestamp(),
          inviteEmail: email,
          authUid: userRecord.uid
        },
        { merge: true }
      );
    } catch (error) {
      await snapshot.ref.set(
        {
          inviteStatus: "failed",
          inviteError: error?.message || "Failed to send invite.",
          inviteUpdatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
      throw error;
    }
  }
);

exports.submitWebsiteInquiry = onCall({ secrets: [resendApiKey] }, async (request) => {
  const payload = request.data || {};
  const inquiryType = normalizeEnumValue(payload.inquiryType, ALLOWED_INQUIRY_TYPES);
  const fullName = toCleanString(payload.fullName, 120);
  const email = toCleanString(payload.email, 254).toLowerCase();
  const phone = toCleanString(payload.phone, 40);
  const hasEmail = Boolean(email);
  const hasPhone = Boolean(phone);
  const preferredContactMethodInput = normalizeEnumValue(
    payload.preferredContactMethod,
    ALLOWED_CONTACT_METHODS
  );
  const preferredContactMethod =
    preferredContactMethodInput ||
    (hasEmail && hasPhone ? "either" : hasEmail ? "email" : hasPhone ? "whatsapp" : "");
  const consentToContact = payload.consentToContact === true;
  const honeypot = toCleanString(payload.website, 120);

  if (!inquiryType) {
    throw new HttpsError("invalid-argument", "Invalid inquiry type.");
  }
  if (!fullName) {
    throw new HttpsError("invalid-argument", "Full name is required.");
  }
  if (hasEmail && !isValidEmail(email)) {
    throw new HttpsError("invalid-argument", "Please provide a valid email address.");
  }
  if (!hasEmail && !hasPhone) {
    throw new HttpsError(
      "invalid-argument",
      "Please provide at least one contact method: email or WhatsApp number."
    );
  }
  if (!preferredContactMethod) {
    throw new HttpsError("invalid-argument", "Preferred contact method is required.");
  }
  if (preferredContactMethod === "email" && !hasEmail) {
    throw new HttpsError("invalid-argument", "Preferred contact method is email, but no email was provided.");
  }
  if ((preferredContactMethod === "whatsapp" || preferredContactMethod === "phone") && !hasPhone) {
    throw new HttpsError(
      "invalid-argument",
      "Preferred contact method is WhatsApp/phone, but no number was provided."
    );
  }
  if (!consentToContact) {
    throw new HttpsError("invalid-argument", "Consent is required.");
  }
  if (honeypot) {
    throw new HttpsError("invalid-argument", "Invalid submission.");
  }

  const companyName = toCleanString(payload.companyName, 180);
  const systemType = normalizeEnumValue(payload.systemType, ALLOWED_SYSTEM_TYPES);
  const systemTypeOther = toCleanString(payload.systemTypeOther, 180);
  const budgetRange = normalizeEnumValue(payload.budgetRange, ALLOWED_BUDGET_RANGES);
  const timeline = normalizeEnumValue(payload.timeline, ALLOWED_TIMELINES);
  const requirementsSummary = toCleanString(payload.requirementsSummary, 4000);
  const message = toCleanString(payload.message, 4000);

  if (inquiryType === "system_quote") {
    if (!companyName) {
      throw new HttpsError("invalid-argument", "Company name is required for system quotes.");
    }
    if (!systemType) {
      throw new HttpsError("invalid-argument", "System type is required for system quotes.");
    }
    if (systemType === "other" && !systemTypeOther) {
      throw new HttpsError("invalid-argument", "Please specify your system type.");
    }
    if (!budgetRange) {
      throw new HttpsError("invalid-argument", "Budget range is required for system quotes.");
    }
    if (!timeline) {
      throw new HttpsError("invalid-argument", "Timeline is required for system quotes.");
    }
    if (!requirementsSummary) {
      throw new HttpsError(
        "invalid-argument",
        "Requirements summary is required for system quotes."
      );
    }
  } else if (!message) {
    throw new HttpsError("invalid-argument", "Message is required for this enquiry type.");
  }

  const configuredOrgId = toCleanString(contactInquiryOrgId.value(), 120) || "default";
  const orgId = toCleanString(payload.orgId, 120) || configuredOrgId;
  if (!orgId) {
    throw new HttpsError("failed-precondition", "No target org configured for inquiry intake.");
  }

  const requestIp = resolveRequestIp(request.rawRequest);
  const ipHash = hashIp(requestIp);
  const userAgent = toCleanString(request.rawRequest?.headers?.["user-agent"], 512);
  const submittedAt = Timestamp.now();

  const rateLimitRef = db.collection(`orgs/${orgId}/inquiryRateLimits/${ipHash}/hits`);
  const rateWindowStart = Timestamp.fromMillis(submittedAt.toMillis() - 60 * 60 * 1000);
  const recentHitsSnapshot = await rateLimitRef
    .where("createdAt", ">=", rateWindowStart)
    .limit(5)
    .get();

  if (recentHitsSnapshot.size >= 5) {
    throw new HttpsError("resource-exhausted", "Too many requests. Try again later.");
  }

  const inquiryData = {
    inquiryType,
    status: LEAD_STATUSES[0],
    fullName,
    email,
    phone: phone || "",
    companyName: inquiryType === "system_quote" ? companyName : "",
    preferredContactMethod,
    consentToContact,
    systemType: inquiryType === "system_quote" ? systemType : "",
    systemTypeOther:
      inquiryType === "system_quote" && systemType === "other" ? systemTypeOther : "",
    budgetRange: inquiryType === "system_quote" ? budgetRange : "",
    timeline: inquiryType === "system_quote" ? timeline : "",
    requirementsSummary: inquiryType === "system_quote" ? requirementsSummary : "",
    message: inquiryType === "system_quote" ? "" : message,
    source: "website_contact_form",
    alertStatus: "pending",
    alertError: "",
    alertEmailId: "",
    receiptStatus: "pending",
    receiptError: "",
    receiptEmailId: "",
    ipHash,
    userAgent,
    adminNotes: "",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
    submittedAt
  };

  const inquiryRef = await db.collection(`orgs/${orgId}/inquiries`).add(inquiryData);
  await rateLimitRef.add({
    inquiryId: inquiryRef.id,
    createdAt: submittedAt
  });

  const updateInquiryEmailStatuses = async (data) => {
    try {
      await inquiryRef.set(
        {
          ...data,
          updatedAt: FieldValue.serverTimestamp()
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Failed to update inquiry email statuses", {
        inquiryId: inquiryRef.id,
        error: error?.message || "Unknown error"
      });
    }
  };

  const resendKey = resendApiKey.value();
  if (!resendKey) {
    await updateInquiryEmailStatuses({
      alertStatus: "failed",
      alertError: "RESEND_API_KEY is not configured.",
      alertEmailId: "",
      receiptStatus: "failed",
      receiptError: "RESEND_API_KEY is not configured.",
      receiptEmailId: ""
    });
    return { ok: true, inquiryId: inquiryRef.id };
  }

  const resend = new Resend(resendKey);
  const fromAddress = resendFrom.value();
  const inboxAddress =
    toCleanString(contactInboxEmail.value(), 254) || "bradley@binarybaker.co.za";
  const whatsappNumber =
    toCleanString(contactWhatsappNumber.value(), 40) || "+27611011669";

  try {
    const alertEmail = buildInquiryAlertEmail({
      lead: inquiryData,
      inquiryId: inquiryRef.id
    });
    let alertSendResult;
    let receiptSendResult = null;

    if (hasEmail) {
      const receiptEmail = buildInquiryReceiptEmail({
        lead: inquiryData,
        inquiryId: inquiryRef.id,
        whatsappNumber
      });

      [alertSendResult, receiptSendResult] = await Promise.allSettled([
        resend.emails.send({
          from: fromAddress,
          to: inboxAddress,
          subject: alertEmail.subject,
          html: alertEmail.html
        }),
        resend.emails.send({
          from: fromAddress,
          to: email,
          subject: receiptEmail.subject,
          html: receiptEmail.html
        })
      ]);
    } else {
      [alertSendResult] = await Promise.allSettled([
        resend.emails.send({
          from: fromAddress,
          to: inboxAddress,
          subject: alertEmail.subject,
          html: alertEmail.html
        })
      ]);
    }

    const alertOutcome = resolveResendSendOutcome(
      alertSendResult,
      "Failed to send inquiry alert email."
    );
    const receiptOutcome = hasEmail
      ? resolveResendSendOutcome(receiptSendResult, "Failed to send inquiry receipt email.")
      : { status: "skipped", error: "", emailId: "" };

    await updateInquiryEmailStatuses({
      alertStatus: alertOutcome.status,
      alertError: alertOutcome.error,
      alertEmailId: alertOutcome.emailId || "",
      receiptStatus: receiptOutcome.status,
      receiptError: receiptOutcome.error,
      receiptEmailId: receiptOutcome.emailId || ""
    });
  } catch (error) {
    await updateInquiryEmailStatuses({
      alertStatus: "failed",
      alertError:
        toCleanString(String(error?.message || "Failed to send inquiry alert email."), 500) ||
        "Failed to send inquiry alert email.",
      alertEmailId: "",
      receiptStatus: "failed",
      receiptError:
        toCleanString(String(error?.message || "Failed to send inquiry receipt email."), 500) ||
        "Failed to send inquiry receipt email.",
      receiptEmailId: ""
    });
  }

  return { ok: true, inquiryId: inquiryRef.id };
});

exports.billingCreateInvoiceDraft = onCall(async (request) => {
  const uid = assertAuth(request);
  const {
    orgId,
    clientId,
    projectId,
    issueDate,
    dueDate,
    currency,
    lineItems,
    notes,
    terms
  } = request.data || {};

  if (!orgId || !clientId) {
    throw new HttpsError("invalid-argument", "orgId and clientId are required.");
  }

  await assertRole(orgId, uid, ALLOWED_CREATE_ROLES);

  const settings = await getSettingsData(orgId);
  const taxMode = settings.taxMode === "inclusive" ? "inclusive" : "exclusive";
  const resolvedCurrency = currency || settings.currency || DEFAULT_CURRENCY;

  const normalizedLines = Array.isArray(lineItems)
    ? lineItems.map((line) => normalizeLineItem(line))
    : [];
  const taxesById = await fetchTaxesById(orgId, normalizedLines);
  const computedLines = normalizedLines.map((line) => {
    const rate = resolveTaxRate(taxesById, line.taxId);
    return { ...line, computed: computeLineItem(line, rate, taxMode) };
  });
  const totals = computeTotals(computedLines, taxesById, taxMode);

  const issue = parseTimestamp(issueDate, Timestamp.now());
  const due = dueDate ? parseTimestamp(dueDate, issue) : null;

  const clientRef = db.doc(`orgs/${orgId}/clients/${clientId}`);
  const clientSnap = await clientRef.get();
  const clientData = clientSnap.exists ? clientSnap.data() : undefined;

  const invoiceNumber = await getAndIncrementInvoiceNumber(orgId);

  const invoiceData = {
    invoiceNumber,
    status: "draft",
    clientId,
    clientSnapshot: buildClientSnapshot(clientData),
    clientName: clientData?.name || clientData?.companyName || "",
    currency: resolvedCurrency,
    issueDate: issue,
    dueDate: due,
    lineItems: computedLines,
    totals,
    amountPaidMinor: 0,
    balanceDueMinor: totals.totalMinor,
    notes: notes || "",
    terms: terms || "",
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  };
  if (projectId) {
    invoiceData.projectId = projectId;
  }

  const invoiceRef = await db.collection(`orgs/${orgId}/invoices`).add(invoiceData);

  return { invoiceId: invoiceRef.id };
});
