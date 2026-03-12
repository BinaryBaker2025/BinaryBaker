import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { indexableSeoRoutes } from "../src/seo/routes.js";
import { SITE_URL } from "../src/seo/siteConfig.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputPath = path.join(rootDir, "public", "sitemap.xml");
const today = new Date().toISOString().slice(0, 10);

function toAbsolute(pathname) {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${clean}`;
}

function buildXml() {
  const urls = indexableSeoRoutes
    .map((route) => route.canonicalPath || route.routePath)
    .map((pathname) => ({
      loc: toAbsolute(pathname),
      lastmod: today,
      changefreq: pathname === "/" ? "weekly" : "monthly",
      priority: pathname === "/" ? "1.0" : "0.8"
    }));

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
}

async function main() {
  const xml = buildXml();
  await fs.writeFile(outputPath, xml, "utf8");
  console.log(`Generated sitemap with ${indexableSeoRoutes.length} routes at ${outputPath}`);
}

main().catch((error) => {
  console.error("Failed to generate sitemap:", error);
  process.exit(1);
});

