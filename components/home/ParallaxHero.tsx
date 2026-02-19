"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, Leaf, FlaskConical, Cherry } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";

const categories = [
  {
    key: "cosmetic",
    icon: Leaf,
    image: "/images/cream-jar.jpg",
    gradient: "from-[#2D5A3D] to-[#4A7C59]",
    glowColor: "rgba(74, 124, 89, 0.5)",
    count: "2000+",
    titleKey: "cosmetic" as const,
    descKey: "cosmeticDesc" as const,
    filter: "cosmetique",
  },
  {
    key: "perfumery",
    icon: FlaskConical,
    image: "/images/essential-oil.jpg",
    gradient: "from-[#A67B5B] to-[#D4A574]",
    glowColor: "rgba(212, 165, 116, 0.5)",
    count: "1500+",
    titleKey: "perfume" as const,
    descKey: "perfumeDesc" as const,
    filter: "parfum",
  },
  {
    key: "aromas",
    icon: Cherry,
    image: "/images/blueberries-herbs.jpg",
    gradient: "from-[#8B4A5E] to-[#C97B8B]",
    glowColor: "rgba(201, 123, 139, 0.5)",
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

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={heroRef}
      className="min-h-[100svh] flex flex-col items-center justify-center px-4 pt-20 sm:pt-24 pb-12 sm:pb-16 bg-forest-950 overflow-hidden relative"
    >
      {/* Parallax Background Image */}
      <motion.div className="absolute inset-0 z-0" style={{ y: bgY }}>
        <Image
          src="/images/hero-botanical.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/60 via-forest-950/80 to-forest-950" />
      </motion.div>

      {/* Decorative Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-1/4 -left-32 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gradient-to-br from-gold-500/40 to-transparent blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute bottom-1/4 -right-32 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gradient-to-br from-forest-600/40 to-transparent blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-forest-900/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <motion.div style={{ y: textY, opacity }} className="relative z-10 flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-forest-800/80 backdrop-blur-sm border border-gold-500/20 text-gold-400 mb-6 sm:mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
          <span className="text-sm font-medium">{t("badge")}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center max-w-4xl leading-tight text-white"
        >
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t("titleLine1")}
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gold-400"
          >
            {t("titleLine2")}
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-cream-300 text-center max-w-2xl px-4"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 w-full sm:w-auto px-4 sm:px-0"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto h-12 sm:h-auto bg-gold-500 hover:bg-gold-400 text-forest-950 rounded-full px-8 shadow-lg shadow-gold-500/20 font-medium"
            >
              <Link href="/catalogue">
                {t("cta")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center w-full sm:w-auto h-12 sm:h-auto rounded-full px-8 py-3 border-2 border-white/60 text-white font-medium hover:bg-white/20 hover:border-white transition-all duration-300"
            >
              {t("ctaSecondary")}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Category Cards */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7, type: "spring", stiffness: 50 }}
        className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-5xl relative z-10 px-4"
      >
        {categories.map((c) => {
          const IconComponent = c.icon;
          return (
            <Link key={c.key} href={{ pathname: "/catalogue", query: { category: c.filter } }}>
              <motion.div
                whileHover={{
                  y: -12,
                  scale: 1.03,
                  boxShadow: `0 30px 60px -15px ${c.glowColor}`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative w-full h-48 sm:h-64 md:h-72 lg:h-80 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br ${c.gradient} shadow-xl`}
              >
                <Image
                  src={c.image}
                  alt={cat(c.titleKey)}
                  fill
                  className="object-cover opacity-40 mix-blend-overlay"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                <div className="relative z-10 p-4 sm:p-5 md:p-6 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 font-semibold text-xs sm:text-sm">
                      {c.count}
                    </Badge>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                      {cat(c.titleKey)}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {cat(c.descKey)}
                    </p>
                    <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-medium pt-1 sm:pt-2">
                      {cat("explore")}
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs uppercase tracking-widest">
          {t("scrollDown")}
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-gold-400"
          />
        </div>
      </motion.div>
    </section>
  );
}
