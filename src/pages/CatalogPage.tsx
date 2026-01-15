import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useProducts, useFilterOptions, ProductFilters } from '@/hooks/useProducts';
import { Language, useTranslation } from '@/lib/i18n';
import { SEOHead } from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList, Leaf, FlaskConical, Droplets, ArrowRight, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { getCategoryConfig } from '@/lib/productTheme';

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

// Category pill component
const CategoryPill = ({ 
  name, 
  icon: Icon, 
  isActive, 
  onClick,
  accentColor
}: { 
  name: string; 
  icon: React.ElementType; 
  isActive: boolean;
  onClick: () => void;
  accentColor: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
      isActive 
        ? "text-forest-900 shadow-lg bg-gold-400" 
        : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
    )}
  >
    <Icon className="w-4 h-4" />
    {name}
  </button>
);

// Helper function to get category glow color
const getCategoryGlow = (typologie: string | null) => {
  const type = typologie?.toUpperCase() || '';
  if (type.includes('COSMET') || type.includes('COSMÉT')) return 'rgba(74, 124, 89, 0.25)';
  if (type.includes('PARFUM')) return 'rgba(212, 165, 116, 0.25)';
  if (type.includes('AROME') || type.includes('ARÔME')) return 'rgba(201, 123, 139, 0.25)';
  return 'rgba(74, 124, 89, 0.25)';
};

// Minimal Product Card with enhanced hover effects
const MinimalProductCard = ({ 
  product, 
  lang, 
  copiedCode,
  onCopy
}: { 
  product: any; 
  lang: Language;
  copiedCode: string | null;
  onCopy: (code: string, e: React.MouseEvent) => void;
}) => {
  const config = getCategoryConfig(product.typologie_de_produit);
  const glowColor = getCategoryGlow(product.typologie_de_produit);
  
  return (
    <Link
      to={`/${lang}/produit/${product.code}`}
      className="group block"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ 
          y: -8, 
          scale: 1.02,
          boxShadow: `0 25px 50px -12px ${glowColor}`
        }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white rounded-2xl border border-forest-100 overflow-hidden hover:border-gold-300 transition-colors duration-300"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-forest-50 overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.nom_commercial || ''}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <img
              src={config.image}
              alt={product.nom_commercial || ''}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          )}
          {/* Category Badge */}
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-forest-900 text-gold-400">
            {config.label}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-serif text-lg text-forest-900 group-hover:text-gold-600 transition-colors line-clamp-1">
            {product.nom_commercial}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-forest-600 font-mono">
              {product.code}
            </span>
            <button
              onClick={(e) => onCopy(product.code || '', e)}
              className="p-1.5 rounded-lg hover:bg-forest-100 transition-colors"
            >
              {copiedCode === product.code ? (
                <Check className="w-4 h-4 text-forest-600" />
              ) : (
                <Copy className="w-4 h-4 text-forest-500" />
              )}
            </button>
          </div>
          {product.origine && (
            <p className="text-sm text-forest-500">
              {lang === 'fr' ? 'Origine' : 'Origin'}: {product.origine}
            </p>
          )}
        </div>
      </motion.div>
    </Link>
  );
};

export const CatalogPage = ({ lang }: CatalogPageProps) => {
  const t = useTranslation(lang);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
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

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(lang === 'fr' ? 'Référence copiée !' : 'Reference copied!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Categories
  const categories = useMemo(() => [
    { 
      id: 'cosmetique',
      name: lang === 'fr' ? 'Cosmétique' : 'Cosmetic', 
      icon: Leaf,
      accentColor: 'hsl(152, 45%, 45%)',
    },
    { 
      id: 'parfum',
      name: lang === 'fr' ? 'Parfumerie' : 'Perfumery', 
      icon: FlaskConical,
      accentColor: 'hsl(35, 70%, 50%)',
    },
    { 
      id: 'arome',
      name: lang === 'fr' ? 'Arômes' : 'Flavors', 
      icon: Droplets,
      accentColor: 'hsl(350, 60%, 55%)',
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
      <div className="border-b border-cream-200 last:border-b-0">
          <button
          onClick={() => setOpenSections(prev => prev.includes(sectionKey) ? prev.filter(s => s !== sectionKey) : [...prev, sectionKey])}
          className="w-full flex items-center justify-between py-3 text-sm font-medium text-forest-900 hover:text-gold-600 transition-colors"
        >
          <span>{title}</span>
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <span className="text-xs bg-forest-900 text-gold-400 px-2 py-0.5 rounded-full font-medium">
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
                  className="border-forest-300 data-[state=checked]:bg-forest-900 data-[state=checked]:border-forest-900"
                />
                <span className="text-sm text-forest-600 group-hover:text-forest-900 transition-colors truncate">
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

      {/* Hero Section - Dark Green to match other pages */}
      <section className="bg-forest-900 pt-32 pb-12">
        <div className="container-luxe">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-cream-300 mb-6">
            <Link to={`/${lang}`} className="hover:text-gold-400 transition-colors">
              {lang === 'fr' ? 'Accueil' : 'Home'}
            </Link>
            <span className="text-cream-500">/</span>
            <span className="text-white">{t.nav.catalog}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl text-white mb-4">
              {t.nav.catalog}
            </h1>
            <p className="text-cream-200 text-lg max-w-2xl mb-8">
              {lang === 'fr' 
                ? 'Découvrez notre sélection de plus de 5000 ingrédients naturels de qualité premium.'
                : 'Discover our selection of over 5000 premium quality natural ingredients.'}
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-400" />
            <Input
              placeholder={t.hero.search}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-cream-400 focus:border-gold-400 focus:ring-gold-400 rounded-2xl text-base backdrop-blur-sm"
            />
            {searchValue && (
              <button 
                onClick={() => setSearchValue('')} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-cream-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <CategoryPill
                key={cat.id}
                name={cat.name}
                icon={cat.icon}
                isActive={activeCategory === cat.id}
                onClick={() => toggleCategory(cat.id)}
                accentColor={cat.accentColor}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-cream-50 py-10 min-h-screen">
        <div className="container-luxe">
          {/* Controls Bar */}
          <div className="flex items-center justify-between gap-4 mb-6">
            {/* Results count + Active Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-forest-600">
                {isLoading ? '...' : `${products?.length || 0} ${lang === 'fr' ? 'résultats' : 'results'}`}
              </span>
              
              {activeCategory && (
                <Badge
                  variant="secondary"
                  className="gap-1.5 pr-1.5 cursor-pointer bg-gold-100 text-forest-900 hover:bg-gold-200"
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
                    className="gap-1.5 pr-1.5 cursor-pointer bg-forest-100 text-forest-800 hover:bg-forest-200"
                    onClick={() => toggleFilter(key as keyof FilterState, value)}
                  >
                    <span className="truncate max-w-[100px]">{value}</span>
                    <X className="h-3 w-3" />
                  </Badge>
                ))
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              {/* Mobile Filter */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2 border-forest-200">
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden xs:inline">{t.filters.title}</span>
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-1 bg-forest-900 text-gold-400 text-xs">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] sm:w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="flex items-center justify-between text-forest-900">
                      {t.filters.title}
                      {activeFiltersCount > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-forest-600">
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
              <div className="flex border border-forest-200 rounded-xl p-1 bg-forest-50">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={cn("h-9 w-9", viewMode === 'grid' && "bg-forest-900 text-gold-400 hover:bg-forest-800")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={cn("h-9 w-9", viewMode === 'list' && "bg-forest-900 text-gold-400 hover:bg-forest-800")}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>

              {activeFiltersCount > 0 && (
                <Button variant="ghost" onClick={clearFilters} className="text-forest-600 hidden md:flex hover:text-forest-900">
                  <X className="w-4 h-4 mr-2" />
                  {t.filters.reset}
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28 bg-forest-50 rounded-2xl border border-forest-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-forest-900">{t.filters.title}</h3>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-forest-600 h-auto p-0 hover:text-gold-600">
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
                  'grid gap-6',
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                )}>
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-forest-50 rounded-2xl overflow-hidden">
                      <Skeleton className="aspect-[4/3]" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayedProducts.length > 0 ? (
                <>
                  <div className={cn(
                    'grid gap-6',
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                      : 'grid-cols-1'
                  )}>
                    {displayedProducts.map((product) => (
                      <MinimalProductCard
                        key={product.id}
                        product={product}
                        lang={lang}
                        copiedCode={copiedCode}
                        onCopy={handleCopyCode}
                      />
                    ))}
                  </div>

                  {/* Load More */}
                  {displayCount < (products?.length || 0) && (
                    <div className="mt-12 text-center">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setDisplayCount(prev => prev + 12)}
                        className="border-forest-300 hover:bg-forest-100 text-forest-900"
                      >
                        {lang === 'fr' ? 'Voir plus' : 'Load more'}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-forest-100 flex items-center justify-center">
                    <Search className="w-8 h-8 text-forest-500" />
                  </div>
                  <h3 className="text-lg font-medium text-forest-900 mb-2">
                    {lang === 'fr' ? 'Aucun produit trouvé' : 'No products found'}
                  </h3>
                  <p className="text-forest-600 mb-6">
                    {lang === 'fr' 
                      ? 'Essayez de modifier vos critères de recherche'
                      : 'Try adjusting your search criteria'}
                  </p>
                  <Button variant="outline" onClick={clearFilters} className="border-forest-300 text-forest-900">
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
