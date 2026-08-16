/**
 * Build a URL for a file in `public/`, honouring the deploy base path.
 *
 * The same code ships to three places with different roots:
 *   • the native Capacitor apps and a root-hosted site  → base "/"
 *   • a GitHub Pages *project* page                     → base "/dadglass/"
 *
 * Vite exposes the configured base as `import.meta.env.BASE_URL` (always with a
 * trailing slash), so every runtime-built asset path must go through here rather
 * than hard-coding a leading "/".
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
