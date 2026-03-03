"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

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
    <section className="py-24 md:py-32 bg-cream-light">
      <div className="w-[94%] mx-auto">
        {/* Header — centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-dark tracking-tight">
            Dernières{" "}
            <span className="font-playfair italic text-[var(--brand-secondary)]">
              publications
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
                    <div className="bg-white rounded-2xl overflow-hidden border border-dark/8 hover:border-dark/15 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 h-full flex flex-col">
                      {/* Image */}
                      <div className="p-3 sm:p-4">
                        <div className="relative aspect-[16/10] overflow-hidden rounded-xl">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent" />
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-semibold text-dark shadow-sm">
                              {article.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-5 sm:px-6 pb-6 pt-1 flex flex-col flex-1">
                        <p className="text-xs text-[var(--brand-secondary)] mb-2 font-semibold uppercase tracking-wider">
                          {new Date(article.date).toLocaleDateString("fr-FR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <h3 className="text-base font-bold text-dark group-hover:text-[var(--brand-secondary)] transition-colors line-clamp-2 mb-2.5 leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-sm text-dark/50 line-clamp-2 leading-relaxed flex-1">
                          {article.excerpt}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-secondary)] mt-4 group-hover:gap-2.5 transition-all duration-300">
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
