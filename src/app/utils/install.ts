/**
 * Install / platform detection.
 *
 * Why this matters: on iOS, a web app kept as a normal Safari tab has ALL of its
 * script-writable storage (localStorage, IndexedDB, caches, service worker) wiped
 * after 7 days of Safari use without visiting the site (WebKit ITP). Web apps added
 * to the Home Screen are explicitly EXEMPT from that 7-day cap.
 *
 * For a journal/checklist app that stores everything on-device, that difference is
 * the difference between "my notes are safe" and "my notes vanished", so we detect
 * the not-yet-installed iOS case and actively guide the user to install.
 *
 * See: https://webkit.org/tracking-prevention/ ("The first-party domain of home
 * screen web applications is exempt from ITP's 7-day cap on all script-writeable
 * storage.")
 *
 * None of this applies to the native (Capacitor) store builds — those are already
 * installed apps with normal app storage, so all of the install prompting is
 * suppressed there via isNative().
 */
import { isNative } from "./platform";

/** Running as an installed app (Home Screen / standalone / native), not a browser tab. */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  // The native store build is by definition already "installed".
  if (isNative()) return true;
  // iOS Safari exposes navigator.standalone; everyone else uses the display-mode query.
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  const displayMode =
    typeof window.matchMedia === "function" &&
    (window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches);
  return Boolean(iosStandalone || displayMode);
}

/** iPhone / iPad / iPod (incl. iPadOS, which reports as Mac with touch). */
export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const iPadOS = /Macintosh/.test(ua) && typeof document !== "undefined" && "ontouchend" in document;
  return /iPad|iPhone|iPod/.test(ua) || iPadOS;
}

/**
 * True when the user is on iOS, in a browser tab, and has NOT installed the app —
 * i.e. exactly the case where their data is on a 7-day timer.
 */
export function needsIOSInstall(): boolean {
  return isIOS() && !isStandalone();
}

/**
 * Ask the browser to keep our storage (best-effort). WebKit grants this
 * heuristically — notably it favours home-screen web apps — and never prompts.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (navigator.storage?.persisted && navigator.storage?.persist) {
      if (await navigator.storage.persisted()) return true;
      return await navigator.storage.persist();
    }
  } catch {
    /* not supported — ignore */
  }
  return false;
}
