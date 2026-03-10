import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

export interface Episode {
  id: number;
  title: string;
  audioUrl: string;
  image?: string;
}

interface AudioPlayerState {
  currentEpisode: Episode | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  play: (episode: Episode) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVolume: (volume: number) => void;
}

const useAudioStore = create<AudioPlayerState>()(
  persist(
    (set, get) => ({
      currentEpisode: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,

      play: (episode) => {
        const current = get().currentEpisode;
        if (current?.id === episode.id) {
          set({ isPlaying: true });
        } else {
          set({
            currentEpisode: episode,
            isPlaying: true,
            currentTime: 0,
            duration: 0,
          });
        }
      },

      pause: () => set({ isPlaying: false }),

      resume: () => set({ isPlaying: true }),

      stop: () =>
        set({
          currentEpisode: null,
          isPlaying: false,
          currentTime: 0,
          duration: 0,
        }),

      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: "ies-audio-player",
      partialize: (state) => ({
        currentEpisode: state.currentEpisode,
        currentTime: state.currentTime,
        volume: state.volume,
      }),
    }
  )
);

/**
 * Hydration-safe wrapper around the audio player store.
 * Returns empty state during SSR/hydration to prevent mismatches,
 * then syncs with localStorage after mount.
 */
export function useAudioPlayer() {
  const store = useAudioStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return {
      ...store,
      currentEpisode: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
    };
  }

  return store;
}
