import { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/catalog/ProductCard';
import { useProducts, useFilterOptions, ProductFilters } from '@/hooks/useProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CatalogPageProps {
  lang: Language;
}

interface FilterState {
  gamme: string[];
  origine: string[];
  solubilite: string[];
  aspect: string[];
  certifications: string[];
  application: string[];
}

export const CatalogPage = ({ lang }: CatalogPageProps) => {
  const t = useTranslation(lang);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Support both 'search' and 'q' parameters
  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [displayCount, setDisplayCount] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [openSections, setOpenSections] = useState<string[]>(['gamme', 'origine']);

  const [filters, setFilters] = useState<FilterState>({
    gamme: [],
    origine: [],
    solubilite: [],
    aspect: [],
    certifications: [],
    application: [],
  });

  // Fetch products with filters
  const productFilters: ProductFilters = {
    search: searchValue,
    gamme: filters.gamme,
    origine: filters.origine,
    solubilite: filters.solubilite,
    aspect: filters.aspect,
    certifications: filters.certifications,
    application: filters.application,
  };

  const { data: products, isLoading } = useProducts(productFilters, lang);
  const { data: filterOptions } = useFilterOptions();

  const displayedProducts = (products || []).slice(0, displayCount);

  const toggleFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const arr = prev[key] as string[];
      return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const clearFilters = () => {
    setFilters({ gamme: [], origine: [], solubilite: [], aspect: [], certifications: [], application: [] });
    setSearchValue('');
  };

  const activeFiltersCount = Object.values(filters).flat().length;

  const FilterSection = ({ 
    title, 
    sectionKey, 
    options, 
    filterKey 
  }: { 
    title: string; 
    sectionKey: string; 
    options: string[]; 
    filterKey: keyof FilterState 
  }) => {
    const isOpen = openSections.includes(sectionKey);
    const selected = filters[filterKey] as string[];

    if (!options || options.length === 0) return null;

    return (
      <div className="border-b border-border/60 last:border-b-0">
        <button
          onClick={() => setOpenSections(prev => prev.includes(sectionKey) ? prev.filter(s => s !== sectionKey) : [...prev, sectionKey])}
          className="w-full flex items-center justify-between py-4 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-primary/60" />
            {title}
          </span>
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">
                {selected.length}
              </span>
            )}
            <ChevronDown className={cn('w-4 h-4 transition-transform duration-300', isOpen && 'rotate-180')} />
          </div>
        </button>
        {isOpen && (
          <div className="pb-4 space-y-2 animate-fade-in max-h-60 overflow-y-auto">
            {options.map(option => (
              <label key={option} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                <Checkbox
                  checked={selected.includes(option)}
                  onCheckedChange={() => toggleFilter(filterKey, option)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {option}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  const FiltersContent = () => (
    <div className="space-y-0">
      <FilterSection title={lang === 'fr' ? 'Gamme' : 'Range'} sectionKey="gamme" options={filterOptions?.gammes || []} filterKey="gamme" />
      <FilterSection title={lang === 'fr' ? 'Origine' : 'Origin'} sectionKey="origine" options={filterOptions?.origines || []} filterKey="origine" />
      <FilterSection title={lang === 'fr' ? 'Solubilité' : 'Solubility'} sectionKey="solubilite" options={filterOptions?.solubilites || []} filterKey="solubilite" />
      <FilterSection title={lang === 'fr' ? 'Aspect' : 'Aspect'} sectionKey="aspect" options={filterOptions?.aspects || []} filterKey="aspect" />
      <FilterSection title={lang === 'fr' ? 'Certifications' : 'Certifications'} sectionKey="certifications" options={filterOptions?.certifications || []} filterKey="certifications" />
      <FilterSection title={lang === 'fr' ? 'Application' : 'Application'} sectionKey="application" options={filterOptions?.applications || []} filterKey="application" />
    </div>
  );

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>{lang === 'fr' ? 'Catalogue - IES Ingredients' : 'Catalog - IES Ingredients'}</title>
        <meta name="description" content={lang === 'fr' ? 'Explorez notre catalogue de plus de 5000 ingrédients.' : 'Explore our catalog of over 5000 ingredients.'} />
        <html lang={lang} />
      </Helmet>

      {/* Hero Section with dark background for header visibility */}
      <section className="relative bg-forest-950 pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 sm:w-64 h-32 sm:h-64 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="container-luxe relative z-10 px-4 sm:px-6">
          <span className="inline-block text-gold-500 text-sm font-medium uppercase tracking-widest mb-3">
            {lang === 'fr' ? 'Nos ingrédients' : 'Our ingredients'}
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl text-white mb-2">{t.nav.catalog}</h1>
          <p className="text-white/60 text-sm sm:text-lg">
            {isLoading ? '...' : `${products?.length || 0} ${lang === 'fr' ? 'produits disponibles' : 'products available'}`}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background py-6 sm:py-10 min-h-screen">
        <div className="container-luxe px-4 sm:px-6">
          {/* Search & Controls Bar */}
          <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8 -mt-6 sm:-mt-8 relative z-10">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <Input
                placeholder={t.hero.search}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 sm:pl-12 h-12 sm:h-14 bg-card border-border focus:border-primary shadow-lg text-sm sm:text-base"
              />
              {searchValue && (
                <button 
                  onClick={() => setSearchValue('')} 
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-2 sm:gap-3">
              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-1.5 sm:gap-2 h-10 sm:h-14 shadow-lg flex-1 sm:flex-none text-sm">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden xs:inline">{t.filters.title}</span>
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-1 bg-primary text-primary-foreground text-xs">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] sm:w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                      {t.filters.title}
                      {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                          {t.filters.reset}
                        </Button>
                      )}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* View Toggle */}
              <div className="flex border border-border rounded-lg p-1 bg-card shadow-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 sm:h-12 sm:w-12"
                >
                  <Grid3X3 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 sm:h-12 sm:w-12"
                >
                  <LayoutList className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground hidden md:flex h-14">
                  <X className="w-4 h-4 mr-2" />
                  {t.filters.reset}
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              {Object.entries(filters).map(([key, values]) =>
                (values as string[]).map(value => (
                  <Badge
                    key={`${key}-${value}`}
                    variant="secondary"
                    className="gap-1 sm:gap-1.5 pr-1 sm:pr-1.5 cursor-pointer hover:bg-secondary/80 text-xs"
                    onClick={() => toggleFilter(key as keyof FilterState, value)}
                  >
                    <span className="truncate max-w-[100px] sm:max-w-none">{value}</span>
                    <X className="h-3 w-3" />
                  </Badge>
                ))
              )}
            </div>
          )}

          <div className="flex gap-4 sm:gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
              <div className="sticky top-28 bg-card rounded-2xl border border-border p-4 xl:p-6">
                <div className="flex items-center justify-between mb-4 xl:mb-6">
                  <h3 className="font-medium text-foreground text-sm xl:text-base">{t.filters.title}</h3>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground h-auto p-0 hover:text-primary">
                      {t.filters.reset}
                    </Button>
                  )}
                </div>
                <FiltersContent />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className={cn(
                  'grid gap-2.5 sm:gap-4 md:gap-6',
                  viewMode === 'grid' 
                    ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                )}>
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="rounded-xl sm:rounded-2xl overflow-hidden border border-border/50 bg-card">
                      <div className="h-1 bg-secondary" />
                      <div className="p-2.5 sm:p-4 space-y-2 sm:space-y-3">
                        <div className="flex gap-2 sm:gap-3">
                          <Skeleton className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg shrink-0" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-3.5 sm:h-5 w-full" />
                            <Skeleton className="h-3 sm:h-4 w-1/2" />
                          </div>
                        </div>
                        <Skeleton className="h-4 sm:h-5 w-full" />
                        <Skeleton className="h-3 sm:h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayedProducts.length > 0 ? (
                <>
                  <div className={cn(
                    'grid gap-2.5 sm:gap-4 md:gap-6',
                    viewMode === 'grid' 
                      ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                      : 'grid-cols-1'
                  )}>
                    {displayedProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} lang={lang} index={index} />
                    ))}
                  </div>
                  
                  {displayCount < (products?.length || 0) && (
                    <div className="mt-8 sm:mt-12 text-center">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={() => setDisplayCount(prev => prev + 12)}
                        className="min-w-[160px] sm:min-w-[200px] text-sm sm:text-base"
                      >
                        {t.catalog.loadMore}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 sm:py-20">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Search className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl text-foreground mb-2">
                    {lang === 'fr' ? 'Aucun produit trouvé' : 'No products found'}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
                    {lang === 'fr' ? 'Essayez de modifier vos critères' : 'Try adjusting your criteria'}
                  </p>
                  <Button variant="outline" onClick={clearFilters} className="text-sm sm:text-base">
                    {t.filters.reset}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
