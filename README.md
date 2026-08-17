# DadGlass 👶

A calm, practical, **week-by-week pregnancy guide built for dads** — the size of the baby
this week (as a familiar glass or everyday object), what your partner may be feeling, one
useful "dad move", checklists, an appointment co-pilot, a hospital-bag list, and a private
journal. **Bilingual (English / Română), fully offline, installable (PWA).**

> ⚕️ **Not medical advice.** DadGlass is for information and support only. It is **not a
> medical device** and does not diagnose, treat, or replace professional care. Always
> consult a doctor or midwife. See `PRIVACY.md` and `CONTENT_LICENSE.md`.
>
> 🍷 **On the glasses.** They are size references, the way other apps use fruit. On alcohol
> itself the app is not neutral: there is no known safe amount in pregnancy, and one of the
> concrete things DadGlass asks of the reader is not to drink either while it lasts.

## Tech
Vite + React 18 + TypeScript + Tailwind. No backend — all data is stored **on-device**
(`localStorage`). Offline via a service worker that precaches the shell, JS/CSS and images.

## Run it
```bash
npm install
npm run sample:assets  # fill public/assets with the placeholder illustrations
npm run dev:phone      # http://127.0.0.1:5174  (mobile-sized shell)
```
Other scripts:
```bash
npm run build          # production build -> dist/ (also generates the service worker)
npm run preview:phone  # serve the built dist/ (needed to test the PWA/offline)
npm run audit          # pre-publication checks (privacy, secrets, content, store readiness)
npm run icons          # regenerate every icon from assets/icon-source.svg
npm run cap:android    # build + sync + open the Android project
```

## Project shape
- `src/app/components` — UI (tabs, feature screens, cards)
- `src/app/context` — app state, persisted to `localStorage`
- `src/app/hooks` — small persistence hooks
- `src/app/i18n` — EN/RO UI strings
- `src/app/data` + `src/app/utils/localizedWeekContent.ts` — **content layer** (see below)
- `scripts/` — image optimizer (`optimize-images.mjs`) + service-worker generator (`gen-sw.mjs`)

## Two licenses: open code, proprietary content
- **Code** → **MPL-2.0** (`LICENSE`). Use it, learn from it, build on it.
- **Content** (the weekly guide copy, its Romanian translations, and the illustrations) →
  **© the DadGlass authors, all rights reserved** (`CONTENT_LICENSE.md`).

### How the split works
The app reads all of its content through the **`@content` alias**:

| | |
|---|---|
| `src/content/` | the real, proprietary content — **not in this repo** |
| `src/content.sample/` | placeholder content for all 37 weeks — **shipped here** |
| `assets.sample/` | placeholder illustrations (`npm run sample:assets`) |

`vite.config.ts` points `@content` at `src/content/` when it exists and falls back to
`src/content.sample/` otherwise — so a fresh clone builds and runs immediately with
obvious "sample" text and images. To run it with your own content, drop your files
into `src/content/` using the same shape as `src/content.sample/`.

Everything else — components, hooks, state, i18n framework, the size-comparison
rendering, the PWA/Capacitor scaffolding, the build scripts — is the open "mechanism".

## Publishing
See `PUBLISHING.md` for the Google Play, Apple App Store and open-source release steps.

## Contact
Questions, bugs, or privacy requests: **dadglass.app@gmail.com**
