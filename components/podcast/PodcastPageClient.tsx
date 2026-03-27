"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CollectionCard } from "./CollectionCard";
import type { CollectionData } from "./CollectionCard";
import { PodcastEpisodesSection } from "./PodcastEpisodesSection";
import type { EpisodeData } from "./EpisodeCard";

interface PodcastPageClientProps {
  collections: CollectionData[];
  episodes: EpisodeData[];
  locale: string;
}

export function PodcastPageClient({
  collections,
  episodes,
  locale,
}: PodcastPageClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      {/* ─── Collections Scroll ─── */}
      <div className="relative overflow-hidden">
        {/* Scroll buttons — inside container, not overflowing */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-[calc(50%-40px)] z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-brown/10 shadow-md flex items-center justify-center hover:bg-white transition-all duration-300 hidden md:flex"
        >
          <ChevronLeft className="w-4 h-4 text-dark/60" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-[calc(50%-40px)] z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-brown/10 shadow-md flex items-center justify-center hover:bg-white transition-all duration-300 hidden md:flex"
        >
          <ChevronRight className="w-4 h-4 text-dark/60" />
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              locale={locale}
            />
          ))}
        </div>
      </div>

      {/* ─── Episodes ─── */}
      <div className="mt-14">
        <h3 className="text-2xl sm:text-3xl font-semibold text-dark tracking-tight mb-8">
          {locale === "fr" ? "Tous les" : "All"}{" "}
          <span className="font-playfair italic text-brand-accent">
            {locale === "fr" ? "épisodes" : "episodes"}
          </span>
        </h3>
        <PodcastEpisodesSection episodes={episodes} locale={locale} />
      </div>
    </div>
  );
}
