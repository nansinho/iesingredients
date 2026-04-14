"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

const showcaseProducts = [
  {
    id: "1",
    name: "Acide Hyaluronique",
    ref: "AH-2024",
    desc: "Actif hydratant haute performance, poids moléculaire optimisé pour pénétration cutanée.",
    category: "Cosmétique",
    image: "/images/cream-jar.jpg",
    accent: "bg-cosmetique",
    tags: ["Hydratation", "Anti-âge"],
  },
  {
    id: "2",
    name: "Vitamine C Stabilisée",
    ref: "VC-3300",
    desc: "Ascorbyl glucoside stabilisé pour formulations éclat et anti-oxydantes.",
    category: "Cosmétique",
    image: "/images/serum-collection.jpg",
    accent: "bg-cosmetique",
    tags: ["Éclat", "Anti-oxydant"],
  },
  {
    id: "3",
    name: "Ambrofix™",
    ref: "5005809",
    desc: "Molécule ambrée biosourcée, puissante et biodégradable. Notes boisées ambrées.",
    category: "Parfumerie",
    image: "/images/essential-oil.jpg",
    accent: "bg-parfum",
    tags: ["Ambrée", "Biosourcé"],
  },
  {
    id: "4",
    name: "Extrait de Vanille",
    ref: "VN-1050",
    desc: "Oléorésine de vanille naturelle de Madagascar, qualité premium.",
    category: "Arômes",
    image: "/images/blueberries-herbs.jpg",
    accent: "bg-arome",
    tags: ["Vanille", "Premium"],
  },
  {
    id: "5",
    name: "Rose Absolute",
    ref: "RA-4400",
    desc: "Absolue de rose de Bulgarie, ingrédient noble pour parfumerie fine.",
    category: "Parfumerie",
    image: "/images/botanicals-flat.jpg",
    accent: "bg-parfum",
    tags: ["Rose", "Luxe"],
  },
  {
    id: "6",
    name: "Huile de Jojoba",
    ref: "JB-2100",
    desc: "Huile végétale premium, émolliente et non comédogène.",
    category: "Cosmétique",
    image: "/images/cream-bowl.jpg",
    accent: "bg-cosmetique",
    tags: ["Émollient", "Végétal"],
  },
];

export function MinimalProducts() {
  const t = useTranslations("products");

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
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
    <section className="py-24 md:py-32 bg-cream-light relative overflow-hidden">
      <div className="w-[94%] max-w-7xl mx-auto relative z-10">
        {/* Header with nav arrows */}
        <div className="flex items-end justify-between mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-[11px] uppercase tracking-[0.2em] text-brand-secondary font-semibold mb-4">
              Sélection
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark tracking-[-0.03em] leading-[1.05]">
              Notre sélection.{" "}
              <span className="font-playfair italic text-brand-accent">
                Vos inspirations.
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
          <div className="flex gap-5 md:gap-6">
            {showcaseProducts.map((product) => (
              <div
                key={product.id}
                className="flex-[0_0_85%] min-w-0 sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
              >
                <Link href="/catalogue" className="group block h-full">
                  <article className="h-full rounded-2xl overflow-hidden bg-white border border-cream-dark/30 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(46,31,61,0.08)] hover:-translate-y-2 flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {/* Category badge */}
                      <div className="absolute top-4 left-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full text-white ${product.accent}`}
                        >
                          {product.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-dark leading-snug group-hover:text-brand-accent transition-colors duration-300">
                          {product.name}
                        </h3>
                        <span className="text-[11px] font-medium text-dark/30 shrink-0 ml-3">
                          {product.ref}
                        </span>
                      </div>

                      <p className="text-sm text-dark/50 leading-relaxed mb-4 flex-1">
                        {product.desc}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-[11px] font-medium border border-dark/8 text-dark/50 bg-cream-light"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <Link
            href="/catalogue"
            className="group inline-flex items-center gap-2 bg-brand-primary text-white rounded-full px-8 py-3.5 text-sm font-semibold hover:bg-brand-secondary transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {t("viewCatalog")}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
