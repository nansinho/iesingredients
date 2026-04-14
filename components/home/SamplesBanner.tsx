"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export function SamplesBanner() {
  const [phase, setPhase] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const hasPlayedRef = useRef(false);

  const startSequence = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];

    setPhase(0);

    timersRef.current.push(setTimeout(() => setPhase(1), 1000));
    timersRef.current.push(setTimeout(() => setPhase(2), 3000));
    timersRef.current.push(setTimeout(() => setPhase(3), 5000));

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, []);

  // IntersectionObserver: play once on first view, replay when re-entering
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasPlayedRef.current) {
            // First time visible — start the sequence
            hasPlayedRef.current = true;
            startSequence();
          } else {
            // Re-entering the viewport — replay everything
            startSequence();
          }
        } else if (hasPlayedRef.current) {
          // Left the viewport — pause video, reset state
          timersRef.current.forEach(clearTimeout);
          timersRef.current = [];
          videoRef.current?.pause();
          setPhase(0);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [startSequence]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center justify-center"
    >
      {/* Background video */}
      <video
        ref={videoRef}
        muted
        playsInline
        onEnded={startSequence}
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
