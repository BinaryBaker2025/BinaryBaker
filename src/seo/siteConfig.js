const runtimeSiteUrl =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SITE_URL) ||
  (typeof process !== "undefined" && process.env && process.env.VITE_SITE_URL) ||
  "https://binarybaker.co.za";

export const SITE_URL = runtimeSiteUrl.replace(/\/+$/, "");
export const BRAND_NAME = "Binary Baker";
export const DEFAULT_CITY = "Gauteng";

export const ANALYTICS_PLACEHOLDERS = {
  ga4MeasurementId: "",
  gtmId: "",
  trackedEvents: ["contact_form_submit", "quote_request", "phone_click", "whatsapp_click"]
};

export function toAbsoluteUrl(pathOrUrl = "/") {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}

