import { getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore, Timestamp } from "firebase-admin/firestore";
import { onCall } from "firebase-functions/v2/https";
import { randomBytes } from "crypto";
import { assertAuth, assertMember, assertRole, throwHttpsError } from "./authz";
import { computeLineItem, computeTotals } from "./calc";
import { getAndIncrementInvoiceNumber } from "./numbering";
import type { Invoice, LineItem } from "./types";

type CreateInvoiceDraftRequest = {
  orgId: string;
  clientId: string;
  issueDate?: unknown;
  dueDate?: unknown;
  currency?: string;
  lineItems?: LineItem[];
  notes?: string;
  terms?: string;
};

type UpdateInvoiceDraftRequest = {
  orgId: string;
  invoiceId: string;
  patch: Partial<{
    clientId: string;
    issueDate: unknown;
    dueDate: unknown;
    currency: string;
    lineItems: LineItem[];
    notes: string;
    terms: string;
  }>;
};

type GetInvoiceRequest = {
  orgId: string;
  invoiceId: string;
};

type SendInvoiceRequest = {
  orgId: string;
  invoiceId: string;
  toEmails?: string[];
  ccEmails?: string[];
};

const DEFAULT_CURRENCY = "ZAR";
const ALLOWED_CREATE_ROLES = ["owner", "admin", "finance", "sales"];

const ensureFirestore = () => {
  if (!getApps().length) {
    initializeApp();
  }
  return getFirestore();
};

const parseTimestamp = (value: unknown, fallback: Timestamp): Timestamp => {
  if (!value) {
    return fallback;
  }
  if (value instanceof Timestamp) {
    return value;
  }
  const valueAny = value as { seconds?: number; _seconds?: number; nanoseconds?: number };
  if (typeof valueAny.seconds === "number") {
    return new Timestamp(valueAny.seconds, valueAny.nanoseconds || 0);
  }
  if (typeof valueAny._seconds === "number") {
    return new Timestamp(valueAny._seconds, valueAny.nanoseconds || 0);
  }
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return Timestamp.fromDate(date);
    }
  }
  return fallback;
};

const normalizeLineItem = (line: LineItem): LineItem => {
  const quantity = Number(line.quantity ?? 0);
  const unitPriceMinor = Number(line.unitPriceMinor ?? 0);
  const discountType =
    line.discountType === "percent" || line.discountType === "amount"
      ? line.discountType
      : undefined;
  const discountValue =
    line.discountValue != null && Number.isFinite(Number(line.discountValue))
      ? Number(line.discountValue)
      : undefined;

  return {
    itemId: line.itemId ?? null,
    name: String(line.name || line.description || "Line item"),
    description: line.description || "",
    quantity: Number.isFinite(quantity) ? quantity : 0,
    unitPriceMinor: Number.isFinite(unitPriceMinor) ? unitPriceMinor : 0,
    discountType,
    discountValue,
    taxId: line.taxId ?? null
  };
};

const fetchTaxesById = async (
  orgId: string,
  lines: LineItem[]
): Promise<Record<string, { ratePercent: number }>> => {
  const db = ensureFirestore();
  const taxIds = Array.from(
    new Set(
      lines
        .map((line) => line.taxId)
        .filter((taxId): taxId is string => Boolean(taxId && typeof taxId === "string"))
    )
  );

  if (taxIds.length === 0) {
    return {};
  }

  const refs = taxIds.map((taxId) => db.doc(`orgs/${orgId}/taxes/${taxId}`));
  const snapshots = await db.getAll(...refs);
  const taxesById: Record<string, { ratePercent: number }> = {};

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

const getSettingsData = async (orgId: string) => {
  const db = ensureFirestore();
  const settingsRef = db.doc(`orgs/${orgId}/settings`);
  const snapshot = await settingsRef.get();
  return snapshot.exists ? snapshot.data() || {} : {};
};

const buildClientSnapshot = (client: FirebaseFirestore.DocumentData | undefined) => {
  if (!client) {
    return { name: "Unknown client" };
  }
  const primaryEmail =
    Array.isArray(client.emails) && client.emails.length > 0
      ? client.emails[0]
      : client.email || undefined;

  return {
    name: client.name || client.companyName || "Client",
    email: primaryEmail,
    taxNumber: client.taxNumber || undefined,
    billingAddress: client.billingAddress || undefined
  };
};

const buildInvoicePayload = async ({
  orgId,
  clientId,
  issueDate,
  dueDate,
  currency,
  lineItems,
  notes,
  terms,
  existingAmountPaidMinor,
  projectId
}: {
  orgId: string;
  clientId: string;
  issueDate?: unknown;
  dueDate?: unknown;
  currency?: string;
  lineItems: LineItem[];
  notes?: string;
  terms?: string;
  existingAmountPaidMinor?: number;
  projectId?: string;
}) => {
  const db = ensureFirestore();
  const settings = await getSettingsData(orgId);
  const taxMode = settings.taxMode === "inclusive" ? "inclusive" : "exclusive";
  const resolvedCurrency = currency || settings.currency || DEFAULT_CURRENCY;

  const clientRef = db.doc(`orgs/${orgId}/clients/${clientId}`);
  const clientSnap = await clientRef.get();
  const clientData = clientSnap.exists ? clientSnap.data() : undefined;

  const normalizedLines = lineItems.map(normalizeLineItem);
  const taxesById = await fetchTaxesById(orgId, normalizedLines);

  const computedLines = normalizedLines.map((line) => {
    const taxRate = line.taxId ? taxesById[line.taxId]?.ratePercent ?? 0 : 0;
    return {
      ...line,
      computed: computeLineItem(line, taxRate, taxMode)
    };
  });

  const totals = computeTotals(computedLines, taxesById, taxMode);
  const amountPaidMinor = existingAmountPaidMinor ?? 0;
  const balanceDueMinor = Math.max(0, totals.totalMinor - amountPaidMinor);

  const issue = parseTimestamp(issueDate, Timestamp.now());
  const due = dueDate ? parseTimestamp(dueDate, issue) : null;

  return {
    clientSnapshot: buildClientSnapshot(clientData),
    clientName: clientData?.name || clientData?.companyName || "",
    currency: resolvedCurrency,
    lineItems: computedLines,
    totals,
    amountPaidMinor,
    balanceDueMinor,
    issueDate: issue,
    dueDate: due,
    notes: notes || "",
    terms: terms || "",
    taxMode,
    projectId: projectId || undefined
  };
};

const generatePublicToken = () => randomBytes(16).toString("hex");

const normalizeEmails = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((email) => (typeof email === "string" ? email.trim() : ""))
    .filter((email) => email.length > 0);
};

const writeAuditLog = async ({
  orgId,
  uid,
  action,
  entityType,
  entityId,
  metadata
}: {
  orgId: string;
  uid: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}) => {
  const db = ensureFirestore();
  await db.collection(`orgs/${orgId}/auditLogs`).add({
    actorUid: uid,
    action,
    entityType,
    entityId,
    metadata: metadata || {},
    createdAt: FieldValue.serverTimestamp()
  });
};

export const billingCreateInvoiceDraft = onCall<CreateInvoiceDraftRequest>(async (request) => {
  const uid = assertAuth(request.auth);
  const { orgId, clientId, issueDate, dueDate, currency, lineItems, notes, terms } =
    request.data || {};

  if (!orgId || !clientId) {
    throwHttpsError("invalid-argument", "orgId and clientId are required.");
  }

  await assertRole(orgId, uid, ALLOWED_CREATE_ROLES);

  const db = ensureFirestore();
  const invoiceNumber = await getAndIncrementInvoiceNumber(orgId);

  const payload = await buildInvoicePayload({
    orgId,
    clientId,
    issueDate,
    dueDate,
    currency,
    lineItems: Array.isArray(lineItems) ? lineItems : [],
    notes,
    terms
  });

  const invoiceRef = await db.collection(`orgs/${orgId}/invoices`).add({
    invoiceNumber,
    status: "draft",
    clientId,
    clientSnapshot: payload.clientSnapshot,
    clientName: payload.clientName,
    currency: payload.currency,
    issueDate: payload.issueDate,
    dueDate: payload.dueDate,
    lineItems: payload.lineItems,
    totals: payload.totals,
    amountPaidMinor: payload.amountPaidMinor,
    balanceDueMinor: payload.balanceDueMinor,
    notes: payload.notes,
    terms: payload.terms,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp()
  });

  return { invoiceId: invoiceRef.id };
});

export const billingUpdateInvoiceDraft = onCall<UpdateInvoiceDraftRequest>(async (request) => {
  const uid = assertAuth(request.auth);
  const { orgId, invoiceId, patch } = request.data || {};

  if (!orgId || !invoiceId || !patch) {
    throwHttpsError("invalid-argument", "orgId, invoiceId, and patch are required.");
  }

  await assertRole(orgId, uid, ALLOWED_CREATE_ROLES);

  const db = ensureFirestore();
  const invoiceRef = db.doc(`orgs/${orgId}/invoices/${invoiceId}`);
  const snapshot = await invoiceRef.get();

  if (!snapshot.exists) {
    throwHttpsError("not-found", "Invoice not found.");
  }

  const invoice = snapshot.data() as Invoice;
  if (invoice.status !== "draft") {
    throwHttpsError("failed-precondition", "Only draft invoices can be updated.");
  }

  const nextClientId = patch.clientId || invoice.clientId;
  const nextCurrency = patch.currency || invoice.currency;
  const nextLineItems = Array.isArray(patch.lineItems) ? patch.lineItems : invoice.lineItems;

  let totalsPatch: Partial<Invoice> = {};
  if (patch.lineItems) {
    const payload = await buildInvoicePayload({
      orgId,
      clientId: nextClientId,
      issueDate: patch.issueDate ?? invoice.issueDate,
      dueDate: patch.dueDate ?? invoice.dueDate,
      currency: nextCurrency,
      lineItems: nextLineItems,
      notes: patch.notes ?? invoice.notes,
      terms: patch.terms ?? invoice.terms,
      existingAmountPaidMinor: invoice.amountPaidMinor || 0,
      projectId: invoice.projectId
    });

    totalsPatch = {
      clientSnapshot: payload.clientSnapshot,
      clientName: payload.clientName,
      currency: payload.currency,
      lineItems: payload.lineItems,
      totals: payload.totals,
      amountPaidMinor: payload.amountPaidMinor,
      balanceDueMinor: payload.balanceDueMinor
    };
  }

  const issueDate = patch.issueDate
    ? parseTimestamp(patch.issueDate, invoice.issueDate)
    : invoice.issueDate;
  const dueDate = patch.dueDate
    ? parseTimestamp(patch.dueDate, invoice.dueDate || invoice.issueDate)
    : invoice.dueDate;

  await invoiceRef.set(
    {
      clientId: nextClientId,
      currency: nextCurrency,
      issueDate,
      dueDate,
      notes: patch.notes ?? invoice.notes ?? "",
      terms: patch.terms ?? invoice.terms ?? "",
      ...totalsPatch,
      updatedAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  return { success: true };
});

export const billingGetInvoice = onCall<GetInvoiceRequest>(async (request) => {
  const uid = assertAuth(request.auth);
  const { orgId, invoiceId } = request.data || {};

  if (!orgId || !invoiceId) {
    throwHttpsError("invalid-argument", "orgId and invoiceId are required.");
  }

  await assertMember(orgId, uid);

  const db = ensureFirestore();
  const invoiceRef = db.doc(`orgs/${orgId}/invoices/${invoiceId}`);
  const snapshot = await invoiceRef.get();

  if (!snapshot.exists) {
    throwHttpsError("not-found", "Invoice not found.");
  }

  return { invoice: { id: snapshot.id, ...(snapshot.data() as object) } };
});

export const billingSendInvoice = onCall<SendInvoiceRequest>(async (request) => {
  const uid = assertAuth(request.auth);
  const { orgId, invoiceId, toEmails, ccEmails } = request.data || {};

  if (!orgId || !invoiceId) {
    throwHttpsError("invalid-argument", "orgId and invoiceId are required.");
  }

  await assertRole(orgId, uid, ALLOWED_CREATE_ROLES);

  const db = ensureFirestore();
  const invoiceRef = db.doc(`orgs/${orgId}/invoices/${invoiceId}`);
  const snapshot = await invoiceRef.get();

  if (!snapshot.exists) {
    throwHttpsError("not-found", "Invoice not found.");
  }

  const invoice = snapshot.data() as Invoice;
  if (invoice.status === "void" || invoice.status === "paid" || invoice.void) {
    throwHttpsError(
      "failed-precondition",
      "Cannot send a void or fully paid invoice."
    );
  }

  const token = generatePublicToken();
  const pdfPath = `invoices/${invoiceId}.pdf`;
  const normalizedTo = normalizeEmails(toEmails);
  const normalizedCc = normalizeEmails(ccEmails);

  await invoiceRef.set(
    {
      status: "sent",
      sentAt: FieldValue.serverTimestamp(),
      pdfPath,
      public: {
        token,
        enabled: true,
        createdAt: FieldValue.serverTimestamp(),
        revokedAt: null
      },
      updatedAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  await writeAuditLog({
    orgId,
    uid,
    action: "invoice.sent",
    entityType: "invoice",
    entityId: invoiceId,
    metadata: {
      invoiceNumber: invoice.invoiceNumber,
      toEmails: normalizedTo,
      ccEmails: normalizedCc
    }
  });

  console.info("billingSendInvoice stub", {
    orgId,
    invoiceId,
    toEmails: normalizedTo,
    ccEmails: normalizedCc,
    pdfPath
  });

  return { publicUrl: `/p/invoice/${token}` };
});
