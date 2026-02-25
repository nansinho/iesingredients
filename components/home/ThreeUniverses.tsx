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
    accent: "from-[#918279]/80 to-[#4E4340]",
    accentBg: "bg-[#918279]",
  },
  {
    titleKey: "perfume" as const,
    descKey: "perfumeDesc" as const,
    image: "/images/essential-oil.jpg",
    filter: "parfum",
    count: "1 500+",
    countLabel: "essences",
    accent: "from-[#D4A99A]/80 to-[#8B5B4E]",
    accentBg: "bg-[#D4A99A]",
  },
  {
    titleKey: "aroma" as const,
    descKey: "aromaDesc" as const,
    image: "/images/blueberries-herbs.jpg",
    filter: "arome",
    count: "1 500+",
    countLabel: "arômes",
    accent: "from-[#B8ADA6]/80 to-[#6B5E58]",
    accentBg: "bg-[#B8ADA6]",
  },
];

export function ThreeUniverses() {
  const t = useTranslations("threeUniverses");
  const cat = useTranslations("categories");

  return (
    <section className="py-24 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-10 bg-cream-50">
      <div className="max-w-[90rem] mx-auto">
        {/* Centered Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-5"
        >
          <span className="inline-block text-xs uppercase tracking-[0.2em] text-gold-600 font-semibold mb-4">
            {t("title")}
          </span>
          <div className="flex justify-center mb-6">
            <div className="divider-gold" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-forest-950 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-forest-500 text-base sm:text-lg mt-5 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* 3 Cards - Premium with 10px image borders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {universes.map((u, index) => (
            <motion.div
              key={u.titleKey}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Link href={{ pathname: "/catalogue", query: { category: u.filter } }}>
                <div className="bg-white rounded-[20px] overflow-hidden border border-forest-100 hover:border-gold-400 transition-all duration-500 group cursor-pointer hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] hover:-translate-y-2">
                  {/* Image with 10px border radius padding */}
                  <div className="p-3 sm:p-4">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[10px]">
                      <Image
                        src={u.image}
                        alt={cat(u.titleKey)}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${u.accent} opacity-40 group-hover:opacity-30 transition-opacity duration-500`} />
                      {/* Count badge */}
                      <div className="absolute bottom-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md text-sm font-bold text-forest-950 shadow-lg">
                          {u.count} <span className="font-normal text-forest-500 text-xs">{u.countLabel}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Text */}
                  <div className="px-5 sm:px-6 pb-6 pt-1">
                    <h3 className="text-xl font-bold text-forest-950 mb-2">
                      {cat(u.titleKey)}
                    </h3>
                    <p className="text-sm text-forest-400 mb-5 leading-relaxed line-clamp-2">
                      {cat(u.descKey)}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-gold-600 group-hover:text-gold-500 group-hover:gap-3 transition-all duration-300">
                      {cat("explore")}
                      <ArrowRight className="w-4 h-4" />
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
