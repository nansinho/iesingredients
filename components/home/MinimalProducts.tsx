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
    code: "IES-COS-001",
    category: "cosmetique",
    image: "/images/cream-jar.jpg",
    origin: "Mexique",
  },
  {
    id: "2",
    name: "Rose Absolute",
    code: "IES-PAR-042",
    category: "parfum",
    image: "/images/essential-oil.jpg",
    origin: "Bulgarie",
  },
  {
    id: "3",
    name: "Vanilla Oleoresin",
    code: "IES-ARO-108",
    category: "arome",
    image: "/images/blueberries-herbs.jpg",
    origin: "Madagascar",
  },
  {
    id: "4",
    name: "Jojoba Oil",
    code: "IES-COS-055",
    category: "cosmetique",
    image: "/images/cream-bowl.jpg",
    origin: "Argentine",
  },
  {
    id: "5",
    name: "Bergamot Essential Oil",
    code: "IES-PAR-089",
    category: "parfum",
    image: "/images/product-bottle.jpg",
    origin: "Italie",
  },
  {
    id: "6",
    name: "Lemon Extract Natural",
    code: "IES-ARO-221",
    category: "arome",
    image: "/images/pump-bottle.jpg",
    origin: "Espagne",
  },
];

const categoryConfig: Record<string, { label: string; color: string }> = {
  cosmetique: { label: "Cosmétique", color: "#4A7C59" },
  parfum: { label: "Parfumerie", color: "#A67B5B" },
  arome: { label: "Arômes", color: "#C97B8B" },
};

export function MinimalProducts() {
  const t = useTranslations("products");
  const nav = useTranslations("nav");

  return (
    <section className="py-32 md:py-40 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header - Centered Apple Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-forest-950 tracking-tight">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {showcaseProducts.map((product, index) => {
            const config = categoryConfig[product.category] || categoryConfig.cosmetique;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Link href="/catalogue" className="group block">
                  <div className="card-apple p-3 hover:shadow-[0_8px_60px_rgba(0,0,0,0.08)] transition-all duration-500">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F5F5F7]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm"
                        style={{ backgroundColor: `${config.color}cc` }}
                      >
                        {config.label}
                      </div>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-forest-700 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-400 font-mono">
                        {product.code}
                      </p>
                      {product.origin && (
                        <p className="text-sm text-gray-500">
                          {t("origin")}: {product.origin}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View Catalog Link - Apple "Learn more" style */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-1.5 text-lg font-medium text-forest-700 hover:text-forest-500 hover:gap-2.5 transition-all duration-300"
          >
            {nav("catalog")}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
