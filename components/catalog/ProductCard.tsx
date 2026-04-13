"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Copy, Check, Heart } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { type Product, getCategoryConfig } from "@/lib/product-types";
import { useSampleCart } from "@/hooks/useSampleCart";
import { useFavorites } from "@/hooks/useFavorites";
import { LoginPromptDialog } from "@/components/auth/LoginPromptDialog";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("products");
  const { addItem } = useSampleCart();
  const { isAuthenticated, isFavorite, toggleFavorite } = useFavorites();
  const [copied, setCopied] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const config = getCategoryConfig(product.typologie_de_produit, product._table);

  const isParfum = product._table === "parfum_fr";
  const isArome = product._table === "aromes_fr";
  const liked = isFavorite(product.code || "");

  // Display the real code_fournisseurs, or "-" if none
  const codeFournisseur = product.code_fournisseurs;
  const displayRef = codeFournisseur || "-";
  const copyRef = codeFournisseur || product.code || "";

  // Famille (varies by catalog)
  const famille = isParfum
    ? product.famille_olfactive
    : isArome
      ? product.famille_arome
      : product.famille_cosmetique;

  // Build tags based on catalog type (excluding famille, shown separately)
  const tags: string[] = [];
  if (isParfum) {
    if (product.profil_olfactif) {
      product.profil_olfactif.split(",").slice(0, 3).forEach((n) => {
        const v = n.trim();
        if (v) tags.push(v);
      });
    }
  } else if (isArome) {
    if (product.saveur) tags.push(product.saveur);
  } else {
    if (product.benefices) {
      product.benefices.split(/[\/,]/).slice(0, 3).forEach((b) => {
        const v = b.trim();
        if (v) tags.push(v);
      });
    }
  }

  const handleSample = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      code: product.code || "",
      name: product.nom_commercial || "",
      category: config.label,
    });
    toast.success("Ajouté au panier d'échantillons");
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(copyRef);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = copyRef;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success("Référence copiée");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }
    const added = await toggleFavorite(product.code || "", product._table || "");
    toast.success(added ? "Ajouté aux favoris" : "Retiré des favoris");
  };

  return (
    <>
      <Link
        href={{
          pathname: "/catalogue/produit/[code]",
          params: { code: product.code || String(product.id) },
        }}
        className="group block h-full"
      >
        <motion.article
          whileHover={{ y: -8 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="bg-brand-primary rounded-2xl overflow-hidden transition-shadow duration-150 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col h-full"
        >
          {/* Banner image */}
          <div className="relative aspect-[3/1] overflow-hidden">
            <Image
              src={product.image_url || config.image}
              alt={product.nom_commercial || "Product"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

            {/* Heart button — top right */}
            <button
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-150 hover:bg-white/30 hover:scale-110 z-10"
              onClick={handleFavorite}
              aria-label="Ajouter aux favoris"
            >
              <Heart
                className={`w-4 h-4 transition-colors duration-150 ${
                  liked ? "fill-red-500 text-red-500" : "text-white/60"
                }`}
              />
            </button>

            {/* Sample button — bottom right */}
            <button
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold tracking-wide transition-all duration-150 hover:bg-white/30 hover:shadow-md z-10"
              onClick={handleSample}
            >
              <Plus className="w-3.5 h-3.5" />
              {t("sample")}
            </button>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            {/* Top row: category + code + copy */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: config.accent }}
                />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-white/70">
                  {config.label}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-white/50 font-mono">
                  {displayRef}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1 rounded-md hover:bg-white/10 transition-colors duration-150"
                  aria-label="Copier la référence"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-white/30 hover:text-white/60 transition-colors duration-150" />
                  )}
                </button>
              </div>
            </div>

            {/* Famille badge */}
            {famille && (
              <span
                className="inline-flex self-start items-center px-2.5 py-1 rounded-full text-[11px] font-semibold mb-2 capitalize"
                style={{ backgroundColor: `${config.accent}30`, color: config.accent }}
              >
                {famille.toLowerCase()}
              </span>
            )}

            {/* Product name */}
            <h3 className="text-lg font-playfair font-semibold text-white group-hover:text-gold-500 transition-colors duration-150 leading-snug mb-2 line-clamp-2">
              {product.nom_commercial || "Sans nom"}
            </h3>

            {/* Description — strictly 2 lines, responsive text */}
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-3 line-clamp-2">
              {product.description || "—"}
            </p>

            <div className="flex-1" />

            {/* Tags — max 4 + "+N" */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto">
                {tags.slice(0, 4).map((tag, i) => (
                  <span
                    key={`${tag}-${i}`}
                    className="px-3 py-1 rounded-full text-[11px] font-medium border border-white/15 text-white/60 bg-white/10"
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 4 && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white/40 bg-white/5 border border-white/10">
                    +{tags.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.article>
      </Link>

      <LoginPromptDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
