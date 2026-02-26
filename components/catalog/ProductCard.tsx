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
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative h-full rounded-[16px] border border-forest-100 overflow-hidden bg-white hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)] hover:border-gold-300 transition-all duration-500 flex flex-col"
      >
        {/* Image — compact */}
        <div className="relative h-36 overflow-hidden bg-forest-50">
          <Image
            src={product.image_url || config.image}
            alt={product.nom_commercial || "Product"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          {/* Arrow on hover */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
            <div className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center shadow-md">
              <ArrowUpRight className="w-3.5 h-3.5 text-forest-950" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-3 pb-4 flex flex-col flex-1">
          {/* Category badge + Code row */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full text-white shrink-0"
              style={{ backgroundColor: config.accent }}
            >
              {config.label}
            </span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-xs font-bold text-forest-500 tracking-tight">
                {product.code}
              </span>
              <button
                onClick={handleCopyCode}
                aria-label="Copier la référence"
                className="p-1 rounded-md hover:bg-forest-50 transition-colors active:scale-95"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-500" />
                ) : (
                  <Copy className="w-3 h-3 opacity-30 hover:opacity-70 transition-opacity text-forest-600" />
                )}
              </button>
            </div>
          </div>

          {/* Product name */}
          <h3 className="text-[15px] font-semibold text-foreground leading-snug mb-1.5 line-clamp-2 min-h-[2.25rem] group-hover:text-gold-700 transition-colors duration-300">
            {product.nom_commercial || "Produit sans nom"}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-[12px] leading-relaxed text-forest-500 line-clamp-2 mb-3">
              {product.description}
            </p>
          )}

          {/* Tags — benefits + certifications */}
          <div className="flex flex-wrap gap-1 mb-3">
            {benefitsArray.map((benefit, i) => (
              <span
                key={`b-${i}`}
                className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border border-gold-200 bg-gold-50 text-gold-800"
              >
                {benefit}
              </span>
            ))}
            {certArray.map((cert, i) => (
              <span
                key={`c-${i}`}
                className="inline-block text-[10px] font-medium px-2 py-0.5 rounded-full border border-forest-200 bg-forest-50 text-forest-700"
              >
                {cert}
              </span>
            ))}
          </div>

          {/* Bottom info — origin + aspect */}
          <div className="mt-auto pt-2 border-t border-forest-100 flex items-center justify-between text-[11px] text-forest-400">
            {product.origine && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gold-500" />
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
            className="mt-3 w-full py-2 rounded-full text-[12px] font-semibold transition-all duration-300 border-2 group-hover:text-white group-hover:shadow-md flex items-center justify-center gap-1.5"
            style={{
              borderColor: config.accent,
              color: config.accent,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = config.accent;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = config.accent;
            }}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            {t("sample")}
          </button>
        </div>
      </motion.article>
    </Link>
  );
}
