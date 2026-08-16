/* One-time image optimization: convert the large week PNGs in public/assets to
 * resized WebP (~640px) and move the originals out of public/ (so they are not
 * shipped). Re-runnable: it only processes PNGs still present in public/assets.
 *
 *   node scripts/optimize-images.mjs
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const dirs = ["baby", "glasses", "dad-objects"];
const publicAssets = path.resolve("public/assets");
const backupRoot = path.resolve("image-originals/assets");

const MAX = 640;
const QUALITY = 82;

let count = 0;
let beforeBytes = 0;
let afterBytes = 0;

for (const dir of dirs) {
  const src = path.join(publicAssets, dir);
  if (!fs.existsSync(src)) continue;
  const backupDir = path.join(backupRoot, dir);
  fs.mkdirSync(backupDir, { recursive: true });

  for (const file of fs.readdirSync(src)) {
    if (!file.toLowerCase().endsWith(".png")) continue;
    const pngPath = path.join(src, file);
    const webpPath = pngPath.replace(/\.png$/i, ".webp");
    const before = fs.statSync(pngPath).size;
    beforeBytes += before;

    const buf = await sharp(pngPath).resize(MAX, MAX, { fit: "inside", withoutEnlargement: true }).webp({ quality: QUALITY }).toBuffer();
    fs.writeFileSync(webpPath, buf);
    afterBytes += buf.length;

    // Move the original PNG out of public/ so it is not bundled.
    fs.renameSync(pngPath, path.join(backupDir, file));
    count++;
  }
}

const mb = (n) => (n / 1048576).toFixed(1);
console.log(`Converted ${count} PNG -> WebP`);
console.log(`  before: ${mb(beforeBytes)} MB  ->  after: ${mb(afterBytes)} MB`);
console.log(`  originals moved to image-originals/assets/`);
