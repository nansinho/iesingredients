"use client";

import { useCallback, useTransition } from "react";
import { Search, X, Leaf, FlaskConical, Droplets, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
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
  { id: "cosmetique", icon: Leaf, accentColor: "#4A7C59" },
  { id: "parfum", icon: FlaskConical, accentColor: "#A67B5B" },
  { id: "arome", icon: Droplets, accentColor: "#C97B8B" },
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
      {/* Hero Section - Matt dark, wider */}
      <section className="section-matt pt-28 sm:pt-32 pb-12 sm:pb-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[150px]" />
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-400 text-[11px] font-semibold uppercase tracking-[0.15em] mb-4">
              <Sparkles className="w-3 h-3" />
              Catalogue
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
              {t("title")}
            </h1>
            <p className="text-white/40 text-lg max-w-2xl mb-8">
              {t("results")}
            </p>
          </motion.div>

          {/* Search */}
          <div className="relative max-w-2xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <Input
              placeholder={hero("search")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-12 h-14 bg-white/[0.06] border-white/[0.1] text-white placeholder:text-white/30 focus:border-gold-500/50 focus:ring-gold-500/30 rounded-2xl text-base backdrop-blur-sm"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
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
                      ? "bg-gold-500 text-white shadow-lg shadow-gold-500/25"
                      : "bg-white/[0.06] text-white/60 hover:bg-white/[0.1] hover:text-white backdrop-blur-sm border border-white/[0.08]"
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
      <section className="bg-cream-50 py-10 sm:py-14 min-h-screen">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
          {/* Controls */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-forest-500 font-medium">
                {isPending ? "..." : `${total} ${t("products")}`}
              </span>
              {activeCategory && (
                <Badge
                  variant="secondary"
                  className="gap-1.5 pr-1.5 cursor-pointer bg-gold-100 text-gold-800 hover:bg-gold-200 border border-gold-200"
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
                className="text-forest-500 hover:text-forest-900"
              >
                <X className="w-4 h-4 mr-2" />
                {filters("reset")}
              </Button>
            )}
          </div>

          {/* Product Grid - wider */}
          {products.length > 0 ? (
            <>
              <div
                className={cn(
                  "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                  isPending && "opacity-50"
                )}
              >
                {products.map((product) => (
                  <ProductCard key={`${product._table}-${product.id}`} product={product} />
                ))}
              </div>

              {/* Pagination - premium */}
              {totalPages > 1 && (
                <div className="mt-14 flex items-center justify-center gap-3">
                  {page > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => updateParams({ page: String(page - 1) })}
                      className="border-forest-200 hover:border-gold-400 rounded-full px-6 h-11"
                    >
                      &larr;
                    </Button>
                  )}
                  <span className="px-5 py-2.5 text-sm text-forest-600 font-medium bg-white rounded-full border border-forest-100 shadow-sm">
                    {page} / {totalPages}
                  </span>
                  {page < totalPages && (
                    <Button
                      variant="outline"
                      onClick={() => updateParams({ page: String(page + 1) })}
                      className="border-forest-200 hover:border-gold-400 rounded-full px-6 h-11"
                    >
                      &rarr;
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-forest-100 flex items-center justify-center">
                <Search className="w-9 h-9 text-forest-400" />
              </div>
              <h3 className="text-lg font-semibold text-forest-900 mb-2">
                {t("noResults")}
              </h3>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4 border-forest-200 text-forest-900 rounded-full px-8"
              >
                {filters("reset")}
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
