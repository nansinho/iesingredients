"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Plus, Heart, Sparkles } from "lucide-react";
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
    span: "lg:col-span-2 lg:row-span-2",
    height: "h-[320px] lg:h-full",
  },
  {
    id: "2",
    name: "Vitamine C Stabilisée",
    ref: "VC-3300",
    desc: "Ascorbyl glucoside stabilisé pour formulations éclat et anti-oxydantes.",
    category: "Cosmétique",
    accent: "#5B7B6B",
    image: "/images/serum-collection.jpg",
    tags: ["Éclat", "Anti-oxydant"],
    span: "",
    height: "h-[280px]",
  },
  {
    id: "3",
    name: "Ambrofix™",
    ref: "5005809",
    desc: "Molécule ambrée biosourcée, puissante et biodégradable.",
    category: "Parfumerie",
    accent: "#8B6A80",
    image: "/images/essential-oil.jpg",
    tags: ["Ambrée", "Biosourcé"],
    span: "",
    height: "h-[280px]",
  },
  {
    id: "4",
    name: "Extrait de Vanille",
    ref: "VN-1050",
    desc: "Oléorésine de vanille naturelle de Madagascar, qualité premium.",
    category: "Arômes",
    accent: "#D4907E",
    image: "/images/blueberries-herbs.jpg",
    tags: ["Vanille", "Premium"],
    span: "",
    height: "h-[280px]",
  },
  {
    id: "5",
    name: "Rose Absolute",
    ref: "RA-4400",
    desc: "Absolue de rose de Bulgarie, ingrédient noble pour parfumerie fine.",
    category: "Parfumerie",
    accent: "#8B6A80",
    image: "/images/botanicals-flat.jpg",
    tags: ["Rose", "Luxe"],
    span: "lg:col-span-2",
    height: "h-[280px]",
  },
  {
    id: "6",
    name: "Huile de Jojoba",
    ref: "JB-2100",
    desc: "Huile végétale premium, émolliente et non comédogène.",
    category: "Cosmétique",
    accent: "#5B7B6B",
    image: "/images/cream-bowl.jpg",
    tags: ["Émollient", "Premium"],
    span: "",
    height: "h-[280px]",
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
      <div className="w-[94%] mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-dark tracking-tight">
            Nos ingrédients{" "}
            <span className="font-playfair italic text-forest-green">
              phares
            </span>
          </h2>
          <p className="text-dark/50 mt-3 text-base max-w-lg mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-auto">
          {showcaseProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={product.span}
            >
              <Link href="/catalogue" className="group block h-full">
                <div
                  className={`relative ${product.height} rounded-3xl overflow-hidden cursor-pointer`}
                >
                  {/* Full-bleed image */}
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Gradient overlay — stronger on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5 transition-opacity duration-500 group-hover:from-black/80 group-hover:via-black/40" />

                  {/* Category pill — top left */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white backdrop-blur-md border border-white/15"
                      style={{ backgroundColor: `${product.accent}CC` }}
                    >
                      <Sparkles className="w-3 h-3" />
                      {product.category}
                    </span>
                  </div>

                  {/* Like button — top right */}
                  <button
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center transition-all duration-300 hover:bg-white/25 hover:scale-110 z-10"
                    onClick={(e) => toggleLike(product.id, e)}
                  >
                    <Heart
                      className={`w-4 h-4 transition-all duration-300 ${
                        likedProducts.has(product.id)
                          ? "fill-red-400 text-red-400 scale-110"
                          : "text-white/70"
                      }`}
                    />
                  </button>

                  {/* Content — bottom with glass card */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/15 p-4 md:p-5 transition-all duration-500 group-hover:bg-white/15 group-hover:border-white/25">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-medium text-white/40 tracking-wider uppercase mb-1">
                            {product.ref}
                          </p>
                          <h3 className="text-lg md:text-xl font-bold text-white leading-snug mb-1.5 truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-white/60 leading-relaxed line-clamp-2 transition-all duration-500 group-hover:text-white/80">
                            {product.desc}
                          </p>
                        </div>

                        {/* Sample CTA */}
                        <button
                          className="shrink-0 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-white/30 hover:scale-110 mt-1"
                          onClick={(e) => e.preventDefault()}
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      {/* Tags — slide up on hover */}
                      <div className="flex flex-wrap gap-1.5 mt-3 opacity-0 translate-y-2 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0">
                        {product.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full text-[10px] font-semibold text-white/80 bg-white/10 border border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/catalogue"
            className="group inline-flex items-center gap-2 bg-[#2E1F3D] text-white rounded-full px-7 py-3.5 text-sm font-semibold hover:bg-[#5B5470] transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {t("viewCatalog")}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
