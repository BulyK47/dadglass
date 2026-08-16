/* Build for GitHub Pages.
 *
 *   npm run build:pages                 -> base "/dadglass/"
 *   APP_BASE=/other/ npm run build:pages
 *
 * A GitHub Pages *project* page is served from https://<user>.github.io/<repo>/,
 * so the app must be built with that sub-path as its base. The normal
 * `npm run build` keeps base "/" because the native Capacitor apps load the
 * bundle from the device root.
 *
 * Cross-platform on purpose: setting an env var inline (`APP_BASE=… npm run …`)
 * does not work in cmd.exe/PowerShell, so we set it here and spawn the build.
 */
import { spawnSync } from "child_process";

const base = process.env.APP_BASE || "/dadglass/";
const normalised = (base.startsWith("/") ? base : "/" + base).replace(/\/*$/, "/");

console.log(`Building for GitHub Pages with base "${normalised}"`);

const res = spawnSync("npm", ["run", "build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, APP_BASE: normalised },
});

process.exit(res.status ?? 1);
