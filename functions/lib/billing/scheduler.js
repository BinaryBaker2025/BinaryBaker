"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nightlyInvoiceSweep = void 0;
const scheduler_1 = require("firebase-functions/v2/scheduler");
exports.nightlyInvoiceSweep = (0, scheduler_1.onSchedule)("every day 02:00", async () => {
    // TODO: Recalculate overdue invoices, send reminders, and sync payments.
});
