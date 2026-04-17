"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { type Product } from "@/lib/product-types";
import { ProductCard } from "@/components/catalog/ProductCard";

interface MinimalProductsProps {
  products: Product[];
}

export function MinimalProducts({ products }: MinimalProductsProps) {
  const t = useTranslations("products");

  if (products.length === 0) return null;

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
            Notre sélection.{" "}
            <span className="font-playfair italic text-brand-secondary">
              Vos inspirations.
            </span>
          </h2>
          <p className="text-dark/50 mt-3 text-base max-w-lg mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Products Grid — same ProductCard as catalogue */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={`${product._table}-${product.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Mobile view catalog link */}
        <div className="text-center mt-10">
          <Link
            href="/catalogue"
            className="group inline-flex items-center gap-2 bg-brand-primary text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-brand-secondary transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {t("viewCatalog")}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
