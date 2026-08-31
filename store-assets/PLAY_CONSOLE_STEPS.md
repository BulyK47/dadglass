# Releasing 1.0.6 — step by step

Written for the 1.0.6 upload during the closed test. Tick as you go.

> **Why 1.0.6 and not 1.0.5.** 1.0.5 was built on 31 August but never uploaded — the store
> still serves 1.0.4. The system-bars defect that 1.0.5 left open is fixed now, so what goes up
> is one build containing both: `store-assets/dadglass-v1.0.6.aab`, versionCode 7.
> **Upload once.** Two uploads stacked on top of each other is the one avoidable cost here:
> Google's review SLA is *"counted from the last submitted change to an app"*, and submitting
> while a change is in review can push you to the back of the queue.

Two things I cannot see from here, so read the real values in your own console:
the **tester count and day count** on the closed-testing track, and the exact
wording of some buttons (Play Console changes labels, and shows some sections
only once you qualify). Where a label might differ, the path is described so you
can find it anyway.

**Never change** the app name (`DadGlass`) or the package name
(`com.dadglass.app`). The package name is permanent.

---

## Part 0 — GitHub first

The store's privacy-policy URL is served from GitHub Pages, so it only updates
when you push. Play points at that URL, and 1.0.5 links out to Google Play, so
the published policy has to mention it before you submit anything.

- [ ] The tester-report work (walkthrough, rating, captioned shots, ASO) is **already committed
      and pushed** — `988b1ff`, 31 August. Nothing to do for it.
- [ ] **Commit and push the safe-area fix** that came after it (index.css + six components +
      vite.config.ts + the version bump). Suggested message:

      Keep every surface clear of the system bars

- [ ] Wait for the **Actions** run (`.github/workflows/deploy.yml`) to go green.
- [ ] Wait for the **Actions** run (`.github/workflows/deploy.yml`) to go green.
- [ ] Open <https://bulyk47.github.io/dadglass/privacy.html> and confirm it says
      **31 August 2026**. If it still says 23 June, the deploy has not landed —
      do not continue until it has.

---

## Part 1 — Upload the build to the closed test

1. <https://play.google.com/console> → select **DadGlass**.
2. Left menu → **Test and release** → **Testing** → **Closed testing**.
3. Find your existing track (it will be the one your testers are opted into) and
   open it → **Create new release**.
4. Under **App bundles**, upload `store-assets/dadglass-v1.0.6.aab`.
   Wait for processing, then check it reads **1.0.6 (7)**. If it refuses the
   upload as a duplicate, versionCode 7 is already used — tell me and I will
   bump it.
   > **The version code has to beat every ACTIVE bundle, not just the closed one.** Play serves
   > each device the highest version code it is eligible for; a bundle with a lower code than one
   > still active on another track is marked *Shadowed* or *Superseded* and silently reaches
   > nobody. Also note that anyone opted into **internal** testing receives ONLY the internal
   > build — if your own phone is on that track, you will not see this release until you leave it.
5. **Release name** autofills as `7 (1.0.6)`. Leave it.
6. **Release notes**: paste from `store-assets/CLOSED_TEST.md` →
   *"Release notes for 1.0.6"*.
   - `en-US` box → the English block
   - `ro` box → the Romanian block
   - If Romanian is not offered, add it first: **Grow → Store presence →
     Store listings → Manage translations → Add translations → Romanian**.
7. **Next** → review the summary → **Start rollout to Closed testing** → confirm.

Warnings you can ignore at this step: a note about missing deobfuscation/debug
symbols (there is no native crash code to symbolise), and any advice about
optimising the bundle.

---

## Part 2 — Store listing and screenshots

This is the shared listing, so it applies to the closed test and to production
later. Changes here go through a short review — usually hours.

1. Left menu → **Grow** → **Store presence** → **Main store listing**.
2. Language selector at the top → **English (United States)**:
   - **Short description** ← from `STORE_LISTING.md` → English → *Short
     description* (73 characters)
   - **Full description** ← the English full description. **Check that the
     medical-disclaimer paragraph is still first** — Play's Health apps policy
     rejects listings that bury it.
   - **Save**.
3. Switch language to **Română** and do the same with the Romanian blocks
   (short description is 75 characters).
4. Still in Main store listing, scroll to **Graphics** → **Phone screenshots**:
   - Delete the five existing ones for that language.
   - Upload the five from `store-assets/screenshots/en/` under English, and the
     five from `store-assets/screenshots/ro/` under Romanian.
   - **Do not upload anything from the `raw/` subfolder.** Those are the
     uncaptioned app captures kept for reference.
   - Order matters — `01` first. The first two or three are what most people
     actually see.
5. **Save**.

Leave the app icon and the feature graphic as they are; neither changed.

---

## Part 3 — Confirm it on your phone

Do this **before** the production form. The form's answers 8 and 9 describe
shipped changes, so they should be true on a real device first.

1. Give the closed-test release a few minutes (occasionally a couple of hours),
   then on your phone: **Play Store → DadGlass → Update**.
2. Check each of these:
   - [ ] **Profile → About** shows **v1.0.6 (7)** — the build number is new in this version,
         and it is what makes a tester report attributable to a build
   - [ ] **Checklist** shows one row of chips plus a single **Filtre** button —
         not four rows
   - [ ] **Profile → Cum funcționează aplicația** opens the five-card tour, and
         **Sari peste** closes it
   - [ ] **Profile → Evaluează pe Google Play** opens the store page
   - [ ] **Geanta de spital** shows the amber note at the top, and the **Acasă**
         tab has the safe-sleep note and the new items (monitor, marsupiu,
         lumină de veghe…)
   - [ ] Onboarding no longer asks whether it is your first baby — to see it,
         **Profile → Șterge toate datele mele**, then reopen
3. **The system bars — now the thing to CONFIRM, not to report.** Fixed in 1.0.6. Check the
   top and bottom edges on every one of these, because each was a separate uncovered surface:
   - [ ] any tab header (the clock must not touch it)
   - [ ] **Profile → Cum funcționează** — the header AND the buttons at the bottom, which had
         lost their 2rem of spacing entirely and sat on the navigation bar
   - [ ] **Jurnalul** — header, and the last entry must clear the bottom bar
   - [ ] **Profile → Instalează aplicația** — header
   - [ ] a feature screen opened from Acasă — header
   - [ ] onboarding, seen again via **Profile → Șterge toate datele mele**
   - [ ] the disclaimer sheet and the checklist filter sheet — both bottom sheets

   If anything still sits under a bar, tell me which screen and I will fix that one — the
   mechanism is one CSS variable now, so a miss is one class, not a redesign.

   > **One cosmetic case deliberately NOT fixed in 1.0.6.** On a phone whose Android System WebView
   > is older than 140, Capacitor pads the web view instead of passing the insets into the page, so
   > the strip behind the clock is painted by the system theme — which resolves to #303030 on a
   > phone in dark mode, i.e. a dark band above a light app. It is a mismatch, not a legibility
   > problem (the system's own icons stay readable on it), it only affects pre-140 WebViews, and
   > fixing it means adding `android:windowBackground` to `AppTheme.NoActionBar`. Left for after
   > production, deliberately: this build is meant to be the low-risk one.

---

## Part 4 — Apply for production access

Only once the track shows the requirement met: **12 testers opted in,
continuously, for 14 days**. Read the actual counter in the console; a tester who
opted out mid-way does not count.

1. Left menu → **Test and release** → **Production** → look for **Apply for
   production access**. (Depending on the account, the same form is reachable
   from the closed-testing track under a **Production access** tab, and it is
   sometimes surfaced as a card on the **Dashboard**.)
2. Answer using `store-assets/PRODUCTION_ACCESS.md`. It is written to be true of
   1.0.6, so upload first, answer second.
   - **Question 2** (how easy was recruiting) — your own answer
   - **Question 7** (expected installs) — your own answer; the file suggests
     1,000–10,000 and says why
   - **Question 10** — leave out unless the form actually shows it
3. Submit. Google's review takes a few days; you will get a Play Console inbox
   message.

Once granted, you still have to create a **Production** release and roll it out —
production access is permission to publish, not publishing itself.

---

## If something goes wrong

- **Upload rejected, "version code already used"** → bump `versionCode` in
  `android/app/build.gradle` and `version` in `package.json` together (the audit
  fails if they disagree), rebuild, re-sign.
- **`:app:mergeReleaseAssets` fails during the build** → just run it again. It is
  a OneDrive race on this machine, not a code fault; it usually passes second try.
- **Listing rejected on the health policy** → check the medical disclaimer is
  still the first paragraph of the full description in both languages.
