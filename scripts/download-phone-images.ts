/**
 * Downloads one GSMArena product image per phone model and saves it
 * to public/phone-images/<filename>.jpg.
 *
 * Run: npx tsx scripts/download-phone-images.ts
 */

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const BASE = "https://fdn2.gsmarena.com/vv/bigpic";
const OUT  = join(process.cwd(), "public", "phone-images");

// ── Image map: local filename → GSMArena slug ────────────────────────────────
// One entry per distinct phone model (color variants share the same image).
const IMAGES: Record<string, string> = {
  // ── Apple ──────────────────────────────────────────────────────────────────
  "iphone-15-pro-max.jpg":  "apple-iphone-15-pro-max.jpg",
  "iphone-15-pro.jpg":      "apple-iphone-15-pro.jpg",
  "iphone-15-plus.jpg":     "apple-iphone-15-plus-.jpg",   // trailing dash in GSMArena slug
  "iphone-15.jpg":          "apple-iphone-15.jpg",
  "iphone-14-pro-max.jpg":  "apple-iphone-14-pro-max-.jpg", // trailing dash
  "iphone-14-pro.jpg":      "apple-iphone-14-pro.jpg",
  "iphone-14-plus.jpg":     "apple-iphone-14-plus.jpg",
  "iphone-14.jpg":          "apple-iphone-14.jpg",
  "iphone-13-pro-max.jpg":  "apple-iphone-13-pro-max.jpg",
  "iphone-13-pro.jpg":      "apple-iphone-13-pro.jpg",
  "iphone-13-mini.jpg":     "apple-iphone-13-mini.jpg",
  "iphone-13.jpg":          "apple-iphone-13.jpg",
  "iphone-12-pro-max.jpg":  "apple-iphone-12-pro-max.jpg",
  "iphone-12-pro.jpg":      "apple-iphone-12-pro.jpg",
  "iphone-12-mini.jpg":     "apple-iphone-12-mini.jpg",
  "iphone-12.jpg":          "apple-iphone-12.jpg",
  "iphone-11-pro.jpg":      "apple-iphone-11-pro.jpg",
  "iphone-11.jpg":          "apple-iphone-11.jpg",
  "iphone-se-2022.jpg":     "apple-iphone-se-2022.jpg",
  "iphone-x.jpg":           "apple-iphone-x.jpg",

  // ── Samsung ─────────────────────────────────────────────────────────────────
  "galaxy-s24-ultra.jpg":   "samsung-galaxy-s24-ultra-5g-sm-s928-stylus.jpg",
  "galaxy-s24-plus.jpg":    "samsung-galaxy-s24-plus-5g-sm-s926.jpg",
  "galaxy-s24.jpg":         "samsung-galaxy-s24-5g-sm-s921.jpg",
  "galaxy-s23-ultra.jpg":   "samsung-galaxy-s23-ultra-5g.jpg",
  "galaxy-s23-plus.jpg":    "samsung-galaxy-s23-plus-5g.jpg",
  "galaxy-s23.jpg":         "samsung-galaxy-s23-5g.jpg",
  "galaxy-s22-ultra.jpg":   "samsung-galaxy-s22-ultra-5g.jpg",
  "galaxy-s22-plus.jpg":    "samsung-galaxy-s22-plus-5g.jpg",
  "galaxy-s22.jpg":         "samsung-galaxy-s22-5g.jpg",
  "galaxy-z-fold5.jpg":     "samsung-galaxy-z-fold5-5g.jpg",
  "galaxy-z-flip5.jpg":     "samsung-galaxy-z-flip5-5g.jpg",
  "galaxy-s21-ultra.jpg":   "samsung-galaxy-s21-ultra-5g-.jpg",  // trailing dash
  "galaxy-s21-fe.jpg":      "samsung-galaxy-s21-fe-5g.jpg",
  "galaxy-a54.jpg":         "samsung-galaxy-a54.jpg",

  // ── Google Pixel ────────────────────────────────────────────────────────────
  "pixel-8-pro.jpg":        "google-pixel-8-pro.jpg",
  "pixel-8.jpg":            "google-pixel-8.jpg",
  "pixel-7-pro.jpg":        "google-pixel7-pro-new.jpg",  // note: pixel7 (no dash) + -new suffix
  "pixel-7.jpg":            "google-pixel7-new.jpg",
  "pixel-7a.jpg":           "google-pixel-7a.jpg",
  "pixel-6-pro.jpg":        "google-pixel-6-pro.jpg",
  "pixel-6.jpg":            "google-pixel-6.jpg",
};

async function download(url: string, dest: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: {
        // GSMArena serves images without Referer checks, but a UA helps avoid 403s
        "User-Agent": "Mozilla/5.0 (compatible; VoltaMobile/1.0)",
      },
    });

    if (!res.ok) {
      console.error(`  ✗  HTTP ${res.status}  ${url}`);
      return false;
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("image")) {
      console.error(`  ✗  Not an image (${contentType})  ${url}`);
      return false;
    }

    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(dest, buf);
    const kb = (buf.byteLength / 1024).toFixed(1);
    console.log(`  ✓  ${kb.padStart(6)} KB  → ${dest.split(/[\\/]/).pop()}`);
    return true;
  } catch (err) {
    console.error(`  ✗  ${(err as Error).message}  ${url}`);
    return false;
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });

  console.log(`\nDownloading ${Object.keys(IMAGES).length} phone images → public/phone-images/\n`);

  let ok = 0;
  let fail = 0;
  const failed: string[] = [];

  for (const [localName, gsmaSlug] of Object.entries(IMAGES)) {
    const url  = `${BASE}/${gsmaSlug}`;
    const dest = join(OUT, localName);
    const success = await download(url, dest);
    if (success) {
      ok++;
    } else {
      fail++;
      failed.push(localName);
    }
    // Small pause to avoid hammering the server
    await new Promise((r) => setTimeout(r, 120));
  }

  console.log(`\n── Summary ──────────────────────────────`);
  console.log(`  Downloaded : ${ok}`);
  console.log(`  Failed     : ${fail}`);
  if (failed.length) {
    console.log(`\n  Failed files:`);
    failed.forEach((f) => console.log(`    - ${f}`));
  }
  console.log();
}

main().catch((e) => { console.error(e); process.exit(1); });
