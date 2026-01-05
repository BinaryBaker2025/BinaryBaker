"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.servePublicInvoice = exports.billingGetPublicInvoice = exports.createPublicInvoiceLink = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const https_1 = require("firebase-functions/v2/https");
const authz_1 = require("./authz");
const ensureFirestore = () => {
    if (!(0, app_1.getApps)().length) {
        (0, app_1.initializeApp)();
    }
    return (0, firestore_1.getFirestore)();
};
const toMillis = (value) => {
    if (!value) {
        return null;
    }
    if (typeof value.toMillis === "function") {
        return value.toMillis();
    }
    const valueAny = value;
    if (typeof valueAny.seconds === "number") {
        return valueAny.seconds * 1000 + Math.round((valueAny.nanoseconds || 0) / 1e6);
    }
    if (typeof valueAny._seconds === "number") {
        return valueAny._seconds * 1000 + Math.round((valueAny.nanoseconds || 0) / 1e6);
    }
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
        return date.getTime();
    }
    return null;
};
const sanitizeInvoice = (id, invoice) => {
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
exports.createPublicInvoiceLink = (0, https_1.onCall)((request) => {
    (0, authz_1.assertAuth)(request.auth);
    // TODO: Generate a public link token and persist it.
    throw new https_1.HttpsError("unimplemented", "TODO: implement createPublicInvoiceLink.");
});
exports.billingGetPublicInvoice = (0, https_1.onCall)(async (request) => {
    const { token } = request.data || {};
    if (!token || typeof token !== "string") {
        throw new https_1.HttpsError("invalid-argument", "token is required.");
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
            throw new https_1.HttpsError("not-found", "Invoice not found.");
        }
        const doc = snapshot.docs[0];
        const data = doc.data();
        const updates = {};
        if (!data.viewedAt) {
            updates.viewedAt = firestore_1.FieldValue.serverTimestamp();
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
exports.servePublicInvoice = (0, https_1.onRequest)((req, res) => {
    // TODO: Validate public token and render invoice payload.
    res.status(501).send("Public invoice endpoint not implemented.");
});
