"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.billingSendInvoice = exports.billingGetInvoice = exports.billingUpdateInvoiceDraft = exports.billingCreateInvoiceDraft = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const storage_1 = require("firebase-admin/storage");
const params_1 = require("firebase-functions/params");
const https_1 = require("firebase-functions/v2/https");
const crypto_1 = require("crypto");
const pdfkit_1 = __importDefault(require("pdfkit"));
const resend_1 = require("resend");
const authz_1 = require("./authz");
const calc_1 = require("./calc");
const numbering_1 = require("./numbering");
const DEFAULT_CURRENCY = "ZAR";
const ALLOWED_CREATE_ROLES = ["owner", "admin", "finance", "sales"];
const resendApiKey = (0, params_1.defineSecret)("RESEND_API_KEY");
const resendFrom = (0, params_1.defineString)("RESEND_FROM", {
    default: "Binary Baker <hello@binarybaker.com>"
});
const clientPortalUrl = (0, params_1.defineString)("CLIENT_PORTAL_URL", {
    default: "https://yourdomain.com"
});
const ensureFirestore = () => {
    if (!(0, app_1.getApps)().length) {
        (0, app_1.initializeApp)();
    }
    return (0, firestore_1.getFirestore)();
};
const ensureStorage = () => {
    if (!(0, app_1.getApps)().length) {
        (0, app_1.initializeApp)();
    }
    return (0, storage_1.getStorage)();
};
const parseTimestamp = (value, fallback) => {
    if (!value) {
        return fallback;
    }
    if (value instanceof firestore_1.Timestamp) {
        return value;
    }
    const valueAny = value;
    if (typeof valueAny.seconds === "number") {
        return new firestore_1.Timestamp(valueAny.seconds, valueAny.nanoseconds || 0);
    }
    if (typeof valueAny._seconds === "number") {
        return new firestore_1.Timestamp(valueAny._seconds, valueAny.nanoseconds || 0);
    }
    if (typeof value === "string" || typeof value === "number") {
        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) {
            return firestore_1.Timestamp.fromDate(date);
        }
    }
    return fallback;
};
const normalizeLineItem = (line) => {
    const quantity = Number(line.quantity ?? 0);
    const unitPriceMinor = Number(line.unitPriceMinor ?? 0);
    const discountType = line.discountType === "percent" || line.discountType === "amount"
        ? line.discountType
        : undefined;
    const discountValue = line.discountValue != null && Number.isFinite(Number(line.discountValue))
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
const fetchTaxesById = async (orgId, lines) => {
    const db = ensureFirestore();
    const taxIds = Array.from(new Set(lines
        .map((line) => line.taxId)
        .filter((taxId) => Boolean(taxId && typeof taxId === "string"))));
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
const getSettingsData = async (orgId) => {
    const db = ensureFirestore();
    const settingsRef = db.doc(`orgs/${orgId}/settings/main`);
    const snapshot = await settingsRef.get();
    return snapshot.exists ? snapshot.data() || {} : {};
};
const buildClientSnapshot = (client) => {
    if (!client) {
        return { name: "Unknown client" };
    }
    const primaryEmail = Array.isArray(client.emails) && client.emails.length > 0
        ? client.emails[0]
        : client.email || undefined;
    return {
        name: client.name || client.companyName || "Client",
        email: primaryEmail,
        taxNumber: client.taxNumber || undefined,
        billingAddress: client.billingAddress || undefined
    };
};
const buildInvoicePayload = async ({ orgId, clientId, issueDate, dueDate, currency, lineItems, notes, terms, existingAmountPaidMinor, projectId }) => {
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
            computed: (0, calc_1.computeLineItem)(line, taxRate, taxMode)
        };
    });
    const totals = (0, calc_1.computeTotals)(computedLines, taxesById, taxMode);
    const amountPaidMinor = existingAmountPaidMinor ?? 0;
    const balanceDueMinor = Math.max(0, totals.totalMinor - amountPaidMinor);
    const issue = parseTimestamp(issueDate, firestore_1.Timestamp.now());
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
const generatePublicToken = () => (0, crypto_1.randomBytes)(16).toString("hex");
const normalizeEmails = (value) => {
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
    }
    catch (error) {
        return base.replace(/\/+$/, "");
    }
};
const formatCurrency = (amountMinor, currency) => {
    const value = Number.isFinite(amountMinor) ? amountMinor / 100 : 0;
    try {
        return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(value);
    }
    catch (error) {
        return `${currency} ${value.toFixed(2)}`;
    }
};
const generateInvoicePdf = async ({ invoice, companyName }) => {
    return new Promise((resolve, reject) => {
        const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
        const chunks = [];
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
                .text(`${line.name} · Qty ${line.quantity} · ${formatCurrency(totalMinor, currency)}`, {
                continued: false
            });
            if (line.description) {
                doc.fontSize(10).fillColor("gray").text(line.description);
                doc.fillColor("black");
            }
        });
        doc.moveDown();
        const totals = invoice.totals;
        if (totals) {
            doc.fontSize(11).text(`Subtotal: ${formatCurrency(totals.subtotalMinor, currency)}`);
            doc.text(`Discounts: ${formatCurrency(totals.discountTotalMinor, currency)}`);
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
const writeAuditLog = async ({ orgId, uid, action, entityType, entityId, metadata }) => {
    const db = ensureFirestore();
    await db.collection(`orgs/${orgId}/auditLogs`).add({
        actorUid: uid,
        action,
        entityType,
        entityId,
        metadata: metadata || {},
        createdAt: firestore_1.FieldValue.serverTimestamp()
    });
};
exports.billingCreateInvoiceDraft = (0, https_1.onCall)(async (request) => {
    const uid = (0, authz_1.assertAuth)(request.auth);
    const { orgId, clientId, issueDate, dueDate, currency, lineItems, notes, terms } = request.data || {};
    if (!orgId || !clientId) {
        (0, authz_1.throwHttpsError)("invalid-argument", "orgId and clientId are required.");
    }
    await (0, authz_1.assertRole)(orgId, uid, ALLOWED_CREATE_ROLES);
    const db = ensureFirestore();
    const invoiceNumber = await (0, numbering_1.getAndIncrementInvoiceNumber)(orgId);
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
        createdAt: firestore_1.FieldValue.serverTimestamp(),
        updatedAt: firestore_1.FieldValue.serverTimestamp()
    });
    return { invoiceId: invoiceRef.id };
});
exports.billingUpdateInvoiceDraft = (0, https_1.onCall)(async (request) => {
    const uid = (0, authz_1.assertAuth)(request.auth);
    const { orgId, invoiceId, patch } = request.data || {};
    if (!orgId || !invoiceId || !patch) {
        (0, authz_1.throwHttpsError)("invalid-argument", "orgId, invoiceId, and patch are required.");
    }
    await (0, authz_1.assertRole)(orgId, uid, ALLOWED_CREATE_ROLES);
    const db = ensureFirestore();
    const invoiceRef = db.doc(`orgs/${orgId}/invoices/${invoiceId}`);
    const snapshot = await invoiceRef.get();
    if (!snapshot.exists) {
        (0, authz_1.throwHttpsError)("not-found", "Invoice not found.");
    }
    const invoice = snapshot.data();
    if (invoice.status !== "draft") {
        (0, authz_1.throwHttpsError)("failed-precondition", "Only draft invoices can be updated.");
    }
    const nextClientId = patch.clientId || invoice.clientId;
    const nextCurrency = patch.currency || invoice.currency;
    const nextLineItems = Array.isArray(patch.lineItems) ? patch.lineItems : invoice.lineItems;
    let totalsPatch = {};
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
    await invoiceRef.set({
        clientId: nextClientId,
        currency: nextCurrency,
        issueDate,
        dueDate,
        notes: patch.notes ?? invoice.notes ?? "",
        terms: patch.terms ?? invoice.terms ?? "",
        ...totalsPatch,
        updatedAt: firestore_1.FieldValue.serverTimestamp()
    }, { merge: true });
    return { success: true };
});
exports.billingGetInvoice = (0, https_1.onCall)(async (request) => {
    const uid = (0, authz_1.assertAuth)(request.auth);
    const { orgId, invoiceId } = request.data || {};
    if (!orgId || !invoiceId) {
        (0, authz_1.throwHttpsError)("invalid-argument", "orgId and invoiceId are required.");
    }
    await (0, authz_1.assertMember)(orgId, uid);
    const db = ensureFirestore();
    const invoiceRef = db.doc(`orgs/${orgId}/invoices/${invoiceId}`);
    const snapshot = await invoiceRef.get();
    if (!snapshot.exists) {
        (0, authz_1.throwHttpsError)("not-found", "Invoice not found.");
    }
    return { invoice: { id: snapshot.id, ...snapshot.data() } };
});
exports.billingSendInvoice = (0, https_1.onCall)({ secrets: [resendApiKey] }, async (request) => {
    const uid = (0, authz_1.assertAuth)(request.auth);
    const { orgId, invoiceId, toEmails, ccEmails } = request.data || {};
    if (!orgId || !invoiceId) {
        (0, authz_1.throwHttpsError)("invalid-argument", "orgId and invoiceId are required.");
    }
    await (0, authz_1.assertRole)(orgId, uid, ALLOWED_CREATE_ROLES);
    const db = ensureFirestore();
    const invoiceRef = db.doc(`orgs/${orgId}/invoices/${invoiceId}`);
    const snapshot = await invoiceRef.get();
    if (!snapshot.exists) {
        (0, authz_1.throwHttpsError)("not-found", "Invoice not found.");
    }
    const invoice = snapshot.data();
    if (invoice.status === "void" || invoice.status === "paid" || invoice.void) {
        (0, authz_1.throwHttpsError)("failed-precondition", "Cannot send a void or fully paid invoice.");
    }
    const existingToken = invoice.public?.token && invoice.public.enabled && !invoice.public.revokedAt
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
        (0, authz_1.throwHttpsError)("invalid-argument", "Recipient email is required.");
    }
    const normalizedCc = normalizeEmails(ccEmails);
    const publicUrl = `${resolvePublicBaseUrl()}/p/invoice/${token}`;
    const resendKey = resendApiKey.value();
    if (!resendKey) {
        (0, authz_1.throwHttpsError)("failed-precondition", "RESEND_API_KEY is not configured.");
    }
    const resend = new resend_1.Resend(resendKey);
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
    const publicPatch = {
        token,
        enabled: true,
        revokedAt: null
    };
    if (!existingToken || invoice.public?.revokedAt) {
        publicPatch.createdAt = firestore_1.FieldValue.serverTimestamp();
    }
    await invoiceRef.set({
        status: "sent",
        sentAt: firestore_1.FieldValue.serverTimestamp(),
        pdfPath,
        public: publicPatch,
        updatedAt: firestore_1.FieldValue.serverTimestamp()
    }, { merge: true });
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
});
