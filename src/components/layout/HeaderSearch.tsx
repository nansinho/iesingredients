import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Loader2, Sparkles, Clock, TrendingUp, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/hooks/useProducts';
import { Badge } from '@/components/ui/badge';

interface HeaderSearchProps {
  lang: Language;
  isScrolled: boolean;
}

// Recent searches stored in localStorage
const RECENT_SEARCHES_KEY = 'ies-recent-searches';
const MAX_RECENT = 5;

const getRecentSearches = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
  } catch {
    return [];
  }
};

const addRecentSearch = (term: string) => {
  const recent = getRecentSearches().filter(s => s !== term);
  recent.unshift(term);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
};

export const HeaderSearch = React.forwardRef<HTMLDivElement, HeaderSearchProps>(({ lang, isScrolled }, forwardedRef) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'cosmetic' | 'perfume' | 'aroma'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const t = useTranslation(lang);

  // Load recent searches
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [isOpen]);

  // Debounced search with category filter
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchTerm = query.toLowerCase().trim();
        
        // Build OR filter for multi-field search including certifications and description
        const searchFields = [
          `nom_commercial.ilike.%${searchTerm}%`,
          `code.ilike.%${searchTerm}%`,
          `inci.ilike.%${searchTerm}%`,
          `gamme.ilike.%${searchTerm}%`,
          `benefices.ilike.%${searchTerm}%`,
          `application.ilike.%${searchTerm}%`,
          `origine.ilike.%${searchTerm}%`,
          `certifications.ilike.%${searchTerm}%`,
          `description.ilike.%${searchTerm}%`,
          `valorisations.ilike.%${searchTerm}%`
        ].join(',');
        
        let queryBuilder = supabase
          .from('cosmetique_fr')
          .select('*')
          .eq('statut', 'ACTIF')
          .or(searchFields)
          .limit(10);

        // Filter by category if selected
        if (activeTab !== 'all') {
          const categoryMap: Record<string, string> = {
            cosmetic: 'COSMETIQUE',
            perfume: 'PARFUM',
            aroma: 'AROME'
          };
          queryBuilder = queryBuilder.ilike('typologie_de_produit', `%${categoryMap[activeTab]}%`);
        }

        const { data, error } = await queryBuilder;

        if (!error && data) {
          setSuggestions(data);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 150); // Fast debounce

    return () => clearTimeout(timer);
  }, [query, activeTab]);

  // Click outside to close (only when clicking outside the modal panel)
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!isOpen) return;
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        navigateToProduct(suggestions[selectedIndex]);
      } else if (query.trim()) {
        navigateToSearch();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [suggestions, selectedIndex, query]);

  const navigateToProduct = (product: Product) => {
    addRecentSearch(product.nom_commercial || product.code || '');
    setIsOpen(false);
    setQuery('');
    navigate(`/${lang}/produit/${product.code}`);
  };

  const navigateToSearch = () => {
    if (query.trim()) {
      addRecentSearch(query.trim());
    }
    setIsOpen(false);
    const categoryParam = activeTab !== 'all' ? `&category=${activeTab}` : '';
    navigate(`/${lang}/catalogue?q=${encodeURIComponent(query)}${categoryParam}`);
    setQuery('');
  };

  const openSearch = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
    setRecentSearches([]);
  };

  const setRootRef = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      forwardedRef.current = node;
    }
  };

  const trendingTerms = lang === 'fr' 
    ? ['Actifs bio', 'Huile de rose', 'Vitamine C', 'Acide hyaluronique']
    : ['Organic actives', 'Rose oil', 'Vitamin C', 'Hyaluronic acid'];

  const categoryTabs = [
    { id: 'all' as const, label: lang === 'fr' ? 'Tout' : 'All' },
    { id: 'cosmetic' as const, label: lang === 'fr' ? 'Cosmétique' : 'Cosmetic' },
    { id: 'perfume' as const, label: lang === 'fr' ? 'Parfum' : 'Perfume' },
    { id: 'aroma' as const, label: lang === 'fr' ? 'Arômes' : 'Flavors' },
  ];

  return (
    <div ref={setRootRef} className="relative w-full">
      {/* Full Width Interactive Search Bar */}
      <motion.div
        initial={false}
        animate={isOpen ? { scale: 1 } : { scale: 1 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={openSearch}
        className={cn(
          "w-full rounded-xl sm:rounded-2xl flex items-center gap-3 px-4 py-2.5 sm:py-3 cursor-pointer transition-all duration-300 border",
          isScrolled 
            ? "bg-muted/50 border-border hover:bg-muted hover:border-primary/30 text-foreground" 
            : "bg-white/15 border-white/30 hover:bg-white/20 hover:border-gold-500/60 text-white",
          isOpen && "ring-2 ring-gold-500/60"
        )}
      >
        <Search className={cn(
          "h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-colors",
          isScrolled ? "text-muted-foreground" : "text-white/70"
        )} />
        <span className={cn(
          "flex-1 text-sm sm:text-base font-medium truncate transition-colors",
          isScrolled ? "text-muted-foreground" : "text-white/60"
        )}>
          {lang === 'fr' ? 'Rechercher un ingrédient, code INCI...' : 'Search ingredient, INCI code...'}
        </span>
        <kbd className={cn(
          "hidden sm:inline-flex h-6 items-center gap-1 rounded-md border px-2 text-xs font-mono transition-colors",
          isScrolled 
            ? "border-border bg-background text-muted-foreground" 
            : "border-white/30 bg-white/10 text-white/60"
        )}>
          ⌘K
        </kbd>
      </motion.div>

      {/* Search Modal - Rendered via Portal to escape header z-index */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9998]"
                onClick={() => setIsOpen(false)}
              />

              {/* Search Container - True centered modal */}
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8">
                <motion.div
                  ref={modalRef}
                  initial={{ opacity: 0, scale: 0.97, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: 8 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="w-full max-w-3xl"
                >
                  <div className="bg-card border border-forest-100 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
                {/* Header with input */}
                <div className="relative">
                  {/* Gradient decoration */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-primary/5 pointer-events-none" />
                  
                  <div className="flex items-center gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-forest-100 relative">
                    <div className="relative flex-1 flex items-center gap-3">
                      <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gold-500 shrink-0" />
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setSelectedIndex(-1);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={lang === 'fr' ? 'Rechercher un ingrédient, code INCI, bénéfice...' : 'Search ingredient, INCI code, benefit...'}
                        className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-base sm:text-lg font-medium"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                      />
                    </div>
                    {isLoading && (
                      <div className="flex items-center gap-2 text-gold-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                      </div>
                    )}
                    {query && !isLoading && (
                      <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => setIsOpen(false)} 
                      className="text-muted-foreground hover:text-foreground transition-colors ml-2"
                    >
                      <kbd className="hidden sm:inline-flex h-6 items-center rounded border border-forest-100 bg-muted px-1.5 text-xs font-mono">
                        ESC
                      </kbd>
                      <X className="w-5 h-5 sm:hidden" />
                    </button>
                  </div>
                </div>

                {/* Category Tabs */}
                <div className="flex items-center gap-1 px-4 sm:px-6 py-2 sm:py-3 border-b border-forest-100 bg-muted/30 overflow-x-auto">
                  <Filter className="w-4 h-4 text-muted-foreground shrink-0 mr-1" />
                  {categoryTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all",
                        activeTab === tab.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Results */}
                <div className="max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
                  {/* Suggestions list */}
                  {suggestions.length > 0 && (
                    <div className="py-2">
                      <div className="px-4 sm:px-6 py-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold-500" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {lang === 'fr' ? 'Résultats' : 'Results'}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {suggestions.length}
                        </Badge>
                      </div>
                      {suggestions.map((product, index) => (
                        <button
                          key={product.id}
                          onClick={() => navigateToProduct(product)}
                          className={cn(
                            "w-full flex items-start gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 text-left transition-all",
                            index === selectedIndex ? "bg-primary/10" : "hover:bg-muted/50"
                          )}
                        >
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-gold-500/20 to-primary/20 flex items-center justify-center shrink-0">
                            <span className="text-primary font-bold text-sm sm:text-base">
                              {product.nom_commercial?.charAt(0) || 'P'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground truncate text-sm sm:text-base">
                              {product.nom_commercial}
                            </p>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-0.5">
                              <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{product.code}</span>
                              {product.gamme && (
                                <>
                                  <span>•</span>
                                  <span className="truncate">{product.gamme}</span>
                                </>
                              )}
                            </div>
                            {product.benefices && (
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                {product.benefices}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Empty state with search */}
                  {query.trim() && !isLoading && suggestions.length === 0 && (
                    <div className="px-6 py-10 text-center">
                      <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Search className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-foreground font-medium mb-1">
                        {lang === 'fr' ? 'Aucun résultat' : 'No results'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {lang === 'fr' ? `Aucun ingrédient ne correspond à "${query}"` : `No ingredient matches "${query}"`}
                      </p>
                    </div>
                  )}

                  {/* Quick access when empty */}
                  {!query && (
                    <div className="py-4">
                      {/* Recent searches */}
                      {recentSearches.length > 0 && (
                        <div className="mb-4">
                          <div className="px-4 sm:px-6 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {lang === 'fr' ? 'Recherches récentes' : 'Recent searches'}
                              </span>
                            </div>
                            <button
                              onClick={clearRecentSearches}
                              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {lang === 'fr' ? 'Effacer' : 'Clear'}
                            </button>
                          </div>
                          <div className="px-4 sm:px-6 flex flex-wrap gap-2">
                            {recentSearches.map((term, i) => (
                              <button
                                key={i}
                                onClick={() => handleRecentClick(term)}
                                className="px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-full text-foreground transition-colors flex items-center gap-1.5"
                              >
                                <Clock className="w-3 h-3 text-muted-foreground" />
                                {term}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Trending */}
                      <div>
                        <div className="px-4 sm:px-6 py-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gold-500" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            {lang === 'fr' ? 'Tendances' : 'Trending'}
                          </span>
                        </div>
                        <div className="px-4 sm:px-6 flex flex-wrap gap-2">
                          {trendingTerms.map((term, i) => (
                            <button
                              key={i}
                              onClick={() => setQuery(term)}
                              className="px-3 py-1.5 text-sm bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 rounded-full text-foreground transition-colors"
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer - See all results */}
                {query.trim() && (
                  <button
                    onClick={navigateToSearch}
                    className="w-full flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-primary/5 to-gold-500/5 hover:from-primary/10 hover:to-gold-500/10 transition-colors border-t border-forest-100"
                  >
                    <span className="text-sm font-semibold text-foreground">
                      {lang === 'fr' ? `Voir tous les résultats pour "${query}"` : `See all results for "${query}"`}
                    </span>
                    <div className="flex items-center gap-2 text-primary">
                      <span className="text-sm font-medium">{lang === 'fr' ? 'Catalogue' : 'Catalog'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
      </AnimatePresence>,
      document.body
      )}
    </div>
  );
});
HeaderSearch.displayName = 'HeaderSearch';