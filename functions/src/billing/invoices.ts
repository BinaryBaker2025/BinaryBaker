import { getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore, Timestamp } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { defineSecret, defineString } from "firebase-functions/params";
import { onCall } from "firebase-functions/v2/https";
import { randomBytes } from "crypto";
import PDFDocument from "pdfkit";
import { Resend } from "resend";
import { assertAuth, assertMember, assertRole, throwHttpsError } from "./authz";
import { computeLineItem, computeTotals } from "./calc";
import { getAndIncrementInvoiceNumber } from "./numbering";
import type { Invoice, LineItem } from "./types";

type CreateInvoiceDraftRequest = {
  orgId: string;
  clientId: string;
  projectId?: string;
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
const resendApiKey = defineSecret("RESEND_API_KEY");
const resendFrom = defineString("RESEND_FROM", {
  default: "Binary Baker <hello@binarybaker.com>"
});
const clientPortalUrl = defineString("CLIENT_PORTAL_URL", {
  default: "https://yourdomain.com"
});

const ensureFirestore = () => {
  if (!getApps().length) {
    initializeApp();
  }
  return getFirestore();
};

const ensureStorage = () => {
  if (!getApps().length) {
    initializeApp();
  }
  return getStorage();
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
  const settingsRef = db.doc(`orgs/${orgId}/settings/main`);
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

  const snapshot: {
    name: string;
    email?: string;
    taxNumber?: string;
    billingAddress?: unknown;
  } = {
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

  const payload: {
    clientSnapshot: ReturnType<typeof buildClientSnapshot>;
    clientName: string;
    currency: string;
    lineItems: LineItem[];
    totals: ReturnType<typeof computeTotals>;
    amountPaidMinor: number;
    balanceDueMinor: number;
    issueDate: Timestamp;
    dueDate: Timestamp | null;
    notes: string;
    terms: string;
    taxMode: string;
    projectId?: string;
  } = {
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
    taxMode
  };
  if (projectId) {
    payload.projectId = projectId;
  }
  return payload;
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

const resolvePublicBaseUrl = () => {
  const base = clientPortalUrl.value();
  try {
    return new URL(base).origin;
  } catch (error) {
    return base.replace(/\/+$/, "");
  }
};

const formatCurrency = (amountMinor: number, currency: string) => {
  const value = Number.isFinite(amountMinor) ? amountMinor / 100 : 0;
  try {
    return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(value);
  } catch (error) {
    return `${currency} ${value.toFixed(2)}`;
  }
};

const generateInvoicePdf = async ({
  invoice,
  companyName
}: {
  invoice: Invoice;
  companyName: string;
}): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const currency = invoice.currency || DEFAULT_CURRENCY;
    const clientName = invoice.clientSnapshot?.name || invoice.clientName || "Client";
    const issuedAt = invoice.issueDate?.toDate?.();
    const dueAt = invoice.dueDate?.toDate?.();

    doc.fontSize(20).text(companyName || "Invoice", { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(12).text(`Invoice: ${invoice.invoiceNumber || invoice.id}`);
    doc.text(`Status: ${invoice.status}`);
    if (issuedAt) {
      doc.text(`Issue date: ${issuedAt.toISOString().slice(0, 10)}`);
    }
    if (dueAt) {
      doc.text(`Due date: ${dueAt.toISOString().slice(0, 10)}`);
    }
    doc.moveDown();
    doc.fontSize(12).text(`Bill to: ${clientName}`);
    if (invoice.clientSnapshot?.email) {
      doc.text(`Email: ${invoice.clientSnapshot.email}`);
    }
    doc.moveDown();
    doc.fontSize(12).text("Line items");
    doc.moveDown(0.5);

    const lines = Array.isArray(invoice.lineItems) ? invoice.lineItems : [];
    lines.forEach((line) => {
      const totalMinor = line.computed?.totalMinor ?? 0;
      doc
        .fontSize(11)
        .text(
          `${line.name} · Qty ${line.quantity} · ${formatCurrency(
            totalMinor,
            currency
          )}`,
          {
            continued: false
          }
        );
      if (line.description) {
        doc.fontSize(10).fillColor("gray").text(line.description);
        doc.fillColor("black");
      }
    });

    doc.moveDown();
    const totals = invoice.totals;
    if (totals) {
      doc.fontSize(11).text(`Subtotal: ${formatCurrency(totals.subtotalMinor, currency)}`);
      doc.text(
        `Discounts: ${formatCurrency(totals.discountTotalMinor, currency)}`
      );
      doc.text(`Tax: ${formatCurrency(totals.taxTotalMinor, currency)}`);
      doc.fontSize(12).text(`Total: ${formatCurrency(totals.totalMinor, currency)}`);
    }

    if (invoice.notes) {
      doc.moveDown();
      doc.fontSize(11).text("Notes");
      doc.fontSize(10).text(invoice.notes);
    }
    if (invoice.terms) {
      doc.moveDown();
      doc.fontSize(11).text("Terms");
      doc.fontSize(10).text(invoice.terms);
    }

    doc.end();
  });
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
  const { orgId, clientId, projectId, issueDate, dueDate, currency, lineItems, notes, terms } =
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
    terms,
    projectId
  });

  const invoiceData: FirebaseFirestore.DocumentData = {
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
  };
  if (projectId) {
    invoiceData.projectId = projectId;
  }

  const invoiceRef = await db.collection(`orgs/${orgId}/invoices`).add(invoiceData);

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

export const billingSendInvoice = onCall<SendInvoiceRequest>(
  { secrets: [resendApiKey] },
  async (request) => {
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

    const existingToken =
      invoice.public?.token && invoice.public.enabled && !invoice.public.revokedAt
        ? invoice.public.token
        : null;
    const token = existingToken || generatePublicToken();
    const pdfPath = `invoices/${orgId}/${invoiceId}.pdf`;

    const settings = await getSettingsData(orgId);
    const companyName = settings.companyName || settings.legalName || "Invoice";

    const pdfBuffer = await generateInvoicePdf({
      invoice,
      companyName
    });

    const storage = ensureStorage();
    await storage.bucket().file(pdfPath).save(pdfBuffer, {
      contentType: "application/pdf",
      resumable: false,
      metadata: {
        cacheControl: "private, max-age=0"
      }
    });

    const normalizedTo = normalizeEmails(toEmails);
    if (normalizedTo.length === 0 && invoice.clientSnapshot?.email) {
      normalizedTo.push(invoice.clientSnapshot.email);
    }
    if (normalizedTo.length === 0) {
      throwHttpsError("invalid-argument", "Recipient email is required.");
    }
    const normalizedCc = normalizeEmails(ccEmails);

    const publicUrl = `${resolvePublicBaseUrl()}/p/invoice/${token}`;

    const resendKey = resendApiKey.value();
    if (!resendKey) {
      throwHttpsError("failed-precondition", "RESEND_API_KEY is not configured.");
    }
    const resend = new Resend(resendKey);
    const fromAddress = resendFrom.value();
    const invoiceLabel = invoice.invoiceNumber || invoice.id;
    const subject = `Invoice ${invoiceLabel}`;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hi ${invoice.clientSnapshot?.name || "there"},</p>
        <p>Your invoice ${invoiceLabel} is ready.</p>
        <p><a href="${publicUrl}" target="_blank" rel="noreferrer">View invoice</a></p>
        <p>Thanks,<br/>${companyName}</p>
      </div>
    `;

    await resend.emails.send({
      from: fromAddress,
      to: normalizedTo,
      cc: normalizedCc.length ? normalizedCc : undefined,
      subject,
      html,
      attachments: [
        {
          filename: `${invoiceLabel}.pdf`,
          content: pdfBuffer.toString("base64")
        }
      ]
    });

    const publicPatch: Record<string, unknown> = {
      token,
      enabled: true,
      revokedAt: null
    };
    if (!existingToken || invoice.public?.revokedAt) {
      publicPatch.createdAt = FieldValue.serverTimestamp();
    }

    await invoiceRef.set(
      {
        status: "sent",
        sentAt: FieldValue.serverTimestamp(),
        pdfPath,
        public: publicPatch,
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
        ccEmails: normalizedCc,
        pdfPath,
        publicUrl
      }
    });

    return { publicUrl };
  }
);
