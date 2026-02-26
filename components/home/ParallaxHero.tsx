"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const certifications = ["COSMOS", "ECOCERT", "BIO", "VEGAN", "ISO 9001"];

const stats = [
  { value: "5000+", labelKey: "statIngredients" as const },
  { value: "48h", labelKey: "statDelivery" as const },
  { value: "3", labelKey: "statUniverses" as const },
];

export function ParallaxHero() {
  const t = useTranslations("hero");
  const certT = useTranslations("certifications");

  return (
    <section className="pt-24 sm:pt-28 pb-0 bg-navy relative overflow-hidden">
      <div className="w-[94%] mx-auto pt-12 sm:pt-20 pb-16 sm:pb-24">
        {/* Surtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-14"
        >
          <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-mint/70 font-medium">
            {t("surtitle")}
          </span>
        </motion.div>

        {/* Main grid: text left, images right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: text content */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-semibold text-white tracking-[-0.03em] leading-[1.05]"
            >
              {t("titleLine1")}
              <br />
              <span className="font-playfair italic text-mint">{t("titleLine2")}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/50 text-sm sm:text-base mt-6 max-w-md leading-relaxed"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10"
            >
              <Button asChild variant="peach" size="lg">
                <Link href="/catalogue">
                  {t("cta")}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Link href="/contact">
                  {t("ctaSecondary")}
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Right: bento image grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="col-span-2 relative aspect-[2.2/1] rounded-2xl overflow-hidden">
              <Image
                src="/images/botanicals-flat.jpg"
                alt="Ingrédients botaniques"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
              <div className="absolute bottom-4 left-5">
                <span className="px-3 py-1.5 rounded-full bg-cream-light/90 backdrop-blur-md text-[11px] font-semibold text-dark">
                  Cosmétique
                </span>
              </div>
            </div>
            <div className="relative aspect-[1.1/1] rounded-2xl overflow-hidden">
              <Image
                src="/images/essential-oil.jpg"
                alt="Huiles essentielles"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1.5 rounded-full bg-cream-light/90 backdrop-blur-md text-[11px] font-semibold text-dark">
                  Parfumerie
                </span>
              </div>
            </div>
            <div className="relative aspect-[1.1/1] rounded-2xl overflow-hidden">
              <Image
                src="/images/blueberries-herbs.jpg"
                alt="Arômes alimentaires"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1.5 rounded-full bg-cream-light/90 backdrop-blur-md text-[11px] font-semibold text-dark">
                  Arômes
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-3 gap-6 mt-16 sm:mt-20 border-t border-white/10 pt-10"
        >
          {stats.map((stat) => (
            <div key={stat.labelKey} className="text-center sm:text-left">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-mint tracking-tight">
                {stat.value}
              </p>
              <p className="text-white/40 text-xs sm:text-sm mt-1.5 uppercase tracking-wider font-medium">
                {t(stat.labelKey)}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Certifications Strip */}
      <div className="bg-[#181818] border-t border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="w-[94%] mx-auto py-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] text-white/30 tracking-[0.1em] uppercase font-medium"
        >
          <span className="text-mint/50 mr-1">
            {certT("title")}
          </span>
          {certifications.map((cert, i) => (
            <React.Fragment key={cert}>
              {i > 0 && <span className="text-white/15 hidden sm:inline">&middot;</span>}
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
