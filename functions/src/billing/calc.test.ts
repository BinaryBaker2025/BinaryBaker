import { computeLineItem, computeTotals } from "./calc";

const baseLine = {
  name: "Design work",
  quantity: 1,
  unitPriceMinor: 10000
};

describe("billing calculations", () => {
  test("exclusive vs inclusive tax", () => {
    const lines = [{ ...baseLine, taxId: "vat" }];
    const taxesById = { vat: { ratePercent: 15 } };

    const exclusive = computeTotals(lines, taxesById, "exclusive");
    expect(exclusive).toEqual({
      subtotalMinor: 10000,
      discountTotalMinor: 0,
      taxTotalMinor: 1500,
      totalMinor: 11500
    });

    const inclusive = computeTotals(lines, taxesById, "inclusive");
    expect(inclusive).toEqual({
      subtotalMinor: 8696,
      discountTotalMinor: 0,
      taxTotalMinor: 1304,
      totalMinor: 10000
    });
  });

  test("percent vs amount discount", () => {
    const percentDiscount = computeLineItem(
      { ...baseLine, discountType: "percent", discountValue: 10 },
      0,
      "exclusive"
    );
    expect(percentDiscount.discountMinor).toBe(1000);
    expect(percentDiscount.totalMinor).toBe(9000);

    const amountDiscount = computeLineItem(
      { ...baseLine, discountType: "amount", discountValue: 2500 },
      0,
      "exclusive"
    );
    expect(amountDiscount.discountMinor).toBe(2500);
    expect(amountDiscount.totalMinor).toBe(7500);
  });

  test("rounding edge case", () => {
    const line = {
      name: "Edge",
      quantity: 1.5,
      unitPriceMinor: 999
    };
    const computed = computeLineItem(line, 0, "exclusive");
    expect(computed.baseMinor).toBe(1499);
    expect(computed.totalMinor).toBe(1499);
  });
});
