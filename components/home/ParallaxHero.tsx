"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

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
    <section className="pt-24 sm:pt-28 pb-0 bg-cream-light dark:bg-dark relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-peach/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-lavender/5 rounded-full blur-[120px] -translate-x-1/3" />

      <div className="max-w-[1400px] w-[90%] mx-auto pt-12 sm:pt-16 pb-0">
        {/* Surtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-brown/70 dark:text-brown-light/70 font-medium">
            {t("surtitle")}
          </span>
        </motion.div>

        {/* Main Title with Playfair accent */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold text-dark dark:text-cream-light tracking-[-0.03em] leading-[1.05] max-w-3xl mx-auto"
        >
          {t("titleLine1")}
          <br />
          <span className="font-playfair italic text-brown">{t("titleLine2")}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-dark/50 dark:text-cream-light/50 text-sm sm:text-base mt-5 max-w-xl mx-auto leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 justify-center items-center"
        >
          <Button
            asChild
            variant="peach"
            size="lg"
          >
            <Link href="/catalogue">
              {t("cta")}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline-brown"
            size="lg"
          >
            <Link href="/contact">
              {t("ctaSecondary")}
            </Link>
          </Button>
        </motion.div>

        {/* Carousel Slider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 sm:mt-16 relative"
        >
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl" ref={emblaRef}>
            <div className="flex">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="flex-[0_0_100%] min-w-0 relative aspect-[16/7] sm:aspect-[2.4/1]"
                >
                  <Image
                    src={slide.image}
                    alt={t(slide.titleKey)}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-dark/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 md:bottom-14 md:left-14 max-w-md">
                    <p className="text-peach/90 text-[11px] sm:text-xs uppercase tracking-[0.25em] font-medium mb-3">
                      {t(slide.subtitleKey)}
                    </p>
                    <p className="text-white text-lg sm:text-xl md:text-3xl lg:text-4xl font-semibold leading-tight mb-5 tracking-[-0.02em]">
                      {t(slide.titleKey)}
                    </p>
                    <Link
                      href="/catalogue"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-cream-light/95 backdrop-blur-sm text-dark rounded-full text-sm font-medium transition-all duration-300 hover:bg-white hover:shadow-lg hover:scale-[1.02]"
                    >
                      {t("bannerCta")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-5 sm:left-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream-light/10 backdrop-blur-md hover:bg-cream-light/20 flex items-center justify-center transition-all duration-300 z-10 border border-cream-light/10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 text-white/80" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-5 sm:right-8 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream-light/10 backdrop-blur-md hover:bg-cream-light/20 flex items-center justify-center transition-all duration-300 z-10 border border-cream-light/10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 text-white/80" />
          </button>

          {/* Progress Indicators */}
          <div className="absolute bottom-5 sm:bottom-8 right-6 sm:right-10 flex gap-1.5 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className="relative h-[3px] rounded-full overflow-hidden bg-white/20 transition-all duration-300"
                style={{ width: index === selectedIndex ? 48 : 16 }}
                aria-label={`Go to slide ${index + 1}`}
              >
                {index === selectedIndex && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-peach rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: AUTOPLAY_DELAY / 1000, ease: "linear" }}
                    key={`progress-${progressKey}`}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Certifications Strip */}
      <div className="bg-cream dark:bg-dark-card border-t border-brown/5 dark:border-brown/10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="max-w-[1400px] w-[90%] mx-auto py-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-dark/30 dark:text-cream-light/30 tracking-[0.1em] uppercase font-medium"
        >
          <span className="text-brown/50 dark:text-brown-light/50 mr-1">
            {certT("title")}
          </span>
          {certifications.map((cert, i) => (
            <React.Fragment key={cert}>
              {i > 0 && <span className="text-brown/15 hidden sm:inline">&middot;</span>}
              <span className="hover:text-brown/60 dark:hover:text-brown-light/60 transition-colors duration-300 cursor-default">
                {cert}
              </span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
