"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

// Static articles for display (real data from Supabase can replace this later)
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
    <section className="py-24 md:py-32 px-4 bg-[#F5F5F7]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-forest-950 tracking-tight">
            {t("title")}
          </h2>
          <Link
            href="/actualites"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-500 hover:gap-2.5 transition-all duration-300"
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
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500">
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6">
                    <p className="text-sm text-gray-400 mb-2">
                      {new Date(article.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-forest-700 transition-colors line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-forest-700 mt-4 group-hover:gap-2 transition-all duration-300">
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
        <div className="sm:hidden text-center mt-8">
          <Link
            href="/actualites"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-500 transition-all duration-300"
          >
            {t("viewMore")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
