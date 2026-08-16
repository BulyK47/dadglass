/* Post-build: generate dist/sw.js with a per-build cache name and a precache
 * list that includes the hashed JS/CSS bundle AND all week images, so each
 * deploy updates cleanly and the app works fully offline on first load.
 *
 * The week images are small WebP (~2.4MB total) since scripts/optimize-images.mjs,
 * so precaching all of them is cheap and gives complete offline coverage.
 */
import fs from "fs";
import path from "path";

const dist = path.resolve("dist");
const assetsDir = path.join(dist, "assets");

if (!fs.existsSync(assetsDir)) {
  console.error("[gen-sw] dist/assets not found — run `vite build` first.");
  process.exit(1);
}

const assetFiles = fs.readdirSync(assetsDir);
const js = assetFiles.find((f) => /^index-.*\.js$/.test(f));
const css = assetFiles.find((f) => /^index-.*\.css$/.test(f));

// Derive a stable per-build version from the hashed JS filename.
const hashMatch = js && js.match(/index-([^.]+)\.js$/);
const version = hashMatch ? hashMatch[1] : String(Date.now());

const core = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
];
if (js) core.push(`/assets/${js}`);
if (css) core.push(`/assets/${css}`);

// Precache the (now-small) week images so a fresh install works fully offline.
for (const sub of ["baby", "glasses", "dad-objects"]) {
  const d = path.join(assetsDir, sub);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d)) {
    if (f.toLowerCase().endsWith(".webp")) core.push(`/assets/${sub}/${f}`);
  }
}

const sw = `/* DadGlass service worker — generated at build time by scripts/gen-sw.mjs.
   Do not edit dist/sw.js by hand; edit the generator instead. */
const CACHE = "dadglass-${version}";
const CORE = ${JSON.stringify(core, null, 2)};

self.addEventListener("install", (event) => {
  self.skipWaiting();
  // Add each asset individually so one bad URL can't drop the whole app shell.
  event.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(CORE.map((u) => c.add(u)))));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function cacheable(res) {
  return res && res.status === 200 && res.type === "basic";
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // App navigations: network-first, fall back to the cached shell when offline.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (cacheable(res)) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/index.html"))),
    );
    return;
  }

  // Static assets (JS/CSS/images): cache-first, then network (and cache it).
  event.respondWith(
    caches.match(req).then(
      (cached) =>
        cached ||
        fetch(req)
          .then((res) => {
            if (cacheable(res)) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => cached),
    ),
  );
});
`;

fs.writeFileSync(path.join(dist, "sw.js"), sw);
console.log(`[gen-sw] wrote dist/sw.js  cache=dadglass-${version}  precache=${core.length} files`);
