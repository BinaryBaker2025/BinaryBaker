import type { LineItem } from "./types";

export const calcSubtotalMinor = (items: LineItem[]): number => {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPriceMinor, 0);
};

export const calcTaxMinor = (subtotalMinor: number, taxRatePercent = 0): number => {
  return Math.round(subtotalMinor * (taxRatePercent / 100));
};

export const calcTotalMinor = (items: LineItem[], taxRatePercent = 0): number => {
  const subtotalMinor = calcSubtotalMinor(items);
  const taxMinor = calcTaxMinor(subtotalMinor, taxRatePercent);
  return subtotalMinor + taxMinor;
};

// TODO: Add currency-aware rounding and discount helpers.
