"use client";

import Image from "next/image";
import { Play, Headphones } from "lucide-react";

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
  isActive,
  onClick,
}: {
  collection: CollectionData;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col w-[260px] sm:w-[280px] shrink-0 rounded-2xl overflow-hidden transition-all duration-500 text-left ${
        isActive
          ? "ring-2 ring-[var(--brand-accent)] shadow-[0_12px_40px_rgba(212,144,126,0.2)] scale-[1.02]"
          : "hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1"
      }`}
    >
      {/* Cover Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="280px"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${collection.color}ee 0%, ${collection.color}80 40%, transparent 100%)`,
          }}
        />

        {/* Play icon overlay */}
        <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Play className="w-4 h-4 text-white ml-0.5" fill="currentColor" />
        </div>

        {/* Bottom overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-white font-semibold text-lg leading-snug mb-1">
            {collection.title}
          </h3>
          <p className="text-white/60 text-xs flex items-center gap-1.5">
            <Headphones className="w-3 h-3" />
            {collection.episodeCount}{" "}
            {collection.episodeCount > 1 ? "épisodes" : "épisode"}
          </p>
        </div>
      </div>

      {/* Bottom info */}
      <div className="bg-white p-4 border border-t-0 border-brown/8 rounded-b-2xl">
        <p className="text-dark/50 text-xs leading-relaxed line-clamp-2">
          {collection.description}
        </p>
      </div>

      {/* Active indicator */}
      {isActive && (
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full bg-[var(--brand-accent)] text-white text-[10px] font-semibold uppercase tracking-wider shadow-md">
            En cours
          </span>
        </div>
      )}
    </button>
  );
}
