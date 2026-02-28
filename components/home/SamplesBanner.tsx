"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export function SamplesBanner() {
  const [phase, setPhase] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const startSequence = useCallback(() => {
    // Clear any existing timers
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setPhase(0);

    // Phase 1: "Chaque création" fades in after 1s
    timersRef.current.push(setTimeout(() => setPhase(1), 1000));

    // Phase 2: "mérite l'exceptionnel." fades in after 3s
    timersRef.current.push(setTimeout(() => setPhase(2), 3000));

    // Phase 3: Logo fades in after 5s
    timersRef.current.push(setTimeout(() => setPhase(3), 5000));
  }, []);

  // Start on mount
  useEffect(() => {
    startSequence();
    return () => timersRef.current.forEach(clearTimeout);
  }, [startSequence]);

  // Restart when video loops
  const handleVideoEnded = useCallback(() => {
    startSequence();
    videoRef.current?.play();
  }, [startSequence]);

  return (
    <section className="relative overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center justify-center">
      {/* Background video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnded}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/Videos/6524721_Caucasian_Girl_Bedroom_1920x1080.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Line 1 */}
        <p
          className={`font-sans font-light tracking-wide uppercase text-white text-3xl md:text-5xl transition-opacity duration-1000 ${
            phase >= 1 ? "opacity-100" : "opacity-0"
          }`}
        >
          Chaque création
        </p>

        {/* Line 2 */}
        <p
          className={`font-sans font-light tracking-wide uppercase text-white text-3xl md:text-5xl mt-2 transition-opacity duration-1000 ${
            phase >= 2 ? "opacity-100" : "opacity-0"
          }`}
        >
          mérite l&apos;exceptionnel.
        </p>

        {/* Logo fade-in */}
        <div
          className={`mt-10 transition-opacity duration-[1500ms] ${
            phase >= 3 ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src="/images/logo-ies.png"
            alt="IES Ingredients"
            width={200}
            height={80}
            className="mx-auto brightness-0 invert"
          />
        </div>
      </div>
    </section>
  );
}
