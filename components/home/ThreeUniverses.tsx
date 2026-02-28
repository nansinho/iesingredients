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

        {/* 3 equal columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {universes.map((universe, index) => {
            const Icon = universe.icon;
            return (
              <motion.div
                key={universe.filter}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Link
                  href={{ pathname: "/catalogue", query: { category: universe.filter } }}
                  className="group block"
                >
                  <div className="relative h-[380px] md:h-[520px] rounded-3xl overflow-hidden cursor-pointer">
                    {/* Background image */}
                    <Image
                      src={universe.image}
                      alt={cat(universe.titleKey)}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                    {/* Vertical title — left edge */}
                    <span
                      className="absolute left-4 md:left-5 bottom-6 text-white/90 text-3xl md:text-4xl font-bold uppercase tracking-[0.15em] select-none origin-bottom-left"
                      style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                    >
                      {cat(universe.titleKey)}
                    </span>

                    {/* Content — bottom right */}
                    <div className="absolute bottom-0 right-0 left-14 md:left-16 p-5 md:p-6 flex flex-col justify-end">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: `${universe.accent}30` }}
                      >
                        <Icon className="w-[18px] h-[18px]" style={{ color: universe.accent }} />
                      </div>

                      <p className="text-white/60 text-sm leading-relaxed mb-1">
                        {cat(universe.descKey)}
                      </p>
                      <p className="text-white/40 text-xs font-medium tracking-wider uppercase mb-5">
                        {universe.count} {universe.countLabel}
                      </p>

                      <span
                        className="inline-flex items-center gap-2 w-fit px-5 py-2.5 rounded-full text-white text-[13px] font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:scale-[1.02]"
                        style={{ background: universe.accent }}
                      >
                        {cat("explore")}
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

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
