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
  },
  {
    titleKey: "perfume" as const,
    descKey: "perfumeDesc" as const,
    image: "/images/essential-oil.jpg",
    filter: "parfum",
    count: "1 500+",
    countLabel: "essences",
  },
  {
    titleKey: "aroma" as const,
    descKey: "aromaDesc" as const,
    image: "/images/blueberries-herbs.jpg",
    filter: "arome",
    count: "1 500+",
    countLabel: "arômes",
  },
];

export function ThreeUniverses() {
  const t = useTranslations("threeUniverses");
  const cat = useTranslations("categories");

  return (
    <section className="py-24 md:py-32 px-4 bg-forest-50">
      <div className="max-w-6xl mx-auto">
        {/* Centered Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-forest-950 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-forest-400 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* 3 Cards with border */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6">
          {universes.map((u, index) => (
            <motion.div
              key={u.titleKey}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <Link href={{ pathname: "/catalogue", query: { category: u.filter } }}>
                <div className="bg-white rounded-2xl overflow-hidden border border-forest-200 hover:border-gold-400 hover:shadow-xl transition-all duration-500 group cursor-pointer">
                  {/* Image with count overlay */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={u.image}
                      alt={cat(u.titleKey)}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    {/* Count badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-forest-950">
                        {u.count} <span className="font-normal text-forest-500">{u.countLabel}</span>
                      </span>
                    </div>
                  </div>
                  {/* Text */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg font-bold text-forest-950 mb-1.5">
                      {cat(u.titleKey)}
                    </h3>
                    <p className="text-sm text-forest-400 mb-4 leading-relaxed">
                      {cat(u.descKey)}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 group-hover:text-gold-500 group-hover:gap-2.5 transition-all duration-300">
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
