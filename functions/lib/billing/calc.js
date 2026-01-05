"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeTotals = exports.computeLineItem = void 0;
const roundMoney = (value) => Math.round(value);
const resolveDiscountMinor = (baseMinor, discountType, discountValue) => {
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
const computeLineItem = (line, taxRatePercent = 0, taxMode) => {
    const baseMinor = roundMoney(line.quantity * line.unitPriceMinor);
    const discountMinor = Math.min(baseMinor, Math.max(0, resolveDiscountMinor(baseMinor, line.discountType, line.discountValue)));
    const netMinor = Math.max(0, baseMinor - discountMinor);
    const safeRate = Math.max(0, Number(taxRatePercent) || 0);
    let taxMinor = 0;
    if (safeRate > 0 && netMinor > 0) {
        if (taxMode === "inclusive") {
            taxMinor = roundMoney((netMinor * safeRate) / (100 + safeRate));
        }
        else {
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
exports.computeLineItem = computeLineItem;
const resolveTaxRate = (taxesById, taxId) => {
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
const computeTotals = (lines, taxesById = {}, taxMode) => {
    let subtotalMinor = 0;
    let discountTotalMinor = 0;
    let taxTotalMinor = 0;
    let totalMinor = 0;
    lines.forEach((line) => {
        const taxRate = resolveTaxRate(taxesById, line.taxId);
        const computed = (0, exports.computeLineItem)(line, taxRate, taxMode);
        const lineSubtotal = taxMode === "inclusive" ? computed.netMinor - computed.taxMinor : computed.netMinor;
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
exports.computeTotals = computeTotals;
