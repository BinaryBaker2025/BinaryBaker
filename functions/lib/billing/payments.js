"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleStripeWebhook = exports.createCheckoutSession = void 0;
const https_1 = require("firebase-functions/v2/https");
const authz_1 = require("./authz");
exports.createCheckoutSession = (0, https_1.onCall)((request) => {
    (0, authz_1.assertAuth)(request.auth);
    // TODO: Create a Stripe Checkout session for the invoice.
    throw new https_1.HttpsError("unimplemented", "TODO: implement createCheckoutSession.");
});
exports.handleStripeWebhook = (0, https_1.onRequest)((req, res) => {
    // TODO: Verify Stripe signature and update invoice/payment records.
    res.status(501).send("Stripe webhook not implemented.");
});
