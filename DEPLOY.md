# DadGlass — Running & Deploying

## Two ways to run locally

| Goal | Double-click | What it does |
|---|---|---|
| **Edit / develop** | `open-app.cmd` | Vite dev server with hot reload at http://127.0.0.1:5174/ |
| **Use it offline / install to phone** | `open-app-offline.cmd` | Builds the app, serves the production build, and it works offline |

### Offline / installable use (the "version until release")
1. Double-click **`open-app-offline.cmd`** (must be online for the first load).
2. The browser opens http://127.0.0.1:5174/. The app caches itself via a service worker.
3. **Install it:** on a phone, browser menu → *Add to Home Screen*; on desktop Chrome/Edge, the *install* icon in the address bar.
4. After the first load it works **offline**. The app shell (screens, logic, styles, icons) is precached, so it boots with no connection. Week comparison images are cached **as you view each week** — open a week once online and it stays available offline.

> Note: phones and desktops only run a service worker over `http://localhost`/`127.0.0.1` or **HTTPS**. The local offline build uses `127.0.0.1`, so it works. A deployed copy must be served over HTTPS.

## Deploying to the web (public release)

The app is a **static site** — no backend, no database, all data stays in the browser's `localStorage`.

1. Build: `npm run build` → outputs `dist/` (also regenerates `dist/sw.js` with a per-build cache name via `scripts/gen-sw.mjs`).
2. Upload `dist/` to any static host: **Netlify, Vercel, Cloudflare Pages, Firebase Hosting, GitHub Pages**, etc.
3. The host must serve over **HTTPS** (all the above do by default) so the service worker and "Install" work.

### ⚠️ Root path assumption
All asset/manifest/SW URLs are **root-absolute** (`/assets/...`, `/sw.js`, `/manifest.webmanifest`). This is correct for a root domain (e.g. `dadglass.app` or `*.netlify.app`).
If you host under a **sub-path** (e.g. a GitHub Pages *project* page `user.github.io/dadglass/`), those URLs would 404. To support that, add a `vite.config.ts` with `base: "/dadglass/"` and switch the hardcoded `/assets/...` paths + `manifest`/`sw.js` to use that base. Easiest path: deploy to a root domain and skip this.

## Service worker / updates
- Each `npm run build` stamps `dist/sw.js` with a cache name derived from the JS bundle hash (e.g. `dadglass-c3083dc4`).
- On the next visit the browser detects the changed worker, installs it, precaches the new shell, and **deletes the old cache** automatically — users don't get stuck on a stale build.

## What's intentionally local-only
- Notifications: a real permission prompt + test notification work today; **scheduled** reminders are delivered via **calendar (.ics) export** (Appointment Copilot, Support Reminders) since true scheduled push needs a server.
- Journal "Export as PDF" uses the browser's print dialog → *Save as PDF*.
