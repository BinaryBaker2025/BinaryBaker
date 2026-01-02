import type { Timestamp } from "firebase-admin/firestore";

export type BillingRole = "owner" | "admin" | "finance" | "sales" | "viewer";
export type InvoiceStatus =
  | "draft"
  | "sent"
  | "viewed"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "void";

export type Address = {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export type OrgMembership = {
  id: string;
  orgId: string;
  uid: string;
  email: string;
  displayName?: string;
  role: BillingRole;
  status: "active" | "invited" | "disabled";
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type LineItem = {
  itemId?: string | null;
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
};

export type InvoiceTotals = {
  subtotalMinor: number;
  discountTotalMinor: number;
  taxTotalMinor: number;
  totalMinor: number;
};

export type ClientSnapshot = {
  name: string;
  email?: string;
  taxNumber?: string;
  billingAddress?: Address;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  clientId: string;
  clientSnapshot: ClientSnapshot;
  currency: string;
  issueDate: Timestamp;
  dueDate: Timestamp | null;
  lineItems: LineItem[];
  totals: InvoiceTotals;
  amountPaidMinor: number;
  balanceDueMinor: number;
  notes?: string;
  terms?: string;
  sentAt?: Timestamp | null;
  viewedAt?: Timestamp | null;
  void?: {
    voidedAt: Timestamp;
    reason?: string;
  };
  pdfPath?: string | null;
  public?: {
    token?: string;
    tokenId?: string | null;
    enabled: boolean;
    createdAt?: Timestamp;
    revokedAt?: Timestamp | null;
  };
  reminderHistory?: Array<{ ruleKey: string; sentAt: Timestamp }>;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  projectId?: string;
};

export type InvoiceDraftInput = {
  orgId: string;
  clientId: string;
  status?: InvoiceStatus;
  currency?: string;
  lineItems?: LineItem[];
  dueDate?: Timestamp | null;
  notes?: string;
  projectId?: string;
};

export type InvoiceResponse = {
  invoiceId: string;
  number?: string;
};

// TODO: Add payment intents, tax profiles, and client models.
