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
    accentColor: "#918279",
    accentDark: "#4E4340",
  },
  {
    titleKey: "perfume" as const,
    descKey: "perfumeDesc" as const,
    image: "/images/essential-oil.jpg",
    filter: "parfum",
    count: "1 500+",
    countLabel: "essences",
    accentColor: "#D4A99A",
    accentDark: "#8B5B4E",
  },
  {
    titleKey: "aroma" as const,
    descKey: "aromaDesc" as const,
    image: "/images/blueberries-herbs.jpg",
    filter: "arome",
    count: "1 500+",
    countLabel: "arômes",
    accentColor: "#B8ADA6",
    accentDark: "#6B5E58",
  },
];

export function ThreeUniverses() {
  const t = useTranslations("threeUniverses");
  const cat = useTranslations("categories");

  return (
    <section className="py-24 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-10 bg-white">
      <div className="max-w-[90rem] mx-auto">
        {/* Section Header — clean, Apple-style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block text-[11px] uppercase tracking-[0.25em] text-forest-400 font-medium mb-4">
            {t("title")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-forest-950 tracking-[-0.02em]">
            {t("title")}
          </h2>
          <p className="text-forest-400 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Full-bleed immersive banners — stacked */}
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {universes.map((u, index) => (
            <motion.div
              key={u.titleKey}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.12 }}
            >
              <Link href={{ pathname: "/catalogue", query: { category: u.filter } }}>
                <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl cursor-pointer">
                  {/* Full-bleed image */}
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
                    <Image
                      src={u.image}
                      alt={cat(u.titleKey)}
                      fill
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                      sizes="100vw"
                    />
                    {/* Category-colored gradient overlay */}
                    <div
                      className="absolute inset-0 transition-opacity duration-700"
                      style={{
                        background: `linear-gradient(135deg, ${u.accentDark}E6 0%, ${u.accentDark}99 40%, transparent 70%)`,
                      }}
                    />
                  </div>

                  {/* Content overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14">
                    {/* Category accent line */}
                    <div
                      className="w-10 h-[3px] rounded-full mb-4 transition-all duration-500 group-hover:w-16"
                      style={{ backgroundColor: u.accentColor }}
                    />

                    {/* Count */}
                    <span className="text-white/60 text-xs sm:text-sm font-medium tracking-wide mb-2">
                      {u.count} {u.countLabel}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-[-0.02em] mb-3">
                      {cat(u.titleKey)}
                    </h3>

                    {/* Description — hidden on mobile */}
                    <p className="text-white/60 text-sm sm:text-base max-w-md leading-relaxed mb-6 hidden sm:block">
                      {cat(u.descKey)}
                    </p>

                    {/* Explore link */}
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:gap-3 transition-all duration-300">
                      {cat("explore")}
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
