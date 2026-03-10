"use client";

import Image from "next/image";
import { Play, Pause, Clock, Calendar } from "lucide-react";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { AnimateIn } from "@/components/ui/AnimateIn";

export interface EpisodeData {
  id: number;
  title: string;
  guest: string;
  description: string;
  duration: string;
  date: string;
  image: string;
  audioUrl: string;
  episodeNumber: number;
}

export function EpisodeCard({ episode }: { episode: EpisodeData }) {
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

  return (
    <AnimateIn y={20}>
      <div
        className={`group bg-white dark:bg-dark-card rounded-2xl border overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_rgba(212,144,126,0.12)] hover:-translate-y-1 ${
          isCurrent
            ? "border-[var(--brand-accent)]/30 shadow-[0_8px_30px_rgba(212,144,126,0.1)]"
            : "border-brown/8 hover:border-brown/20"
        }`}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={episode.image}
            alt={episode.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <button
            onClick={handlePlay}
            className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-dark text-xs font-semibold hover:bg-white transition-all duration-300 shadow-lg"
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-3.5 h-3.5 text-[var(--brand-accent)]" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[var(--brand-accent)]" fill="currentColor" />
            )}
            {episode.duration}
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-dark/40 dark:text-cream-light/40 mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(episode.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {`Épisode ${episode.episodeNumber}`}
            </span>
          </div>

          <h3 className="font-semibold text-dark dark:text-cream-light text-base mb-1.5 leading-snug">
            {episode.title}
          </h3>

          <p className="text-sm text-[var(--brand-accent)] font-medium mb-2">
            {episode.guest}
          </p>

          <p className="text-sm text-dark/50 dark:text-cream-light/50 leading-relaxed line-clamp-2 mb-4">
            {episode.description}
          </p>

          <button
            onClick={handlePlay}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-accent)] hover:text-[var(--brand-primary)] transition-colors duration-300 group/btn"
          >
            {isCurrentlyPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" fill="currentColor" />
                Écouter
              </>
            )}
            <span className="group-hover/btn:translate-x-0.5 transition-transform duration-300">
              &rarr;
            </span>
          </button>
        </div>
      </div>
    </AnimateIn>
  );
}
