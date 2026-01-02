import { HttpsError, onCall, onRequest } from "firebase-functions/v2/https";
import { assertAuth } from "./authz";

export const createPublicInvoiceLink = onCall<
  { invoiceId: string },
  { publicId: string }
>(async (request) => {
  assertAuth(request.auth);
  // TODO: Generate a public link token and persist it.
  throw new HttpsError("unimplemented", "TODO: implement createPublicInvoiceLink.");
});

export const servePublicInvoice = onRequest((req, res) => {
  // TODO: Validate public token and render invoice payload.
  res.status(501).send("Public invoice endpoint not implemented.");
});
