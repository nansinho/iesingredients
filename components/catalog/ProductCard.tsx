"use client";

import Image from "next/image";
import { ArrowUpRight, Copy, Check, MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { type Product, getCategoryConfig } from "@/lib/product-types";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("products");
  const config = getCategoryConfig(product.typologie_de_produit);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.code) return;
    navigator.clipboard.writeText(product.code);
    setCopied(true);
    toast.success(t("referenceCopied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const benefitsArray = product.benefices
    ? product.benefices
        .split(/[\/,]/)
        .map((b) => b.trim())
        .filter(Boolean)
        .slice(0, 2)
    : [];

  return (
    <Link
      href={{
        pathname: "/catalogue/[code]",
        params: { code: product.code || String(product.id) },
      }}
      className="group block h-full"
    >
      <motion.article
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative h-full rounded-2xl border border-forest-100 overflow-hidden bg-white hover:shadow-xl hover:border-gold-300 transition-colors duration-300"
      >
        {/* Image */}
        <div className="relative h-40 overflow-hidden bg-forest-50">
          <Image
            src={product.image_url || config.image}
            alt={product.nom_commercial || "Product"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span
              className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full text-white"
              style={{ backgroundColor: config.accent }}
            >
              {config.label}
            </span>
          </div>

          {/* Arrow on hover */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-foreground" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Code + Copy */}
          <div className="text-center mb-3">
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xl font-black tracking-tight text-forest-900">
                {product.code}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1 rounded-md hover:bg-black/5 transition-colors active:scale-95"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 opacity-60 hover:opacity-100 transition-opacity text-forest-600" />
                )}
              </button>
            </div>
          </div>

          {/* Separator */}
          <div className="flex justify-center mb-3">
            <div
              className="h-0.5 w-12 rounded-full"
              style={{ backgroundColor: config.accent }}
            />
          </div>

          {/* Title */}
          <h3 className="font-serif text-base font-semibold text-foreground leading-tight mb-2 line-clamp-2 min-h-[2.5rem] text-center group-hover:text-gold-600 transition-colors duration-300">
            {product.nom_commercial || "Produit sans nom"}
          </h3>

          {/* Benefits */}
          {benefitsArray.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-3">
              {benefitsArray.map((benefit, i) => (
                <span
                  key={i}
                  className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border border-forest-200 bg-forest-50 text-forest-700"
                >
                  {benefit}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Info */}
          <div className="mt-auto pt-3 border-t border-forest-100 flex items-center justify-between text-[11px] text-muted-foreground">
            {product.origine && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {product.origine}
              </span>
            )}
            {product.solubilite && (
              <span className="font-medium text-forest-700">
                {product.solubilite.length > 12
                  ? product.solubilite.substring(0, 12) + "..."
                  : product.solubilite}
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
