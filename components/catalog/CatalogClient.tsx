"use client";

import { useCallback, useTransition } from "react";
import Image from "next/image";
import { Search, X, Leaf, FlaskConical, Droplets, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/routing";
import { ProductCard } from "@/components/catalog/ProductCard";
import { type Product } from "@/lib/product-types";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface CatalogClientProps {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  searchParams: {
    search?: string;
    category?: string;
    page?: string;
  };
}

const categoryOptions = [
  { id: "cosmetique", icon: Leaf, accentColor: "#5B7B6B" },
  { id: "parfum", icon: FlaskConical, accentColor: "#8B6A80" },
  { id: "arome", icon: Droplets, accentColor: "#D4907E" },
] as const;

export function CatalogClient({
  products,
  total,
  page,
  totalPages,
  searchParams,
}: CatalogClientProps) {
  const router = useRouter();
  const t = useTranslations("catalog");
  const cat = useTranslations("categories");
  const filters = useTranslations("filters");
  const hero = useTranslations("hero");
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchParams.search || "");
  const activeCategory = searchParams.category || "";

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const current = new URLSearchParams();
      if (searchParams.search) current.set("search", searchParams.search);
      if (searchParams.category) current.set("category", searchParams.category);
      if (searchParams.page) current.set("page", searchParams.page);

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          current.set(key, value);
        } else {
          current.delete(key);
        }
      });

      // Reset page when filters change
      if (!updates.page && (updates.search !== undefined || updates.category !== undefined)) {
        current.delete("page");
      }

      startTransition(() => {
        const qs = current.toString();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.push((`/catalogue${qs ? `?${qs}` : ""}`) as any);
      });
    },
    [router, searchParams]
  );

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue !== (searchParams.search || "")) {
        updateParams({ search: searchValue || undefined, page: undefined });
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchValue, searchParams.search, updateParams]);

  const toggleCategory = (catId: string) => {
    updateParams({
      category: activeCategory === catId ? undefined : catId,
      page: undefined,
    });
  };

  const clearFilters = () => {
    setSearchValue("");
    updateParams({ search: undefined, category: undefined, page: undefined });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 sm:pt-36 pb-12 sm:pb-14 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/blueberries-herbs.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--brand-primary)]/90 via-[var(--brand-primary)]/85 to-[var(--brand-primary)]" />
        </div>

        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-peach/10 border border-peach/20 text-peach text-[11px] font-semibold uppercase tracking-[0.15em] mb-4">
                <Sparkles className="w-3 h-3" />
                Catalogue
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-cream-light tracking-tight mb-4">
                <span className="font-playfair italic text-peach">{t("title")}</span>
              </h1>
              <p className="text-cream-light/40 text-lg max-w-2xl mx-auto">
                {t("results")}
              </p>
            </div>
          </motion.div>

          {/* Search */}
          <div className="relative max-w-2xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-light/30" />
            <Input
              placeholder={hero("search")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-12 h-14 bg-cream-light/[0.06] border-cream-light/[0.1] text-cream-light placeholder:text-cream-light/30 focus:border-peach/50 focus:ring-peach/30 rounded-2xl text-base backdrop-blur-sm"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream-light/30 hover:text-cream-light"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categoryOptions.map((c) => {
              const Icon = c.icon;
              const isActive = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCategory(c.id)}
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
                    isActive
                      ? "bg-peach text-dark shadow-lg shadow-peach/25"
                      : "bg-cream-light/[0.06] text-cream-light/60 hover:bg-cream-light/[0.1] hover:text-cream-light backdrop-blur-sm border border-cream-light/[0.08]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {cat(c.id === "cosmetique" ? "cosmetic" : c.id === "parfum" ? "perfume" : "aroma")}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="bg-cream-light dark:bg-dark py-10 sm:py-14 min-h-screen">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Controls */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-dark/50 dark:text-cream-light/50 font-medium">
                {isPending ? "..." : `${total} ${t("products")}`}
              </span>
              {activeCategory && (
                <Badge
                  variant="secondary"
                  className="gap-1.5 pr-1.5 cursor-pointer bg-peach/10 text-brown hover:bg-peach/20 border border-peach/20"
                  onClick={() => toggleCategory(activeCategory)}
                >
                  {cat(
                    activeCategory === "cosmetique"
                      ? "cosmetic"
                      : activeCategory === "parfum"
                        ? "perfume"
                        : "aroma"
                  )}
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </div>
            {(activeCategory || searchValue) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-dark/50 hover:text-dark dark:text-cream-light/50 dark:hover:text-cream-light"
              >
                <X className="w-4 h-4 mr-2" />
                {filters("reset")}
              </Button>
            )}
          </div>

          {/* Product Grid - wider */}
          {products.length > 0 ? (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.06 } },
                }}
                className={cn(
                  "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                  isPending && "opacity-50"
                )}
              >
                {products.map((product) => (
                  <motion.div
                    key={`${product._table}-${product.id}`}
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
                    }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-14 flex items-center justify-center gap-3"
                >
                  {page > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => updateParams({ page: String(page - 1) })}
                      className="border-brown/15 hover:border-peach rounded-full px-6 h-11"
                    >
                      &larr;
                    </Button>
                  )}
                  <span className="px-5 py-2.5 text-sm text-dark/60 dark:text-cream-light/60 font-medium bg-white dark:bg-dark-card rounded-full border border-brown/8 dark:border-brown/10 shadow-sm">
                    {page} / {totalPages}
                  </span>
                  {page < totalPages && (
                    <Button
                      variant="outline"
                      onClick={() => updateParams({ page: String(page + 1) })}
                      className="border-brown/15 hover:border-peach rounded-full px-6 h-11"
                    >
                      &rarr;
                    </Button>
                  )}
                </motion.div>
              )}
            </>
          ) : (
            <div className="text-center py-24">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-cream dark:bg-dark-card flex items-center justify-center">
                <Search className="w-9 h-9 text-brown/40" />
              </div>
              <h3 className="text-lg font-semibold text-dark dark:text-cream-light mb-2">
                {t("noResults")}
              </h3>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4 border-brown/15 text-dark dark:text-cream-light rounded-full px-8"
              >
                {filters("reset")}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Help CTA */}
      <section className="py-16 bg-cream-light dark:bg-dark border-t border-brown/8 dark:border-brown/10">
        <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-[var(--brand-accent-light)]/15 border border-[var(--brand-accent)]/20 relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-[var(--brand-primary)] dark:text-cream-light font-semibold text-xl mb-1">
                {t("needHelp") || (cat("cosmetic") ? "Besoin d'aide pour trouver un ingrédient ?" : "Need help finding an ingredient?")}
              </h3>
              <p className="text-[var(--brand-primary)]/55 dark:text-cream-light/50 text-sm">
                {t("helpDescription") || (cat("cosmetic") ? "Notre équipe est là pour vous accompagner." : "Our team is here to help you.")}
              </p>
            </div>
            <Link
              href="/contact"
              className="relative z-10 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--brand-primary)] text-white text-sm font-semibold hover:bg-[var(--brand-secondary)] transition-all duration-300 shadow-lg shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              Contact
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
