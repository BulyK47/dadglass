import { Capacitor } from "@capacitor/core";

/**
 * Where are we running?
 *
 * The same build ships three ways:
 *  - a normal web page (browser tab),
 *  - an installed PWA (Home Screen / standalone),
 *  - a native app (Capacitor: Google Play / App Store).
 *
 * Several browser APIs we rely on behave differently — or not at all — inside the
 * native WebView (the web Notification API is unavailable in WKWebView and Android
 * WebView; blob + <a download> downloads silently do nothing). So anything that
 * touches notifications or files must branch on this.
 */

/** True inside the Capacitor native shell (Android/iOS store app). */
export function isNative(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/** "android" | "ios" | "web" */
export function platform(): string {
  try {
    return Capacitor.getPlatform();
  } catch {
    return "web";
  }
}
