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

        {/* 3 Cards */}
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
                <div className="group relative overflow-hidden rounded-2xl cursor-pointer h-full bg-white dark:bg-dark-card border border-brown/8 dark:border-brown/10 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(163,123,104,0.12)] hover:-translate-y-2 hover:border-brown/20">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={u.image}
                      alt={cat(u.titleKey)}
                      fill
                      className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
                    {/* Count badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1.5 rounded-full bg-cream-light/90 backdrop-blur-sm text-[11px] font-semibold text-dark">
                        {u.count} {u.countLabel}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl font-semibold text-dark dark:text-cream-light tracking-[-0.02em] mb-2">
                      {cat(u.titleKey)}
                    </h3>
                    <p className="text-dark/50 dark:text-cream-light/50 text-sm leading-relaxed mb-4 line-clamp-2">
                      {cat(u.descKey)}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-brown group-hover:gap-3 transition-all duration-300">
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
