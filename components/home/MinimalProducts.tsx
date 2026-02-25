"use client";

import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";
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
    accent: "#918279",
  },
  {
    id: "2",
    name: "Rose Absolute",
    desc: "Absolue de rose de Bulgarie",
    descEn: "Bulgarian rose absolute",
    category: "Parfumerie",
    image: "/images/essential-oil.jpg",
    origin: "Bulgarie",
    accent: "#D4A99A",
  },
  {
    id: "3",
    name: "Vanilla Oleoresin",
    desc: "Oléorésine de vanille naturelle",
    descEn: "Natural vanilla oleoresin",
    category: "Arômes",
    image: "/images/blueberries-herbs.jpg",
    origin: "Madagascar",
    accent: "#B8ADA6",
  },
  {
    id: "4",
    name: "Jojoba Oil",
    desc: "Huile végétale premium",
    descEn: "Premium vegetable oil",
    category: "Cosmétique",
    image: "/images/cream-bowl.jpg",
    origin: "Israël",
    accent: "#918279",
  },
  {
    id: "5",
    name: "Bergamot Essential Oil",
    desc: "Huile essentielle d'Italie",
    descEn: "Essential oil from Italy",
    category: "Parfumerie",
    image: "/images/product-bottle.jpg",
    origin: "Italie",
    accent: "#D4A99A",
  },
  {
    id: "6",
    name: "Lemon Extract Natural",
    desc: "Extrait naturel de citron",
    descEn: "Natural lemon extract",
    category: "Arômes",
    image: "/images/pump-bottle.jpg",
    origin: "Sicile",
    accent: "#B8ADA6",
  },
];

export function MinimalProducts() {
  const t = useTranslations("products");

  return (
    <section className="py-24 md:py-32 lg:py-40 px-4 sm:px-6 lg:px-10 section-matt relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gold-500/3 rounded-full blur-[120px]" />

      <div className="max-w-[90rem] mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[11px] font-semibold uppercase tracking-[0.15em] mb-4">
              <ShoppingBag className="w-3 h-3" />
              Premium
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              {t("title")}
            </h2>
            <p className="text-white/40 mt-3 text-base max-w-lg">{t("subtitle")}</p>
          </div>
          <Link
            href="/catalogue"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300 hover:gap-3 transition-all duration-300"
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
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link href="/catalogue" className="group block">
                <div className="bg-forest-900/60 backdrop-blur-sm rounded-[20px] overflow-hidden border border-white/[0.08] hover:border-gold-500/30 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:-translate-y-2">
                  {/* Image with 10px border radius */}
                  <div className="p-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[10px]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {/* Category badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-white backdrop-blur-md border border-white/20"
                          style={{ backgroundColor: `${product.accent}CC` }}
                        >
                          {product.category}
                        </span>
                      </div>
                      {/* Origin badge */}
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-medium text-white/80 border border-white/10">
                          {product.origin}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-5 pb-5 pt-1">
                    <h3 className="text-base font-bold text-white group-hover:text-gold-400 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <p className="text-sm text-white/40 mt-1">
                      {product.desc}
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/[0.08]">
                      <button
                        className="w-full h-10 rounded-full bg-gold-500 hover:bg-gold-400 text-white text-xs font-semibold tracking-wide transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30"
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
        <div className="sm:hidden text-center mt-10">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold-400 hover:text-gold-300 transition-all duration-300"
          >
            {t("viewCatalog")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
