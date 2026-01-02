import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";
import { assertAuth } from "./authz";

export const createCheckoutSession = onCall<
  { invoiceId: string },
  { sessionId: string }
>(async (request) => {
  assertAuth(request.auth);
  // TODO: Create a Stripe Checkout session for the invoice.
  throw new HttpsError("unimplemented", "TODO: implement createCheckoutSession.");
});

export const handleStripeWebhook = onRequest((req, res) => {
  // TODO: Verify Stripe signature and update invoice/payment records.
  res.status(501).send("Stripe webhook not implemented.");
});
