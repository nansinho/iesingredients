"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// Static showcase products (real data will come from Supabase in Phase 3)
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

const categoryConfig: Record<string, { label: string; accent: string }> = {
  cosmetique: { label: "Cosmétique", accent: "#4A7C59" },
  parfum: { label: "Parfumerie", accent: "#A67B5B" },
  arome: { label: "Arômes", accent: "#C97B8B" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function MinimalProducts() {
  const t = useTranslations("products");
  const nav = useTranslations("nav");

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-forest-900">
              {t("title")}
            </h2>
            <p className="text-forest-600 mt-2">{t("subtitle")}</p>
          </div>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 text-navy-900 font-medium hover:gap-3 transition-all group"
          >
            {nav("catalog")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {showcaseProducts.map((product) => {
            const config = categoryConfig[product.category] || categoryConfig.cosmetique;
            return (
              <motion.div key={product.id} variants={itemVariants}>
                <Link href="/catalogue" className="group block">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-100 mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div
                      className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: config.accent }}
                    >
                      {config.label}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-serif text-lg text-forest-900 group-hover:text-forest-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-forest-600 font-mono">
                        {product.code}
                      </span>
                    </div>
                    {product.origin && (
                      <p className="text-sm text-forest-500">
                        {t("origin")}: {product.origin}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
