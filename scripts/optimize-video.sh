#!/usr/bin/env bash
# Recompress the SamplesBanner hero video to a ~1.5 MB WebM + MP4 pair.
# Requires ffmpeg. Run locally then commit the generated files.
#
# Usage: ./scripts/optimize-video.sh
set -euo pipefail

SRC="public/Videos/6524721_Caucasian_Girl_Bedroom_1920x1080.mp4"
OUT_MP4="public/Videos/samples-banner.mp4"
OUT_WEBM="public/Videos/samples-banner.webm"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install it with: brew install ffmpeg (macOS) or apt install ffmpeg (Linux)"
  exit 1
fi

if [ ! -f "$SRC" ]; then
  echo "Source video not found: $SRC"
  exit 1
fi

# 720p H.264 MP4 — broad compatibility, ~1 MB/10s at CRF 28
ffmpeg -y -i "$SRC" \
  -vf "scale='min(1280,iw)':-2" \
  -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p \
  -movflags +faststart \
  -an \
  "$OUT_MP4"

# 720p VP9 WebM — smaller for modern browsers
ffmpeg -y -i "$SRC" \
  -vf "scale='min(1280,iw)':-2" \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 \
  -an \
  "$OUT_WEBM"

echo
echo "Done. Update SamplesBanner.tsx to reference the new files:"
echo "  <source src=\"/Videos/samples-banner.webm\" type=\"video/webm\" />"
echo "  <source src=\"/Videos/samples-banner.mp4\" type=\"video/mp4\" />"
