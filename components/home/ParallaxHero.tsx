"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, ChevronDown, Leaf, FlaskConical, Cherry } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";

const categories = [
  {
    key: "cosmetic",
    icon: Leaf,
    image: "/images/cream-jar.jpg",
    count: "2000+",
    titleKey: "cosmetic" as const,
    descKey: "cosmeticDesc" as const,
    filter: "cosmetique",
  },
  {
    key: "perfumery",
    icon: FlaskConical,
    image: "/images/essential-oil.jpg",
    count: "1500+",
    titleKey: "perfume" as const,
    descKey: "perfumeDesc" as const,
    filter: "parfum",
  },
  {
    key: "aromas",
    icon: Cherry,
    image: "/images/blueberries-herbs.jpg",
    count: "1500+",
    titleKey: "aroma" as const,
    descKey: "aromaDesc" as const,
    filter: "arome",
  },
];

export function ParallaxHero() {
  const heroRef = useRef<HTMLElement>(null);
  const t = useTranslations("hero");
  const cat = useTranslations("categories");

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="min-h-[100svh] flex flex-col items-center justify-center px-4 pt-24 sm:pt-28 pb-16 sm:pb-20 bg-[#FAFAFA] overflow-hidden relative"
    >
      {/* Content */}
      <motion.div style={{ y: textY, opacity }} className="relative z-10 flex flex-col items-center max-w-5xl mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-center font-black text-forest-950 tracking-tight leading-[0.9]"
        >
          <span>{t("titleLine1")}</span>
          <br />
          <span className="text-gradient-green">{t("titleLine2")}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl font-light text-gray-500 text-center max-w-2xl px-4"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10 sm:mt-12 w-full sm:w-auto px-4 sm:px-0"
        >
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-13 bg-forest-900 hover:bg-forest-800 text-white rounded-full px-8 text-base font-medium shadow-lg shadow-forest-900/10 transition-all duration-300 hover:scale-[1.02]"
          >
            <Link href="/catalogue">
              {t("cta")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center w-full sm:w-auto h-13 rounded-full px-8 py-3 text-base font-medium text-forest-900 hover:text-forest-700 transition-colors duration-300"
          >
            {t("ctaSecondary")}
          </Link>
        </motion.div>
      </motion.div>

      {/* Category Cards */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mt-16 sm:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl relative z-10 px-4"
      >
        {categories.map((c, index) => {
          const IconComponent = c.icon;
          return (
            <Link key={c.key} href={{ pathname: "/catalogue", query: { category: c.filter } }}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -8, boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12)" }}
                className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80 rounded-3xl overflow-hidden cursor-pointer bg-white shadow-[0_2px_40px_rgba(0,0,0,0.06)] group"
              >
                <Image
                  src={c.image}
                  alt={cat(c.titleKey)}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                <div className="relative z-10 p-5 sm:p-6 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                      {c.count}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {cat(c.titleKey)}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                      {cat(c.descKey)}
                    </p>
                    <div className="flex items-center gap-2 text-white text-sm font-medium pt-2 group-hover:gap-3 transition-all duration-300">
                      {cat("explore")}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>

      {/* Scroll Indicator - Simple Chevron */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center"
      >
        <ChevronDown className="w-6 h-6 text-gray-400 animate-chevron" />
      </motion.div>
    </section>
  );
}
