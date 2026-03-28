"use client";

import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function MediathequePage() {
  return (
    <MediaLibrary
      open={false}
      onClose={() => {}}
      onSelect={() => {}}
      standalone
    />
  );
}
