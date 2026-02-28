"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const TYPING_TEXT = "C'est comme ça que les histoires commencent...";
const CHAR_DELAY = 70;
const LOGO_DELAY = 800;

export function SamplesBanner() {
  const [charIndex, setCharIndex] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const typingDone = charIndex >= TYPING_TEXT.length;

  // Typing effect
  useEffect(() => {
    if (typingDone) return;
    const timer = setInterval(() => {
      setCharIndex((prev) => {
        if (prev >= TYPING_TEXT.length) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, CHAR_DELAY);
    return () => clearInterval(timer);
  }, [typingDone]);

  // Logo fade-in after typing completes
  useEffect(() => {
    if (!typingDone) return;
    const timer = setTimeout(() => setShowLogo(true), LOGO_DELAY);
    return () => clearTimeout(timer);
  }, [typingDone]);

  return (
    <section className="relative overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center justify-center">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/Videos/6524721_Caucasian_Girl_Bedroom_1920x1080.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        {/* Typing text */}
        <p className="font-playfair italic text-white text-2xl md:text-4xl leading-relaxed">
          {TYPING_TEXT.slice(0, charIndex)}
          <span
            className={`inline-block w-[2px] h-[1em] bg-white ml-1 align-middle ${
              typingDone ? "animate-pulse" : "animate-blink"
            }`}
          />
        </p>

        {/* Logo fade-in */}
        <div
          className={`mt-10 transition-opacity duration-[1500ms] ${
            showLogo ? "opacity-100" : "opacity-0"
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
