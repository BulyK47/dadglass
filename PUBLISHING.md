# DadGlass — Publishing Guide

Ship DadGlass to **GitHub** (open source), **Google Play**, and the **Apple App Store**.
**No web hosting** — the app is wrapped with **Capacitor**, which bundles the built web app
*inside* each native binary (loads locally, works offline, no server/URL/assetlinks/domain).

Sources cited inline; verify against official docs before each submission (store rules change).

---

## Architecture decision
- **No Netlify / no hosting.** Capacitor bundles `dist/` into the Android and iOS apps.
- **One toolchain, both stores.** Same Capacitor project → Play (`.aab`) and App Store (`.ipa`).
- **Trade-off:** app updates ship as new store releases (not instant web deploys). Fine for
  content-stable apps. (Optional later: a Capacitor live-update service like Capgo.)
- **App ID:** `com.dadglass.app` (in `capacitor.config.ts`). ⚠️ **PERMANENT once published to
  Play** — confirm/change it before the first upload.

---

## Prerequisites
- A public **privacy policy URL** (both stores require it). **Done** — the GitHub Pages deploy
  serves it at:

  ```
  https://bulyk47.github.io/dadglass/privacy.html
  ```

  That is the URL to paste into Play Console and App Store Connect. It is `public/privacy.html`,
  a plain static page with no JavaScript, so a reviewer can always read it even if the app fails
  to boot. It duplicates `PRIVACY.md` on purpose (one for the repo, one for the stores) and
  `npm run audit` fails if the two ever drift apart on the contact address or the core claims.
- Node + npm (installed). **Android Studio + JDK 17** for the Play build (you have it from Quillery).
- For iOS: an **Apple Developer account ($99/yr)** and a **macOS build** (cloud Mac is fine — see Part 3).

Convenience scripts (in `package.json`):
```bash
npm run cap:sync      # build web + copy into native projects
npm run cap:android   # build + sync + open Android Studio
```

---

## Part 1 — Google Play (Capacitor Android)

You already cleared the account gates for Quillery (one-time **$25** fee; the post-2023
12-testers/14-days closed-testing gate). Per app:

1. **Build + open the Android project:**
   ```bash
   npm run cap:android        # = vite build + cap sync android + cap open android
   ```
   This opens Android Studio on the generated `android/` project with your web app bundled in.
2. **Set target API level 35 (Android 15)** — required for new uploads in 2025-2026. Capacitor 8
   already targets a recent SDK; confirm `compileSdkVersion`/`targetSdkVersion = 35` in
   `android/variables.gradle`.
3. **App icon / name:** replace the default launcher icons (Android Studio → res → mipmap, or use
   `@capacitor/assets` to generate from your icon) and confirm the app label = "DadGlass".
4. **Signing:** in Android Studio, Build → Generate Signed Bundle → **create/choose an upload
   keystore** → **back it up + save the passwords** (every future update needs the same key).
   Produce a signed **`.aab`**. (Play App Signing manages the release key on Google's side.)
   *Note: Capacitor Android needs NO `assetlinks.json` — that was only for a TWA.*
5. **Play Console** (same account as Quillery — no new fee): Create app → upload the `.aab` to
   **Internal testing** first, then Production.
6. **Mandatory forms:**
   - **Data safety:** all data on-device, nothing transmitted → **"No data collected/shared."**
     (Still must submit the form. Confirm no analytics SDK — there is none.)
   - **Health apps declaration** (App content → Health apps): pregnancy = *Reproductive & Sexual
     Health* → declare the health feature (do NOT pick "no health features").
   - **Store description:** put the **medical disclaimer in the first paragraph**
     ("not a medical device; does not diagnose/treat; consult a healthcare professional").
   - **Privacy policy URL** (App content → Privacy policy).
   - Content rating; target audience = adults (not children); ads = none.
7. **Release:** roll to Internal testing → verify it launches full-screen and works offline →
   promote to Production → submit. Updates: bump `versionCode` (`android/app/build.gradle`),
   rebuild with the SAME keystore, re-upload.

**Sources:** capacitorjs.com/docs/android, developer.android.com (target API), Google Play Console Help.

---

## Part 2 — Apple App Store (Capacitor iOS)

Apple has no PWA path; Capacitor's native wrapper is the route.

### Requirements
- **Apple Developer Program: $99 USD/year** (mandatory to submit).
- A **macOS + Xcode** build step to produce the signed `.ipa`. **No Mac needed** if you use cloud CI:
  - **Codemagic** — free ~500 macOS-M2 min/month; connects your Git repo, archives + signs + uploads.
  - **Capawesome Cloud** — purpose-built for Capacitor.
  - or a rented Mac (MacinCloud/MacStadium) / GitHub Actions macOS runners.
- 1024×1024 icon, iPhone screenshots (6.9" & 6.5"), privacy policy URL, App Store Connect API key.

### Steps
1. **Add the iOS platform** (do this on the Mac/cloud build, since it runs `pod install`):
   ```bash
   npm i               # (on the build machine)
   npm run build && npx cap add ios && npx cap sync ios
   ```
2. **Beat Guideline 4.2 ("Minimum Functionality")** — the #1 rejection risk for web-wrapped apps.
   **Before first submission**, add genuine native capability. The highest-value one for DadGlass:
   wire **native local notifications** (`@capacitor/local-notifications`, already installed) so the
   reminder/appointment feature schedules real device notifications (not just a `.ics`). Also ensure
   full offline use (Airplane-Mode demo), no browser chrome, native-feeling nav. In **App Review
   notes**, list these native features + how to test them. Argue *app-like utility*, never "it's a PWA."
3. **Health rules (1.4.1) + privacy (5.1.1):** keep the "consult your doctor" disclaimer prominent
   (already in onboarding consent + About); make no diagnostic/accuracy claims; App Privacy labels =
   minimal/no collection (true — clean story); link the privacy policy in metadata + in-app.
4. **Signing:** App Store Connect → create app with Bundle ID `com.dadglass.app`; use an App Store
   Connect API key so CI auto-manages certs/profiles.
5. **Build → upload → submit:** cloud build archives + signs + uploads to TestFlight → validate →
   **Add for Review**. ~24-48h. If 4.2-rejected, respond in Resolution Center pointing to the native
   features (front-load them to pass first try).

**Sources:** developer.apple.com/app-store/review/guidelines, capacitorjs.com/docs/ios,
capawesome.io + codemagic.io (cloud Mac builds).

---

## Part 3 — GitHub (open source: mechanism yes, content no)

Decision: **truly separate** content from code; code under **MPL-2.0**.

- **Open (MPL-2.0):** all code — React components, hooks, i18n framework, PWA scaffolding, the
  Capacitor config + native projects, build scripts, the size-comparison rendering.
- **Content (yours, NOT published):** `src/app/data/pregnancyWeeks.ts`,
  `src/app/utils/localizedWeekContent.ts`, `src/app/data/babyLooks.ts`, `src/app/data/dadObjects.ts`,
  the `public/assets/{baby,glasses,dad-objects}` images, and the name/logo/icon.

**Before the repo goes public — the content-split refactor:** move the real weekly text +
translations + images into a private content layer, and commit a small **`content.sample/`**
(a few generic weeks + placeholder images) so the public repo clones-and-runs. (Not done yet —
see "Next steps".)

**Repo files (ready):** `README.md`, `CONTENT_LICENSE.md`, `PRIVACY.md`, `.gitignore`.
Add `LICENSE` via GitHub's **"Add file → license → MPL-2.0"** template (authoritative full text; SPDX `MPL-2.0`).

**Before pushing:** ✅ no personal data in code, ✅ never commit signing keystores / API keys.

---

## Recommended order (ușor, ușor)
1. **Confirm the App ID** (`com.dadglass.app`) and app name/icon.
2. **Google Play** first (you know the flow; Capacitor build in Android Studio → `.aab`).
3. **Content-split refactor** → publish the **open GitHub repo** (MPL-2.0).
4. **iOS** last — add native local notifications, then Capacitor + cloud Mac build → App Store.
