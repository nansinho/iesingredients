"use client";

import Image from "next/image";
import { Play, Pause, Clock, Calendar, Headphones } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

export interface EpisodeData {
  id: number;
  title: string;
  guest: string;
  guestRole?: string;
  description: string;
  duration: string;
  date: string;
  image: string;
  audioUrl: string;
  episodeNumber: number;
  category?: string;
  collection?: string;
  spotifyUrl?: string;
  applePodcastUrl?: string;
}

const categoryLabels: Record<string, { fr: string; en: string }> = {
  parfumerie: { fr: "Parfumerie", en: "Perfumery" },
  ingredients: { fr: "Ingrédients", en: "Ingredients" },
  innovation: { fr: "Innovation", en: "Innovation" },
  durabilite: { fr: "Durabilité", en: "Sustainability" },
};

const categoryColors: Record<string, string> = {
  parfumerie: "bg-[#8B6A80]/10 text-[#8B6A80]",
  ingredients: "bg-brand-accent/10 text-brand-accent",
  innovation: "bg-blue-500/10 text-blue-600",
  durabilite: "bg-emerald-500/10 text-emerald-600",
};

export function EpisodeCard({
  episode,
  locale = "fr",
}: {
  episode: EpisodeData;
  locale?: string;
}) {
  const { play, pause, currentEpisode, isPlaying } = useAudioPlayer();
  const isCurrentlyPlaying = currentEpisode?.id === episode.id && isPlaying;
  const isCurrent = currentEpisode?.id === episode.id;

  const handlePlay = () => {
    if (isCurrentlyPlaying) {
      pause();
    } else {
      play({
        id: episode.id,
        title: episode.title,
        audioUrl: episode.audioUrl,
        image: episode.image,
      });
    }
  };

  const categoryLabel =
    episode.category && categoryLabels[episode.category]
      ? locale === "fr"
        ? categoryLabels[episode.category].fr
        : categoryLabels[episode.category].en
      : null;

  const categoryColor =
    episode.category && categoryColors[episode.category]
      ? categoryColors[episode.category]
      : "bg-dark/5 text-dark/60";

  const formattedDate = new Date(episode.date).toLocaleDateString(
    locale === "fr" ? "fr-FR" : "en-US",
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <div
      className={`group flex flex-col sm:flex-row bg-white rounded-2xl border overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_rgba(212,144,126,0.12)] ${
        isCurrent
          ? "border-brand-accent/30 shadow-[0_8px_30px_rgba(212,144,126,0.1)]"
          : "border-brown/8 hover:border-brown/20"
      }`}
    >
      {/* Left: Image + Episode Number */}
      <div className="relative w-full sm:w-56 md:w-64 lg:w-72 shrink-0">
        <div className="relative aspect-[16/10] sm:aspect-auto sm:h-full overflow-hidden">
          <Image
            src={episode.image}
            alt={episode.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, 288px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent sm:bg-gradient-to-t sm:from-black/50 sm:to-transparent" />

          {/* Episode number overlay */}
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
            <span className="text-white/50 text-[10px] font-semibold uppercase tracking-[0.15em]">
              {locale === "fr" ? "Épisode" : "Episode"}
            </span>
            <p className="text-white text-2xl sm:text-3xl font-bold leading-none -mt-0.5">
              {String(episode.episodeNumber).padStart(2, "0")}
            </p>
          </div>

          {/* Play button overlay */}
          <button
            onClick={handlePlay}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-5 h-5 text-brand-primary" />
            ) : (
              <Play
                className="w-5 h-5 text-brand-primary ml-0.5"
                fill="currentColor"
              />
            )}
          </button>
        </div>
      </div>

      {/* Right: Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between min-h-0">
        <div>
          {/* Top row: category + date + duration */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {categoryLabel && (
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${categoryColor}`}
              >
                {categoryLabel}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-dark/40">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1 text-xs text-dark/40">
              <Clock className="w-3 h-3" />
              {episode.duration}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-dark text-lg sm:text-xl leading-snug mb-1.5 group-hover:text-brand-primary transition-colors duration-300">
            {episode.title}
          </h3>

          {/* Guest */}
          <p className="text-sm text-brand-accent font-medium mb-3 flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5" />
            {episode.guest}
          </p>

          {/* Description */}
          <p className="text-sm text-dark/50 leading-relaxed line-clamp-2">
            {episode.description}
          </p>
        </div>

        {/* Bottom: Play CTA */}
        <div className="mt-4 pt-4 border-t border-brown/6">
          <button
            onClick={handlePlay}
            className="inline-flex items-center gap-2.5 text-sm font-semibold text-brand-primary hover:text-brand-accent transition-colors duration-300 group/btn"
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                isCurrentlyPlaying
                  ? "bg-brand-accent text-white"
                  : "bg-brand-primary/8 text-brand-primary group-hover/btn:bg-brand-accent/15"
              }`}
            >
              {isCurrentlyPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
              )}
            </span>
            {isCurrentlyPlaying
              ? "Pause"
              : locale === "fr"
                ? "Écouter l'épisode"
                : "Listen to episode"}
          </button>
        </div>
      </div>
    </div>
  );
}
