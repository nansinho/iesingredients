"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const showcaseProducts = [
  {
    id: "1",
    name: "Aloe Vera Extract",
    desc: "Actif hydratant naturel",
    descEn: "Natural moisturizing active",
    category: "cosmetique",
    image: "/images/cream-jar.jpg",
  },
  {
    id: "2",
    name: "Rose Absolute",
    desc: "Absolue de rose de Bulgarie",
    descEn: "Bulgarian rose absolute",
    category: "parfum",
    image: "/images/essential-oil.jpg",
  },
  {
    id: "3",
    name: "Vanilla Oleoresin",
    desc: "Oléorésine de vanille naturelle",
    descEn: "Natural vanilla oleoresin",
    category: "arome",
    image: "/images/blueberries-herbs.jpg",
  },
  {
    id: "4",
    name: "Jojoba Oil",
    desc: "Huile végétale premium",
    descEn: "Premium vegetable oil",
    category: "cosmetique",
    image: "/images/cream-bowl.jpg",
  },
  {
    id: "5",
    name: "Bergamot Essential Oil",
    desc: "Huile essentielle d'Italie",
    descEn: "Essential oil from Italy",
    category: "parfum",
    image: "/images/product-bottle.jpg",
  },
  {
    id: "6",
    name: "Lemon Extract Natural",
    desc: "Extrait naturel de citron",
    descEn: "Natural lemon extract",
    category: "arome",
    image: "/images/pump-bottle.jpg",
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
          <h2 className="text-3xl md:text-4xl font-bold text-forest-950 tracking-tight">
            {t("title")}
          </h2>
          <Link
            href="/catalogue"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-500 hover:gap-2.5 transition-all duration-300"
          >
            {t("viewCatalog")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {showcaseProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link href="/catalogue" className="group block">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500 border border-gray-100">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F5F7]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-forest-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {product.desc}
                    </p>
                    <div className="mt-4">
                      <Button
                        size="sm"
                        className="rounded-full bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-medium px-5 h-8"
                        onClick={(e) => e.preventDefault()}
                      >
                        {t("sample")}
                      </Button>
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
            className="inline-flex items-center gap-1.5 text-sm font-medium text-forest-700 hover:text-forest-500 transition-all duration-300"
          >
            {t("viewCatalog")}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
