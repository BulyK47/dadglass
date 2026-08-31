/* Generate Play Store / App Store screenshots straight from the running app.
 *
 *   npm run preview:phone      (in one terminal — serves the built app)
 *   npm run screenshots        (in another)
 *
 * Output: store-assets/screenshots/{en,ro}/*.png at 1080x1920 (Play's
 * recommended phone size, 9:16). Re-run after any UI change.
 *
 * Two phases, deliberately separated:
 *   1. drive the app and capture the raw device shots (kept under
 *      screenshots/{lang}/raw/ for reference),
 *   2. in a FRESH browser, compose each one into a captioned frame — headline,
 *      subline, phone below — which is what actually gets uploaded.
 *
 * Bare device output tells a browsing user nothing about what the app does; the
 * caption is the part that earns the install.
 *
 * The two phases are not merged because doing so is what broke this script:
 * with the app page and the framing page alive in the same browser, and a
 * 1080x1920 capture on each, Page.captureScreenshot started hanging after about
 * six frames. Separate browsers, one job each, and it finishes every time.
 *
 * The frame is rendered in Chrome rather than composited with sharp on purpose:
 * sharp draws SVG text through whatever fonts the machine happens to have, so
 * the same script would produce different output elsewhere and the Romanian
 * diacritics are the first thing to break. Chrome lays out text the same way
 * every run.
 *
 * Uses the Chrome already installed on the machine (puppeteer-core), so there
 * is no 300 MB browser download.
 */
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";
import { pathToFileURL } from "url";

const URL = process.env.APP_URL || "http://127.0.0.1:5174";
const OUT = "store-assets/screenshots";
const W = 1080, H = 1920, DSF = 3; // 360x640 CSS px @3x

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
];
const executablePath = CHROME_CANDIDATES.find((p) => fs.existsSync(p));
if (!executablePath) {
  console.error("No Chrome/Edge found. Set one of:", CHROME_CANDIDATES.join(", "));
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const launch = () => puppeteer.launch({
  executablePath,
  headless: "new",
  // File-to-file subresources: the frame page loads the raw PNG sitting next to it.
  args: ["--hide-scrollbars", "--allow-file-access-from-files"],
  protocolTimeout: 180_000,
});

/** Seed localStorage so the app opens past onboarding in a good-looking state. */
function seed(lang, week) {
  const set = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  localStorage.clear();
  set("dg_onboarded", true);
  set("dg_disclaimer", true);
  set("dg_lang", lang);
  set("dg_week", week);
  set("dg_units", "metric");
  set("dg_cmp", "glass");
  set("dg_profile", { dadName: lang === "ro" ? "Andrei" : "Alex", partnerName: lang === "ro" ? "Ana" : "Sarah", babyNickname: "", dueDate: "" });
  set("dg_style", { priorities: [], mood: "", tone: "Warm" });
  // a little realistic progress
  set("dg_todos", ["t1-1", "t1-2", "t1-3"]);
  set("dg_install_hint_dismissed", "1");
  // the walkthrough would otherwise cover the first screen
  set("dg_howto_seen", true);
}

/** Click the bottom-nav tab whose label matches. */
async function tab(page, label) {
  await page.evaluate((l) => {
    const b = [...document.querySelectorAll("button")].find((x) => x.textContent.trim() === l);
    b?.click();
  }, label);
  await sleep(900);
}

/** Open a feature screen from Profile by matching its title text. */
async function openFeature(page, re) {
  await page.evaluate((src) => {
    const rx = new RegExp(src);
    const b = [...document.querySelectorAll("button")].find((x) => rx.test(x.textContent));
    b?.click();
  }, re.source);
  await sleep(900);
}

/* Captions, in shot order. Kept short: Play crops the listing carousel hard on
 * small screens, and a headline that wraps past two lines stops being readable. */
const CAPTIONS = {
  home: {
    en: ["See how big the baby is this week", "Compared to a familiar glass — or an everyday object."],
    // No em dash in this one: it landed at the start of the wrapped second line.
    ro: ["Vezi cât de mare e bebelușul săptămâna asta", "Comparat cu un pahar cunoscut sau cu un obiect de zi cu zi."],
  },
  journey: {
    en: ["All 37 weeks, one at a time", "What's happening, and one thing you can actually do about it."],
    ro: ["Toate cele 37 de săptămâni, pe rând", "Ce se întâmplă și un lucru concret pe care îl poți face."],
  },
  checklist: {
    en: ["51 things to do, sorted for you", "By trimester and priority, with reminders for your own calendar."],
    ro: ["51 de lucruri de făcut, deja sortate", "Pe trimestre și priorități, cu memento în calendarul tău."],
  },
  handbook: {
    en: ["Labour and birth, in plain language", "Plus a glossary of the words you'll hear at appointments."],
    ro: ["Travaliul și nașterea, pe înțeles", "Plus un glosar cu termenii pe care îi auzi la consultații."],
  },
  "hospital-bag": {
    en: ["The bag, packed before it's urgent", "For her, the baby, you, and the documents."],
    ro: ["Geanta, făcută înainte să fie urgent", "Pentru ea, pentru bebeluș, pentru tine și documentele."],
  },
};

/** The captioned frame: headline, subline, phone. Fixed sizes so runs match. */
function framePage(imgFile, headline, subline) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${W}px; height: ${H}px; }
  body {
    background: linear-gradient(160deg, #0b1220 0%, #1e293b 62%, #26364d 100%);
    font-family: "Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif;
    display: flex; flex-direction: column; align-items: center;
    padding: 96px 72px 0;
    overflow: hidden;
  }
  h1 {
    font-size: 62px; line-height: 1.14; font-weight: 700; letter-spacing: -0.02em;
    color: #ffffff; text-align: center; text-wrap: balance;
  }
  p {
    margin-top: 26px; font-size: 32px; line-height: 1.38; font-weight: 400;
    color: #cbd5e1; text-align: center; max-width: 860px; text-wrap: balance;
  }
  .phone {
    margin-top: 64px; width: 780px; border-radius: 42px; overflow: hidden;
    border: 3px solid rgba(255,255,255,0.16);
    box-shadow: 0 40px 90px rgba(0,0,0,0.45);
    flex-shrink: 0;
  }
  .phone img { display: block; width: 100%; }
</style></head>
<body>
  <h1>${headline}</h1>
  <p>${subline}</p>
  <div class="phone"><img src="${imgFile}"></div>
</body></html>`;
}

const SHOTS = {
  en: { nav: ["Home", "Journey", "Checklist", "Handbook"], hospital: /Hospital Bag/, profile: "Profile" },
  ro: { nav: ["Acasă", "Parcurs", "Checklist", "Ghid"], hospital: /Geanta de spital/, profile: "Profil" },
};

/* ---------- Phase 1: raw captures from the running app ---------- */

const captured = []; // { lang, name, file, dir, rawDir }

{
  const browser = await launch();
  for (const lang of ["en", "ro"]) {
    const dir = path.join(OUT, lang);
    const rawDir = path.join(dir, "raw");
    fs.mkdirSync(rawDir, { recursive: true });
    const page = await browser.newPage();
    await page.setViewport({ width: W / DSF, height: H / DSF, deviceScaleFactor: DSF, isMobile: true, hasTouch: true });

    await page.goto(URL, { waitUntil: "networkidle2" });
    await page.evaluate(seed, lang, 20);
    await page.reload({ waitUntil: "networkidle2" });
    await sleep(1400);

    const cfg = SHOTS[lang];
    let n = 1;
    const shot = async (name) => {
      const file = `${String(n).padStart(2, "0")}-${name}.png`;
      await page.screenshot({ path: path.join(rawDir, file) });
      if (!CAPTIONS[name]?.[lang]) throw new Error(`No ${lang} caption for shot "${name}" — add one to CAPTIONS.`);
      captured.push({ lang, name, file, dir, rawDir });
      console.log(`  raw  ${lang}/${file}`);
      n++;
    };

    await shot("home");                                   // baby size comparison
    await tab(page, cfg.nav[1]); await shot("journey");   // week timeline
    await tab(page, cfg.nav[2]); await shot("checklist"); // dad checklist
    await tab(page, cfg.nav[3]); await shot("handbook");  // guides
    await tab(page, cfg.profile);
    await openFeature(page, cfg.hospital); await shot("hospital-bag");

    await page.close();
  }
  await browser.close();
}

/* ---------- Phase 2: compose the captioned frames ---------- */

{
  const browser = await launch();
  const framer = await browser.newPage();
  await framer.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  for (const { lang, name, file, dir, rawDir } of captured) {
    const [headline, subline] = CAPTIONS[name][lang];
    const framePath = path.join(rawDir, "_frame.html");
    fs.writeFileSync(framePath, framePage(file, headline, subline), "utf8");
    await framer.goto(pathToFileURL(path.resolve(framePath)).href, { waitUntil: "load" });
    await framer.evaluate(async () => { await document.fonts.ready; });
    await framer.screenshot({ path: path.join(dir, file) });
    console.log(`  frame ${lang}/${file}`);
  }

  await browser.close();
}

console.log(`\n${captured.length} captioned screenshots written to ${OUT}/{en,ro}/ (${W}x${H}); raw app output under raw/`);
