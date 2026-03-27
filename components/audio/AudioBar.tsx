"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Play, Pause, X, Volume2, VolumeX, RotateCcw, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioBar() {
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    duration,
    volume,
    pause,
    resume,
    stop,
    setCurrentTime,
    setDuration,
    setVolume,
  } = useAudioPlayer();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const prevEpisodeIdRef = useRef<number | null>(null);
  const isSeeking = useRef(false);

  // Create / update audio element when episode changes
  useEffect(() => {
    if (!currentEpisode) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      prevEpisodeIdRef.current = null;
      return;
    }

    if (prevEpisodeIdRef.current !== currentEpisode.id) {
      // New episode
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }

      const audio = new Audio(currentEpisode.audioUrl);
      audio.volume = volume;
      audioRef.current = audio;
      prevEpisodeIdRef.current = currentEpisode.id;

      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
        if (currentTime > 0) {
          audio.currentTime = currentTime;
        }
      });

      audio.addEventListener("ended", () => {
        pause();
        setCurrentTime(0);
      });

      audio.addEventListener("error", () => {
        // Silently handle missing audio files (demo/placeholder)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEpisode?.id]);

  // Play / pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentEpisode) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // autoplay blocked — user will click again
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentEpisode]);

  // Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Time update — sync to store periodically
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!isSeeking.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => audio.removeEventListener("timeupdate", onTimeUpdate);
  }, [setCurrentTime, currentEpisode]);

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      setCurrentTime(time);
      if (audioRef.current) {
        audioRef.current.currentTime = time;
      }
    },
    [setCurrentTime]
  );

  const handleSeekStart = useCallback(() => {
    isSeeking.current = true;
  }, []);

  const handleSeekEnd = useCallback(() => {
    isSeeking.current = false;
  }, []);

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVolume(parseFloat(e.target.value));
    },
    [setVolume]
  );

  const toggleMute = useCallback(() => {
    setVolume(volume === 0 ? 0.8 : 0);
  }, [volume, setVolume]);

  const skipBackward = useCallback(() => {
    const newTime = Math.max(0, currentTime - 15);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  }, [currentTime, setCurrentTime]);

  const skipForward = useCallback(() => {
    const newTime = Math.min(duration, currentTime + 15);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  }, [currentTime, duration, setCurrentTime]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {currentEpisode && (
        <>
          {/* Spacer so content doesn't hide behind the fixed bar */}
          <div className="h-[72px]" />

          {/* Fixed audio bar */}
          <motion.div
            initial={{ y: 72, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 72, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 h-[72px] bg-white/95 backdrop-blur-xl border-t border-brown/10 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]"
          >
            <div className="h-full max-w-[1400px] mx-auto px-4 sm:px-6 flex items-center gap-3 sm:gap-4">
              {/* Episode image */}
              {currentEpisode.image && (
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-brown/10">
                  <Image
                    src={currentEpisode.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
              )}

              {/* Title */}
              <div className="min-w-0 shrink-0 max-w-[120px] sm:max-w-[200px]">
                <p className="text-sm font-semibold text-dark truncate leading-tight">
                  {currentEpisode.title}
                </p>
                <p className="text-xs text-dark/40 truncate">
                  À Fleur De Nez
                </p>
              </div>

              {/* Skip back */}
              <button
                onClick={skipBackward}
                className="hidden sm:flex w-8 h-8 items-center justify-center text-dark/40 hover:text-dark transition-colors shrink-0"
                aria-label="Reculer 15 secondes"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={() => (isPlaying ? pause() : resume())}
                className="w-9 h-9 rounded-full bg-brand-accent hover:bg-brand-accent/80 flex items-center justify-center shrink-0 transition-colors duration-200 shadow-md"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white" fill="white" />
                ) : (
                  <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
                )}
              </button>

              {/* Skip forward */}
              <button
                onClick={skipForward}
                className="hidden sm:flex w-8 h-8 items-center justify-center text-dark/40 hover:text-dark transition-colors shrink-0"
                aria-label="Avancer 15 secondes"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Time + Progress */}
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <span className="text-[11px] text-dark/40 tabular-nums shrink-0 hidden sm:block">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 relative group">
                  <div className="h-1.5 rounded-full bg-brown/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-accent transition-[width] duration-150"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    onMouseDown={handleSeekStart}
                    onMouseUp={handleSeekEnd}
                    onTouchStart={handleSeekStart}
                    onTouchEnd={handleSeekEnd}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-[11px] text-dark/40 tabular-nums shrink-0 hidden sm:block">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Volume — hidden on mobile */}
              <div className="hidden md:flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  className="text-dark/40 hover:text-dark transition-colors"
                >
                  {volume === 0 ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <div className="relative w-20 group">
                  <div className="h-1 rounded-full bg-brown/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-dark/20"
                      style={{ width: `${volume * 100}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={handleVolumeChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Close */}
              <button
                onClick={stop}
                className="text-dark/30 hover:text-dark transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
