"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const AUTOPLAY_DELAY = 5000;

const slides = [
  {
    image: "/images/botanicals-flat.jpg",
    titleKey: "slide1Title" as const,
    subtitleKey: "slide1Subtitle" as const,
  },
  {
    image: "/images/essential-oil.jpg",
    titleKey: "slide2Title" as const,
    subtitleKey: "slide2Subtitle" as const,
  },
  {
    image: "/images/blueberries-herbs.jpg",
    titleKey: "slide3Title" as const,
    subtitleKey: "slide3Subtitle" as const,
  },
];

const certifications = ["COSMOS", "ECOCERT", "BIO", "VEGAN", "ISO 9001"];

export function ParallaxHero() {
  const t = useTranslations("hero");
  const certT = useTranslations("certifications");

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: AUTOPLAY_DELAY, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setProgressKey((prev) => prev + 1);
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="flex-1 flex flex-col pt-28 sm:pt-32 px-3 sm:px-5 pb-3 sm:pb-5 bg-[#2E1F3D]">
      {/* ═══════════════════════════════════════
         Furdesign-style rounded bordered container
         ═══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex-1 rounded-[1.5rem] sm:rounded-[2rem] border border-[#2E1F3D]/10 overflow-hidden bg-[#F0C5B3]"
      >
        {/* Inner grid: Text left | Image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* ── Left: Text content ── */}
          <div className="relative z-10 flex flex-col justify-between p-7 sm:p-10 lg:p-14 xl:p-16">
            {/* Top: surtitle */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#2E1F3D]/45 font-semibold">
                {t("surtitle")}
              </span>
            </motion.div>

            {/* Center: Title + subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="my-8 lg:my-0"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-bold text-[#2E1F3D] tracking-[-0.04em] leading-[0.95]">
                {t("titleLine1")}
                <br />
                <span className="font-playfair italic text-[#5B5470]">
                  {t("titleLine2")}
                </span>
              </h1>
              <p className="text-[#2E1F3D]/45 text-sm sm:text-base mt-6 max-w-sm leading-relaxed">
                {t("subtitle")}
              </p>
            </motion.div>

            {/* Bottom: Circular CTA + slide counter + certifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-6"
            >
              <div className="flex items-end justify-between">
                {/* Circular CTA */}
                <Link
                  href="/catalogue"
                  className="group relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#2E1F3D] flex items-center justify-center hover:bg-[#5B5470] transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-[1.03]"
                >
                  <div className="text-center">
                    <ArrowUpRight className="w-6 h-6 text-white mx-auto mb-1.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span className="text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider leading-tight block px-4">
                      {t("cta")}
                    </span>
                  </div>
                </Link>

                {/* Slide counter */}
                <div className="hidden sm:flex items-center gap-3">
                  <span className="text-sm font-bold text-[#2E1F3D]/60">
                    {String(selectedIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="w-16 h-[2px] bg-[#2E1F3D]/12 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#2E1F3D]/50 rounded-full"
                      animate={{ width: `${((selectedIndex + 1) / slides.length) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                  <span className="text-sm font-bold text-[#2E1F3D]/25">
                    {String(slides.length).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Certifications strip */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] text-[#2E1F3D]/30 tracking-[0.12em] uppercase font-medium border-t border-[#2E1F3D]/8 pt-4">
                <span className="text-[#2E1F3D]/45 mr-1">
                  {certT("title")}
                </span>
                {certifications.map((cert, i) => (
                  <React.Fragment key={cert}>
                    {i > 0 && <span className="text-[#2E1F3D]/10 hidden sm:inline">·</span>}
                    <span>{cert}</span>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right: Carousel image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="h-full min-h-[320px] lg:min-h-0 overflow-hidden" ref={emblaRef}>
              <div className="flex h-full">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="flex-[0_0_100%] min-w-0 relative"
                  >
                    <Image
                      src={slide.image}
                      alt={t(slide.titleKey)}
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Glass card overlay — bottom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-7"
            >
              <div className="bg-white/15 backdrop-blur-xl rounded-2xl border border-white/25 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white/60 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium mb-1">
                      {t(slides[selectedIndex].subtitleKey)}
                    </p>
                    <p className="text-white text-base sm:text-lg font-bold tracking-[-0.02em]">
                      {t(slides[selectedIndex].titleKey)}
                    </p>
                  </div>
                  <Link
                    href="/catalogue"
                    className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/35 transition-all duration-300 border border-white/20"
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Nav arrows — top right */}
            <div className="absolute top-5 right-5 sm:top-7 sm:right-7 flex gap-2 z-10">
              <button
                onClick={scrollPrev}
                className="w-10 h-10 rounded-full bg-white/12 backdrop-blur-sm border border-white/15 flex items-center justify-center hover:bg-white/25 transition-all duration-300"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 text-white/80" />
              </button>
              <button
                onClick={scrollNext}
                className="w-10 h-10 rounded-full bg-white/12 backdrop-blur-sm border border-white/15 flex items-center justify-center hover:bg-white/25 transition-all duration-300"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 text-white/80" />
              </button>
            </div>

            {/* Progress bar per-slide — top left */}
            <div className="absolute top-5 left-5 sm:top-7 sm:left-7 flex gap-1.5 z-10">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className="h-[3px] rounded-full overflow-hidden bg-white/15 transition-all duration-300"
                  style={{ width: index === selectedIndex ? 40 : 14 }}
                >
                  {index === selectedIndex && (
                    <motion.div
                      className="h-full bg-white/80 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: AUTOPLAY_DELAY / 1000, ease: "linear" }}
                      key={`progress-${progressKey}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
}
