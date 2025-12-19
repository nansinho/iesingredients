import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/hooks/useProducts';

interface HeaderSearchProps {
  lang: Language;
  isScrolled: boolean;
}

export const HeaderSearch = ({ lang, isScrolled }: HeaderSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const t = useTranslation(lang);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const searchTerm = query.toLowerCase();
        const { data, error } = await supabase
          .from('cosmetique_fr')
          .select('*')
          .eq('statut', 'ACTIF')
          .or(`nom_commercial.ilike.%${searchTerm}%,code.ilike.%${searchTerm}%,inci.ilike.%${searchTerm}%,gamme.ilike.%${searchTerm}%,benefices.ilike.%${searchTerm}%`)
          .limit(6);

        if (!error && data) {
          setSuggestions(data);
        }
      } catch {
        // Silently ignore search errors (network / aborted requests) to keep console clean.
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    setIsOpen(false);
    setQuery('');
    navigate(`/${lang}/produit/${product.code}`);
  };

  const navigateToSearch = () => {
    setIsOpen(false);
    navigate(`/${lang}/catalogue?q=${encodeURIComponent(query)}`);
    setQuery('');
  };

  const openSearch = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Search Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={openSearch}
        className={cn(
          "rounded-full w-11 h-11 flex items-center justify-center transition-all duration-300",
          isScrolled 
            ? "text-foreground hover:bg-muted" 
            : "text-white hover:bg-white/10"
        )}
      >
        <Search className="h-5 w-5" />
      </motion.button>

      {/* Search Modal/Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Search Container */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-2xl z-50"
            >
              <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                  <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedIndex(-1);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={lang === 'fr' ? 'Rechercher un ingrédient, code INCI...' : 'Search for an ingredient, INCI code...'}
                    className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
                  />
                  {isLoading && <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />}
                  {query && !isLoading && (
                    <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="max-h-[60vh] overflow-y-auto">
                    {suggestions.map((product, index) => (
                      <button
                        key={product.id}
                        onClick={() => navigateToProduct(product)}
                        className={cn(
                          "w-full flex items-start gap-4 px-5 py-4 text-left transition-colors",
                          index === selectedIndex ? "bg-secondary" : "hover:bg-secondary/50"
                        )}
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-primary font-semibold text-sm">
                            {product.nom_commercial?.charAt(0) || 'P'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {product.nom_commercial}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-mono">{product.code}</span>
                            {product.gamme && (
                              <>
                                <span>•</span>
                                <span>{product.gamme}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-3" />
                      </button>
                    ))}
                  </div>
                )}

                {/* See All Results */}
                {query.trim() && (
                  <button
                    onClick={navigateToSearch}
                    className="w-full flex items-center justify-between px-5 py-4 bg-secondary/50 hover:bg-secondary transition-colors border-t border-border"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {lang === 'fr' ? `Voir tous les résultats pour "${query}"` : `See all results for "${query}"`}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}

                {/* Empty State */}
                {query.trim() && !isLoading && suggestions.length === 0 && (
                  <div className="px-5 py-8 text-center text-muted-foreground">
                    <p>{lang === 'fr' ? 'Aucun résultat trouvé' : 'No results found'}</p>
                  </div>
                )}

                {/* Quick Links when empty */}
                {!query && (
                  <div className="px-5 py-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                      {lang === 'fr' ? 'Suggestions' : 'Suggestions'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Actifs', 'Extraits', 'Huiles', 'Bio'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80 rounded-full text-foreground transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
