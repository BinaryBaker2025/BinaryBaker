const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret, defineString } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { FieldValue, getFirestore, Timestamp } = require("firebase-admin/firestore");
const { Resend } = require("resend");

initializeApp();

const auth = getAuth();
const db = getFirestore();

const resendApiKey = defineSecret("RESEND_API_KEY");
const resendFrom = defineString("RESEND_FROM", {
  default: "Binary Baker <hello@binarybaker.com>"
});
const portalUrl = defineString("CLIENT_PORTAL_URL", {
  default: "https://yourdomain.com/portal"
});

const DEFAULT_CURRENCY = "ZAR";
const ALLOWED_CREATE_ROLES = ["owner", "admin", "finance", "sales"];

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
