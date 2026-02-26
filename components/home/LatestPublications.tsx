"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const staticArticles = [
  {
    id: "1",
    slug: "tendances-cosmetiques-2025",
    title: "Les tendances cosmétiques naturelles en 2025",
    titleEn: "Natural cosmetic trends in 2025",
    excerpt: "Découvrez les dernières innovations en matière d'ingrédients naturels pour la cosmétique.",
    excerptEn: "Discover the latest innovations in natural ingredients for cosmetics.",
    category: "Cosmétique",
    image: "/images/cream-bowl.jpg",
    date: "2025-01-15",
  },
  {
    id: "2",
    slug: "sourcing-responsable",
    title: "Notre approche du sourcing responsable",
    titleEn: "Our approach to responsible sourcing",
    excerpt: "Comment nous sélectionnons nos fournisseurs pour garantir qualité et éthique.",
    excerptEn: "How we select our suppliers to guarantee quality and ethics.",
    category: "Entreprise",
    image: "/images/leaves-hero.jpg",
    date: "2025-01-08",
  },
  {
    id: "3",
    slug: "huiles-essentielles-guide",
    title: "Guide complet des huiles essentielles",
    titleEn: "Complete guide to essential oils",
    excerpt: "Tout ce que vous devez savoir sur les huiles essentielles et leurs applications.",
    excerptEn: "Everything you need to know about essential oils and their applications.",
    category: "Parfumerie",
    image: "/images/essential-oil.jpg",
    date: "2024-12-20",
  },
];

export function LatestPublications() {
  const t = useTranslations("latestPublications");

  return (
    <section className="py-24 md:py-32 bg-sage">
      <div className="max-w-[1400px] w-[90%] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4"
        >
          <div>
            <div className="flex mb-5">
              <div className="divider-brown opacity-50" />
            </div>
            <h2 className="text-dark tracking-tight">
              Dernières <span className="font-playfair italic text-forest-green">publications</span>
            </h2>
          </div>
          <Link
            href="/actualites"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-forest-green hover:text-dark hover:gap-3 transition-all duration-300"
          >
            {t("viewMore")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {staticArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href="/actualites" className="group block">
                <div className="bg-white/40 rounded-2xl overflow-hidden border border-dark/8 hover:border-dark/20 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] hover:-translate-y-2">
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
                        <span className="px-3 py-1.5 rounded-full bg-cream-light/95 backdrop-blur-md text-[11px] font-semibold text-dark shadow-sm">
                          {article.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-5 sm:px-6 pb-6 pt-1">
                    <p className="text-xs text-forest-green mb-2 font-semibold uppercase tracking-wider">
                      {new Date(article.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <h3 className="text-base font-bold text-dark group-hover:text-forest-green transition-colors line-clamp-2 mb-2.5 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-sm text-dark/50 line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest-green mt-4 group-hover:gap-2.5 transition-all duration-300">
                      {t("readMore")}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile view more link */}
        <div className="sm:hidden text-center mt-10">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest-green hover:text-dark transition-all duration-300"
          >
            {t("viewMore")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
