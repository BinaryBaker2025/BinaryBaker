import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { prerenderRoutes } from "./src/seo/routes.js";

const require = createRequire(import.meta.url);
const vitePrerender = require("vite-plugin-prerender");
const Renderer = vitePrerender.PuppeteerRenderer;

const browserCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
].filter(Boolean);

const executablePath = browserCandidates.find((candidate) => fs.existsSync(candidate));

export default defineConfig({
  plugins: [
    react(),
    vitePrerender({
      staticDir: path.resolve("dist"),
      routes: prerenderRoutes,
      renderer: new Renderer({
        maxConcurrentRoutes: 2,
        renderAfterTime: 1500,
        ...(executablePath ? { executablePath } : {})
      })
    })
  ]
});
