"use client";

import { useCallback, useTransition } from "react";
import { Search, X, Leaf, FlaskConical, Droplets } from "lucide-react";
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
      {/* Hero Section */}
      <section className="bg-forest-950 pt-28 sm:pt-32 pb-10 sm:pb-12">
        <div className="container-luxe">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
              {t("title")}
            </h1>
            <p className="text-cream-200 text-lg max-w-2xl mb-8">
              {t("results")}
            </p>
          </motion.div>

          {/* Search */}
          <div className="relative max-w-2xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-400" />
            <Input
              placeholder={hero("search")}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-cream-400 focus:border-gold-400 focus:ring-gold-400 rounded-2xl text-base backdrop-blur-sm"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream-400 hover:text-white"
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
                      ? "text-forest-900 shadow-lg bg-gold-400"
                      : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
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
      <section className="bg-cream-50 py-10 min-h-screen">
        <div className="container-luxe">
          {/* Controls */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-forest-600">
                {isPending ? "..." : `${total} ${t("products")}`}
              </span>
              {activeCategory && (
                <Badge
                  variant="secondary"
                  className="gap-1.5 pr-1.5 cursor-pointer bg-gold-100 text-forest-900 hover:bg-gold-200"
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
                className="text-forest-600 hover:text-forest-900"
              >
                <X className="w-4 h-4 mr-2" />
                {filters("reset")}
              </Button>
            )}
          </div>

          {/* Product Grid */}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {page > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => updateParams({ page: String(page - 1) })}
                      className="border-forest-300"
                    >
                      &larr;
                    </Button>
                  )}
                  <span className="px-4 py-2 text-sm text-forest-600">
                    {page} / {totalPages}
                  </span>
                  {page < totalPages && (
                    <Button
                      variant="outline"
                      onClick={() => updateParams({ page: String(page + 1) })}
                      className="border-forest-300"
                    >
                      &rarr;
                    </Button>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-forest-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-forest-500" />
              </div>
              <h3 className="text-lg font-medium text-forest-900 mb-2">
                {t("noResults")}
              </h3>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4 border-forest-300 text-forest-900"
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
