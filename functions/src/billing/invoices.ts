import { HttpsError, onCall } from "firebase-functions/v2/https";
import { assertAuth } from "./authz";
import type { Invoice, InvoiceDraftInput, InvoiceResponse } from "./types";

export type ListInvoicesResponse = {
  invoices: Invoice[];
};

export type GetInvoiceResponse = {
  invoice: Invoice | null;
};

export const createInvoice = onCall<InvoiceDraftInput, InvoiceResponse>(async (request) => {
  assertAuth(request.auth);
  // TODO: Validate input, check membership, reserve invoice number, and write to Firestore.
  throw new HttpsError("unimplemented", "TODO: implement createInvoice.");
});

export const updateInvoice = onCall<
  { invoiceId: string; updates: Partial<Invoice> },
  InvoiceResponse
>(async (request) => {
  assertAuth(request.auth);
  // TODO: Validate input, enforce RBAC, and update Firestore document.
  throw new HttpsError("unimplemented", "TODO: implement updateInvoice.");
});

export const listInvoices = onCall<{ orgId: string }, ListInvoicesResponse>(async (request) => {
  assertAuth(request.auth);
  // TODO: Enforce RBAC and list invoices for the org.
  return { invoices: [] };
});

export const getInvoice = onCall<{ orgId: string; invoiceId: string }, GetInvoiceResponse>(
  async (request) => {
    assertAuth(request.auth);
    // TODO: Enforce RBAC and fetch invoice.
    return { invoice: null };
  }
);
