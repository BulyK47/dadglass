/* Google Play "feature graphic" — 1024x500, no transparency, no rounded corners.
 * Play may crop the edges and overlays the app title on some surfaces, so the
 * important content stays inside the middle band.
 *
 *   npm run feature-graphic
 */
import fs from "fs";
import sharp from "sharp";

fs.mkdirSync("store-assets", { recursive: true });

const glass = (x, y, s) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <clipPath id="c${x}"><path d="M292 300 L347 748 Q347 780 379 780 L645 780 Q677 780 677 748 L732 300 Z"/></clipPath>
    <g clip-path="url(#c${x})">
      <rect x="280" y="418" width="464" height="380" fill="url(#juice)"/>
      <ellipse cx="512" cy="422" rx="207" ry="30" fill="#e59313" opacity="0.45"/>
    </g>
    <rect x="386" y="470" width="34" height="250" rx="17" fill="#fdf3e0" opacity="0.92"/>
    <path d="M292 300 L347 748 Q347 780 379 780 L645 780 Q677 780 677 748 L732 300"
          fill="none" stroke="#fff" stroke-width="27" stroke-linejoin="round" stroke-linecap="round"/>
    <ellipse cx="512" cy="300" rx="220" ry="38" fill="none" stroke="#fff" stroke-width="27"/>
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1220"/><stop offset="55%" stop-color="#16233a"/><stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
    <linearGradient id="juice" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f6a723"/><stop offset="100%" stop-color="#ef8c06"/>
    </linearGradient>
  </defs>

  <rect width="1024" height="500" fill="url(#bg)"/>

  <!-- soft amber glow behind the mark -->
  <circle cx="800" cy="250" r="210" fill="#f59e0b" opacity="0.10"/>

  <!-- the glass mark -->
  ${glass(555, 12, 0.475)}

  <!-- wordmark + tagline (kept left, clear of Play's crop) -->
  <text x="72" y="212" font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif"
        font-size="82" font-weight="700" fill="#ffffff" letter-spacing="-1">DadGlass</text>
  <rect x="74" y="238" width="72" height="6" rx="3" fill="#f59e0b"/>
  <text x="72" y="300" font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif"
        font-size="33" font-weight="600" fill="#cbd5e1">Pregnancy, week by week —</text>
  <text x="72" y="344" font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif"
        font-size="33" font-weight="600" fill="#cbd5e1">built for dads.</text>
  <text x="72" y="404" font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif"
        font-size="25" fill="#94a3b8">Offline · Private · English &amp; Română</text>
</svg>`;

await sharp(Buffer.from(svg), { density: 200 })
  .resize(1024, 500)
  .flatten({ background: "#0b1220" })
  .png()
  .toFile("store-assets/feature-graphic-1024x500.png");

console.log("store-assets/feature-graphic-1024x500.png");
