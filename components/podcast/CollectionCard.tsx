"use client";

import Image from "next/image";
import { Headphones } from "lucide-react";

export interface CollectionData {
  id: string;
  title: string;
  description: string;
  image: string;
  episodeCount: number;
  color: string;
}

export function CollectionCard({
  collection,
  locale = "fr",
}: {
  collection: CollectionData;
  locale?: string;
}) {
  return (
    <div className="group w-[240px] sm:w-[260px] shrink-0 snap-start">
      {/* Cover Image */}
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="260px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Episode count badge */}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-semibold text-dark/70 flex items-center gap-1">
          <Headphones className="w-3 h-3" />
          {collection.episodeCount}{" "}
          {collection.episodeCount > 1
            ? locale === "fr"
              ? "épisodes"
              : "episodes"
            : locale === "fr"
              ? "épisode"
              : "episode"}
        </div>

        {/* Color accent bar at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{ backgroundColor: collection.color }}
        />
      </div>

      {/* Text content */}
      <h3 className="font-semibold text-dark text-[15px] leading-snug mb-1 group-hover:text-brand-primary transition-colors duration-300">
        {collection.title}
      </h3>
      <p className="text-dark/45 text-xs leading-relaxed line-clamp-2">
        {collection.description}
      </p>
    </div>
  );
}
