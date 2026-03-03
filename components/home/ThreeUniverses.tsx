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
    image: "/images/Cosmetique/Portrait Cosmetique.jpg",
    filter: "cosmetique",
    count: "2 000+",
    countLabel: "actifs",
    icon: Leaf,
    accent: "#5B7B6B",
  },
  {
    titleKey: "perfume" as const,
    descKey: "perfumeDesc" as const,
    image: "/images/Parfum/Parfum Portrait.jpg",
    filter: "parfum",
    count: "1 500+",
    countLabel: "essences",
    icon: FlaskConical,
    accent: "#8B6A80",
  },
  {
    titleKey: "aroma" as const,
    descKey: "aromaDesc" as const,
    image: "/images/Aromes/Aromes Portrait.jpg",
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
    <section className="py-20 md:py-28 bg-cream">
      <div className="w-[94%] mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-center"
        >
          <span className="inline-block text-[11px] uppercase tracking-[0.3em] text-[var(--brand-primary)]/40 font-semibold mb-4">
            Nos univers
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--brand-primary)] tracking-[-0.03em] leading-[1.05]">
            Trois univers.{" "}
            <span className="font-playfair italic text-[var(--brand-secondary)]">Une expertise.</span>
          </h2>
          <p className="text-[var(--brand-primary)]/45 text-sm sm:text-base max-w-md leading-relaxed mt-4 mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* 3 equal columns — continuous block */}
        <div className="rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--brand-primary)]/20">
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
                  <div className="relative h-[400px] md:h-[560px] overflow-hidden cursor-pointer flex">
                    {/* Vertical sidebar strip */}
                    <div
                      className="relative z-10 w-12 md:w-14 shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: universe.accent }}
                    >
                      <span
                        className="text-white text-sm md:text-base font-bold uppercase tracking-[0.25em] select-none whitespace-nowrap"
                        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                      >
                        {cat(universe.titleKey)}
                      </span>
                    </div>

                    {/* Image + content area */}
                    <div className="relative flex-1">
                      {/* Background image */}
                      <Image
                        src={universe.image}
                        alt={cat(universe.titleKey)}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                      {/* Content — bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 flex flex-col justify-end">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm"
                          style={{ background: "rgba(255,255,255,0.15)" }}
                        >
                          <Icon className="w-[18px] h-[18px] text-white" />
                        </div>

                        <p className="text-white/80 text-sm leading-relaxed mb-1">
                          {cat(universe.descKey)}
                        </p>
                        <p className="text-white/50 text-xs font-medium tracking-wider uppercase mb-5">
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
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/catalogue"
            className="group inline-flex items-center gap-2 bg-[var(--brand-primary)] text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-[var(--brand-secondary)] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Voir tout le catalogue
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] rounded-full px-6 py-3 text-sm font-semibold hover:bg-[var(--brand-primary)]/5 transition-all duration-300"
          >
            Contactez-nous
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
