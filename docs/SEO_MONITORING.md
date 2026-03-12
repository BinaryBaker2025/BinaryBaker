# SEO Monitoring & Analytics Placeholders

## Canonical Domain

- Preferred canonical host: `https://binarybaker.co.za`
- Manual infrastructure task after deploy:
  - Configure `www.binarybaker.co.za` to permanently redirect to `https://binarybaker.co.za`
  - Confirm TLS is active for both hostnames

## Search Engine Setup Checklist

1. Add domain property in Google Search Console.
2. Verify ownership with DNS.
3. Submit sitemap: `https://binarybaker.co.za/sitemap.xml`.
4. Inspect important URLs and request indexing.
5. Add site to Bing Webmaster Tools.

## Analytics Deferred (Current Release)

This release intentionally does **not** inject GA4 or GTM scripts yet.

When tracking is enabled, configure:

- `GA4_MEASUREMENT_ID`
- `GTM_ID` (optional)

Planned conversion events:

- `contact_form_submit`
- `quote_request`
- `phone_click`
- `whatsapp_click`

