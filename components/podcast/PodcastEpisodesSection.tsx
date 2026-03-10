"use client";

import { useState } from "react";
import { Search } from "lucide-react";
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

  const filtered = episodes.filter((ep) => {
    const matchesCategory =
      activeFilter === "all" || ep.category === activeFilter;
    const matchesSearch =
      !searchQuery ||
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div>
      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setActiveFilter(cat.key);
                setVisibleCount(EPISODES_PER_PAGE);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === cat.key
                  ? "bg-[var(--brand-accent)] text-white shadow-md"
                  : "bg-white border border-brown/10 text-dark/60 hover:border-[var(--brand-accent)]/30 hover:text-[var(--brand-accent)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto sm:ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/30" />
          <input
            type="text"
            placeholder={isFr ? "Rechercher un épisode..." : "Search episodes..."}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(EPISODES_PER_PAGE);
            }}
            className="w-full sm:w-64 h-10 pl-10 pr-4 rounded-full bg-white border border-brown/10 text-sm text-dark placeholder:text-dark/40 focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30 transition-all duration-300"
          />
        </div>
      </div>

      {/* Episode Grid */}
      {visible.length > 0 ? (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {visible.map((episode) => (
            <motion.div
              key={episode.id}
              variants={{
                hidden: { opacity: 0, y: 25 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: appleEase },
                },
              }}
            >
              <EpisodeCard episode={episode} locale={locale} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <p className="text-dark/40 text-lg">
            {isFr
              ? "Aucun épisode trouvé pour cette recherche."
              : "No episodes found for this search."}
          </p>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={() => setVisibleCount((c) => c + EPISODES_PER_PAGE)}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white border border-brown/15 text-dark/70 text-sm font-semibold hover:border-[var(--brand-accent)]/40 hover:text-[var(--brand-accent)] hover:shadow-md transition-all duration-300"
          >
            {isFr ? "Voir plus d'épisodes" : "Load more episodes"}
          </button>
        </div>
      )}
    </div>
  );
}
