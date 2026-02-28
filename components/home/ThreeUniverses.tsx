"use client";

import Image from "next/image";
import { ArrowRight, Leaf, FlaskConical, Droplets } from "lucide-react";
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
    icon: Leaf,
    accent: "#5B7B6B",
    accentBg: "#5B7B6B15",
  },
  {
    titleKey: "perfume" as const,
    descKey: "perfumeDesc" as const,
    image: "/images/essential-oil.jpg",
    filter: "parfum",
    count: "1 500+",
    countLabel: "essences",
    icon: FlaskConical,
    accent: "#8B6A80",
    accentBg: "#8B6A8015",
  },
  {
    titleKey: "aroma" as const,
    descKey: "aromaDesc" as const,
    image: "/images/blueberries-herbs.jpg",
    filter: "arome",
    count: "1 500+",
    countLabel: "arômes",
    icon: Droplets,
    accent: "#D4907E",
    accentBg: "#D4907E15",
  },
];

export function ThreeUniverses() {
  const t = useTranslations("threeUniverses");
  const cat = useTranslations("categories");

  return (
    <section className="py-20 md:py-28 bg-[#F5F2ED]">
      <div className="w-[90%] max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <span className="inline-block text-[11px] uppercase tracking-[0.3em] text-[#1A1A1A]/40 font-semibold mb-4">
            Nos univers
          </span>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] tracking-[-0.03em] leading-[1.05]">
              Trois univers.
              <br />
              <span className="font-playfair italic text-[#5B5470]">Une expertise.</span>
            </h2>
            <p className="text-[#1A1A1A]/45 text-sm sm:text-base max-w-sm leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[minmax(200px,1fr)]"
        >
          {/* Card 1 — Cosmétique (large, spans 2 rows) */}
          <Link
            href={{ pathname: "/catalogue", query: { category: universes[0].filter } }}
            className="md:col-span-5 md:row-span-2 group"
          >
            <div className="relative h-full min-h-[400px] md:min-h-0 rounded-3xl overflow-hidden cursor-pointer">
              <Image
                src={universes[0].image}
                alt={cat(universes[0].titleKey)}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: universes[0].accentBg }}
                >
                  <Leaf className="w-5 h-5" style={{ color: universes[0].accent }} />
                </div>
                <h3 className="text-white text-2xl sm:text-3xl font-bold tracking-[-0.02em] mb-1">
                  {cat(universes[0].titleKey)}
                </h3>
                <p className="text-white/60 text-sm mb-1">
                  {cat(universes[0].descKey)}
                </p>
                <p className="text-white/40 text-xs font-medium tracking-wider uppercase mb-5">
                  {universes[0].count} {universes[0].countLabel}
                </p>
                <span
                  className="inline-flex items-center gap-2 w-fit px-5 py-2.5 rounded-full text-white text-[13px] font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]"
                  style={{ background: universes[0].accent }}
                >
                  {cat("explore")}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 2 — Parfumerie (top right) */}
          <Link
            href={{ pathname: "/catalogue", query: { category: universes[1].filter } }}
            className="md:col-span-7 group"
          >
            <div className="relative h-full min-h-[240px] rounded-3xl overflow-hidden cursor-pointer">
              <Image
                src={universes[1].image}
                alt={cat(universes[1].titleKey)}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: universes[1].accentBg }}
                  >
                    <FlaskConical className="w-4.5 h-4.5" style={{ color: universes[1].accent }} />
                  </div>
                  <div>
                    <h3 className="text-white text-xl sm:text-2xl font-bold tracking-[-0.02em]">
                      {cat(universes[1].titleKey)}
                    </h3>
                    <p className="text-white/40 text-xs font-medium tracking-wider uppercase">
                      {universes[1].count} {universes[1].countLabel}
                    </p>
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-4">{cat(universes[1].descKey)}</p>
                <span
                  className="inline-flex items-center gap-2 w-fit px-5 py-2.5 rounded-full text-white text-[13px] font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]"
                  style={{ background: universes[1].accent }}
                >
                  {cat("explore")}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Card 3 — Arômes (bottom right) */}
          <Link
            href={{ pathname: "/catalogue", query: { category: universes[2].filter } }}
            className="md:col-span-7 group"
          >
            <div className="relative h-full min-h-[240px] rounded-3xl overflow-hidden cursor-pointer">
              <Image
                src={universes[2].image}
                alt={cat(universes[2].titleKey)}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 58vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: universes[2].accentBg }}
                  >
                    <Droplets className="w-4.5 h-4.5" style={{ color: universes[2].accent }} />
                  </div>
                  <div>
                    <h3 className="text-white text-xl sm:text-2xl font-bold tracking-[-0.02em]">
                      {cat(universes[2].titleKey)}
                    </h3>
                    <p className="text-white/40 text-xs font-medium tracking-wider uppercase">
                      {universes[2].count} {universes[2].countLabel}
                    </p>
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-4">{cat(universes[2].descKey)}</p>
                <span
                  className="inline-flex items-center gap-2 w-fit px-5 py-2.5 rounded-full text-white text-[13px] font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]"
                  style={{ background: universes[2].accent }}
                >
                  {cat("explore")}
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Bottom link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex justify-center"
        >
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors duration-300 group"
          >
            Voir tout le catalogue
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
