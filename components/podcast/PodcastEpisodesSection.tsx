"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";
import { EpisodeCard } from "./EpisodeCard";
import type { EpisodeData } from "./EpisodeCard";

const appleEase = [0.22, 1, 0.36, 1] as const;

const EPISODES_PER_PAGE = 6;

interface PodcastEpisodesSectionProps {
  episodes: EpisodeData[];
  locale: string;
}

const categoriesFr = [
  { key: "all", label: "Tous" },
  { key: "parfumerie", label: "Parfumerie" },
  { key: "ingredients", label: "Ingrédients" },
  { key: "innovation", label: "Innovation" },
  { key: "durabilite", label: "Durabilité" },
];

const categoriesEn = [
  { key: "all", label: "All" },
  { key: "parfumerie", label: "Perfumery" },
  { key: "ingredients", label: "Ingredients" },
  { key: "innovation", label: "Innovation" },
  { key: "durabilite", label: "Sustainability" },
];

export function PodcastEpisodesSection({
  episodes,
  locale,
}: PodcastEpisodesSectionProps) {
  const isFr = locale === "fr";
  const categories = isFr ? categoriesFr : categoriesEn;
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(EPISODES_PER_PAGE);

  const filtered = useMemo(() => {
    return episodes.filter((ep) => {
      const matchesCategory =
        activeFilter === "all" || ep.category === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        ep.title.toLowerCase().includes(q) ||
        ep.guest.toLowerCase().includes(q) ||
        ep.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [episodes, activeFilter, searchQuery]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleFilterChange = (key: string) => {
    setActiveFilter(key);
    setVisibleCount(EPISODES_PER_PAGE);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setVisibleCount(EPISODES_PER_PAGE);
  };

  return (
    <div>
      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = activeFilter === cat.key;
            const count =
              cat.key === "all"
                ? episodes.length
                : episodes.filter((e) => e.category === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => handleFilterChange(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20"
                    : "bg-white border border-brown/10 text-dark/60 hover:border-brand-primary/30 hover:text-brand-primary"
                }`}
              >
                {cat.label}
                <span
                  className={`ml-1.5 text-xs ${isActive ? "text-white/60" : "text-dark/30"}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
          <input
            type="text"
            placeholder={
              isFr ? "Rechercher un épisode..." : "Search episodes..."
            }
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full sm:w-72 h-11 pl-10 pr-10 rounded-full bg-white border border-brown/10 text-sm text-dark placeholder:text-dark/35 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/30 transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-dark/10 flex items-center justify-center hover:bg-dark/20 transition-colors"
            >
              <X className="w-3 h-3 text-dark/50" />
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-dark/40 mb-6">
        {filtered.length}{" "}
        {isFr
          ? filtered.length > 1
            ? "épisodes"
            : "épisode"
          : filtered.length > 1
            ? "episodes"
            : "episode"}
        {activeFilter !== "all" &&
          ` · ${categories.find((c) => c.key === activeFilter)?.label}`}
        {searchQuery && ` · "${searchQuery}"`}
      </p>

      {/* Episode List */}
      {visible.length > 0 ? (
        <div className="flex flex-col gap-4">
          {visible.map((episode, index) => (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
                ease: appleEase,
              }}
            >
              <EpisodeCard episode={episode} locale={locale} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-brown/8">
          <div className="w-16 h-16 rounded-full bg-dark/5 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-dark/20" />
          </div>
          <p className="text-dark/50 text-lg font-medium mb-1">
            {isFr ? "Aucun épisode trouvé" : "No episodes found"}
          </p>
          <p className="text-dark/30 text-sm">
            {isFr
              ? "Essayez un autre mot-clé ou changez de filtre."
              : "Try another keyword or change the filter."}
          </p>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((c) => c + EPISODES_PER_PAGE)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary/90 shadow-md shadow-brand-primary/15 hover:shadow-lg transition-all duration-300"
          >
            {isFr ? "Voir plus d'épisodes" : "Load more episodes"}
          </button>
        </div>
      )}
    </div>
  );
}
