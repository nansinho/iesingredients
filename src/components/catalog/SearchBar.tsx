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
          'relative flex items-center overflow-hidden transition-all duration-300',
          variant === 'hero'
            ? 'bg-white shadow-2xl border border-gray-200 rounded-xl hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]'
            : 'bg-muted/50 border border-border rounded-xl',
          isFocused && variant === 'hero' && 'shadow-[0_16px_50px_rgba(0,0,0,0.2)] border-forest-300'
        )}
      >
        <Search
          className={cn(
            'absolute left-5 w-5 h-5 transition-colors',
            isFocused ? 'text-forest-600' : 'text-muted-foreground'
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
            'border-0 bg-transparent pl-14 pr-14 focus-visible:ring-0 focus-visible:ring-offset-0',
            variant === 'hero' ? 'h-16 text-base placeholder:text-muted-foreground/70' : 'h-11'
          )}
        />
        {value && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full"
            onClick={() => onChange('')}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
