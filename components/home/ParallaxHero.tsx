"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/images/ACCUEIL-COSMETIQUE.jpg",
  "/images/ACCUEIL-PARFUMERIE.jpg",
  "/images/ACCUEIL-ARÔMES.jpg",
];

const SLIDE_DURATION = 6000;

const stats = [
  { valueKey: "statIngredients" as const, number: "5 000+" },
  { valueKey: "statDelivery" as const, number: "48h" },
  { valueKey: "statUniverses" as const, number: "3" },
];

export function ParallaxHero() {
  const t = useTranslations("hero");
  const certT = useTranslations("certifications");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen flex flex-col overflow-hidden">
      {/* Background images with crossfade */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            aria-hidden="true"
          />
        </motion.div>
      </AnimatePresence>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/60 via-brand-primary/30 to-brand-primary/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/40 to-transparent" />

      {/* Content — centré verticalement */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 pt-28">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/80 text-xs font-semibold uppercase tracking-[0.15em]">
            {t("badge")}
          </span>
        </motion.div>

        {/* Titre principal */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-display-xl font-bold text-white tracking-[-0.03em] leading-[0.95] max-w-5xl"
        >
          {t("titleLine1")}
          <br />
          <span className="font-playfair italic text-brand-accent-light">
            {t("titleLine2")}
          </span>
        </motion.h1>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-6 text-white/60 text-base sm:text-lg max-w-xl leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/catalogue"
            className="group inline-flex items-center gap-2.5 bg-brand-accent text-white rounded-full px-8 py-4 text-sm font-semibold hover:bg-brand-accent-hover transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-brand-accent/20"
          >
            {t("cta")}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-white/25 text-white rounded-full px-8 py-4 text-sm font-semibold hover:bg-white/10 hover:border-white/40 backdrop-blur-sm transition-all duration-300"
          >
            {t("ctaSecondary")}
          </Link>
        </motion.div>
      </div>

      {/* Bottom bar: stats + certifications */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1 }}
        className="relative z-10 border-t border-white/10"
      >
        <div className="w-[94%] max-w-7xl mx-auto py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Stats */}
          <div className="flex items-center gap-8 sm:gap-12">
            {stats.map((stat) => (
              <div key={stat.valueKey} className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {stat.number}
                </p>
                <p className="text-white/40 text-xs font-medium uppercase tracking-wider mt-0.5">
                  {t(stat.valueKey)}
                </p>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="flex items-center gap-3 text-[10px] text-white/30 tracking-[0.12em] uppercase font-medium">
            <span className="text-white/45 mr-1">{certT("title")}</span>
            {["COSMOS", "ECOCERT", "BIO", "VEGAN", "ISO 9001"].map((cert, i) => (
              <React.Fragment key={cert}>
                {i > 0 && <span className="text-white/15 hidden sm:inline">·</span>}
                <span>{cert}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </motion.div>

      {/* Progress dots */}
      <div className="absolute bottom-32 sm:bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2 md:hidden">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              index === currentIndex
                ? "w-8 bg-white/70"
                : "w-1.5 bg-white/25"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
