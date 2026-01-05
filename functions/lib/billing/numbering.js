"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAndIncrementCreditNumber = exports.getAndIncrementEstimateNumber = exports.getAndIncrementInvoiceNumber = exports.reserveInvoiceNumber = exports.formatInvoiceNumber = void 0;
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const DEFAULT_PAD_LENGTH = 4;
const DEFAULT_INVOICE_PREFIX = "INV-";
const DEFAULT_ESTIMATE_PREFIX = "EST-";
const DEFAULT_CREDIT_PREFIX = "CR-";
const ensureFirestore = (db) => {
    if (db) {
        return db;
    }
    if (!(0, app_1.getApps)().length) {
        (0, app_1.initializeApp)();
    }
    return (0, firestore_1.getFirestore)();
};
const normalizePrefix = (value, fallback) => {
    const prefix = typeof value === "string" ? value.trim() : "";
    return prefix || fallback;
};
const normalizeSequence = (value) => {
    if (typeof value === "number" && Number.isFinite(value) && value > 0) {
        return Math.floor(value);
    }
    return 1;
};
const formatNumber = (sequence, prefix, padLength = DEFAULT_PAD_LENGTH) => {
    return `${prefix}${String(sequence).padStart(padLength, "0")}`;
};
const formatInvoiceNumber = (sequence, prefix = DEFAULT_INVOICE_PREFIX) => {
    return formatNumber(sequence, prefix);
};
exports.formatInvoiceNumber = formatInvoiceNumber;
const getAndIncrementNumber = async ({ db, orgId, prefixField, nextField, defaultPrefix }) => {
    if (!orgId) {
        throw new Error("orgId is required to increment invoice numbers.");
    }
    const firestore = ensureFirestore(db);
    const settingsRef = firestore.doc(`orgs/${orgId}/settings/main`);
    return firestore.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(settingsRef);
        const data = snapshot.exists ? snapshot.data() : {};
        const prefix = normalizePrefix(data?.[prefixField], defaultPrefix);
        const sequence = normalizeSequence(data?.[nextField]);
        const number = formatNumber(sequence, prefix);
        transaction.set(settingsRef, {
            [prefixField]: prefix,
            [nextField]: sequence + 1
        }, { merge: true });
        return { sequence, number };
    });
};
const reserveInvoiceNumber = async (db, orgId, prefix = DEFAULT_INVOICE_PREFIX) => {
    return getAndIncrementNumber({
        db,
        orgId,
        prefixField: "invoicePrefix",
        nextField: "nextInvoiceNumber",
        defaultPrefix: prefix
    });
};
exports.reserveInvoiceNumber = reserveInvoiceNumber;
const getAndIncrementInvoiceNumber = async (orgId) => {
    const { number } = await getAndIncrementNumber({
        orgId,
        prefixField: "invoicePrefix",
        nextField: "nextInvoiceNumber",
        defaultPrefix: DEFAULT_INVOICE_PREFIX
    });
    return number;
};
exports.getAndIncrementInvoiceNumber = getAndIncrementInvoiceNumber;
const getAndIncrementEstimateNumber = async (orgId) => {
    const { number } = await getAndIncrementNumber({
        orgId,
        prefixField: "estimatePrefix",
        nextField: "nextEstimateNumber",
        defaultPrefix: DEFAULT_ESTIMATE_PREFIX
    });
    return number;
};
exports.getAndIncrementEstimateNumber = getAndIncrementEstimateNumber;
const getAndIncrementCreditNumber = async (orgId) => {
    const { number } = await getAndIncrementNumber({
        orgId,
        prefixField: "creditPrefix",
        nextField: "nextCreditNumber",
        defaultPrefix: DEFAULT_CREDIT_PREFIX
    });
    return number;
};
exports.getAndIncrementCreditNumber = getAndIncrementCreditNumber;
// Example usage:
// const invoiceNumber = await getAndIncrementInvoiceNumber(orgId);
// const estimateNumber = await getAndIncrementEstimateNumber(orgId);
// const creditNumber = await getAndIncrementCreditNumber(orgId);
