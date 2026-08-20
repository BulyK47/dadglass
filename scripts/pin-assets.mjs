/* Keep the freshly-copied native assets on disk, not in the cloud.
 *
 * When the checkout lives in OneDrive (or another sync client), files that
 * `npx cap sync` has just written are prime candidates for being turned into
 * placeholders. Gradle then fails with
 *
 *   Cannot snapshot <file>: not a regular file
 *
 * which names the symptom and not the cause, and it has broken this build
 * repeatedly. `attrib +P -U` marks them "always keep on this device".
 *
 * Windows only, and never fatal: on any other platform, or if attrib is not
 * available, there is nothing to do and the build continues.
 */
import { execFileSync } from "child_process";
import fs from "fs";
import path from "path";

if (process.platform !== "win32") process.exit(0);

const targets = ["android/app/src/main/assets", "dist"].filter((p) => fs.existsSync(p));

for (const target of targets) {
  try {
    execFileSync("attrib", ["+P", "-U", path.resolve(target, "*"), "/S", "/D"], { stdio: "ignore" });
  } catch {
    // Not a synced folder, or attrib unavailable — nothing to keep on disk.
  }
}

if (targets.length) console.log(`[pin-assets] kept on device: ${targets.join(", ")}`);
