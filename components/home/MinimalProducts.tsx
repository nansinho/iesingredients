"use client";

import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const showcaseProducts = [
  {
    id: "1",
    name: "Acide Hyaluronique",
    ref: "AH-2024",
    desc: "Actif hydratant haute performance, poids moléculaire optimisé pour pénétration cutanée.",
    category: "Cosmétique",
    accent: "#cc8860",
    image: "/images/cream-jar.jpg",
    tags: ["Hydratation", "Anti-âge", "Naturel"],
  },
  {
    id: "2",
    name: "Vitamine C Stabilisée",
    ref: "VC-3300",
    desc: "Ascorbyl glucoside stabilisé pour formulations éclat et anti-oxydantes.",
    category: "Cosmétique",
    accent: "#cc8860",
    image: "/images/serum-collection.jpg",
    tags: ["Éclat", "Anti-oxydant", "Performance"],
  },
  {
    id: "3",
    name: "Ambrofix™",
    ref: "5005809",
    desc: "Molécule ambrée biosourcée, puissante et biodégradable. Notes boisées ambrées.",
    category: "Parfumerie",
    accent: "#b47068",
    image: "/images/essential-oil.jpg",
    tags: ["Ambrée", "Biosourcé", "Biodégradable"],
  },
  {
    id: "4",
    name: "Extrait de Vanille",
    ref: "VN-1050",
    desc: "Oléorésine de vanille naturelle de Madagascar, qualité premium pour arômes alimentaires.",
    category: "Arômes",
    accent: "#c8a8a8",
    image: "/images/blueberries-herbs.jpg",
    tags: ["Vanille", "Naturel", "Premium"],
  },
  {
    id: "5",
    name: "Rose Absolute",
    ref: "RA-4400",
    desc: "Absolue de rose de Bulgarie, ingrédient noble pour parfumerie fine et soins luxe.",
    category: "Parfumerie",
    accent: "#b47068",
    image: "/images/botanicals-flat.jpg",
    tags: ["Rose", "Luxe", "Bulgarie"],
  },
  {
    id: "6",
    name: "Huile de Jojoba",
    ref: "JB-2100",
    desc: "Huile végétale premium, émolliente et non comédogène, idéale pour soins capillaires et cutanés.",
    category: "Cosmétique",
    accent: "#cc8860",
    image: "/images/cream-bowl.jpg",
    tags: ["Émollient", "Végétal", "Premium"],
  },
];

export function MinimalProducts() {
  const t = useTranslations("products");

  return (
    <section className="py-24 md:py-32 bg-mint relative overflow-hidden">

      <div className="w-[94%] mx-auto relative z-10">
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
              Nos ingrédients <span className="font-playfair italic text-forest-green">phares</span>
            </h2>
            <p className="text-dark/50 dark:text-cream-light/50 mt-3 text-base max-w-lg">{t("subtitle")}</p>
          </div>
          <Link
            href="/catalogue"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-forest-green hover:text-charcoal hover:gap-3 transition-all duration-300"
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
                <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(74,90,56,0.12)] hover:-translate-y-2 flex flex-col h-full">
                  {/* Banner image */}
                  <div className="relative aspect-[16/7] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                  {/* Top row: category + ref */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: product.accent }}
                      />
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-dark/70 dark:text-cream-light/70">
                        {product.category}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-dark/40 dark:text-cream-light/40">
                      {product.ref}
                    </span>
                  </div>

                  {/* Product name */}
                  <h3 className="text-xl font-playfair font-semibold text-dark dark:text-cream-light group-hover:text-forest-green transition-colors duration-300 leading-snug mb-2">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-dark/60 dark:text-cream-light/50 leading-relaxed mb-5 flex-1">
                    {product.desc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-[11px] font-medium border border-dark/15 dark:border-cream-light/15 text-dark/60 dark:text-cream-light/50 bg-white/30 dark:bg-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Sample button */}
                  <div className="flex justify-end">
                    <button
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-forest-green text-white text-xs font-semibold tracking-wide transition-all duration-300 hover:bg-charcoal hover:shadow-md hover:shadow-forest-green/20"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Plus className="w-3.5 h-3.5" />
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest-green hover:text-charcoal transition-all duration-300"
          >
            {t("viewCatalog")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
