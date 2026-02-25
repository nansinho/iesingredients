"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
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
    <section className="pt-28 sm:pt-36 pb-16 sm:pb-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Centered Surtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-xs sm:text-sm uppercase tracking-[0.25em] text-forest-500 font-medium mb-5"
        >
          {t("surtitle")}
        </motion.p>

        {/* Centered Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-forest-950 tracking-tight leading-[0.95] max-w-4xl mx-auto"
        >
          {t("titleLine1")}
          <br />
          {t("titleLine2")}
        </motion.h1>

        {/* Carousel Slider */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 sm:mt-14 relative"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
                  <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 md:bottom-12 md:left-12 max-w-md">
                    <p className="text-white/80 text-xs sm:text-sm uppercase tracking-widest mb-2">
                      {t(slide.subtitleKey)}
                    </p>
                    <p className="text-white text-xl sm:text-2xl md:text-4xl font-bold leading-tight mb-4">
                      {t(slide.titleKey)}
                    </p>
                    <Link
                      href="/catalogue"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-white/90 text-forest-950 rounded-full text-sm font-medium transition-all duration-300 shadow-lg"
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
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-lg transition-all duration-300 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-forest-950" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white flex items-center justify-center shadow-lg transition-all duration-300 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-forest-950" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 sm:bottom-6 right-6 sm:right-10 flex gap-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Centered CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 justify-center items-center"
        >
          <Button
            asChild
            size="lg"
            className="h-12 bg-forest-950 hover:bg-forest-800 text-white rounded-full px-8 text-sm font-medium transition-all duration-300"
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
            className="h-12 rounded-full px-8 text-sm font-medium border-forest-300 text-forest-900 hover:bg-forest-50 hover:border-forest-400 transition-all duration-300"
          >
            <Link href="/contact">
              {t("ctaSecondary")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Certifications Strip - Centered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <span className="text-[11px] uppercase tracking-[0.15em] text-forest-400 font-medium w-full text-center mb-1">
            {certT("title")}
          </span>
          <div className="flex flex-wrap justify-center gap-2.5">
            {certifications.map((cert) => (
              <div
                key={cert}
                className="flex items-center justify-center h-9 px-4 rounded-full border border-forest-200 bg-white text-[11px] font-semibold text-forest-600 tracking-wide"
              >
                {cert}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
