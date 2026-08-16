import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Register the service worker for offline support in production builds
// (skipped in dev to avoid interfering with Vite HMR).
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
