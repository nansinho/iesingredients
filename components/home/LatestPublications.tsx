"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

const categoryColors: Record<string, string> = {
  "Cosmétique": "#5B7B6B",
  "Parfumerie": "#8B6A80",
  "Arômes": "#D4907E",
  "Entreprise": "var(--brand-primary)",
};

const staticArticles = [
  {
    id: "1",
    slug: "tendances-cosmetiques-2025",
    title: "Les tendances cosmétiques naturelles en 2025",
    titleEn: "Natural cosmetic trends in 2025",
    excerpt:
      "Découvrez les dernières innovations en matière d'ingrédients naturels pour la cosmétique.",
    excerptEn:
      "Discover the latest innovations in natural ingredients for cosmetics.",
    category: "Cosmétique",
    image: "/images/cream-bowl.jpg",
    date: "2025-01-15",
  },
  {
    id: "2",
    slug: "sourcing-responsable",
    title: "Notre approche du sourcing responsable",
    titleEn: "Our approach to responsible sourcing",
    excerpt:
      "Comment nous sélectionnons nos fournisseurs pour garantir qualité et éthique.",
    excerptEn:
      "How we select our suppliers to guarantee quality and ethics.",
    category: "Entreprise",
    image: "/images/leaves-hero.jpg",
    date: "2025-01-08",
  },
  {
    id: "3",
    slug: "huiles-essentielles-guide",
    title: "Guide complet des huiles essentielles",
    titleEn: "Complete guide to essential oils",
    excerpt:
      "Tout ce que vous devez savoir sur les huiles essentielles et leurs applications.",
    excerptEn:
      "Everything you need to know about essential oils and their applications.",
    category: "Parfumerie",
    image: "/images/essential-oil.jpg",
    date: "2024-12-20",
  },
];

export function LatestPublications() {
  const t = useTranslations("latestPublications");

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="w-[94%] max-w-7xl mx-auto">
        {/* Header — centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-dark tracking-tight">
            À la une.{" "}
            <span className="font-playfair italic text-[var(--brand-accent)]">
              L&apos;essentiel.
            </span>
          </h2>
          <p className="text-dark/50 mt-3 text-base max-w-lg mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation arrows */}
          <div className="hidden sm:flex absolute -top-20 right-0 gap-2 z-10">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="w-10 h-10 rounded-full border border-dark/10 flex items-center justify-center hover:bg-dark/5 transition-all duration-300 disabled:opacity-30"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 text-dark" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="w-10 h-10 rounded-full border border-dark/10 flex items-center justify-center hover:bg-dark/5 transition-all duration-300 disabled:opacity-30"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 text-dark" />
            </button>
          </div>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6">
              {staticArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
                >
                  <Link href="/actualites" className="group block h-full">
                    <div className="relative h-[420px] md:h-[480px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] hover:-translate-y-1">
                      {/* Full background image */}
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                      {/* Category badge — top */}
                      <div className="absolute top-4 left-4">
                        <span
                          className="px-3.5 py-1.5 rounded-full backdrop-blur-md text-[11px] font-semibold text-white shadow-sm"
                          style={{ backgroundColor: categoryColors[article.category] || "var(--brand-primary)" }}
                        >
                          {article.category}
                        </span>
                      </div>

                      {/* Content — bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                        <p className="text-[11px] text-white/50 font-semibold uppercase tracking-wider mb-2">
                          {new Date(article.date).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <h3 className="text-lg font-bold text-white leading-snug mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-white/60 line-clamp-2 leading-relaxed mb-4">
                          {article.excerpt}
                        </p>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:gap-3 transition-all duration-300">
                          {t("readMore")}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA button — centered */}
        <div className="text-center mt-12">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 bg-[var(--brand-primary)] text-white rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-[var(--brand-secondary)] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {t("viewMore")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
