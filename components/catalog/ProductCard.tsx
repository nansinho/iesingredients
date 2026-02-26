"use client";

import Image from "next/image";
import { ArrowUpRight, Copy, Check, MapPin, FlaskConical } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { type Product, getCategoryConfig } from "@/lib/product-types";
import { motion } from "framer-motion";

export function ProductCard({ product }: { product: Product }) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("products");
  const config = getCategoryConfig(product.typologie_de_produit);

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.code) return;
    try {
      await navigator.clipboard.writeText(product.code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = product.code;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success(t("referenceCopied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const benefitsArray = product.benefices
    ? product.benefices
        .split(/[\/,]/)
        .map((b) => b.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];

  const certArray = product.certifications
    ? product.certifications
        .split(/[\/,]/)
        .map((c) => c.trim())
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
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative h-full rounded-2xl border border-brown/8 dark:border-brown/10 overflow-hidden bg-white dark:bg-dark-card hover:shadow-[0_20px_60px_rgba(163,123,104,0.1)] hover:border-brown/20 transition-all duration-500 flex flex-col"
      >
        {/* Image — padded pattern */}
        <div className="p-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-cream-light dark:bg-dark">
            <Image
              src={product.image_url || config.image}
              alt={product.nom_commercial || "Product"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark/30 to-transparent" />

            {/* Arrow on hover */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
              <div className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-md">
                <ArrowUpRight className="w-3.5 h-3.5 text-dark" />
              </div>
            </div>

            {/* Category badge on image */}
            <div className="absolute top-3 left-3">
              <span
                className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full text-white backdrop-blur-md border border-white/20"
                style={{ backgroundColor: `${config.accent}cc` }}
              >
                {config.label}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pt-1 pb-5 flex flex-col flex-1">
          {/* Code row */}
          <div className="flex items-center justify-end gap-1 mb-2">
            <span className="font-mono text-xs font-bold text-dark/50 dark:text-cream-light/50 tracking-tight">
              {product.code}
            </span>
            <button
              onClick={handleCopyCode}
              aria-label="Copier la référence"
              className="p-1 rounded-md hover:bg-cream dark:hover:bg-dark transition-colors active:scale-95"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 opacity-30 hover:opacity-70 transition-opacity text-dark/60 dark:text-cream-light/60" />
              )}
            </button>
          </div>

          {/* Product name */}
          <h3 className="text-[15px] font-semibold text-dark dark:text-cream-light leading-snug mb-1.5 line-clamp-2 min-h-[2.25rem] group-hover:text-brown dark:group-hover:text-peach transition-colors duration-300">
            {product.nom_commercial || "Produit sans nom"}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-[12px] leading-relaxed text-dark/50 dark:text-cream-light/50 line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          {/* Tags — benefits + certifications */}
          <div className="flex flex-wrap gap-1 mb-3">
            {benefitsArray.map((benefit, i) => (
              <span
                key={`b-${i}`}
                className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border border-peach/20 bg-peach/8 text-brown dark:text-peach"
              >
                {benefit}
              </span>
            ))}
            {certArray.map((cert, i) => (
              <span
                key={`c-${i}`}
                className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border border-brown/10 bg-brown/5 text-brown/70 dark:text-cream-light/50"
              >
                {cert}
              </span>
            ))}
          </div>

          {/* Bottom info — origin + aspect */}
          <div className="mt-auto pt-2 border-t border-brown/8 dark:border-brown/10 flex items-center justify-between text-[11px] text-dark/40 dark:text-cream-light/40">
            {product.origine && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-peach" />
                {product.origine}
              </span>
            )}
            {product.aspect && (
              <span className="truncate max-w-[50%] text-right">
                {product.aspect}
              </span>
            )}
          </div>

          {/* Sample button */}
          <button
            onClick={(e) => e.preventDefault()}
            className="mt-3 w-full h-10 rounded-full bg-peach text-dark text-xs font-semibold tracking-wide transition-all duration-300 shadow-md shadow-peach/20 hover:shadow-lg hover:shadow-peach/30 hover:scale-[1.02] flex items-center justify-center gap-1.5"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            {t("sample")}
          </button>
        </div>
      </motion.article>
    </Link>
  );
}
