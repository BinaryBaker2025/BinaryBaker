import type { LineItem } from "./types";

export type TaxMode = "exclusive" | "inclusive";
export type TaxRate = { ratePercent: number } | number;
export type TaxesById = Record<string, TaxRate>;

const roundMoney = (value: number): number => Math.round(value);

const resolveDiscountMinor = (
  baseMinor: number,
  discountType?: "percent" | "amount",
  discountValue?: number
): number => {
  if (!discountType || discountValue == null) {
    return 0;
  }

  if (discountType === "percent") {
    const percent = Number(discountValue);
    if (!Number.isFinite(percent)) {
      return 0;
    }
    return roundMoney((baseMinor * Math.max(0, percent)) / 100);
  }

  if (discountType === "amount") {
    const amount = Number(discountValue);
    if (!Number.isFinite(amount)) {
      return 0;
    }
    return roundMoney(amount);
  }

  return 0;
};

export const computeLineItem = (
  line: LineItem,
  taxRatePercent = 0,
  taxMode: TaxMode
) => {
  const baseMinor = roundMoney(line.quantity * line.unitPriceMinor);
  const discountMinor = Math.min(
    baseMinor,
    Math.max(0, resolveDiscountMinor(baseMinor, line.discountType, line.discountValue))
  );
  const netMinor = Math.max(0, baseMinor - discountMinor);

  const safeRate = Math.max(0, Number(taxRatePercent) || 0);
  let taxMinor = 0;

  if (safeRate > 0 && netMinor > 0) {
    if (taxMode === "inclusive") {
      taxMinor = roundMoney((netMinor * safeRate) / (100 + safeRate));
    } else {
      taxMinor = roundMoney((netMinor * safeRate) / 100);
    }
  }

  const totalMinor = taxMode === "inclusive" ? netMinor : netMinor + taxMinor;

  return {
    baseMinor,
    discountMinor,
    netMinor,
    taxMinor,
    totalMinor
  };
};

const resolveTaxRate = (taxesById: TaxesById, taxId?: string | null): number => {
  if (!taxId) {
    return 0;
  }
  const entry = taxesById[taxId];
  if (entry == null) {
    return 0;
  }
  if (typeof entry === "number") {
    return entry;
  }
  if (typeof entry.ratePercent === "number") {
    return entry.ratePercent;
  }
  return 0;
};

export const computeTotals = (
  lines: LineItem[],
  taxesById: TaxesById = {},
  taxMode: TaxMode
) => {
  let subtotalMinor = 0;
  let discountTotalMinor = 0;
  let taxTotalMinor = 0;
  let totalMinor = 0;

  lines.forEach((line) => {
    const taxRate = resolveTaxRate(taxesById, line.taxId);
    const computed = computeLineItem(line, taxRate, taxMode);
    const lineSubtotal =
      taxMode === "inclusive" ? computed.netMinor - computed.taxMinor : computed.netMinor;

    subtotalMinor += lineSubtotal;
    discountTotalMinor += computed.discountMinor;
    taxTotalMinor += computed.taxMinor;
    totalMinor += computed.totalMinor;
  });

  return {
    subtotalMinor,
    discountTotalMinor,
    taxTotalMinor,
    totalMinor
  };
};
