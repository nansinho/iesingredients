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
import { Search, Filter, X, ChevronDown } from 'lucide-react';
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
      <div className="border-b border-border last:border-b-0">
        <button
          onClick={() => setOpenSections(prev => prev.includes(sectionKey) ? prev.filter(s => s !== sectionKey) : [...prev, sectionKey])}
          className="w-full flex items-center justify-between py-3 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          {title}
          <div className="flex items-center gap-2">
            {selected.length > 0 && <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">{selected.length}</span>}
            <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
          </div>
        </button>
        {isOpen && (
          <div className="pb-3 space-y-1">
            {options.map(option => (
              <label key={option} className="flex items-center gap-2 py-1 cursor-pointer group">
                <Checkbox
                  checked={selected.includes(option)}
                  onCheckedChange={() => toggleFilter(filterKey, option)}
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
    <div className="space-y-1">
      <FilterSection title={t.filters.category} sectionKey="category" options={filterOptions.categories} filterKey="categories" />
      <FilterSection title={t.filters.olfactoryFamily} sectionKey="famille" options={filterOptions.famillesOlfactives} filterKey="famillesOlfactives" />
      <FilterSection title={t.filters.range} sectionKey="gamme" options={filterOptions.gammes} filterKey="gammes" />
      <FilterSection title={t.filters.origin} sectionKey="origine" options={filterOptions.origines} filterKey="origines" />
      <FilterSection title={t.filters.certifications} sectionKey="certif" options={filterOptions.certifications} filterKey="certifications" />
      <FilterSection title={t.filters.solubility} sectionKey="solu" options={filterOptions.solubility} filterKey="solubility" />
      <div className="py-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={filters.foodGrade} onCheckedChange={() => toggleFilter('foodGrade', '')} />
          <span className="text-sm font-medium">{t.filters.foodGrade}</span>
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

      <div className="pt-24 pb-16">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-2">{t.nav.catalog}</h1>
            <p className="text-muted-foreground">{lang === 'fr' ? `${filteredProducts.length} produits disponibles` : `${filteredProducts.length} products available`}</p>
          </div>

          {/* Search & Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t.hero.search}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-9"
              />
              {searchValue && (
                <button onClick={() => setSearchValue('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2">
                  <Filter className="w-4 h-4" />
                  {t.filters.title}
                  {activeFiltersCount > 0 && <Badge className="ml-1">{activeFiltersCount}</Badge>}
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
                <div className="mt-4">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
                <X className="w-4 h-4 mr-1" />
                {t.filters.reset}
              </Button>
            )}
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">{t.filters.title}</h3>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground h-auto p-0">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayedProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} lang={lang} index={index} />
                    ))}
                  </div>
                  {displayCount < filteredProducts.length && (
                    <div className="mt-10 text-center">
                      <Button variant="outline" size="lg" onClick={() => setDisplayCount(prev => prev + 12)}>
                        {t.catalog.loadMore}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">{t.catalog.noResults}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
