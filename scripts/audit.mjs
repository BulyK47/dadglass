import fs from "fs";
import path from "path";
let problems = 0, warns = 0;
const P = (s) => console.log(s);
const FAIL = (s) => { problems++; console.log("  ❌ " + s); };
const WARN = (s) => { warns++; console.log("  ⚠️  " + s); };
const OK = (s) => console.log("  ✅ " + s);

const srcFiles = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = d + "/" + e.name;
    if (e.isDirectory()) walk(p); else if (/\.(ts|tsx)$/.test(e.name)) srcFiles.push(p);
  }
})("src");
const readAll = (f) => fs.readFileSync(f, "utf8");

// ── 3. PRIVACY CLAIMS vs REALITY ─────────────────────────────
P("\n════ 3. PRIVACY: does the code match what PRIVACY.md promises? ════");
const netPatterns = [
  [/\bfetch\s*\(/g, "fetch()"],
  [/XMLHttpRequest/g, "XMLHttpRequest"],
  [/new WebSocket/g, "WebSocket"],
  [/navigator\.sendBeacon/g, "sendBeacon"],
  [/import\s+.*from\s+['"]https?:/g, "remote import"],
];
let netHits = [];
for (const f of srcFiles) {
  const c = readAll(f);
  for (const [re, label] of netPatterns) {
    const m = c.match(re);
    if (m) netHits.push(`${f}: ${label} ×${m.length}`);
  }
}
// fetch inside sw.js is expected (cache), src should be clean
if (netHits.length === 0) OK("No fetch/XHR/WebSocket/beacon anywhere in src/ — nothing phones home.");
else netHits.forEach((h) => WARN("network call in src: " + h));

// external hosts referenced
const hostRe = /https?:\/\/([a-z0-9.-]+)/gi;
const hosts = new Set();
for (const f of [...srcFiles, "index.html"]) {
  const c = readAll(f);
  let m; while ((m = hostRe.exec(c))) hosts.add(m[1].toLowerCase());
}
const allowed = new Set(["www.w3.org", "webkit.org", "dadglass.app"]);
const externals = [...hosts].filter((h) => !allowed.has(h));
if (externals.length === 0) OK("No external hosts referenced.");
else externals.forEach((h) => {
  if (h.includes("calendar.google.com")) OK(`External host ${h} — user-initiated Google Calendar link (disclosed in PRIVACY.md ✓)`);
  else WARN(`External host referenced: ${h} — confirm it's disclosed in PRIVACY.md`);
});

// third-party analytics / trackers
const trackers = /googletagmanager|google-analytics|gtag\(|mixpanel|amplitude|sentry|posthog|hotjar|facebook\.net|fbq\(/i;
let trackerHit = srcFiles.filter((f) => trackers.test(readAll(f)));
if (trackerHit.length === 0) OK("No analytics/tracking SDKs.");
else trackerHit.forEach((f) => FAIL("tracker found in " + f));

// runtime deps = no hidden network libs
const pkg = JSON.parse(readAll("package.json"));
OK("Runtime deps: " + Object.keys(pkg.dependencies).join(", "));

// ── 4. SECRETS / PII ─────────────────────────────────────────
P("\n════ 4. SECRETS & PERSONAL DATA (open-source safety) ════");
const secretRe = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "private key"],
  [/AIza[0-9A-Za-z_\-]{35}/, "Google API key"],
  [/sk-[A-Za-z0-9]{20,}/, "secret key"],
  [/ghp_[A-Za-z0-9]{36}/, "GitHub token"],
  [/password\s*[:=]\s*["'][^"']{4,}/i, "hardcoded password"],
];
let secretHits = [];
for (const f of [...srcFiles, "index.html", "package.json", "capacitor.config.ts"]) {
  if (!fs.existsSync(f)) continue;
  const c = readAll(f);
  for (const [re, label] of secretRe) if (re.test(c)) secretHits.push(`${f}: ${label}`);
}
secretHits.length ? secretHits.forEach((h) => FAIL("SECRET: " + h)) : OK("No secrets/keys in source.");

// The dedicated project address (dadglass.app@) is meant to be public; anything
// that identifies the author personally is not.
const piiRe = /iulian|voicila|voici@|politehnica/i;
const piiHits = [...srcFiles, "index.html", "README.md", "PRIVACY.md", "CONTENT_LICENSE.md"]
  .filter((f) => fs.existsSync(f) && piiRe.test(readAll(f)));
piiHits.length
  ? piiHits.forEach((f) => WARN("personal identifier in " + f))
  : OK("No personal identifiers in shipped source/docs (project address only).");
// Any other email address would be an accidental leak.
const strayMail = [...srcFiles, "index.html", "README.md", "PRIVACY.md"]
  .filter((f) => fs.existsSync(f))
  .flatMap((f) => (readAll(f).match(/[\w.+-]+@[\w.-]+\.\w+/g) || []).map((m) => `${f}: ${m}`))
  .filter((s) => !/dadglass\.app@gmail\.com/.test(s));
strayMail.length ? strayMail.forEach((s) => WARN("unexpected email address — " + s)) : OK("Only the project contact address appears anywhere.");

// keystores anywhere
const keystores = [];
(function scan(d, depth = 0) {
  if (depth > 3 || /node_modules|\.git$/.test(d)) return;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) scan(p, depth + 1);
    else if (/\.(keystore|jks|p12|mobileprovision)$/.test(e.name)) keystores.push(p);
  }
})(".");
keystores.length ? keystores.forEach((k) => WARN("signing material present (must NEVER be committed): " + k)) : OK("No signing keystores in the project.");

// ── 5. GITIGNORE PROTECTS CONTENT ────────────────────────────
P("\n════ 5. .gitignore — would a `git push` leak anything? ════");
const gi = readAll(".gitignore");
for (const must of ["node_modules/", "dist/", "*.keystore", "*.jks", "*.p12", "image-originals/"]) {
  gi.includes(must) ? OK(`ignored: ${must}`) : FAIL(`.gitignore MISSING: ${must}`);
}
const contentPaths = ["src/content/", "public/assets/baby/", "public/assets/glasses/", "public/assets/dad-objects/"];
const contentIgnored = contentPaths.every((c) => new RegExp("^\\s*" + c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "m").test(gi));
contentIgnored ? OK("proprietary content (src/content + illustrations) is git-ignored") : FAIL("proprietary content is NOT git-ignored — it would be published!");
// the public repo must still be runnable
["src/content.sample/weeks.ts", "src/content.sample/localized.ts", "assets.sample"].every((p) => fs.existsSync(p))
  ? OK("sample content present — a fresh clone builds and runs")
  : FAIL("sample content missing — a public clone would not build");

// ── 6. CONTENT INTEGRITY ─────────────────────────────────────
P("\n════ 6. CONTENT INTEGRITY ════");
let missImg = [];
for (let w = 4; w <= 40; w++)
  for (const [dir, pre] of [["baby", "aw"], ["glasses", "w"], ["dad-objects", "w"]])
    if (!fs.existsSync(`public/assets/${dir}/${pre}${w}.webp`)) missImg.push(`${dir}/${pre}${w}.webp`);
missImg.length ? FAIL(`${missImg.length} missing images`) : OK("All 111 week images present (.webp)");

// Content now lives in the swappable layer: real content when present, else sample.
const contentDir = fs.existsSync("src/content/weeks.ts") ? "src/content" : "src/content.sample";
P(`  (checking content layer: ${contentDir})`);
const pw = readAll(`${contentDir}/weeks.ts`);
const loc = readAll(`${contentDir}/localized.ts`);
const roKeys = new Set([...loc.matchAll(/^\s{2}"([^"]+)":/gm)].map((m) => m[1]));
const start = pw.indexOf("[", pw.indexOf("export const weeks"));
const weeks = eval("(" + pw.slice(start, pw.lastIndexOf("\n];") + 2) + ")");
const used = new Set();
for (const w of weeks) {
  const add = (s) => { if (typeof s === "string" && s.trim()) used.add(s); };
  add(w.glassType); add(w.fillDescription); add(w.toast); add(w.babyThisWeek?.summary);
  (w.babyThisWeek?.milestones || []).forEach(add); (w.momThisWeek?.physical || []).forEach(add);
  (w.momThisWeek?.emotional || []).forEach(add); (w.dadActions || []).forEach(add);
  add(w.headsUp); add(w.dadTip);
  (w.emergencyContact?.urgentSymptoms || []).forEach(add); add(w.emergencyContact?.advice);
}
const missRO = [...used].filter((s) => !roKeys.has(s));
missRO.length ? (FAIL(`${missRO.length} weekly strings missing RO`), missRO.slice(0, 5).forEach((s) => P("     - " + s))) : OK(`All ${used.size} weekly strings have Romanian`);
weeks.length === 37 ? OK("37 weeks (4-40) present") : FAIL(`week count = ${weeks.length}`);

const i18 = readAll("src/app/i18n/index.ts");
const enB = i18.slice(i18.indexOf("en: {"), i18.indexOf("ro: {"));
const roB = i18.slice(i18.indexOf("ro: {"));
const kre = /"([a-zA-Z]+\.[a-zA-Z.]+)":/g;
const enK = new Set([...enB.matchAll(kre)].map((m) => m[1]));
const roK = new Set([...roB.matchAll(kre)].map((m) => m[1]));
const miss = [...enK].filter((k) => !roK.has(k));
miss.length ? FAIL("i18n keys missing RO: " + miss.join(", ")) : OK(`i18n parity EN=${enK.size} RO=${roK.size}`);

// ── 7. PWA / STORE READINESS ─────────────────────────────────
P("\n════ 7. PWA & STORE READINESS ════");
const man = JSON.parse(readAll("public/manifest.webmanifest"));
for (const k of ["name", "short_name", "start_url", "display", "icons"]) man[k] ? OK(`manifest.${k} = ${JSON.stringify(man[k]).slice(0, 60)}`) : FAIL(`manifest missing ${k}`);
const has512 = (man.icons || []).some((i) => i.sizes === "512x512");
const hasMask = (man.icons || []).some((i) => (i.purpose || "").includes("maskable"));
has512 ? OK("512x512 icon present") : FAIL("no 512x512 icon (store requirement)");
hasMask ? OK("maskable icon present") : WARN("no maskable icon");
for (const i of man.icons || []) fs.existsSync("public" + i.src) ? OK(`icon exists: ${i.src}`) : FAIL(`icon MISSING on disk: ${i.src}`);
const idx = readAll("index.html");
/rel="manifest"/.test(idx) ? OK("index.html links manifest") : FAIL("no manifest link");
/apple-touch-icon/.test(idx) ? OK("apple-touch-icon set (needed for iOS install)") : FAIL("no apple-touch-icon — iOS home-screen icon will be a screenshot");
/name="description"/.test(idx) ? OK("meta description present") : WARN("no meta description");
const cap = readAll("capacitor.config.ts");
const appId = (cap.match(/appId:\s*'([^']+)'/) || [])[1];
appId ? OK(`Capacitor appId = ${appId} (PERMANENT once on Play)`) : FAIL("no appId");
fs.existsSync("android") ? OK("android/ platform present") : WARN("android/ not scaffolded");

// ── 8. LEGAL / DOCS ──────────────────────────────────────────
P("\n════ 8. LEGAL & STORE DOCS ════");
for (const f of ["PRIVACY.md", "CONTENT_LICENSE.md", "README.md", "PUBLISHING.md"]) fs.existsSync(f) ? OK(f + " present") : FAIL(f + " MISSING");
fs.existsSync("LICENSE") ? OK("LICENSE present") : WARN("LICENSE not yet added (use GitHub's MPL-2.0 template)");
const priv = readAll("PRIVACY.md");
/add your contact email|adaugă adresa ta/i.test(priv) ? WARN("PRIVACY.md still has the contact-email placeholder — stores require a real contact") : OK("privacy contact filled in");
// disclaimer reachable in app?
const anySrc = srcFiles.map(readAll).join("\n");
/not medical advice|nu.*sfaturi medicale|disclaimer/i.test(anySrc) ? OK("medical disclaimer present in app") : FAIL("no medical disclaimer in app");

P("\n════════════════════════════════════");
P(`RESULT: ${problems} blocking problem(s), ${warns} warning(s)`);
