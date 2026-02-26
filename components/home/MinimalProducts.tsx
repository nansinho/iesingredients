"use client";

import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
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
    accent: "#8B6FA3",
    image: "/images/cream-jar.jpg",
    origin: "Mexique",
  },
  {
    id: "2",
    name: "Rose Absolute",
    desc: "Absolue de rose de Bulgarie",
    descEn: "Bulgarian rose absolute",
    category: "Parfumerie",
    accent: "#A67B5B",
    image: "/images/essential-oil.jpg",
    origin: "Bulgarie",
  },
  {
    id: "3",
    name: "Vanilla Oleoresin",
    desc: "Oléorésine de vanille naturelle",
    descEn: "Natural vanilla oleoresin",
    category: "Arômes",
    accent: "#C97B8B",
    image: "/images/blueberries-herbs.jpg",
    origin: "Madagascar",
  },
  {
    id: "4",
    name: "Jojoba Oil",
    desc: "Huile végétale premium",
    descEn: "Premium vegetable oil",
    category: "Cosmétique",
    accent: "#8B6FA3",
    image: "/images/cream-bowl.jpg",
    origin: "Israël",
  },
  {
    id: "5",
    name: "Bergamot Essential Oil",
    desc: "Huile essentielle d'Italie",
    descEn: "Essential oil from Italy",
    category: "Parfumerie",
    accent: "#A67B5B",
    image: "/images/product-bottle.jpg",
    origin: "Italie",
  },
  {
    id: "6",
    name: "Lemon Extract Natural",
    desc: "Extrait naturel de citron",
    descEn: "Natural lemon extract",
    category: "Arômes",
    accent: "#C97B8B",
    image: "/images/pump-bottle.jpg",
    origin: "Sicile",
  },
];

export function MinimalProducts() {
  const t = useTranslations("products");

  return (
    <section className="py-24 md:py-32 bg-cream-light dark:bg-dark relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-peach/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-lavender/5 rounded-full blur-[120px]" />

      <div className="max-w-[1400px] w-[90%] mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4"
        >
          <div>
            <h2 className="text-dark dark:text-cream-light tracking-tight">
              Nos ingrédients <span className="font-playfair italic text-brown">phares</span>
            </h2>
            <p className="text-dark/50 dark:text-cream-light/50 mt-3 text-base max-w-lg">{t("subtitle")}</p>
          </div>
          <Link
            href="/catalogue"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-brown hover:text-peach-dark hover:gap-3 transition-all duration-300"
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
                <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-brown/8 dark:border-brown/10 hover:border-brown/20 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(163,123,104,0.1)] hover:-translate-y-2">
                  {/* Image — full bleed */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/30 via-transparent to-transparent" />

                    {/* Category badge — accent color */}
                    <div className="absolute top-3 left-3">
                      <span
                        className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-white backdrop-blur-sm shadow-sm"
                        style={{ backgroundColor: product.accent }}
                      >
                        {product.category}
                      </span>
                    </div>

                    {/* Origin badge */}
                    <div className="absolute bottom-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-medium text-dark shadow-sm">
                        <MapPin className="w-2.5 h-2.5 opacity-50" />
                        {product.origin}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-5 pt-4 pb-5">
                    <h3 className="text-base font-semibold text-dark dark:text-cream-light group-hover:text-brown transition-colors duration-300 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-sm text-dark/50 dark:text-cream-light/50 mt-1">
                      {product.desc}
                    </p>
                    <div className="mt-4 pt-4 border-t border-brown/8 dark:border-brown/10">
                      <button
                        className="w-full h-10 rounded-full bg-peach text-dark text-xs font-semibold tracking-wide transition-all duration-300 shadow-md shadow-peach/20 hover:shadow-lg hover:shadow-peach/30 hover:scale-[1.02]"
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-brown hover:text-peach-dark transition-all duration-300"
          >
            {t("viewCatalog")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
