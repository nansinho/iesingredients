"use client";

import Image from "next/image";
import { MapPin, ShoppingBag, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { type Product, getCategoryConfig } from "@/lib/product-types";
import { useSampleCart } from "@/hooks/useSampleCart";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

export function ProductDetail({ product }: { product: Product }) {
  const t = useTranslations("product");
  const nav = useTranslations("nav");
  const [copied, setCopied] = useState(false);
  const { addItem } = useSampleCart();

  const config = getCategoryConfig(product.typologie_de_produit);

  const handleCopy = async () => {
    if (!product.code) return;
    try {
      await navigator.clipboard.writeText(product.code);
    } catch {
      // Fallback for non-secure contexts (HTTP)
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
    toast.success("Code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Build specs grid
  const specs = [
    { label: "Code", value: product.code },
    { label: t("inci"), value: product.inci },
    { label: t("cas"), value: product.cas_no },
    { label: t("origin"), value: product.origine },
    { label: t("solubility"), value: product.solubilite },
    { label: t("aspect"), value: product.aspect },
    { label: "Food Grade", value: product.food_grade },
    { label: t("certifications"), value: product.certifications },
  ].filter((s) => s.value);

  return (
    <div className="min-h-screen bg-cream-light dark:bg-dark">
      {/* Hero */}
      <section
        className="relative pt-32 sm:pt-36 pb-12 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${config.accent}22 0%, transparent 60%), linear-gradient(to bottom, hsl(30 15% 12%) 0%, hsl(30 10% 15%) 100%)`,
        }}
      >
        <div className="w-[94%] mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-cream-light/60 mb-6">
            <Link href="/catalogue" className="hover:text-peach transition-colors">
              &larr; {nav("catalog")}
            </Link>
          </nav>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-cream-light/5"
            >
              <Image
                src={product.image_url || config.image}
                alt={product.nom_commercial || "Product"}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute top-4 left-4">
                <Badge
                  className="text-white border-0 text-xs font-semibold uppercase"
                  style={{ backgroundColor: config.accent }}
                >
                  {config.label}
                </Badge>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* Code */}
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-black text-peach tracking-tight">
                  {product.code}
                </span>
                <button
                  onClick={handleCopy}
                  aria-label="Copier le code"
                  className="p-1.5 rounded-lg hover:bg-cream-light/10 transition-colors"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Copy className="w-5 h-5 text-cream-light/60" />
                  )}
                </button>
              </div>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-cream-light leading-tight tracking-[-0.03em]">
                {product.nom_commercial}
              </h1>

              {/* Quick info */}
              <div className="flex flex-wrap gap-3">
                {product.origine && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-light/10 text-cream-light/80 text-sm">
                    <MapPin className="w-4 h-4" />
                    {product.origine}
                  </span>
                )}
                {product.gamme && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-cream-light/10 text-cream-light/80 text-sm">
                    {product.gamme}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-cream-light/60 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* CTA */}
              <Button
                variant="accent"
                size="xl"
                onClick={() => {
                  addItem({
                    code: product.code || "",
                    name: product.nom_commercial || "",
                    category: config.label,
                  });
                  toast.success(
                    t("specifications") === "Spécifications"
                      ? "Ajouté au panier"
                      : "Added to cart"
                  );
                }}
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                {t("specifications") === "Spécifications"
                  ? "Demande d'échantillon"
                  : "Request sample"}
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Specs Grid */}
      <section className="w-[94%] mx-auto py-24">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-semibold text-2xl text-dark dark:text-cream-light mb-6"
        >
          {t("specifications")}
        </motion.h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {specs.map((spec) => (
            <motion.div
              key={spec.label}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="p-4 rounded-2xl bg-cream dark:bg-dark-card border border-brown/8 dark:border-brown/10 hover:border-brown/20 transition-all duration-300"
            >
              <p className="text-xs text-dark/40 dark:text-cream-light/40 uppercase tracking-wider mb-1">
                {spec.label}
              </p>
              <p className="text-sm font-medium text-dark dark:text-cream-light break-words">
                {spec.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Separator className="w-[94%] mx-auto bg-brown/8" />

      {/* Details Accordion */}
      <section className="w-[94%] mx-auto py-24">
        <Accordion type="multiple" className="space-y-2">
          {product.benefices && (
            <AccordionItem value="benefits" className="border border-brown/8 dark:border-brown/10 rounded-2xl px-4">
              <AccordionTrigger className="text-dark dark:text-cream-light font-medium">
                {t("benefits")}
              </AccordionTrigger>
              <AccordionContent className="text-dark/70 dark:text-cream-light/60 leading-relaxed">
                {product.benefices}
              </AccordionContent>
            </AccordionItem>
          )}

          {product.application && (
            <AccordionItem value="application" className="border border-brown/8 dark:border-brown/10 rounded-2xl px-4">
              <AccordionTrigger className="text-dark dark:text-cream-light font-medium">
                Application
              </AccordionTrigger>
              <AccordionContent className="text-dark/70 dark:text-cream-light/60 leading-relaxed">
                {product.application}
              </AccordionContent>
            </AccordionItem>
          )}

          {product.certifications && (
            <AccordionItem value="certifications" className="border border-brown/8 dark:border-brown/10 rounded-2xl px-4">
              <AccordionTrigger className="text-dark dark:text-cream-light font-medium">
                {t("certifications")}
              </AccordionTrigger>
              <AccordionContent className="text-dark/70 dark:text-cream-light/60 leading-relaxed">
                {product.certifications}
              </AccordionContent>
            </AccordionItem>
          )}

          {product.profil_olfactif && (
            <AccordionItem value="olfactory" className="border border-brown/8 dark:border-brown/10 rounded-2xl px-4">
              <AccordionTrigger className="text-dark dark:text-cream-light font-medium">
                Profil Olfactif
              </AccordionTrigger>
              <AccordionContent className="text-dark/70 dark:text-cream-light/60 leading-relaxed">
                {product.profil_olfactif}
              </AccordionContent>
            </AccordionItem>
          )}

          {product.profil_aromatique && (
            <AccordionItem value="aromatic" className="border border-brown/8 dark:border-brown/10 rounded-2xl px-4">
              <AccordionTrigger className="text-dark dark:text-cream-light font-medium">
                Profil Aromatique
              </AccordionTrigger>
              <AccordionContent className="text-dark/70 dark:text-cream-light/60 leading-relaxed">
                {product.profil_aromatique}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </section>
    </div>
  );
}
