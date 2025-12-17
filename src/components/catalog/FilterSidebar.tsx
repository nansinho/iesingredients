import { useState } from 'react';
import { X, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';
import { filterOptions } from '@/data/mockProducts';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export interface FilterState {
  categories: string[];
  gammes: string[];
  famillesOlfactives: string[];
  origines: string[];
  certifications: string[];
  foodGrade: boolean;
  solubility: string[];
}

interface FilterSidebarProps {
  lang: Language;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  productCount: number;
}

export const FilterSidebar = ({
  lang,
  filters,
  onFiltersChange,
  productCount,
}: FilterSidebarProps) => {
  const t = useTranslation(lang);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'category',
    'famille',
  ]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  const handleCheckboxChange = (
    key: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    if (key === 'foodGrade') {
      onFiltersChange({ ...filters, foodGrade: checked });
    } else {
      const currentValues = filters[key] as string[];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);
      onFiltersChange({ ...filters, [key]: newValues });
    }
  };

  const resetFilters = () => {
    onFiltersChange({
      categories: [],
      gammes: [],
      famillesOlfactives: [],
      origines: [],
      certifications: [],
      foodGrade: false,
      solubility: [],
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.gammes.length > 0 ||
    filters.famillesOlfactives.length > 0 ||
    filters.origines.length > 0 ||
    filters.certifications.length > 0 ||
    filters.foodGrade ||
    filters.solubility.length > 0;

  const FilterSection = ({
    title,
    sectionKey,
    options,
    filterKey,
  }: {
    title: string;
    sectionKey: string;
    options: readonly string[];
    filterKey: keyof FilterState;
  }) => {
    const isExpanded = expandedSections.includes(sectionKey);
    const selectedValues = filters[filterKey] as string[];

    return (
      <div className="border-b border-border/50 last:border-b-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-colors"
        >
          <span className="font-medium text-sm">{title}</span>
          <div className="flex items-center gap-2">
            {selectedValues.length > 0 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {selectedValues.length}
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </button>
        {isExpanded && (
          <div className="pb-4 space-y-2 animate-fade-in">
            {options.map((option) => (
              <label
                key={option}
                className="flex items-center gap-3 cursor-pointer group py-1"
              >
                <Checkbox
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(filterKey, option, checked as boolean)
                  }
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  {filterKey === 'categories' ? t.categories[option as keyof typeof t.categories] || option : option}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  const FilterContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="font-display text-lg font-semibold">{t.filters.title}</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4 mr-1" />
            {t.filters.reset}
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="py-4 border-b border-border/50">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{productCount}</span>{' '}
          {t.catalog.products}
        </p>
      </div>

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto">
        <FilterSection
          title={t.filters.category}
          sectionKey="category"
          options={filterOptions.categories}
          filterKey="categories"
        />
        <FilterSection
          title={t.filters.olfactoryFamily}
          sectionKey="famille"
          options={filterOptions.famillesOlfactives}
          filterKey="famillesOlfactives"
        />
        <FilterSection
          title={t.filters.range}
          sectionKey="gamme"
          options={filterOptions.gammes}
          filterKey="gammes"
        />
        <FilterSection
          title={t.filters.origin}
          sectionKey="origine"
          options={filterOptions.origines}
          filterKey="origines"
        />
        <FilterSection
          title={t.filters.certifications}
          sectionKey="certifications"
          options={filterOptions.certifications}
          filterKey="certifications"
        />
        <FilterSection
          title={t.filters.solubility}
          sectionKey="solubility"
          options={filterOptions.solubility}
          filterKey="solubility"
        />

        {/* Food Grade Toggle */}
        <div className="py-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              checked={filters.foodGrade}
              onCheckedChange={(checked) =>
                handleCheckboxChange('foodGrade', '', checked as boolean)
              }
            />
            <span className="font-medium text-sm">{t.filters.foodGrade}</span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-28 bg-card rounded-2xl border border-border/50 p-6 shadow-soft">
          <FilterContent />
        </div>
      </aside>

      {/* Mobile Filter Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              {t.filters.title}
              {hasActiveFilters && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {filters.categories.length +
                    filters.gammes.length +
                    filters.famillesOlfactives.length +
                    filters.origines.length +
                    filters.certifications.length +
                    filters.solubility.length +
                    (filters.foodGrade ? 1 : 0)}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-6">
            <SheetHeader className="sr-only">
              <SheetTitle>{t.filters.title}</SheetTitle>
            </SheetHeader>
            <FilterContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};
