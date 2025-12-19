import { ReactNode } from 'react';

// Simplified scroll provider - removed Lenis for better performance
// Native smooth scroll is now handled via CSS (scroll-behavior: smooth)

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export const useSmoothScroll = () => ({ lenis: null });

export const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  return <>{children}</>;
};
