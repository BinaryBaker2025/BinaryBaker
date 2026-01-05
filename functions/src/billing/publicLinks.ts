import { getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";
import type { Invoice } from "./types";
import { assertAuth } from "./authz";

type PublicInvoiceResponse = {
  id: string;
  invoiceNumber: string;
  status: string;
  currency: string;
  issueDate: number | null;
  dueDate: number | null;
  client: {
    name: string;
    email?: string;
  };
  lineItems: Array<{
    name: string;
    description?: string;
    quantity: number;
    unitPriceMinor: number;
    discountType?: "percent" | "amount";
    discountValue?: number;
    taxId?: string | null;
    computed?: {
      baseMinor: number;
      discountMinor: number;
      netMinor: number;
      taxMinor: number;
      totalMinor: number;
    };
  }>;
  totals: Invoice["totals"] | null;
  amountPaidMinor: number;
  balanceDueMinor: number;
  notes: string;
  terms: string;
};

const ensureFirestore = () => {
  if (!getApps().length) {
    initializeApp();
  }
  return getFirestore();
};

const toMillis = (value: unknown): number | null => {
  if (!value) {
    return null;
  }
  if (typeof (value as { toMillis?: () => number }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis();
  }
  const valueAny = value as { seconds?: number; _seconds?: number; nanoseconds?: number };
  if (typeof valueAny.seconds === "number") {
    return valueAny.seconds * 1000 + Math.round((valueAny.nanoseconds || 0) / 1e6);
  }
  if (typeof valueAny._seconds === "number") {
    return valueAny._seconds * 1000 + Math.round((valueAny.nanoseconds || 0) / 1e6);
  }
  const date = new Date(value as string | number);
  if (!Number.isNaN(date.getTime())) {
    return date.getTime();
  }
  return null;
};

const sanitizeInvoice = (id: string, invoice: Invoice): PublicInvoiceResponse => {
  const clientSnapshot = invoice.clientSnapshot || { name: "Client" };
  const lineItems = Array.isArray(invoice.lineItems) ? invoice.lineItems : [];

  return {
    id,
    invoiceNumber: invoice.invoiceNumber || id,
    status: invoice.status,
    currency: invoice.currency,
    issueDate: toMillis(invoice.issueDate),
    dueDate: toMillis(invoice.dueDate),
    client: {
      name: clientSnapshot.name || "Client",
      email: clientSnapshot.email
    },
    lineItems: lineItems.map((line) => ({
      name: line.name,
      description: line.description || "",
      quantity: Number(line.quantity ?? 0),
      unitPriceMinor: Number(line.unitPriceMinor ?? 0),
      discountType: line.discountType,
      discountValue: line.discountValue,
      taxId: line.taxId ?? null,
      computed: line.computed
    })),
    totals: invoice.totals || null,
    amountPaidMinor: invoice.amountPaidMinor ?? 0,
    balanceDueMinor: invoice.balanceDueMinor ?? 0,
    notes: invoice.notes || "",
    terms: invoice.terms || ""
  };
};

export const createPublicInvoiceLink = onCall<{ invoiceId: string }, { publicId: string }>(
  (request) => {
    assertAuth(request.auth);
    // TODO: Generate a public link token and persist it.
    throw new HttpsError("unimplemented", "TODO: implement createPublicInvoiceLink.");
  }
);

export const billingGetPublicInvoice = onCall<{ token: string }>(async (request) => {
  const { token } = request.data || {};

  if (!token || typeof token !== "string") {
    throw new HttpsError("invalid-argument", "token is required.");
  }

  const db = ensureFirestore();
  const invoicesQuery = db
    .collectionGroup("invoices")
    .where("public.token", "==", token)
    .where("public.enabled", "==", true)
    .where("public.revokedAt", "==", null)
    .limit(1);

  const { id, invoice } = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(invoicesQuery);
    if (snapshot.empty) {
      throw new HttpsError("not-found", "Invoice not found.");
    }

    const doc = snapshot.docs[0];
    const data = doc.data() as Invoice;
    const updates: Record<string, unknown> = {};

    if (!data.viewedAt) {
      updates.viewedAt = FieldValue.serverTimestamp();
    }

    if (data.status === "sent") {
      updates.status = "viewed";
    }

    if (Object.keys(updates).length > 0) {
      transaction.update(doc.ref, updates);
    }

    return { id: doc.id, invoice: data };
  });

  return { invoice: sanitizeInvoice(id, invoice) };
});

export const servePublicInvoice = onRequest((req, res) => {
  // TODO: Validate public token and render invoice payload.
  res.status(501).send("Public invoice endpoint not implemented.");
});
