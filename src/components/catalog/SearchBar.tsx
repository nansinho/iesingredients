import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Language, useTranslation } from '@/lib/i18n';

interface SearchBarProps {
  lang: Language;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  variant?: 'default' | 'hero';
}

export const SearchBar = ({
  lang,
  value,
  onChange,
  className,
  variant = 'default',
}: SearchBarProps) => {
  const t = useTranslation(lang);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      className={cn(
        'relative transition-all duration-300',
        variant === 'hero' && 'max-w-2xl mx-auto',
        isFocused && variant === 'hero' && 'scale-[1.02]',
        className
      )}
    >
      <div
        className={cn(
          'relative flex items-center rounded-xl overflow-hidden transition-all duration-300',
          variant === 'hero'
            ? 'bg-background/95 backdrop-blur-sm shadow-card border-2 border-transparent'
            : 'bg-muted/50 border border-border',
          isFocused && variant === 'hero' && 'border-accent shadow-glow'
        )}
      >
        <Search
          className={cn(
            'absolute left-4 w-5 h-5 transition-colors',
            isFocused ? 'text-primary' : 'text-muted-foreground'
          )}
        />
        <Input
          type="text"
          placeholder={t.hero.search}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            'border-0 bg-transparent pl-12 pr-12 focus-visible:ring-0 focus-visible:ring-offset-0',
            variant === 'hero' ? 'h-14 text-base' : 'h-11'
          )}
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onChange('')}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
