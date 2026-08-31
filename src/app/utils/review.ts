import { InAppReview } from "@capacitor-community/in-app-review";
import { AppLauncher } from "@capacitor/app-launcher";
import { isNative, platform } from "./platform";

/**
 * Rating the app — two separate paths, deliberately.
 *
 * Google Play's in-app review guidelines are stricter than they look, and the
 * two rules below are the ones that get an implementation flagged:
 *
 *  1. Do NOT trigger the in-app review flow from a button the user pressed.
 *     The API is meant to fire at a natural point in the app, on its own.
 *  2. Do NOT ask the user anything first — no "Enjoying DadGlass?" pre-prompt,
 *     no opinion question, nothing that filters who gets to see the dialog.
 *
 * So: `requestInAppReview()` fires once, silently, after the user has actually
 * got something out of the app, and asks nothing. The Profile row the user can
 * press goes through `openStoreListing()` instead, which is just a deep link to
 * the store page and is unrestricted.
 *
 * A further subtlety worth knowing before "fixing" this: `requestInAppReview()`
 * resolving successfully does NOT mean a dialog appeared. Play applies its own
 * per-user quota and shows nothing if the user has already rated or has seen
 * the dialog recently. There is no way to detect that, by design.
 */

const APP_ID = "com.dadglass.app";
const LISTING_URL = `https://play.google.com/store/apps/details?id=${APP_ID}`;
const MARKET_URL = `market://details?id=${APP_ID}`;

/** Set once the milestone prompt has fired, so it never fires twice. */
const PROMPT_KEY = "dg_review_asked";

/** How much the user has to have done before we ask Play to ask them. */
export const REVIEW_TODO_THRESHOLD = 10;
export const REVIEW_JOURNAL_THRESHOLD = 3;

export function hasAskedForReview(): boolean {
  try {
    return localStorage.getItem(PROMPT_KEY) === "1";
  } catch {
    // No storage means we cannot remember having asked, so never ask: a prompt
    // that could repeat on every launch is worse than no prompt at all.
    return true;
  }
}

function markAskedForReview() {
  try {
    localStorage.setItem(PROMPT_KEY, "1");
  } catch {
    /* storage unavailable — nothing to remember it with */
  }
}

/**
 * Open the store page for the app so the user can rate it themselves.
 * On Android this prefers the `market://` scheme so it lands in the Play app
 * rather than a browser; on the web it opens the normal listing URL.
 */
export async function openStoreListing(): Promise<void> {
  if (isNative() && platform() === "android") {
    try {
      const { completed } = await AppLauncher.openUrl({ url: MARKET_URL });
      if (completed) return;
    } catch {
      /* Play app missing or the scheme was refused — fall through to https */
    }
    try {
      await AppLauncher.openUrl({ url: LISTING_URL });
      return;
    } catch {
      /* fall through to the web path */
    }
  }
  try {
    window.open(LISTING_URL, "_blank", "noopener,noreferrer");
  } catch {
    /* popup blocked — nothing further we can usefully do */
  }
}

/**
 * Ask Play to show its in-app review dialog, at most once per install.
 * No-op off-Android, and a no-op if it has already been asked.
 */
export async function requestInAppReview(): Promise<void> {
  if (hasAskedForReview()) return;
  if (!isNative() || platform() !== "android") return;
  // Marked before the call, not after: if the request throws we still do not
  // want to retry it on every subsequent launch.
  markAskedForReview();
  try {
    await InAppReview.requestReview();
  } catch {
    /* Play declined or the service is unavailable — nothing to show the user */
  }
}
