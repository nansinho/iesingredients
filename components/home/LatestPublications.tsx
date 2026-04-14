"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { createClient } from "@/lib/supabase/client";

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
  news: "bg-cosmetique",
  events: "bg-arome",
  press: "bg-parfum",
  certifications: "bg-brand-accent",
  trends: "bg-brand-secondary",
};

const categoryLabels: Record<string, string> = {
  news: "Actualité",
  events: "Événement",
  press: "Presse",
  certifications: "Certification",
  trends: "Tendance",
};

export function LatestPublications() {
  const t = useTranslations("latestPublications");
  const locale = useLocale();
  const isFr = locale === "fr";
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("blog_articles") as any)
      .select(
        "id, slug, title_fr, title_en, excerpt_fr, excerpt_en, cover_image_url, category, published_at, created_at"
      )
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(6)
      .then(({ data }: { data: Article[] | null }) => {
        if (data && data.length > 0) setArticles(data);
      });
  }, []);

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
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-[11px] uppercase tracking-[0.2em] text-brand-secondary font-semibold mb-4">
              Actualités
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark tracking-[-0.03em] leading-[1.05]">
              À la une.{" "}
              <span className="font-playfair italic text-brand-accent">
                L&apos;essentiel.
              </span>
            </h2>
            <p className="text-dark/45 mt-4 text-base max-w-lg leading-relaxed">
              {t("subtitle")}
            </p>
          </motion.div>

          {/* Nav arrows */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="w-11 h-11 rounded-full border border-dark/10 flex items-center justify-center hover:bg-dark/5 transition-all duration-300 disabled:opacity-25"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-4 h-4 text-dark" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="w-11 h-11 rounded-full border border-dark/10 flex items-center justify-center hover:bg-dark/5 transition-all duration-300 disabled:opacity-25"
              aria-label="Suivant"
            >
              <ChevronRight className="w-4 h-4 text-dark" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {articles.map((article) => {
              const title = isFr
                ? article.title_fr
                : article.title_en || article.title_fr;
              const excerpt = isFr
                ? article.excerpt_fr
                : article.excerpt_en || article.excerpt_fr;
              const date = article.published_at || article.created_at;
              const cat = article.category || "news";
              return (
                <div
                  key={article.id}
                  className="flex-[0_0_85%] min-w-0 sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
                >
                  <Link
                    href={{
                      pathname: "/actualites/[slug]",
                      params: { slug: article.slug },
                    }}
                    className="group block h-full"
                  >
                    <article className="h-full rounded-2xl overflow-hidden bg-white border border-cream-dark/30 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(46,31,61,0.08)] hover:-translate-y-2 flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {article.cover_image_url ? (
                          <Image
                            src={article.cover_image_url}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-cream-light to-cream" />
                        )}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full text-white ${categoryColors[cat] || "bg-brand-primary"}`}
                          >
                            {categoryLabels[cat] || cat}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
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
                        <p className="text-sm leading-relaxed text-dark/50 line-clamp-2 flex-1">
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

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/actualites"
            className="group inline-flex items-center gap-2 bg-brand-primary text-white rounded-full px-8 py-3.5 text-sm font-semibold hover:bg-brand-secondary transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {t("viewMore")}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
