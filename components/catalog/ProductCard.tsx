"use client";

import Image from "next/image";
import { ArrowUpRight, Copy, Check, MapPin } from "lucide-react";
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
        className="relative h-full rounded-[20px] border border-forest-100 overflow-hidden bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] hover:border-gold-400 transition-all duration-500"
      >
        {/* Image with 10px border radius */}
        <div className="p-3">
          <div className="relative h-44 overflow-hidden rounded-[10px] bg-forest-50">
            <Image
              src={product.image_url || config.image}
              alt={product.nom_commercial || "Product"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span
                className="inline-flex items-center px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded-full text-white shadow-lg"
                style={{ backgroundColor: config.accent }}
              >
                {config.label}
              </span>
            </div>

            {/* Arrow on hover */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
              <div className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-lg">
                <ArrowUpRight className="w-4 h-4 text-forest-950" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-5 pt-0">
          {/* Code + Copy */}
          <div className="text-center mb-2.5">
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xl font-black tracking-tight text-forest-900">
                {product.code}
              </span>
              <button
                onClick={handleCopyCode}
                aria-label="Copier la référence"
                className="p-1.5 rounded-lg hover:bg-forest-50 transition-colors active:scale-95"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5 opacity-40 hover:opacity-80 transition-opacity text-forest-600" />
                )}
              </button>
            </div>
          </div>

          {/* Separator - gold accent */}
          <div className="flex justify-center mb-2.5">
            <div
              className="h-[2px] w-14 rounded-full"
              style={{ background: `linear-gradient(90deg, transparent, ${config.accent}, transparent)` }}
            />
          </div>

          {/* Title */}
          <h3 className="font-serif text-base font-semibold text-foreground leading-tight mb-2.5 line-clamp-2 min-h-[2.5rem] text-center group-hover:text-gold-700 transition-colors duration-300">
            {product.nom_commercial || "Produit sans nom"}
          </h3>

          {/* Benefits */}
          {benefitsArray.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mb-3">
              {benefitsArray.map((benefit, i) => (
                <span
                  key={i}
                  className="inline-block text-[10px] font-medium px-2.5 py-1 rounded-full border border-gold-200 bg-gold-50 text-gold-800"
                >
                  {benefit}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Info */}
          <div className="mt-auto pt-3 border-t border-forest-100 flex items-center justify-between text-[11px] text-forest-400">
            {product.origine && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold-500" />
                {product.origine}
              </span>
            )}
            {product.solubilite && (
              <span className="font-medium text-forest-600">
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
