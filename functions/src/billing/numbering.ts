import type { Firestore } from "firebase-admin/firestore";

export type InvoiceNumberReservation = {
  sequence: number;
  number: string;
};

export const formatInvoiceNumber = (sequence: number, prefix = "INV"): string => {
  return `${prefix}-${String(sequence).padStart(5, "0")}`;
};

export const reserveInvoiceNumber = async (
  _db: Firestore,
  _orgId: string,
  prefix = "INV"
): Promise<InvoiceNumberReservation> => {
  // TODO: Use a Firestore transaction to increment a counter per org.
  const sequence = 1;
  return { sequence, number: formatInvoiceNumber(sequence, prefix) };
};
