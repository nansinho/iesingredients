"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

interface Article {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string | null;
  excerpt_fr: string | null;
  excerpt_en: string | null;
  cover_image_url: string | null;
  category: string | null;
  published_at: string | null;
  created_at: string;
}

const categoryColors: Record<string, string> = {
  news: "#5B7B6B",
  events: "#D4907E",
  press: "#8B6A80",
  certifications: "#3B82F6",
  trends: "#F59E0B",
};

const categoryLabels: Record<string, string> = {
  news: "Actualité",
  events: "Événement",
  press: "Presse",
  certifications: "Certification",
  trends: "Tendance",
};

interface LatestPublicationsProps {
  articles: Article[];
}

export function LatestPublications({ articles }: LatestPublicationsProps) {
  const t = useTranslations("latestPublications");
  const locale = useLocale();
  const isFr = locale === "fr";

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

  if (articles.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="w-[94%] max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-dark tracking-tight">
            À la une.{" "}
            <span className="font-playfair italic text-brand-accent">
              L&apos;essentiel.
            </span>
          </h2>
          <p className="text-dark/50 mt-3 text-base max-w-lg mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
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
            <div className="flex gap-6 items-stretch">
              {articles.map((article) => {
                const title = isFr ? article.title_fr : (article.title_en || article.title_fr);
                const excerpt = isFr ? article.excerpt_fr : (article.excerpt_en || article.excerpt_fr);
                const date = article.published_at || article.created_at;
                const cat = article.category || "news";
                return (
                  <div
                    key={article.id}
                    className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] flex"
                  >
                    <Link href={{ pathname: "/actualites/[slug]", params: { slug: article.slug } }} className="group block h-full">
                      <article className="relative h-full rounded-2xl overflow-hidden bg-white border border-brown/8 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(200,168,168,0.12)] hover:-translate-y-2 flex flex-col">
                        <div className="relative aspect-[16/10] overflow-hidden">
                          {article.cover_image_url ? (
                            <Image
                              src={article.cover_image_url}
                              alt={title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-cream-light to-cream" />
                          )}
                          <div className="absolute top-3 left-3">
                            <span
                              className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full text-white backdrop-blur-md border border-white/20"
                              style={{ backgroundColor: categoryColors[cat] || "hsl(var(--brand-primary))" }}
                            >
                              {categoryLabels[cat] || cat}
                            </span>
                          </div>
                        </div>
                        <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
                          <time className="text-[11px] text-brand-accent font-semibold uppercase tracking-wider mb-2">
                            {new Date(date).toLocaleDateString(locale, {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </time>
                          <h3 className="text-base font-bold text-dark leading-snug mb-2 line-clamp-2 group-hover:text-brand-accent transition-colors duration-300">
                            {title}
                          </h3>
                          <p className="text-sm leading-relaxed text-dark/50 line-clamp-2">
                            {excerpt}
                          </p>
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary mt-4 group-hover:gap-3 transition-all duration-300">
                            {t("readMore")}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </article>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 bg-brand-primary text-white rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-brand-secondary transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {t("viewMore")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
