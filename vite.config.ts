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

/**
 * Deploy base path.
 *  • "/"           — native Capacitor builds and any root-hosted site (default)
 *  • "/dadglass/"  — a GitHub Pages *project* page (set APP_BASE in CI)
 * Everything that builds a URL at runtime goes through src/app/utils/assetUrl.ts,
 * and the manifest/index.html use relative URLs, so both work unchanged.
 */
const base = process.env.APP_BASE || "/";

/**
 * The version shown in Profile → About. It used to be a hardcoded "v2.0" that
 * had drifted away from the released build, which made it impossible to tell
 * from inside the app which version a phone was actually running. It now comes
 * from package.json, and `npm run audit` fails if that disagrees with the
 * versionName in android/app/build.gradle.
 */
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, "package.json"), "utf8"));

export default defineConfig({
  base,
  define: { __APP_VERSION__: JSON.stringify(pkg.version) },
  // Always start from a clean dist: leftover hashed bundles from earlier builds
  // would otherwise pile up and could be picked up by tooling.
  build: { emptyOutDir: true },
  plugins: [react()],
  resolve: {
    alias: { "@content": contentDir },
  },
});
