"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const stats = [
  { value: "5 000+", labelKey: "statIngredients" as const },
  { value: "30 ans", labelKey: "statDelivery" as const },
  { value: "3", labelKey: "statUniverses" as const },
];

const certifications = ["COSMOS", "ECOCERT", "BIO", "VEGAN", "ISO 9001"];

export function ParallaxHero() {
  const t = useTranslations("hero");
  const certT = useTranslations("certifications");

  return (
    <section className="relative min-h-screen bg-[#1A1A1A] overflow-hidden flex flex-col">
      {/* Background image — subtle */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/botanicals-flat.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-[0.07]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A] via-transparent to-[#1A1A1A]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center w-[90%] max-w-7xl mx-auto pt-36 sm:pt-40 pb-16">
        {/* Layout: Title left, description right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-end">
          {/* Left — Big title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-[11px] uppercase tracking-[0.3em] text-olive/70 font-semibold mb-6">
              {t("surtitle")}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-white tracking-[-0.04em] leading-[0.95]">
              {t("titleLine1")}
              <br />
              <span className="font-playfair italic text-olive">{t("titleLine2")}</span>
            </h1>
          </motion.div>

          {/* Right — Description + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pb-2"
          >
            <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-md mb-8">
              {t("subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/catalogue"
                className="inline-flex items-center justify-center gap-2 h-13 px-8 bg-olive text-white rounded-full text-sm font-semibold hover:bg-olive-dark transition-all duration-300 shadow-lg shadow-olive/20 hover:shadow-xl hover:shadow-olive/30"
              >
                {t("cta")}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 h-13 px-8 border border-white/15 text-white/70 rounded-full text-sm font-medium hover:bg-white/5 hover:text-white hover:border-white/25 transition-all duration-300"
              >
                {t("ctaSecondary")}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 sm:mt-28 grid grid-cols-3 gap-6 sm:gap-12 border-t border-white/10 pt-8"
        >
          {stats.map((stat) => (
            <div key={stat.labelKey}>
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-[-0.03em]">
                {stat.value}
              </p>
              <p className="text-white/35 text-xs sm:text-sm mt-1 uppercase tracking-wider font-medium">
                {t(stat.labelKey)}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Certifications strip — bottom ticker */}
      <div className="relative z-10 border-t border-white/8 bg-white/[0.03]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="w-[90%] max-w-7xl mx-auto py-5 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] text-white/30 tracking-[0.15em] uppercase font-medium"
        >
          <span className="text-white/50 mr-2">
            {certT("title")}
          </span>
          {certifications.map((cert, i) => (
            <React.Fragment key={cert}>
              {i > 0 && <span className="text-white/10 hidden sm:inline">·</span>}
              <span className="hover:text-white/60 transition-colors duration-300 cursor-default">
                {cert}
              </span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
