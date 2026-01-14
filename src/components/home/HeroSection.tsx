import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Leaf, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/catalog/SearchBar';
import { Language, useTranslation } from '@/lib/i18n';
import { useState, useEffect } from 'react';

// Import hero images
import heroBotanical from '@/assets/hero-botanical.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import serumCollection from '@/assets/serum-collection.jpg';
import botanicalsFlat from '@/assets/botanicals-flat.jpg';

const heroImages = [
  heroBotanical,
  essentialOil,
  serumCollection,
  botanicalsFlat,
];

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate images every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background Images with Ken Burns Effect */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-2000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt=""
            className={`w-full h-full object-cover ${
              index === currentImageIndex ? 'animate-kenburns' : ''
            }`}
          />
        </div>
      ))}
      
      {/* Overlay avec couleur verte forêt signature */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/40 to-forest-950/80" />

      {/* Content - Centered */}
      <div className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge Premium */}
          <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gold-500/20 backdrop-blur-md border border-gold-400/40 shadow-lg mb-10 animate-fade-in">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-medium text-white tracking-wide">
              {lang === 'fr' ? '+5000 références produits' : '+5000 product references'}
            </span>
          </div>

          {/* Title - Mis en valeur avec fond semi-transparent */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="inline-block font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-white leading-[1.1] tracking-tight px-8 py-4 bg-forest-950/50 backdrop-blur-sm rounded-2xl [text-shadow:_0_4px_40px_rgba(0,0,0,0.4)]">
              {t.hero.title}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-12 animate-fade-in-up font-light leading-relaxed" style={{ animationDelay: '0.1s' }}>
            {t.hero.subtitle}
          </p>

          {/* Search Bar - Visible et solide */}
          <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar
              lang={lang}
              value={searchValue}
              onChange={onSearchChange}
              variant="hero"
            />
          </div>

          {/* CTA Buttons - Rectangulaires professionnels */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button asChild variant="premium-light" size="xl" className="min-w-[200px]">
              <Link to={`/${lang}/catalogue`}>
                {t.hero.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="premium-light-outline" size="xl" className="min-w-[200px]">
              <Link to={`/${lang}/contact`}>
                {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
              </Link>
            </Button>
          </div>

          {/* Category Pills - Rectangulaires */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link
              to={`/${lang}/catalogue?category=cosmetic`}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-cosmetique-500/30 border border-cosmetique-400/50 hover:bg-cosmetique-500/50 transition-all duration-300 backdrop-blur-sm"
            >
              <Droplets className="w-5 h-5 text-cosmetique-300" />
              <span className="text-sm font-semibold text-white uppercase tracking-widest">
                {t.categories.cosmetic}
              </span>
              <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={`/${lang}/catalogue?category=perfume`}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-parfum-500/30 border border-parfum-400/50 hover:bg-parfum-500/50 transition-all duration-300 backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 text-parfum-300" />
              <span className="text-sm font-semibold text-white uppercase tracking-widest">
                {t.categories.perfume}
              </span>
              <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={`/${lang}/catalogue?category=aroma`}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-arome-500/30 border border-arome-400/50 hover:bg-arome-500/50 transition-all duration-300 backdrop-blur-sm"
            >
              <Leaf className="w-5 h-5 text-arome-300" />
              <span className="text-sm font-semibold text-white uppercase tracking-widest">
                {t.categories.aroma}
              </span>
              <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-8 h-12 rounded-xl border-2 border-white/40 flex items-start justify-center pt-3 backdrop-blur-sm">
          <div className="w-1.5 h-3 bg-white/80 rounded-full animate-scroll-bounce" />
        </div>
      </div>
    </section>
  );
};
