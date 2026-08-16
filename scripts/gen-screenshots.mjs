/* Generate Play Store / App Store screenshots straight from the running app.
 *
 *   npm run preview:phone      (in one terminal — serves the built app)
 *   npm run screenshots        (in another)
 *
 * Output: store-assets/screenshots/{en,ro}/*.png at 1080x1920 (Play's
 * recommended phone size, 9:16). Re-run after any UI change.
 *
 * Uses the Chrome already installed on the machine (puppeteer-core), so there
 * is no 300 MB browser download.
 */
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";

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
  set("dg_profile", { dadName: lang === "ro" ? "Andrei" : "Alex", partnerName: lang === "ro" ? "Ana" : "Sarah", babyNickname: "", dueDate: "", firstBaby: "yes" });
  set("dg_style", { priorities: ["Practical checklists"], mood: "Excited", tone: "Warm" });
  // a little realistic progress
  set("dg_todos", ["t1-1", "t1-2", "t1-3"]);
  set("dg_install_hint_dismissed", "1");
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

const SHOTS = {
  en: { nav: ["Home", "Journey", "Checklist", "Handbook"], hospital: /Hospital Bag/, profile: "Profile" },
  ro: { nav: ["Acasă", "Parcurs", "Checklist", "Ghid"], hospital: /Geanta de spital/, profile: "Profil" },
};

const browser = await puppeteer.launch({ executablePath, headless: "new", args: ["--hide-scrollbars"] });

for (const lang of ["en", "ro"]) {
  const dir = path.join(OUT, lang);
  fs.mkdirSync(dir, { recursive: true });
  const page = await browser.newPage();
  await page.setViewport({ width: W / DSF, height: H / DSF, deviceScaleFactor: DSF, isMobile: true, hasTouch: true });

  await page.goto(URL, { waitUntil: "networkidle2" });
  await page.evaluate(seed, lang, 20);
  await page.reload({ waitUntil: "networkidle2" });
  await sleep(1400);

  const cfg = SHOTS[lang];
  let n = 1;
  const shot = async (name) => {
    await page.screenshot({ path: path.join(dir, `${String(n).padStart(2, "0")}-${name}.png`) });
    console.log(`  ${lang}/${String(n).padStart(2, "0")}-${name}.png`);
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
console.log(`\nScreenshots written to ${OUT}/ (${W}x${H})`);
