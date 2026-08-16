/* Regenerate every app icon from the single vector master (assets/icon-source.svg).
 *
 *   npm run icons
 *
 * Produces:
 *   assets/icon.png, icon-foreground.png, icon-background.png  -> input for
 *     `npx capacitor-assets generate` (Android launcher + adaptive icons)
 *   public/icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png
 *     -> the PWA / iOS home-screen icons referenced by the manifest + index.html
 *
 * Icons are flattened onto an opaque background: iOS rejects icons with an alpha
 * channel, and the OS applies its own corner mask, so we never round the corners.
 */
import fs from "fs";
import sharp from "sharp";

const SRC = "assets/icon-source.svg";
const BG = "#0d1526";

if (!fs.existsSync(SRC)) {
  console.error(`Missing ${SRC}`);
  process.exit(1);
}
const svg = fs.readFileSync(SRC);

/** Render the master at `size`, flattened (no alpha). */
const render = (size, out) =>
  sharp(svg, { density: 384 })
    .resize(size, size)
    .flatten({ background: BG })
    .png()
    .toFile(out)
    .then(() => console.log(`  ${out}  ${size}x${size}`));

/**
 * Android adaptive icons mask the foreground into a circle/squircle, so the
 * artwork must sit inside the middle ~66%. We scale the master down and pad it.
 */
async function foreground(size, out) {
  const inner = Math.round(size * 0.66);
  const pad = Math.round((size - inner) / 2);
  const art = await sharp(svg, { density: 384 }).resize(inner, inner).png().toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: art, top: pad, left: pad }])
    .png()
    .toFile(out);
  console.log(`  ${out}  ${size}x${size} (safe-zone padded)`);
}

console.log("Rendering icons from " + SRC);
fs.mkdirSync("assets", { recursive: true });

await render(1024, "assets/icon.png");
await foreground(1024, "assets/icon-foreground.png");
await sharp({ create: { width: 1024, height: 1024, channels: 4, background: BG } })
  .png()
  .toFile("assets/icon-background.png");
console.log("  assets/icon-background.png  1024x1024");

await render(192, "public/icon-192.png");
await render(512, "public/icon-512.png");
await render(512, "public/icon-maskable-512.png");
await render(180, "public/apple-touch-icon.png");

console.log("\nDone. Next: npx capacitor-assets generate --android");
