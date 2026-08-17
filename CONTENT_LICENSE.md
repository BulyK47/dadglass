# Content License

This project separates **code** from **content**, under two different licenses.

## Code — MPL-2.0
All source code (React components, hooks, the i18n framework, PWA scaffolding, build
configuration, and the size-comparison rendering system) is licensed under the
**Mozilla Public License 2.0** — see `LICENSE`. You may use, modify, and redistribute
it (including commercially); modifications to MPL-covered files must remain open.

## Content — reserved to the DadGlass authors, not covered by the MPL
The text and illustrations were **produced with AI assistance, under the direction and
editorial curation of the DadGlass authors**: the concept, the week-by-week structure, what
belongs in it and what does not, the tone, the Romanian phrasing, and the review of the
medical content against published guidance. That selection, arrangement and editorial work
is the authors'.

Copyright in individual AI-generated images and passages is unsettled and varies by
jurisdiction, so this is a statement of what is reserved rather than a claim that every
asset is independently protected. Either way the following are **not covered by the MPL**
and are **not** licensed for reuse, redistribution, or the creation of derivative works:

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
