/* Copy the placeholder illustrations into public/assets so the open-source
 * checkout has images to render.
 *
 *   npm run sample:assets
 *
 * The real DadGlass illustrations are proprietary (CONTENT_LICENSE.md) and are
 * not part of the public repository; this fills the same paths with obvious
 * "sample" tiles so every screen works after a fresh clone.
 * It never overwrites real images that are already present.
 */
import fs from "fs";
import path from "path";

const SRC = "assets.sample";
const DEST = "public/assets";

if (!fs.existsSync(SRC)) {
  console.error(`Missing ${SRC}/ — nothing to copy.`);
  process.exit(1);
}

let copied = 0;
let skipped = 0;
for (const dir of fs.readdirSync(SRC)) {
  const from = path.join(SRC, dir);
  const to = path.join(DEST, dir);
  if (!fs.statSync(from).isDirectory()) continue;
  fs.mkdirSync(to, { recursive: true });
  for (const file of fs.readdirSync(from)) {
    const target = path.join(to, file);
    if (fs.existsSync(target)) { skipped++; continue; }
    fs.copyFileSync(path.join(from, file), target);
    copied++;
  }
}

console.log(`Sample assets: ${copied} copied, ${skipped} already present (left untouched).`);
if (copied) console.log("These are placeholders — the real illustrations are proprietary.");
