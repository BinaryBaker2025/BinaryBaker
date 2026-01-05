import type { Timestamp } from "firebase/firestore";

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

export type BillingClient = {
  id: string;
  name: string;
  companyName?: string;
  contactName?: string;
  emails: string[];
  phone?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  taxNumber?: string;
  currencyOverride?: string;
  paymentTermsDaysOverride?: number;
  status: "active" | "inactive";
  notes?: string;
  tags?: string[];
  outstandingBalanceMinor?: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type BillingItem = {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  unitPriceMinor: number;
  unitType?: string;
  defaultTaxId?: string | null;
  isActive: boolean;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

export type InvoiceLineItem = {
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
  clientName?: string;
  clientSnapshot: ClientSnapshot;
  currency: string;
  issueDate: Timestamp;
  dueDate: Timestamp | null;
  lineItems: InvoiceLineItem[];
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
  lineItems?: InvoiceLineItem[];
  dueDate?: Timestamp | null;
  notes?: string;
  projectId?: string;
};

// TODO: Add payment, tax, and discount models as the billing system evolves.
