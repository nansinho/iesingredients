"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const universes = [
  {
    titleKey: "cosmetic" as const,
    descKey: "cosmeticDesc" as const,
    image: "/images/cream-jar.jpg",
    filter: "cosmetique",
    count: "2 000+",
    countLabel: "actifs",
    verticalTitle: "Cosmétique",
  },
  {
    titleKey: "perfume" as const,
    descKey: "perfumeDesc" as const,
    image: "/images/essential-oil.jpg",
    filter: "parfum",
    count: "1 500+",
    countLabel: "essences",
    verticalTitle: "Parfumerie",
  },
  {
    titleKey: "aroma" as const,
    descKey: "aromaDesc" as const,
    image: "/images/blueberries-herbs.jpg",
    filter: "arome",
    count: "1 500+",
    countLabel: "arômes",
    verticalTitle: "Arômes",
  },
];

export function ThreeUniverses() {
  const t = useTranslations("threeUniverses");
  const cat = useTranslations("categories");

  return (
    <section className="py-24 md:py-32 bg-white dark:bg-dark">
      <div className="max-w-[1400px] w-[90%] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-dark dark:text-cream-light tracking-[-0.02em]">
            Trois univers. Une <span className="font-playfair italic text-brown">expertise</span>.
          </h2>
          <p className="text-dark/50 dark:text-cream-light/50 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* 3 Cards — tall portrait with vertical title + Apple shop button */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
          {universes.map((u, index) => (
            <motion.div
              key={u.titleKey}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
            >
              <Link href={{ pathname: "/catalogue", query: { category: u.filter } }}>
                <div className="group relative overflow-hidden rounded-[20px] cursor-pointer h-full">
                  {/* Full-bleed image — tall portrait */}
                  <div className="relative aspect-[3/4] sm:aspect-[3/4.5] overflow-hidden">
                    <Image
                      src={u.image}
                      alt={cat(u.titleKey)}
                      fill
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    {/* Subtle dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-dark/10 to-dark/5" />
                  </div>

                  {/* Vertical rotated title — left edge */}
                  <div className="absolute left-4 top-0 bottom-0 flex items-center pointer-events-none">
                    <span
                      className="text-white/90 text-[13px] sm:text-sm font-semibold uppercase tracking-[0.25em] whitespace-nowrap -rotate-90"
                    >
                      {u.verticalTitle}
                    </span>
                  </div>

                  {/* Shop button — bottom left, Apple pill style */}
                  <div className="absolute bottom-5 left-5">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 dark:bg-cream-light/95 backdrop-blur-sm text-dark text-[13px] font-medium transition-all duration-300 group-hover:bg-white group-hover:shadow-lg group-hover:scale-[1.03] shadow-sm">
                      {cat("explore")}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>

                  {/* Count — bottom right */}
                  <div className="absolute bottom-5 right-5">
                    <span className="text-white/70 text-[11px] font-medium tracking-wide">
                      {u.count} {u.countLabel}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
