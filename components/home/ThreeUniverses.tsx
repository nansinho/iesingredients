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
    accentLight: "#F2EDE8",
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
    accentLight: "#F8F0ED",
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
    accentLight: "#F2EDE8",
  },
];

export function ThreeUniverses() {
  const t = useTranslations("threeUniverses");
  const cat = useTranslations("categories");

  return (
    <section className="py-24 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-10 bg-white">
      <div className="max-w-[100rem] mx-auto">
        {/* Section Header */}
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
          <h2 className="text-forest-950 tracking-[-0.02em]">
            {t("title")}
          </h2>
          <p className="text-forest-400 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* 3 Column Grid — colored category cards (NOT white product cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
          {universes.map((u, index) => (
            <motion.div
              key={u.titleKey}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
            >
              <Link href={{ pathname: "/catalogue", query: { category: u.filter } }}>
                <div className="group relative overflow-hidden rounded-3xl cursor-pointer h-full">
                  {/* Full image background */}
                  <div className="relative aspect-[3/4] sm:aspect-[3/4] overflow-hidden">
                    <Image
                      src={u.image}
                      alt={cat(u.titleKey)}
                      fill
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    {/* Category-colored gradient overlay */}
                    <div
                      className="absolute inset-0 transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(to top, ${u.accentDark}F0 0%, ${u.accentDark}80 35%, transparent 70%)`,
                      }}
                    />
                  </div>

                  {/* Content overlay — positioned at bottom */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                    {/* Accent line */}
                    <div
                      className="w-8 h-[3px] rounded-full mb-4 transition-all duration-500 group-hover:w-14"
                      style={{ backgroundColor: u.accentColor }}
                    />

                    {/* Count */}
                    <span className="text-white/60 text-xs font-medium tracking-wide mb-1.5 block">
                      {u.count} {u.countLabel}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white tracking-[-0.02em] mb-2">
                      {cat(u.titleKey)}
                    </h3>

                    {/* Description */}
                    <p className="text-white/50 text-sm leading-relaxed mb-5 line-clamp-2">
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
