"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Library } from "lucide-react";
import { motion } from "framer-motion";
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
  const isFr = locale === "fr";
  const [activeCollection, setActiveCollection] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCollectionClick = (id: string) => {
    setActiveCollection((prev) => (prev === id ? null : id));
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  const activeCollectionData = activeCollection
    ? collections.find((c) => c.id === activeCollection)
    : null;

  return (
    <div>
      {/* ─── Collections Scroll ─── */}
      <div className="relative">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-brown/10 shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 -translate-x-1/2 hidden md:flex"
        >
          <ChevronLeft className="w-5 h-5 text-dark/60" />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-brown/10 shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 translate-x-1/2 hidden md:flex"
        >
          <ChevronRight className="w-5 h-5 text-dark/60" />
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              isActive={activeCollection === collection.id}
              onClick={() => handleCollectionClick(collection.id)}
            />
          ))}
        </div>
      </div>

      {/* ─── Active collection indicator ─── */}
      {activeCollectionData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 mb-2 flex items-center gap-3"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: activeCollectionData.color }}
          />
          <p className="text-dark/70 text-sm font-medium">
            {isFr ? "Filtré par collection :" : "Filtered by collection:"}{" "}
            <span className="text-dark font-semibold">
              {activeCollectionData.title}
            </span>
          </p>
          <button
            onClick={() => setActiveCollection(null)}
            className="ml-auto text-xs text-dark/40 hover:text-dark/60 transition-colors flex items-center gap-1"
          >
            <Library className="w-3 h-3" />
            {isFr ? "Voir tout" : "Show all"}
          </button>
        </motion.div>
      )}

      {/* ─── Episodes ─── */}
      <div className="mt-10">
        <PodcastEpisodesSection
          episodes={episodes}
          locale={locale}
          activeCollection={activeCollection}
        />
      </div>
    </div>
  );
}
