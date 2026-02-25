"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const showcaseProducts = [
  {
    id: "1",
    name: "Aloe Vera Extract",
    desc: "Actif hydratant naturel",
    descEn: "Natural moisturizing active",
    category: "Cosmétique",
    image: "/images/cream-jar.jpg",
    origin: "Mexique",
  },
  {
    id: "2",
    name: "Rose Absolute",
    desc: "Absolue de rose de Bulgarie",
    descEn: "Bulgarian rose absolute",
    category: "Parfumerie",
    image: "/images/essential-oil.jpg",
    origin: "Bulgarie",
  },
  {
    id: "3",
    name: "Vanilla Oleoresin",
    desc: "Oléorésine de vanille naturelle",
    descEn: "Natural vanilla oleoresin",
    category: "Arômes",
    image: "/images/blueberries-herbs.jpg",
    origin: "Madagascar",
  },
  {
    id: "4",
    name: "Jojoba Oil",
    desc: "Huile végétale premium",
    descEn: "Premium vegetable oil",
    category: "Cosmétique",
    image: "/images/cream-bowl.jpg",
    origin: "Israël",
  },
  {
    id: "5",
    name: "Bergamot Essential Oil",
    desc: "Huile essentielle d'Italie",
    descEn: "Essential oil from Italy",
    category: "Parfumerie",
    image: "/images/product-bottle.jpg",
    origin: "Italie",
  },
  {
    id: "6",
    name: "Lemon Extract Natural",
    desc: "Extrait naturel de citron",
    descEn: "Natural lemon extract",
    category: "Arômes",
    image: "/images/pump-bottle.jpg",
    origin: "Sicile",
  },
];

export function MinimalProducts() {
  const t = useTranslations("products");

  return (
    <section className="py-24 md:py-32 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header - Left title + Right link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-forest-950 tracking-tight">
              {t("title")}
            </h2>
            <p className="text-forest-400 mt-2 text-base">{t("subtitle")}</p>
          </div>
          <Link
            href="/catalogue"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:text-gold-500 hover:gap-2.5 transition-all duration-300"
          >
            {t("viewCatalog")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {showcaseProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
            >
              <Link href="/catalogue" className="group block">
                <div className="bg-white rounded-2xl overflow-hidden border border-forest-200 hover:border-gold-400 hover:shadow-xl transition-all duration-500">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-forest-50">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-forest-700 border border-forest-200/50">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-forest-950 group-hover:text-gold-700 transition-colors truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-forest-400 mt-0.5">
                          {product.desc}
                        </p>
                        <p className="text-xs text-forest-300 mt-1.5">
                          {t("origin")} : {product.origin}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-forest-100">
                      <button
                        className="w-full h-9 rounded-full bg-gold-500 hover:bg-gold-400 text-white text-xs font-semibold tracking-wide transition-all duration-300"
                        onClick={(e) => e.preventDefault()}
                      >
                        {t("sample")}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile view catalog link */}
        <div className="sm:hidden text-center mt-8">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold-600 hover:text-gold-500 transition-all duration-300"
          >
            {t("viewCatalog")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
