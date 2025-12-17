import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/catalog/ProductCard';
import { mockProducts, filterOptions } from '@/data/mockProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CatalogPageProps {
  lang: Language;
}

interface FilterState {
  categories: string[];
  gammes: string[];
  famillesOlfactives: string[];
  origines: string[];
  certifications: string[];
  foodGrade: boolean;
  solubility: string[];
}

export const CatalogPage = ({ lang }: CatalogPageProps) => {
  const t = useTranslation(lang);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [displayCount, setDisplayCount] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [openSections, setOpenSections] = useState<string[]>(['category', 'famille']);

  const [filters, setFilters] = useState<FilterState>({
    categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
    gammes: [],
    famillesOlfactives: [],
    origines: [],
    certifications: [],
    foodGrade: false,
    solubility: [],
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchValue) params.set('search', searchValue);
    if (filters.categories.length === 1) params.set('category', filters.categories[0]);
    setSearchParams(params, { replace: true });
  }, [searchValue, filters.categories, setSearchParams]);

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      if (searchValue) {
        const search = searchValue.toLowerCase();
        const matches = product.name.toLowerCase().includes(search) ||
          product.description.toLowerCase().includes(search) ||
          product.code.toLowerCase().includes(search) ||
          product.familleOlfactive.toLowerCase().includes(search);
        if (!matches) return false;
      }
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) return false;
      if (filters.gammes.length > 0 && !filters.gammes.includes(product.gamme)) return false;
      if (filters.famillesOlfactives.length > 0 && !filters.famillesOlfactives.includes(product.familleOlfactive)) return false;
      if (filters.origines.length > 0 && !filters.origines.includes(product.origine)) return false;
      if (filters.certifications.length > 0 && !filters.certifications.some(c => product.certifications.includes(c))) return false;
      if (filters.foodGrade && !product.foodGrade) return false;
      if (filters.solubility.length > 0 && !filters.solubility.includes(product.solubility)) return false;
      return true;
    });
  }, [searchValue, filters]);

  const displayedProducts = filteredProducts.slice(0, displayCount);

  const toggleFilter = (key: keyof FilterState, value: string) => {
    if (key === 'foodGrade') {
      setFilters(prev => ({ ...prev, foodGrade: !prev.foodGrade }));
    } else {
      setFilters(prev => {
        const arr = prev[key] as string[];
        return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
      });
    }
  };

  const clearFilters = () => {
    setFilters({ categories: [], gammes: [], famillesOlfactives: [], origines: [], certifications: [], foodGrade: false, solubility: [] });
    setSearchValue('');
  };

  const activeFiltersCount = filters.categories.length + filters.gammes.length + filters.famillesOlfactives.length + filters.origines.length + filters.certifications.length + filters.solubility.length + (filters.foodGrade ? 1 : 0);

  const FilterSection = ({ title, sectionKey, options, filterKey }: { title: string; sectionKey: string; options: readonly string[]; filterKey: keyof FilterState }) => {
    const isOpen = openSections.includes(sectionKey);
    const selected = filters[filterKey] as string[];

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
          <div className="pb-4 space-y-2 animate-fade-in">
            {options.map(option => (
              <label key={option} className="flex items-center gap-3 py-1.5 cursor-pointer group">
                <Checkbox
                  checked={selected.includes(option)}
                  onCheckedChange={() => toggleFilter(filterKey, option)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {filterKey === 'categories' ? t.categories[option as keyof typeof t.categories] : option}
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
      <FilterSection title={t.filters.category} sectionKey="category" options={filterOptions.categories} filterKey="categories" />
      <FilterSection title={t.filters.olfactoryFamily} sectionKey="famille" options={filterOptions.famillesOlfactives} filterKey="famillesOlfactives" />
      <FilterSection title={t.filters.range} sectionKey="gamme" options={filterOptions.gammes} filterKey="gammes" />
      <FilterSection title={t.filters.origin} sectionKey="origine" options={filterOptions.origines} filterKey="origines" />
      <FilterSection title={t.filters.certifications} sectionKey="certif" options={filterOptions.certifications} filterKey="certifications" />
      <FilterSection title={t.filters.solubility} sectionKey="solu" options={filterOptions.solubility} filterKey="solubility" />
      
      {/* Food Grade */}
      <div className="py-4">
        <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-accent/8 border border-accent/20 hover:border-accent/40 transition-colors">
          <Checkbox 
            checked={filters.foodGrade} 
            onCheckedChange={() => toggleFilter('foodGrade', '')}
            className="border-accent data-[state=checked]:bg-accent data-[state=checked]:border-accent"
          />
          <div>
            <span className="text-sm font-medium text-foreground">{t.filters.foodGrade}</span>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === 'fr' ? 'Adapté à l\'usage alimentaire' : 'Suitable for food use'}
            </p>
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>{lang === 'fr' ? 'Catalogue - IES Ingredients' : 'Catalog - IES Ingredients'}</title>
        <meta name="description" content={lang === 'fr' ? 'Explorez notre catalogue de plus de 5000 ingrédients.' : 'Explore our catalog of over 5000 ingredients.'} />
        <html lang={lang} />
      </Helmet>

      <div className="pt-28 pb-20 min-h-screen bg-background">
        <div className="container-elegant">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">{t.nav.catalog}</h1>
            <p className="text-muted-foreground text-lg">
              {filteredProducts.length} {lang === 'fr' ? 'produits disponibles' : 'products available'}
            </p>
          </div>

          {/* Search & Controls Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t.hero.search}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-12 h-12 bg-card border-border focus:border-primary"
              />
              {searchValue && (
                <button 
                  onClick={() => setSearchValue('')} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2 h-12">
                    <SlidersHorizontal className="w-4 h-4" />
                    {t.filters.title}
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-1 bg-primary text-primary-foreground">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto">
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
              <div className="hidden md:flex border border-border rounded-lg p-1 bg-card">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className="h-10 w-10"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="h-10 w-10"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground hidden md:flex">
                  <X className="w-4 h-4 mr-2" />
                  {t.filters.reset}
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.categories.map(cat => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="gap-1.5 pr-1.5 cursor-pointer hover:bg-secondary/80"
                  onClick={() => toggleFilter('categories', cat)}
                >
                  {t.categories[cat as keyof typeof t.categories]}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {filters.famillesOlfactives.map(fam => (
                <Badge
                  key={fam}
                  variant="secondary"
                  className="gap-1.5 pr-1.5 cursor-pointer hover:bg-secondary/80"
                  onClick={() => toggleFilter('famillesOlfactives', fam)}
                >
                  {fam}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
              {filters.foodGrade && (
                <Badge
                  variant="secondary"
                  className="gap-1.5 pr-1.5 cursor-pointer hover:bg-secondary/80"
                  onClick={() => toggleFilter('foodGrade', '')}
                >
                  Food Grade
                  <X className="h-3 w-3" />
                </Badge>
              )}
            </div>
          )}

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-28 bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-medium text-foreground">{t.filters.title}</h3>
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
            <div className="flex-1">
              {displayedProducts.length > 0 ? (
                <>
                  <div className={cn(
                    'grid gap-6',
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                      : 'grid-cols-1'
                  )}>
                    {displayedProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} lang={lang} index={index} />
                    ))}
                  </div>
                  
                  {displayCount < filteredProducts.length && (
                    <div className="mt-12 text-center">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={() => setDisplayCount(prev => prev + 12)}
                        className="min-w-[200px]"
                      >
                        {t.catalog.loadMore}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground mb-2">
                    {lang === 'fr' ? 'Aucun produit trouvé' : 'No products found'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {lang === 'fr' ? 'Essayez de modifier vos critères' : 'Try adjusting your criteria'}
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    {t.filters.reset}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
