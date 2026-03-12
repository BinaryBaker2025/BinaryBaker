import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seoRoutes } from "../src/seo/routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");

function getRequiredString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }
      return fullPath;
    })
  );
  return files.flat();
}

function validateRouteConfig() {
  const errors = [];
  const pathSet = new Set();
  const slugSet = new Set();

  for (const route of seoRoutes) {
    if (!getRequiredString(route.id)) {
      errors.push("Route has missing id.");
    }

    if (!getRequiredString(route.routePath)) {
      errors.push(`Route ${route.id} has missing routePath.`);
    }

    if (pathSet.has(route.routePath)) {
      errors.push(`Duplicate routePath found: ${route.routePath}`);
    }
    pathSet.add(route.routePath);

    if (route.slug && slugSet.has(route.slug)) {
      errors.push(`Duplicate slug found: ${route.slug}`);
    }
    if (route.slug) {
      slugSet.add(route.slug);
    }

    if (route.indexable) {
      if (!getRequiredString(route.pageName)) {
        errors.push(`Indexable route ${route.id} is missing pageName.`);
      }
      if (!getRequiredString(route.routePath) || !route.routePath.startsWith("/")) {
        errors.push(`Indexable route ${route.id} must have a root-relative routePath.`);
      }
      if (!getRequiredString(route.metaDescription) && !(route.quickSummary || []).length) {
        errors.push(`Indexable route ${route.id} needs metaDescription or quickSummary.`);
      }
      if (!getRequiredString(route.ogImage)) {
        errors.push(`Indexable route ${route.id} must define ogImage.`);
      }
      if (!getRequiredString(route.schemaType)) {
        errors.push(`Indexable route ${route.id} must define schemaType.`);
      }
    }
  }

  return errors;
}

function findImageTagIssues(fileContent, filePath) {
  const issues = [];
  const imgMatches = fileContent.match(/<img[\s\S]*?>/g) || [];

  imgMatches.forEach((tag) => {
    const hasAlt = /alt\s*=/.test(tag);
    if (!hasAlt) {
      issues.push(`${filePath}: <img> is missing alt attribute.`);
      return;
    }

    const literalAlt = tag.match(/alt\s*=\s*"([^"]*)"/);
    if (literalAlt && literalAlt[1].trim().length === 0) {
      issues.push(`${filePath}: <img> has empty alt text.`);
    }
  });

  return issues;
}

async function validateImageAltText() {
  const errors = [];
  const files = await walk(srcDir);
  const jsxFiles = files.filter((file) => /\.(jsx|tsx)$/.test(file));

  for (const filePath of jsxFiles) {
    const content = await fs.readFile(filePath, "utf8");
    errors.push(...findImageTagIssues(content, path.relative(rootDir, filePath)));
  }

  return errors;
}

async function main() {
  const configErrors = validateRouteConfig();
  const imgErrors = await validateImageAltText();
  const allErrors = [...configErrors, ...imgErrors];

  if (allErrors.length > 0) {
    console.error("SEO validation failed:");
    allErrors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log("SEO validation passed.");
}

main().catch((error) => {
  console.error("SEO validation failed with runtime error:", error);
  process.exit(1);
});

