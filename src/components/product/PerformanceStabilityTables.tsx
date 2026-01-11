import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/hooks/useProducts';

interface PerformanceStabilityTablesProps {
  product: Product;
  lang: 'fr' | 'en';
}

// Convert rating like "5/5", "3/5", "★★★★★" to number of stars
const parseRating = (rating: string | null | undefined): number => {
  if (!rating) return 0;
  
  const str = rating.trim();
  
  // Handle "X/5" format
  const slashMatch = str.match(/^(\d+)\s*\/\s*5$/);
  if (slashMatch) {
    return Math.min(5, Math.max(0, parseInt(slashMatch[1], 10)));
  }
  
  // Handle star characters
  const starCount = (str.match(/★/g) || []).length;
  if (starCount > 0) return Math.min(5, starCount);
  
  // Handle "*" characters
  const asteriskCount = (str.match(/\*/g) || []).length;
  if (asteriskCount > 0) return Math.min(5, asteriskCount);
  
  return 0;
};

// Render stars based on rating
const StarRating = ({ rating, className }: { rating: number; className?: string }) => {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            star <= rating 
              ? "fill-parfum text-parfum" 
              : "fill-transparent text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );
};

// Check if value is a rating (contains /5 or stars)
const isRatingValue = (value: string | null | undefined): boolean => {
  if (!value) return false;
  const str = value.trim();
  return /^\d+\s*\/\s*5$/.test(str) || /^[★\*]+$/.test(str);
};

export const PerformanceStabilityTables = ({ product, lang }: PerformanceStabilityTablesProps) => {
  // Build performance data from Option/Performance 1-6
  const performanceData: { label: string; value: string; isRating: boolean }[] = [];
  
  const optionFields = [
    { option: product.option_1, performance: product.performance_1 },
    { option: product.option_2, performance: product.performance_2 },
    { option: product.option_3, performance: product.performance_3 },
    { option: product.option_4, performance: product.performance_4 },
    { option: product.option_5, performance: product.performance_5 },
    { option: product.option_6, performance: product.performance_6 },
  ];
  
  optionFields.forEach(({ option, performance }) => {
    if (option && performance) {
      performanceData.push({
        label: option,
        value: performance,
        isRating: isRatingValue(performance),
      });
    }
  });

  // Build stability data from odeur columns
  const stabilityData: { ph: string; base: string; odeur: string | null }[] = [
    { ph: '2', base: lang === 'fr' ? 'Nettoyant acide' : 'Acid cleaner', odeur: product.odeur_nettoyant_acide },
    { ph: '3', base: lang === 'fr' ? 'Assouplissant textile' : 'Fabric softener', odeur: product.odeur_assouplissant_textile },
    { ph: '3,5', base: lang === 'fr' ? 'Anti-transpirant' : 'Antiperspirant', odeur: product.odeur_antisudorifique },
    { ph: '6', base: lang === 'fr' ? 'Shampooing' : 'Shampoo', odeur: product.odeur_shampooing },
    { ph: '9', base: 'APC', odeur: product.odeur_apc },
    { ph: '9', base: lang === 'fr' ? 'Lessive liquide pour le linge' : 'Liquid laundry detergent', odeur: product.odeur_detergent_liquide },
    { ph: '10', base: lang === 'fr' ? 'Savon' : 'Soap', odeur: product.odeur_savon },
    { ph: '10,5', base: lang === 'fr' ? 'Lessive en poudre' : 'Powder detergent', odeur: product.odeur_detergent_poudre },
    { ph: '11', base: lang === 'fr' ? 'Eau de Javel liquide' : 'Liquid bleach', odeur: product.odeur_eau_javel },
  ].filter(item => item.odeur);

  const hasPerformance = performanceData.length > 0;
  const hasStability = stabilityData.length > 0;

  if (!hasPerformance && !hasStability) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 sm:mb-12">
      {/* Performance Table */}
      {hasPerformance && (
        <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h3 className="font-serif text-lg sm:text-xl font-semibold mb-4 text-parfum">
            Performance
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {performanceData.map((item, i) => (
                  <tr key={i} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-2.5 pr-4 text-muted-foreground">{item.label}</td>
                    <td className="py-2.5 font-medium text-foreground">
                      {item.isRating ? (
                        <StarRating rating={parseRating(item.value)} />
                      ) : (
                        <span>{item.value}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stability Table */}
      {hasStability && (
        <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <h3 className="font-serif text-lg sm:text-xl font-semibold mb-4 text-parfum">
            {lang === 'fr' ? 'Stabilité' : 'Stability'}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 pr-3 text-left font-semibold text-parfum">pH</th>
                  <th className="py-2 pr-3 text-left font-semibold text-parfum">Base</th>
                  <th className="py-2 text-left font-semibold text-parfum">
                    {lang === 'fr' ? 'Odeur' : 'Odor'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stabilityData.map((item, i) => (
                  <tr key={i} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-2.5 pr-3 text-muted-foreground font-mono">{item.ph}</td>
                    <td className="py-2.5 pr-3 text-foreground">{item.base}</td>
                    <td className="py-2.5">
                      <StarRating rating={parseRating(item.odeur)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legend */}
      {(hasPerformance || hasStability) && (
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-parfum text-parfum" />
              {lang === 'fr' ? 'médiocre' : 'poor'}
            </span>
            <span className="flex items-center gap-1">
              <span className="flex">
                <Star className="w-3 h-3 fill-parfum text-parfum" />
                <Star className="w-3 h-3 fill-parfum text-parfum" />
              </span>
              {lang === 'fr' ? 'moyen' : 'average'}
            </span>
            <span className="flex items-center gap-1">
              <span className="flex">
                <Star className="w-3 h-3 fill-parfum text-parfum" />
                <Star className="w-3 h-3 fill-parfum text-parfum" />
                <Star className="w-3 h-3 fill-parfum text-parfum" />
              </span>
              {lang === 'fr' ? 'moyen' : 'average'}
            </span>
            <span className="flex items-center gap-1">
              <span className="flex">
                <Star className="w-3 h-3 fill-parfum text-parfum" />
                <Star className="w-3 h-3 fill-parfum text-parfum" />
                <Star className="w-3 h-3 fill-parfum text-parfum" />
                <Star className="w-3 h-3 fill-parfum text-parfum" />
              </span>
              {lang === 'fr' ? 'bon' : 'good'}
            </span>
            <span className="flex items-center gap-1">
              <span className="flex">
                <Star className="w-3 h-3 fill-parfum text-parfum" />
                <Star className="w-3 h-3 fill-parfum text-parfum" />
                <Star className="w-3 h-3 fill-parfum text-parfum" />
                <Star className="w-3 h-3 fill-parfum text-parfum" />
                <Star className="w-3 h-3 fill-parfum text-parfum" />
              </span>
              {lang === 'fr' ? 'excellent' : 'excellent'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
