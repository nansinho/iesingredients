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
    href: "/catalogue/cosmetique" as const,
    count: "2 000+",
    countLabel: "actifs botaniques",
    icon: Leaf,
    color: "bg-cosmetique",
    colorDark: "bg-cosmetique-dark",
  },
  {
    titleKey: "perfume" as const,
    descKey: "perfumeDesc" as const,
    image: "/images/Parfum/Parfum Portrait.jpg",
    href: "/catalogue/parfumerie" as const,
    count: "1 500+",
    countLabel: "essences & absolues",
    icon: FlaskConical,
    color: "bg-parfum",
    colorDark: "bg-parfum-dark",
  },
  {
    titleKey: "aroma" as const,
    descKey: "aromaDesc" as const,
    image: "/images/Aromes/Aromes Portrait.jpg",
    href: "/catalogue/aromes" as const,
    count: "1 500+",
    countLabel: "arômes naturels",
    icon: Droplets,
    color: "bg-arome",
    colorDark: "bg-arome-dark",
  },
];

export function ThreeUniverses() {
  const t = useTranslations("threeUniverses");
  const cat = useTranslations("categories");

  return (
    <section className="py-24 md:py-32 bg-cream-light">
      <div className="w-[94%] max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block text-[11px] uppercase tracking-[0.2em] text-brand-secondary font-semibold mb-4">
            Nos univers
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-display-sm font-bold text-dark tracking-[-0.03em] leading-[1.05]">
            Trois univers.{" "}
            <span className="font-playfair italic text-brand-accent">
              Une expertise.
            </span>
          </h2>
          <p className="text-dark/45 text-base sm:text-lg max-w-lg mx-auto mt-5 leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Cards — large stacked horizontal */}
        <div className="space-y-6">
          {universes.map((universe, index) => {
            const Icon = universe.icon;
            const isReversed = index % 2 !== 0;

            return (
              <motion.div
                key={universe.titleKey}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link href={universe.href} className="group block">
                  <div
                    className={`relative rounded-3xl overflow-hidden bg-dark grid grid-cols-1 lg:grid-cols-2 min-h-[400px] lg:min-h-[480px] ${
                      isReversed ? "lg:direction-rtl" : ""
                    }`}
                  >
                    {/* Image side */}
                    <div
                      className={`relative min-h-[280px] lg:min-h-0 overflow-hidden ${
                        isReversed ? "lg:order-2" : ""
                      }`}
                    >
                      <Image
                        src={universe.image}
                        alt={cat(universe.titleKey)}
                        fill
                        className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      {/* Subtle gradient on mobile */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark/60 lg:hidden" />
                    </div>

                    {/* Content side */}
                    <div
                      className={`relative flex flex-col justify-center p-8 sm:p-10 lg:p-14 xl:p-16 ${
                        isReversed ? "lg:order-1 lg:direction-ltr" : ""
                      }`}
                    >
                      {/* Icon badge */}
                      <div
                        className={`w-12 h-12 rounded-2xl ${universe.color} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      {/* Category name */}
                      <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-[-0.03em] leading-tight mb-3">
                        {cat(universe.titleKey)}
                      </h3>

                      {/* Description */}
                      <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-md mb-6">
                        {cat(universe.descKey)}
                      </p>

                      {/* Count */}
                      <p className="text-white/30 text-sm font-medium uppercase tracking-wider mb-8">
                        {universe.count} {universe.countLabel}
                      </p>

                      {/* CTA */}
                      <span
                        className={`inline-flex items-center gap-2.5 w-fit ${universe.color} text-white rounded-full px-7 py-3.5 text-sm font-semibold transition-all duration-300 group-hover:shadow-lg group-hover:gap-3`}
                      >
                        {cat("explore")}
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
