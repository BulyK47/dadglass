# Content License

This project separates **code** from **content**, under two different licenses.

## Code — MPL-2.0
All source code (React components, hooks, the i18n framework, PWA scaffolding, build
configuration, and the size-comparison rendering system) is licensed under the
**Mozilla Public License 2.0** — see `LICENSE`. You may use, modify, and redistribute
it (including commercially); modifications to MPL-covered files must remain open.

## Content — © the DadGlass authors, all rights reserved
The following are **original creative/editorial works and are NOT covered by the MPL**.
They are **© the DadGlass authors. All rights reserved.** They are **not** licensed for
reuse, redistribution, or the creation of derivative works:

- The weekly pregnancy guide content: `src/content/weeks.ts`
- The Romanian translations of that content: `src/content/localized.ts`
- The baby-look and dad-object descriptions: `src/content/babyLooks.ts`, `src/content/dadObjects.ts`
- All weekly illustrations under `public/assets/baby`, `public/assets/glasses`,
  `public/assets/dad-objects`
- The DadGlass name, logo, and app icon

**None of the above is included in the public repository.** The whole `src/content/`
directory and the illustration folders are excluded via `.gitignore`.

What the public repository ships instead:

- `src/content.sample/` — placeholder text for all 37 weeks, in the same shape
- `assets.sample/` — placeholder illustrations (`npm run sample:assets`)

This is what makes a fresh clone build and run: the code resolves `@content` to the
real content when it is present, and to the sample content otherwise.

## No medical warranty
The content is provided for **information and support only**. It is **not medical advice**
and comes with **no warranty of accuracy or fitness for any purpose**. Always consult a
qualified healthcare professional.
