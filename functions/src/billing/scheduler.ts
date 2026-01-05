import { onSchedule } from "firebase-functions/v2/scheduler";

export const nightlyInvoiceSweep = onSchedule("every day 02:00", async () => {
  // TODO: Recalculate overdue invoices, send reminders, and sync payments.
});
