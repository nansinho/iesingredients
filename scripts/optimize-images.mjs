#!/usr/bin/env node
/**
 * Re-compress all JPG/PNG images under public/ in place using sharp.
 *
 * - Resizes images wider than MAX_WIDTH down to MAX_WIDTH (keeps aspect ratio).
 * - Re-encodes JPG with mozjpeg quality 82, progressive.
 * - Re-encodes PNG with compressionLevel 9 + palette when possible.
 * - Skips SVG, WEBP, AVIF, GIF.
 * - Idempotent: already-optimized files stay roughly the same size.
 *
 * Usage: node scripts/optimize-images.mjs
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "public");
const MAX_WIDTH = 2000;
const JPG_QUALITY = 82;
const SKIP_DIRS = new Set([".git", "node_modules"]);
const ALLOWED = new Set([".jpg", ".jpeg", ".png"]);

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

function fmt(bytes) {
  if (bytes > 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + " MB";
  return (bytes / 1024).toFixed(1) + " KB";
}

async function optimize(file) {
  const ext = extname(file).toLowerCase();
  if (!ALLOWED.has(ext)) return null;

  const before = await readFile(file);
  const originalSize = before.byteLength;

  const pipeline = sharp(before, { failOn: "none" });
  const meta = await pipeline.metadata();
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  let buffer;
  if (ext === ".png") {
    buffer = await pipeline
      .png({ compressionLevel: 9, palette: true, quality: 90 })
      .toBuffer();
  } else {
    buffer = await pipeline
      .jpeg({ quality: JPG_QUALITY, progressive: true, mozjpeg: true })
      .toBuffer();
  }

  if (buffer.byteLength >= originalSize) {
    return { file, originalSize, newSize: originalSize, skipped: true };
  }

  await writeFile(file, buffer);
  return { file, originalSize, newSize: buffer.byteLength, skipped: false };
}

const files = await walk(ROOT);
let totalBefore = 0;
let totalAfter = 0;
let changed = 0;

for (const file of files) {
  try {
    const result = await optimize(file);
    if (!result) continue;
    totalBefore += result.originalSize;
    totalAfter += result.newSize;
    if (!result.skipped) {
      changed++;
      const saved = result.originalSize - result.newSize;
      const pct = ((saved / result.originalSize) * 100).toFixed(0);
      console.log(
        `  ${file.replace(ROOT, "")}: ${fmt(result.originalSize)} → ${fmt(result.newSize)} (-${pct}%)`,
      );
    }
  } catch (err) {
    console.warn(`  ! skipped ${file}: ${err.message}`);
  }
}

console.log();
console.log(
  `Optimized ${changed} file(s). Total: ${fmt(totalBefore)} → ${fmt(totalAfter)} (saved ${fmt(totalBefore - totalAfter)}).`,
);
