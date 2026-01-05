import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import type { Firestore } from "firebase-admin/firestore";

export type InvoiceNumberReservation = {
  sequence: number;
  number: string;
};

const DEFAULT_PAD_LENGTH = 4;
const DEFAULT_INVOICE_PREFIX = "INV-";
const DEFAULT_ESTIMATE_PREFIX = "EST-";
const DEFAULT_CREDIT_PREFIX = "CR-";

const ensureFirestore = (db?: Firestore): Firestore => {
  if (db) {
    return db;
  }
  if (!getApps().length) {
    initializeApp();
  }
  return getFirestore();
};

const normalizePrefix = (value: unknown, fallback: string) => {
  const prefix = typeof value === "string" ? value.trim() : "";
  return prefix || fallback;
};

const normalizeSequence = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }
  return 1;
};

const formatNumber = (sequence: number, prefix: string, padLength = DEFAULT_PAD_LENGTH) => {
  return `${prefix}${String(sequence).padStart(padLength, "0")}`;
};

export const formatInvoiceNumber = (
  sequence: number,
  prefix = DEFAULT_INVOICE_PREFIX
): string => {
  return formatNumber(sequence, prefix);
};

const getAndIncrementNumber = async ({
  db,
  orgId,
  prefixField,
  nextField,
  defaultPrefix
}: {
  db?: Firestore;
  orgId: string;
  prefixField: string;
  nextField: string;
  defaultPrefix: string;
}): Promise<InvoiceNumberReservation> => {
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

    transaction.set(
      settingsRef,
      {
        [prefixField]: prefix,
        [nextField]: sequence + 1
      },
      { merge: true }
    );

    return { sequence, number };
  });
};

export const reserveInvoiceNumber = async (
  db: Firestore,
  orgId: string,
  prefix = DEFAULT_INVOICE_PREFIX
): Promise<InvoiceNumberReservation> => {
  return getAndIncrementNumber({
    db,
    orgId,
    prefixField: "invoicePrefix",
    nextField: "nextInvoiceNumber",
    defaultPrefix: prefix
  });
};

export const getAndIncrementInvoiceNumber = async (orgId: string): Promise<string> => {
  const { number } = await getAndIncrementNumber({
    orgId,
    prefixField: "invoicePrefix",
    nextField: "nextInvoiceNumber",
    defaultPrefix: DEFAULT_INVOICE_PREFIX
  });
  return number;
};

export const getAndIncrementEstimateNumber = async (orgId: string): Promise<string> => {
  const { number } = await getAndIncrementNumber({
    orgId,
    prefixField: "estimatePrefix",
    nextField: "nextEstimateNumber",
    defaultPrefix: DEFAULT_ESTIMATE_PREFIX
  });
  return number;
};

export const getAndIncrementCreditNumber = async (orgId: string): Promise<string> => {
  const { number } = await getAndIncrementNumber({
    orgId,
    prefixField: "creditPrefix",
    nextField: "nextCreditNumber",
    defaultPrefix: DEFAULT_CREDIT_PREFIX
  });
  return number;
};

// Example usage:
// const invoiceNumber = await getAndIncrementInvoiceNumber(orgId);
// const estimateNumber = await getAndIncrementEstimateNumber(orgId);
// const creditNumber = await getAndIncrementCreditNumber(orgId);
