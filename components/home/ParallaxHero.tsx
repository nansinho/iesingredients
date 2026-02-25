"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

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
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="pt-20 sm:pt-24 pb-0 bg-forest-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-gold-500/3 rounded-full blur-[120px] -translate-x-1/3" />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-0">
        {/* Surtitle with premium badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-xs font-semibold uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5" />
            {t("surtitle")}
          </span>
        </motion.div>

        {/* Centered Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white tracking-tight leading-[0.95] max-w-5xl mx-auto"
        >
          {t("titleLine1")}
          <br />
          <span className="text-gradient-gold">{t("titleLine2")}</span>
        </motion.h1>

        {/* Centered CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 justify-center items-center"
        >
          <Button
            asChild
            size="lg"
            className="h-13 bg-gold-500 hover:bg-gold-400 text-white rounded-full px-10 text-sm font-semibold transition-all duration-300 shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 hover:scale-[1.02]"
          >
            <Link href="/catalogue">
              {t("cta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-13 rounded-full px-10 text-sm font-medium border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
          >
            <Link href="/contact">
              {t("ctaSecondary")}
            </Link>
          </Button>
        </motion.div>

        {/* Carousel Slider - Full width, premium */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 sm:mt-16 relative"
        >
          <div className="overflow-hidden rounded-t-[20px] sm:rounded-t-[28px]" ref={emblaRef}>
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
                  <div className="absolute inset-0 bg-gradient-to-r from-forest-950/70 via-forest-950/30 to-transparent" />
                  <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 md:bottom-14 md:left-14 max-w-lg">
                    <p className="text-gold-400 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium mb-2.5">
                      {t(slide.subtitleKey)}
                    </p>
                    <p className="text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5">
                      {t(slide.titleKey)}
                    </p>
                    <Link
                      href="/catalogue"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-gold-50 text-forest-950 rounded-full text-sm font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.03]"
                    >
                      {t("bannerCta")}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Navigation Arrows */}
          <button
            onClick={scrollPrev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/90 backdrop-blur-md hover:bg-white flex items-center justify-center shadow-xl transition-all duration-300 z-10 hover:scale-105"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-forest-950" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/90 backdrop-blur-md hover:bg-white flex items-center justify-center shadow-xl transition-all duration-300 z-10 hover:scale-105"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-forest-950" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-5 sm:bottom-8 right-6 sm:right-10 flex gap-2.5 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  index === selectedIndex
                    ? "w-10 bg-gold-400"
                    : "w-2.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Certifications Strip - outside container, full width matt bar */}
      <div className="bg-forest-900/80 backdrop-blur-sm border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10 py-5 flex flex-wrap items-center justify-center gap-3 sm:gap-5"
        >
          <span className="text-[11px] uppercase tracking-[0.2em] text-gold-400/70 font-medium mr-2">
            {certT("title")}
          </span>
          {certifications.map((cert) => (
            <div
              key={cert}
              className="flex items-center justify-center h-8 px-4 rounded-full border border-white/10 bg-white/5 text-[11px] font-semibold text-white/70 tracking-wider hover:border-gold-500/30 hover:text-gold-400 transition-all duration-300"
            >
              {cert}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
