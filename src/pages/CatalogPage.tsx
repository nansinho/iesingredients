import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/catalog/ProductCard';
import { useProducts, useFilterOptions, ProductFilters } from '@/hooks/useProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList, Leaf, FlaskConical, Droplets, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import creamJar from '@/assets/cream-jar.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';

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

// Category card component
const CategoryCard = ({ 
  name, 
  desc, 
  image, 
  icon: Icon, 
  gradient, 
  isActive, 
  onClick 
}: { 
  name: string; 
  desc: string; 
  image: string; 
  icon: React.ElementType; 
  gradient: string; 
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "relative h-32 sm:h-40 rounded-2xl overflow-hidden group text-left transition-all duration-300",
      isActive ? "ring-2 ring-gold-500 ring-offset-2 ring-offset-background" : "hover:scale-[1.02]"
    )}
  >
    <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
    <div className={`absolute inset-0 ${gradient}`} />
    <div className="absolute inset-0 p-4 flex flex-col justify-end">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-white" />
        <span className="text-white font-semibold text-sm sm:text-base">{name}</span>
      </div>
      <p className="text-white/70 text-xs line-clamp-1">{desc}</p>
    </div>
    {isActive && (
      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold-500 flex items-center justify-center">
        <span className="text-forest-950 text-xs font-bold">✓</span>
      </div>
    )}
  </button>
);

export const CatalogPage = ({ lang }: CatalogPageProps) => {
  const t = useTranslation(lang);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';
  
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [displayCount, setDisplayCount] = useState(12);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [openSections, setOpenSections] = useState<string[]>(['gamme', 'origine']);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);

  const [filters, setFilters] = useState<FilterState>({
    gamme: [],
    origine: [],
    solubilite: [],
    aspect: [],
    certifications: [],
    application: [],
  });

  // Categories
  const categories = useMemo(() => [
    { 
      id: 'cosmetique',
      name: lang === 'fr' ? 'Cosmétique' : 'Cosmetic', 
      desc: lang === 'fr' ? 'Actifs botaniques et extraits naturels' : 'Botanical actives and natural extracts',
      image: creamJar,
      gradient: 'bg-gradient-to-t from-emerald-900/90 via-emerald-800/60 to-transparent',
      icon: Leaf,
    },
    { 
      id: 'parfum',
      name: lang === 'fr' ? 'Parfumerie' : 'Perfumery', 
      desc: lang === 'fr' ? 'Essences et matières premières nobles' : 'Noble essences and raw materials',
      image: essentialOil,
      gradient: 'bg-gradient-to-t from-amber-900/90 via-amber-700/60 to-transparent',
      icon: FlaskConical,
    },
    { 
      id: 'arome',
      name: lang === 'fr' ? 'Arômes' : 'Flavors', 
      desc: lang === 'fr' ? 'Arômes alimentaires naturels' : 'Natural food flavors',
      image: blueberriesHerbs,
      gradient: 'bg-gradient-to-t from-rose-900/90 via-rose-700/60 to-transparent',
      icon: Droplets,
    }
  ], [lang]);

  // Build product filters
  const productFilters: ProductFilters = useMemo(() => ({
    search: searchValue,
    gamme: filters.gamme,
    origine: filters.origine,
    solubilite: filters.solubilite,
    aspect: filters.aspect,
    certifications: filters.certifications,
    application: filters.application,
    // Add category filter based on activeCategory
    ...(activeCategory ? { typologie: activeCategory.toUpperCase() } : {})
  }), [searchValue, filters, activeCategory]);

  const { data: products, isLoading } = useProducts(productFilters, lang);
  const { data: filterOptions } = useFilterOptions();

  const displayedProducts = useMemo(() => 
    (products || []).slice(0, displayCount), 
    [products, displayCount]
  );

  const toggleFilter = (key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const arr = prev[key];
      return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const clearFilters = () => {
    setFilters({ gamme: [], origine: [], solubilite: [], aspect: [], certifications: [], application: [] });
    setSearchValue('');
    setActiveCategory('');
  };

  const toggleCategory = (catId: string) => {
    setActiveCategory(prev => prev === catId ? '' : catId);
  };

  const activeFiltersCount = Object.values(filters).flat().length + (activeCategory ? 1 : 0);

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
    const selected = filters[filterKey];

    if (!options || options.length === 0) return null;

    return (
      <div className="border-b border-border/60 last:border-b-0">
        <button
          onClick={() => setOpenSections(prev => prev.includes(sectionKey) ? prev.filter(s => s !== sectionKey) : [...prev, sectionKey])}
          className="w-full flex items-center justify-between py-3 text-sm font-medium text-foreground hover:text-primary transition-colors"
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
            <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isOpen && 'rotate-180')} />
          </div>
        </button>
        {isOpen && (
          <div className="pb-3 space-y-1 max-h-48 overflow-y-auto">
            {options.map(option => (
              <label key={option} className="flex items-center gap-2.5 py-1 cursor-pointer group">
                <Checkbox
                  checked={selected.includes(option)}
                  onCheckedChange={() => toggleFilter(filterKey, option)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">
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
      <SEOHead
        lang={lang}
        title={lang === 'fr' ? 'Catalogue Ingrédients - IES Ingredients' : 'Ingredients Catalog - IES Ingredients'}
        description={lang === 'fr' 
          ? 'Explorez notre catalogue de plus de 5000 ingrédients naturels pour cosmétiques, parfums et arômes. Filtrez par gamme, origine et certifications.'
          : 'Explore our catalog of over 5000 natural ingredients for cosmetics, perfumes and flavors. Filter by range, origin and certifications.'}
      />

      {/* Hero Section */}
      <section className="relative bg-forest-950 pt-32 sm:pt-36 pb-8 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-48 sm:w-96 h-48 sm:h-96 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 sm:w-64 h-32 sm:h-64 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="container-luxe relative z-10">
          <span className="inline-block text-gold-500 text-sm font-medium uppercase tracking-widest mb-4">
            {lang === 'fr' ? 'Nos ingrédients' : 'Our ingredients'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            {t.nav.catalog}
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl mb-8">
            {lang === 'fr' 
              ? 'Découvrez notre sélection de plus de 5000 ingrédients naturels de qualité premium.'
              : 'Discover our selection of over 5000 premium quality natural ingredients.'}
          </p>
          
          {/* Category Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {categories.map(cat => (
              <CategoryCard
                key={cat.id}
                {...cat}
                isActive={activeCategory === cat.id}
                onClick={() => toggleCategory(cat.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-background py-6 sm:py-10 min-h-screen">
        <div className="container-luxe">
          {/* Search & Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 -mt-4 relative z-10">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t.hero.search}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-12 h-12 sm:h-14 bg-card border-border focus:border-primary shadow-lg"
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
            <div className="flex gap-2">
              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2 h-12 sm:h-14 shadow-lg flex-1 sm:flex-none">
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
                  className="h-10 w-10 sm:h-12 sm:w-12"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className="h-10 w-10 sm:h-12 sm:w-12"
                >
                  <LayoutList className="h-4 w-4" />
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

          {/* Results count + Active Filters */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">
              {isLoading ? '...' : `${products?.length || 0} ${lang === 'fr' ? 'résultats' : 'results'}`}
            </span>
            
            {activeCategory && (
              <Badge
                variant="secondary"
                className="gap-1.5 pr-1.5 cursor-pointer hover:bg-secondary/80"
                onClick={() => setActiveCategory('')}
              >
                {categories.find(c => c.id === activeCategory)?.name}
                <X className="h-3 w-3" />
              </Badge>
            )}
            
            {Object.entries(filters).map(([key, values]) =>
              values.map(value => (
                <Badge
                  key={`${key}-${value}`}
                  variant="secondary"
                  className="gap-1.5 pr-1.5 cursor-pointer hover:bg-secondary/80"
                  onClick={() => toggleFilter(key as keyof FilterState, value)}
                >
                  <span className="truncate max-w-[100px]">{value}</span>
                  <X className="h-3 w-3" />
                </Badge>
              ))
            )}
          </div>

          <div className="flex gap-6 lg:gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28 bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-4">
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
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className={cn(
                  'grid gap-3 sm:gap-4',
                  viewMode === 'grid' 
                    ? 'grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                )}>
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-border/50 bg-card">
                      <div className="h-1 bg-secondary" />
                      <div className="p-4 space-y-3">
                        <div className="flex gap-3">
                          <Skeleton className="w-11 h-11 rounded-lg shrink-0" />
                          <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        </div>
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayedProducts.length > 0 ? (
                <>
                  <div className={cn(
                    'grid gap-3 sm:gap-4',
                    viewMode === 'grid' 
                      ? 'grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                      : 'grid-cols-1'
                  )}>
                    {displayedProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} lang={lang} index={index} />
                    ))}
                  </div>
                  
                  {displayCount < (products?.length || 0) && (
                    <div className="mt-10 text-center">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={() => setDisplayCount(prev => prev + 12)}
                        className="min-w-[200px]"
                      >
                        {t.catalog.loadMore}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground mb-2">
                    {lang === 'fr' ? 'Aucun produit trouvé' : 'No products found'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {lang === 'fr' ? 'Essayez de modifier vos critères de recherche' : 'Try adjusting your search criteria'}
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
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
