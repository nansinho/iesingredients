"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

const AUTOPLAY_DELAY = 5000;

const slides = [
  {
    image: "/images/Aromes/Aromes Banniere.jpg",
    titleKey: "slide1Title" as const,
    subtitleKey: "slide1Subtitle" as const,
    descriptionKey: "slide1Description" as const,
  },
  {
    image: "/images/Parfum/Parfum Banniere.jpg",
    titleKey: "slide2Title" as const,
    subtitleKey: "slide2Subtitle" as const,
    descriptionKey: "slide2Description" as const,
  },
  {
    image: "/images/Cosmetique/Banniere Cosmetique.jpg",
    titleKey: "slide3Title" as const,
    subtitleKey: "slide3Subtitle" as const,
    descriptionKey: "slide3Description" as const,
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
    <section className="flex-1 flex flex-col min-h-0 pt-28 sm:pt-32 px-3 sm:px-5 pb-3 sm:pb-5 bg-[var(--brand-primary)]">
      {/* ═══════════════════════════════════════
         Furdesign-style rounded bordered container
         ═══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex-1 min-h-0 rounded-[1.5rem] sm:rounded-[2rem] border border-[var(--brand-primary)]/10 overflow-hidden bg-[var(--brand-accent-light)]"
      >
        {/* Inner grid: Text left | Image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* ── Left: Text content ── */}
          <div className="relative z-10 flex flex-col justify-between p-7 sm:p-10 lg:p-14 xl:p-16">
            {/* Top: surtitle or spacer */}
            {t("surtitle") ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-[11px] uppercase tracking-[0.3em] text-[var(--brand-primary)]/45 font-semibold">
                {t("surtitle")}
              </span>
            </motion.div>
            ) : <div />}

            {/* Center: Title + subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="my-8 lg:my-0"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-bold text-[var(--brand-primary)] tracking-[-0.04em] leading-[0.95]">
                {t("titleLine1")}
                <br />
                <span className="font-playfair italic text-[var(--brand-secondary)]">
                  {t("titleLine2")}
                </span>
              </h1>
              <p className="text-[var(--brand-primary)]/45 text-base sm:text-lg mt-6 max-w-md leading-relaxed">
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
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/catalogue"
                  className="group inline-flex items-center gap-2 bg-[var(--brand-primary)] text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-[var(--brand-secondary)] transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  {t("cta")}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] rounded-full px-6 py-3 text-sm font-semibold hover:bg-[var(--brand-primary)]/5 transition-all duration-300"
                >
                  {t("ctaSecondary")}
                </Link>
              </div>

              {/* Certifications strip */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] text-[var(--brand-primary)]/30 tracking-[0.12em] uppercase font-medium border-t border-[var(--brand-primary)]/8 pt-4">
                <span className="text-[var(--brand-primary)]/45 mr-1">
                  {certT("title")}
                </span>
                {certifications.map((cert, i) => (
                  <React.Fragment key={cert}>
                    {i > 0 && <span className="text-[var(--brand-primary)]/10 hidden sm:inline">·</span>}
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
              <div className="bg-[var(--brand-primary)] rounded-2xl p-6 sm:p-8 flex items-center justify-between gap-6">
                <div>
                  <p className="text-white/50 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-medium mb-1.5">
                    {t(slides[selectedIndex].subtitleKey)}
                  </p>
                  <p className="text-white text-xl sm:text-2xl lg:text-3xl font-bold tracking-[-0.02em] mb-2">
                    {t(slides[selectedIndex].titleKey)}
                  </p>
                  <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-md">
                    {t(slides[selectedIndex].descriptionKey)}
                  </p>
                </div>
                <Link
                  href="/catalogue"
                  className="shrink-0 inline-flex items-center gap-2 bg-[var(--brand-accent)] text-white rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold hover:bg-[var(--brand-accent-hover)] transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {t("discover")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            {/* Nav arrows — top right */}
            <div className="absolute top-5 right-5 sm:top-7 sm:right-7 flex gap-2 z-10">
              <button
                onClick={scrollPrev}
                className="w-10 h-10 rounded-full bg-[var(--brand-primary)]/60 backdrop-blur-sm border border-[var(--brand-primary)]/20 flex items-center justify-center hover:bg-[var(--brand-primary)]/80 transition-all duration-300"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={scrollNext}
                className="w-10 h-10 rounded-full bg-[var(--brand-primary)]/60 backdrop-blur-sm border border-[var(--brand-primary)]/20 flex items-center justify-center hover:bg-[var(--brand-primary)]/80 transition-all duration-300"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Progress bar per-slide — top left */}
            <div className="absolute top-5 left-5 sm:top-7 sm:left-7 flex gap-1.5 z-10">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className="h-[3px] rounded-full overflow-hidden bg-[var(--brand-primary)]/25 transition-all duration-300"
                  style={{ width: index === selectedIndex ? 40 : 14 }}
                >
                  {index === selectedIndex && (
                    <motion.div
                      className="h-full bg-[var(--brand-primary)] rounded-full"
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
