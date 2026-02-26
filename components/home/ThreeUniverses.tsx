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
    accent: "#8B6FA3",
  },
  {
    titleKey: "perfume" as const,
    descKey: "perfumeDesc" as const,
    image: "/images/essential-oil.jpg",
    filter: "parfum",
    count: "1 500+",
    countLabel: "essences",
    verticalTitle: "Parfumerie",
    accent: "#A67B5B",
  },
  {
    titleKey: "aroma" as const,
    descKey: "aromaDesc" as const,
    image: "/images/blueberries-herbs.jpg",
    filter: "arome",
    count: "1 500+",
    countLabel: "arômes",
    verticalTitle: "Arômes",
    accent: "#C97B8B",
  },
];

export function ThreeUniverses() {
  const t = useTranslations("threeUniverses");
  const cat = useTranslations("categories");

  return (
    <section className="py-24 md:py-32 bg-olive-bright">
      <div className="max-w-[1400px] w-[90%] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-white tracking-[-0.02em]">
            Trois univers. Une <span className="font-playfair italic text-dark">expertise</span>.
          </h2>
          <p className="text-white/70 text-base sm:text-lg mt-4 max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* 3 Cards — flush, 1px border, vertical title, accent colors */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 overflow-hidden rounded-[20px] border border-white/15"
        >
          {universes.map((u, index) => (
            <Link
              key={u.titleKey}
              href={{ pathname: "/catalogue", query: { category: u.filter } }}
              className={
                index < universes.length - 1
                  ? "border-b sm:border-b-0 sm:border-r border-white/15"
                  : ""
              }
            >
              <div className="group relative overflow-hidden cursor-pointer h-full">
                {/* Full-bleed image — tall portrait */}
                <div className="relative aspect-[3/4] sm:aspect-[3/4.5] overflow-hidden">
                  <Image
                    src={u.image}
                    alt={cat(u.titleKey)}
                    fill
                    className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-dark/15 to-dark/5 transition-opacity duration-500 group-hover:from-dark/50" />
                </div>

                {/* Accent line — top edge */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: u.accent }}
                />

                {/* Vertical rotated title — flush left */}
                <div className="absolute left-6 top-0 bottom-0 flex items-center pointer-events-none">
                  <span
                    className="text-white text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-[0.2em] whitespace-nowrap drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
                    style={{ transform: "rotate(-90deg) translateX(-50%)", transformOrigin: "0 0" }}
                  >
                    {u.verticalTitle}
                  </span>
                </div>

                {/* Shop button — bottom left, Apple pill style with accent */}
                <div className="absolute bottom-5 left-5">
                  <span
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-[13px] font-medium transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.03] shadow-sm backdrop-blur-sm"
                    style={{ background: u.accent }}
                  >
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
          ))}
        </motion.div>
      </div>
    </section>
  );
}
