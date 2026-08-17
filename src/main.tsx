import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";
import { isNative } from "./app/utils/platform";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

/*
 * Register the service worker for offline support in production web builds
 * (skipped in dev so it cannot interfere with Vite HMR).
 *
 * Deliberately NOT registered inside the native apps. There every asset already
 * ships in the package and is served locally, so the worker buys no offline
 * support at all — it only adds a cache that can serve the previous build's
 * files after a Play update, which is a confusing bug in exchange for nothing.
 */
if ("serviceWorker" in navigator && import.meta.env.PROD && !isNative()) {
  window.addEventListener("load", () => {
    // Registered relative to the deploy base so it works both at the site root
    // (native builds / custom domain) and under a project path like /dadglass/.
    const base = import.meta.env.BASE_URL || "/";
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch(() => {});
  });
}
