import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { SearchBar } from '@/components/catalog/SearchBar';
import { FilterSidebar, FilterState } from '@/components/catalog/FilterSidebar';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Grid3X3, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CatalogPageProps {
  lang: Language;
}

export const CatalogPage = ({ lang }: CatalogPageProps) => {
  const t = useTranslation(lang);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [displayCount, setDisplayCount] = useState(12);

  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams.get('category')
      ? [searchParams.get('category')!]
      : [],
    gammes: [],
    famillesOlfactives: [],
    origines: [],
    certifications: [],
    foodGrade: false,
    solubility: [],
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchValue) params.set('search', searchValue);
    if (filters.categories.length === 1) params.set('category', filters.categories[0]);
    setSearchParams(params, { replace: true });
  }, [searchValue, filters.categories, setSearchParams]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      // Search filter
      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        const matchesSearch =
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.code.toLowerCase().includes(searchLower) ||
          product.familleOlfactive.toLowerCase().includes(searchLower) ||
          product.gamme.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Gamme filter
      if (filters.gammes.length > 0 && !filters.gammes.includes(product.gamme)) {
        return false;
      }

      // Famille olfactive filter
      if (
        filters.famillesOlfactives.length > 0 &&
        !filters.famillesOlfactives.includes(product.familleOlfactive)
      ) {
        return false;
      }

      // Origine filter
      if (filters.origines.length > 0 && !filters.origines.includes(product.origine)) {
        return false;
      }

      // Certifications filter
      if (
        filters.certifications.length > 0 &&
        !filters.certifications.some((cert) => product.certifications.includes(cert))
      ) {
        return false;
      }

      // Food grade filter
      if (filters.foodGrade && !product.foodGrade) {
        return false;
      }

      // Solubility filter
      if (filters.solubility.length > 0 && !filters.solubility.includes(product.solubility)) {
        return false;
      }

      return true;
    });
  }, [searchValue, filters]);

  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>
          {lang === 'fr'
            ? 'Catalogue - IES Ingredients | Ingrédients Cosmétiques, Parfums & Arômes'
            : 'Catalog - IES Ingredients | Cosmetic Ingredients, Perfumes & Flavors'}
        </title>
        <meta
          name="description"
          content={
            lang === 'fr'
              ? 'Parcourez notre catalogue de plus de 5000 ingrédients cosmétiques, parfums et arômes alimentaires. Filtrez par catégorie, famille olfactive, origine et certifications.'
              : 'Browse our catalog of over 5000 cosmetic ingredients, perfumes and food flavors. Filter by category, olfactory family, origin and certifications.'
          }
        />
        <link rel="canonical" href={`https://ies-ingredients.com/${lang}/catalogue`} />
        <html lang={lang} />
      </Helmet>

      <div className="pt-28 pb-20">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.nav.catalog}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {lang === 'fr'
                ? 'Explorez notre collection complète d\'ingrédients cosmétiques, parfums et arômes alimentaires.'
                : 'Explore our complete collection of cosmetic ingredients, perfumes and food flavors.'}
            </p>
          </div>

          {/* Search and View Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <SearchBar
                lang={lang}
                value={searchValue}
                onChange={setSearchValue}
              />
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile filter trigger is in FilterSidebar */}
              <FilterSidebar
                lang={lang}
                filters={filters}
                onFiltersChange={setFilters}
                productCount={filteredProducts.length}
              />
              
              {/* View mode toggle */}
              <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8"
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex gap-8">
            {/* Desktop Filter Sidebar */}
            <FilterSidebar
              lang={lang}
              filters={filters}
              onFiltersChange={setFilters}
              productCount={filteredProducts.length}
            />

            {/* Products */}
            <div className="flex-1">
              {/* Results count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {filteredProducts.length}
                  </span>{' '}
                  {t.catalog.products}
                </p>
              </div>

              {/* Products Grid/List */}
              {displayedProducts.length > 0 ? (
                <>
                  <div
                    className={cn(
                      'gap-6',
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                        : 'flex flex-col'
                    )}
                  >
                    {displayedProducts.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        lang={lang}
                        index={index}
                      />
                    ))}
                  </div>

                  {/* Load More */}
                  {hasMore && (
                    <div className="mt-12 text-center">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setDisplayCount((prev) => prev + 12)}
                      >
                        {t.catalog.loadMore}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg">{t.catalog.noResults}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
