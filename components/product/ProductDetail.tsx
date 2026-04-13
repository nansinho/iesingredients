"use client";

import Image from "next/image";
import { MapPin, ShoppingBag, Copy, Check, Droplets, Sun, FlaskConical, ArrowRight } from "lucide-react";
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
import { type Product, type PerformanceRow, type StabiliteRow, getCategoryConfig } from "@/lib/product-types";
import { useSampleCart } from "@/hooks/useSampleCart";
import { StarRating } from "@/components/product/StarRating";
import { ProductCard } from "@/components/catalog/ProductCard";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

interface ProductDetailProps {
  product: Product;
  performance?: PerformanceRow[];
  stabilite?: StabiliteRow[];
  relatedProducts?: Product[];
}

export function ProductDetail({ product, performance = [], stabilite = [], relatedProducts = [] }: ProductDetailProps) {
  const t = useTranslations("product");
  const nav = useTranslations("nav");
  const [copied, setCopied] = useState(false);
  const { addItem } = useSampleCart();

  const config = getCategoryConfig(product.typologie_de_produit, product._table);
  const isParfum = product._table === "parfum_fr";
  const isCosmetique = product._table === "cosmetique_fr";
  const isArome = product._table === "aromes_fr";

  const handleCopy = async () => {
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
    toast.success("Code copié !");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddSample = () => {
    addItem({
      code: product.code || "",
      name: product.nom_commercial || "",
      category: config.label,
    });
    toast.success("Ajouté au panier d'échantillons");
  };

  // Build specs grid
  const specs = [
    { label: "Code", value: product.code },
    { label: "INCI", value: product.inci },
    { label: "N° CAS", value: product.cas_no },
    { label: "Origine", value: product.origine },
    { label: "Solubilité", value: product.solubilite },
    { label: "Aspect", value: product.aspect },
    { label: "Food Grade", value: product.food_grade },
    { label: "Certifications", value: product.certifications },
    { label: "Nom latin", value: product.nom_latin },
    { label: "Traçabilité", value: product.tracabilite },
    { label: "Valorisations", value: product.valorisations },
    ...(isArome ? [
      { label: "Famille aromatique", value: product.famille_arome },
      { label: "Saveur", value: product.saveur },
    ] : []),
    ...(isCosmetique ? [
      { label: "Famille", value: product.famille_cosmetique },
      { label: "Type de peau", value: product.type_de_peau },
      { label: "Partie utilisée", value: product.partie_utilisee },
      { label: "Conservateurs", value: product.conservateurs },
    ] : []),
    ...(isParfum ? [
      { label: "Famille olfactive", value: product.famille_olfactive },
      { label: "Flavouring Preparation", value: product.flavouring_preparation },
      { label: "Récolte", value: product.calendrier_recoltes || product.calendrier_des_recoltes },
    ] : []),
  ].filter((s) => s.value);

  const hasPerformance = performance.length > 0;
  const hasStabilite = stabilite.length > 0;

  return (
    <div className="min-h-screen bg-cream-light dark:bg-dark">
      {/* ── Hero ── */}
      <section
        className="relative pt-32 sm:pt-36 pb-12 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${config.accent}22 0%, transparent 60%), linear-gradient(to bottom, hsl(30 15% 12%) 0%, hsl(30 10% 15%) 100%)`,
        }}
      >
        <div className="w-[94%] mx-auto">
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
                <Badge className="text-white border-0 text-xs font-semibold uppercase" style={{ backgroundColor: config.accent }}>
                  {config.label}
                </Badge>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-black text-peach tracking-tight">{product.code}</span>
                <button onClick={handleCopy} aria-label="Copier le code" className="p-1.5 rounded-lg hover:bg-cream-light/10 transition-colors">
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5 text-cream-light/60" />}
                </button>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-semibold text-cream-light leading-tight tracking-[-0.03em]">
                {product.nom_commercial}
              </h1>

              <div className="flex flex-wrap gap-3">
                {product.origine && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-light/10 text-cream-light/80 text-sm">
                    <MapPin className="w-4 h-4" />
                    {product.origine}
                  </span>
                )}
                {product.gamme && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-cream-light/10 text-cream-light/80 text-sm">{product.gamme}</span>
                )}
                {product.famille_olfactive && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm" style={{ backgroundColor: `${config.accent}25`, color: config.accent }}>
                    {product.famille_olfactive}
                  </span>
                )}
                {product.famille_arome && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm" style={{ backgroundColor: `${config.accent}25`, color: config.accent }}>
                    {product.famille_arome}
                  </span>
                )}
              </div>

              {product.description && (
                <p className="text-cream-light/60 leading-relaxed">{product.description}</p>
              )}

              {product.profil_olfactif && (
                <div className="flex flex-wrap gap-2">
                  {product.profil_olfactif.split(",").map((note) => (
                    <span key={note.trim()} className="px-2.5 py-1 rounded-full bg-cream-light/8 text-cream-light/70 text-xs font-medium">
                      {note.trim()}
                    </span>
                  ))}
                </div>
              )}

              <Button variant="accent" size="xl" onClick={handleAddSample}>
                <ShoppingBag className="w-5 h-5 mr-2" />
                Demande d&apos;échantillon
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Specs Grid ── */}
      <section className="w-[94%] mx-auto py-16 md:py-24">
        <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-playfair font-semibold text-2xl md:text-3xl text-dark dark:text-cream-light mb-8">
          {t("specifications")}
        </motion.h2>
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4"
        >
          {specs.map((spec) => (
            <motion.div
              key={spec.label}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } }}
              className="p-4 rounded-2xl bg-cream dark:bg-dark-card border border-brown/8 dark:border-brown/10 hover:border-brown/20 transition-all duration-300"
            >
              <p className="text-[11px] text-dark/40 dark:text-cream-light/40 uppercase tracking-wider mb-1">{spec.label}</p>
              <p className="text-sm font-medium text-dark dark:text-cream-light break-words">{spec.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Performance (parfums only) ── */}
      {isParfum && hasPerformance && (
        <section className="w-[94%] mx-auto pb-16 md:pb-24">
          <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-playfair font-semibold text-2xl md:text-3xl text-dark dark:text-cream-light mb-8">
            Performance
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-dark-card rounded-2xl border border-brown/8 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brown/8 bg-cream-light/50 dark:bg-dark-lighter">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-dark/50 uppercase tracking-wider">Critère</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-dark/50 uppercase tracking-wider">Valeur</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((row) => (
                  <tr key={row.ordre} className="border-b border-brown/5 last:border-0 hover:bg-cream-light/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-dark dark:text-cream-light">{row.option_name}</td>
                    <td className="px-6 py-4 text-right">
                      {row.performance_value ? (
                        <span className="text-sm text-dark/70 dark:text-cream-light/70 font-medium">{row.performance_value}</span>
                      ) : row.performance_rating ? (
                        <div className="flex justify-end">
                          <StarRating rating={row.performance_rating} color={config.accent} size="md" />
                        </div>
                      ) : (
                        <span className="text-dark/20">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </section>
      )}

      {/* ── Stabilité (parfums only) ── */}
      {isParfum && hasStabilite && (
        <section className="w-[94%] mx-auto pb-16 md:pb-24">
          <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-playfair font-semibold text-2xl md:text-3xl text-dark dark:text-cream-light mb-8">
            Stabilité
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-dark-card rounded-2xl border border-brown/8 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brown/8 bg-cream-light/50 dark:bg-dark-lighter">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-dark/50 uppercase tracking-wider w-20">pH</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-dark/50 uppercase tracking-wider">Base</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-dark/50 uppercase tracking-wider">Odeur</th>
                </tr>
              </thead>
              <tbody>
                {stabilite.map((row) => (
                  <tr key={row.ordre} className="border-b border-brown/5 last:border-0 hover:bg-cream-light/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center min-w-[2.5rem] h-7 px-2 rounded-lg text-xs font-bold" style={{ backgroundColor: `${config.accent}15`, color: config.accent }}>
                        {row.ph_value}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-dark dark:text-cream-light">{row.base_name}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <StarRating rating={row.odeur_rating} color={config.accent} size="md" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-3 bg-cream-light/30 dark:bg-dark-lighter border-t border-brown/5">
              <p className="text-[11px] text-dark/40 dark:text-cream-light/40">
                ★ médiocre &nbsp;|&nbsp; ★★ moyen &nbsp;|&nbsp; ★★★ moyen &nbsp;|&nbsp; ★★★★ bon &nbsp;|&nbsp; ★★★★★ bon
              </p>
            </div>
          </motion.div>
        </section>
      )}

      {/* ── Bénéfices cosmétiques (aqueux / huileux) ── */}
      {isCosmetique && (product.benefices_aqueux || product.benefices_huileux) && (
        <section className="w-[94%] mx-auto pb-16 md:pb-24">
          <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-playfair font-semibold text-2xl md:text-3xl text-dark dark:text-cream-light mb-8">
            Bénéfices
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-4">
            {product.benefices_aqueux && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/30">
                <div className="flex items-center gap-2 mb-3">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Bénéfices Aqueux</h3>
                </div>
                <p className="text-sm text-dark/70 dark:text-cream-light/60 leading-relaxed">{product.benefices_aqueux}</p>
              </motion.div>
            )}
            {product.benefices_huileux && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="p-6 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/30">
                <div className="flex items-center gap-2 mb-3">
                  <Sun className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Bénéfices Huileux</h3>
                </div>
                <p className="text-sm text-dark/70 dark:text-cream-light/60 leading-relaxed">{product.benefices_huileux}</p>
              </motion.div>
            )}
          </div>
        </section>
      )}

      <Separator className="w-[94%] mx-auto bg-brown/8" />

      {/* ── Details Accordion ── */}
      <section className="w-[94%] mx-auto py-16 md:py-24">
        <Accordion type="multiple" className="space-y-2">
          {product.benefices && (
            <AccordionItem value="benefits" className="border border-brown/8 dark:border-brown/10 rounded-2xl px-4">
              <AccordionTrigger className="text-dark dark:text-cream-light font-medium">{t("benefits")}</AccordionTrigger>
              <AccordionContent className="text-dark/70 dark:text-cream-light/60 leading-relaxed">{product.benefices}</AccordionContent>
            </AccordionItem>
          )}
          {product.application && (
            <AccordionItem value="application" className="border border-brown/8 dark:border-brown/10 rounded-2xl px-4">
              <AccordionTrigger className="text-dark dark:text-cream-light font-medium">Application</AccordionTrigger>
              <AccordionContent className="text-dark/70 dark:text-cream-light/60 leading-relaxed">{product.application}</AccordionContent>
            </AccordionItem>
          )}
          {product.certifications && (
            <AccordionItem value="certifications" className="border border-brown/8 dark:border-brown/10 rounded-2xl px-4">
              <AccordionTrigger className="text-dark dark:text-cream-light font-medium">{t("certifications")}</AccordionTrigger>
              <AccordionContent className="text-dark/70 dark:text-cream-light/60 leading-relaxed">{product.certifications}</AccordionContent>
            </AccordionItem>
          )}
          {product.profil_aromatique && (
            <AccordionItem value="aromatic" className="border border-brown/8 dark:border-brown/10 rounded-2xl px-4">
              <AccordionTrigger className="text-dark dark:text-cream-light font-medium">Profil Aromatique</AccordionTrigger>
              <AccordionContent className="text-dark/70 dark:text-cream-light/60 leading-relaxed">{product.profil_aromatique}</AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </section>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <section className="w-[94%] mx-auto pb-16 md:pb-24">
          <div className="flex items-center justify-between mb-8">
            <motion.h2 initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-playfair font-semibold text-2xl md:text-3xl text-dark dark:text-cream-light">
              Produits similaires
            </motion.h2>
            <Link href="/catalogue" className="text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all" style={{ color: config.accent }}>
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.code} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ── CTA Final ── */}
      <section className="w-[94%] mx-auto pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-8 md:p-12 text-center"
          style={{ background: `linear-gradient(135deg, ${config.accent}12 0%, ${config.accent}05 100%)`, border: `1px solid ${config.accent}20` }}
        >
          <FlaskConical className="w-10 h-10 mx-auto mb-4" style={{ color: config.accent }} />
          <h3 className="text-xl md:text-2xl font-playfair font-semibold text-dark dark:text-cream-light mb-2">
            Intéressé par cet ingrédient ?
          </h3>
          <p className="text-dark/50 dark:text-cream-light/50 mb-6 max-w-md mx-auto">
            Demandez un échantillon gratuit ou contactez notre équipe commerciale pour plus d&apos;informations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button variant="accent" size="lg" onClick={handleAddSample}>
              <ShoppingBag className="w-4 h-4 mr-2" />
              Demander un échantillon
            </Button>
            <Button variant="outline" size="lg" asChild>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Link href={"/contact" as any}>Nous contacter</Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
