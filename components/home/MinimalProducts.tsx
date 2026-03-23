"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Plus, Heart } from "lucide-react";
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
    accent: "#5B7B6B",
    image: "/images/cream-jar.jpg",
    tags: ["Hydratation", "Anti-âge", "Naturel"],
  },
  {
    id: "2",
    name: "Vitamine C Stabilisée",
    ref: "VC-3300",
    desc: "Ascorbyl glucoside stabilisé pour formulations éclat et anti-oxydantes.",
    category: "Cosmétique",
    accent: "#5B7B6B",
    image: "/images/serum-collection.jpg",
    tags: ["Éclat", "Anti-oxydant", "Performance"],
  },
  {
    id: "3",
    name: "Ambrofix™",
    ref: "5005809",
    desc: "Molécule ambrée biosourcée, puissante et biodégradable. Notes boisées ambrées.",
    category: "Parfumerie",
    accent: "#8B6A80",
    image: "/images/essential-oil.jpg",
    tags: ["Ambrée", "Biosourcé", "Biodégradable"],
  },
  {
    id: "4",
    name: "Extrait de Vanille",
    ref: "VN-1050",
    desc: "Oléorésine de vanille naturelle de Madagascar, qualité premium pour arômes alimentaires.",
    category: "Arômes",
    accent: "#D4907E",
    image: "/images/blueberries-herbs.jpg",
    tags: ["Vanille", "Naturel", "Premium"],
  },
  {
    id: "5",
    name: "Rose Absolute",
    ref: "RA-4400",
    desc: "Absolue de rose de Bulgarie, ingrédient noble pour parfumerie fine et soins luxe.",
    category: "Parfumerie",
    accent: "#8B6A80",
    image: "/images/botanicals-flat.jpg",
    tags: ["Rose", "Luxe", "Bulgarie"],
  },
  {
    id: "6",
    name: "Huile de Jojoba",
    ref: "JB-2100",
    desc: "Huile végétale premium, émolliente et non comédogène, idéale pour soins capillaires et cutanés.",
    category: "Cosmétique",
    accent: "#5B7B6B",
    image: "/images/cream-bowl.jpg",
    tags: ["Émollient", "Végétal", "Premium"],
  },
];

export function MinimalProducts() {
  const t = useTranslations("products");
  const [likedProducts, setLikedProducts] = useState<Set<string>>(new Set());

  const toggleLike = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  return (
    <section className="py-24 md:py-32 bg-mint relative overflow-hidden">

      <div className="w-[94%] max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-dark tracking-tight">
            Nos ingrédients <span className="font-playfair italic text-[var(--brand-secondary)]">phares</span>
          </h2>
          <p className="text-dark/50 mt-3 text-base max-w-lg mx-auto">{t("subtitle")}</p>
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
              <Link href="/catalogue" className="group block h-full">
                <div className="bg-[var(--brand-primary)] rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:-translate-y-2 flex flex-col h-full">
                  {/* Banner image with like + sample buttons */}
                  <div className="relative aspect-[3/1] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Like button — top right */}
                    <button
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-white/30 hover:shadow-md hover:scale-110 z-10"
                      onClick={(e) => toggleLike(product.id, e)}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors duration-300 ${
                          likedProducts.has(product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-white/60"
                        }`}
                      />
                    </button>

                    {/* Sample button — bottom right */}
                    <button
                      className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold tracking-wide transition-all duration-300 hover:bg-white/30 hover:shadow-md z-10"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {t("sample")}
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                  {/* Top row: category + ref */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: product.accent }}
                      />
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-white/70">
                        {product.category}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-white/40">
                      {product.ref}
                    </span>
                  </div>

                  {/* Product name */}
                  <h3 className="text-xl font-playfair font-semibold text-white group-hover:text-gold-500 transition-colors duration-300 leading-snug mb-2">
                    {product.name}
                  </h3>

                  {/* Description — flex-1 to push tags to bottom */}
                  <p className="text-sm text-white/60 leading-relaxed mb-3 flex-1">
                    {product.desc}
                  </p>

                  {/* Tags — always at bottom */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-[11px] font-medium border border-white/15 text-white/60 bg-white/10"
                      >
                        {tag}
                      </span>
                    ))}
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
