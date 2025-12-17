import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Leaf, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/catalog/SearchBar';
import { Language, useTranslation } from '@/lib/i18n';

interface HeroSectionProps {
  lang: Language;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const HeroSection = ({
  lang,
  searchValue,
  onSearchChange,
}: HeroSectionProps) => {
  const t = useTranslation(lang);

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating circles */}
        <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-accent/10 blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-10 w-96 h-96 rounded-full bg-primary-foreground/5 blur-3xl animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-accent/5 blur-2xl animate-float"
          style={{ animationDelay: '4s' }}
        />
        
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground/90">
              {lang === 'fr' ? '+5000 références produits' : '+5000 product references'}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-in-up">
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10 animate-fade-in-up stagger-1">
            {t.hero.subtitle}
          </p>

          {/* Search Bar */}
          <div className="mb-10 animate-fade-in-up stagger-2">
            <SearchBar
              lang={lang}
              value={searchValue}
              onChange={onSearchChange}
              variant="hero"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-3">
            <Button asChild size="xl" variant="hero">
              <Link to={`/${lang}/catalogue`}>
                {t.hero.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="hero-outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link to={`/${lang}/contact`}>
                {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
              </Link>
            </Button>
          </div>

          {/* Category Pills */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4 animate-fade-in-up stagger-4">
            <Link
              to={`/${lang}/catalogue?category=cosmetic`}
              className="group flex items-center gap-2 px-5 py-3 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all"
            >
              <Droplets className="w-4 h-4 text-pink-300" />
              <span className="text-sm font-medium text-primary-foreground">
                {t.categories.cosmetic}
              </span>
              <ArrowRight className="w-4 h-4 text-primary-foreground/50 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={`/${lang}/catalogue?category=perfume`}
              className="group flex items-center gap-2 px-5 py-3 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span className="text-sm font-medium text-primary-foreground">
                {t.categories.perfume}
              </span>
              <ArrowRight className="w-4 h-4 text-primary-foreground/50 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={`/${lang}/catalogue?category=aroma`}
              className="group flex items-center gap-2 px-5 py-3 rounded-full bg-primary-foreground/10 border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all"
            >
              <Leaf className="w-4 h-4 text-orange-300" />
              <span className="text-sm font-medium text-primary-foreground">
                {t.categories.aroma}
              </span>
              <ArrowRight className="w-4 h-4 text-primary-foreground/50 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};
