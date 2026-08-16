import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

/**
 * The app is split into an open-source "mechanism" (src/app — components, hooks,
 * types, getters) and a proprietary "content" layer (the weekly guide text, the
 * Romanian translations and the illustrations).
 *
 * `@content` resolves to src/content when the real content is present (the
 * maintainers' build), and otherwise falls back to src/content.sample — a small
 * placeholder set that ships with the public repository so that anyone can clone,
 * `npm install`, and run a working app.
 *
 * See CONTENT_LICENSE.md.
 */
const realContent = path.resolve(__dirname, "src/content");
const sampleContent = path.resolve(__dirname, "src/content.sample");
const contentDir = fs.existsSync(path.join(realContent, "weeks.ts")) ? realContent : sampleContent;

if (contentDir === sampleContent) {
  console.log("\n[content] Using PLACEHOLDER content from src/content.sample\n");
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@content": contentDir },
  },
});
