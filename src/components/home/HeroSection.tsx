import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
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
      
      {/* Overlay - Dégradé noir élégant */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

      {/* Content - Centered */}
      <div className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge Premium - Glassmorphism */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 mb-10 animate-fade-in">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-medium text-white/95 tracking-wide">
              {lang === 'fr' ? '+5000 références produits' : '+5000 product references'}
            </span>
          </div>

          {/* Title - Clean, no background */}
          <div className="mb-6 animate-fade-in-up">
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.05] tracking-tight [text-shadow:_0_2px_30px_rgba(0,0,0,0.4)]">
              {t.hero.title}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-10 animate-fade-in-up font-light leading-relaxed" style={{ animationDelay: '0.1s' }}>
            {t.hero.subtitle}
          </p>

          {/* Search Bar - Compact and elegant */}
          <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar
              lang={lang}
              value={searchValue}
              onChange={onSearchChange}
              variant="hero"
            />
          </div>

          {/* CTA Buttons - Rectangular, professional */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button asChild size="lg" className="min-w-[200px] rounded-lg bg-[#FAF6F0] text-forest-950 font-semibold hover:bg-white shadow-lg transition-all duration-300">
              <Link to={`/${lang}/catalogue`}>
                {t.hero.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" className="min-w-[200px] rounded-lg bg-transparent border-2 border-white/80 text-white font-medium hover:bg-white/10 transition-all duration-300">
              <Link to={`/${lang}/contact`}>
                {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
              </Link>
            </Button>
          </div>

          {/* Category Links - Minimal text style */}
          <div className="mt-14 flex items-center justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link
              to={`/${lang}/catalogue?category=cosmetic`}
              className="text-sm text-white/70 uppercase tracking-widest hover:text-white transition-colors duration-300"
            >
              {t.categories.cosmetic}
            </Link>
            <span className="w-px h-4 bg-white/30" />
            <Link
              to={`/${lang}/catalogue?category=perfume`}
              className="text-sm text-white/70 uppercase tracking-widest hover:text-white transition-colors duration-300"
            >
              {t.categories.perfume}
            </Link>
            <span className="w-px h-4 bg-white/30" />
            <Link
              to={`/${lang}/catalogue?category=aroma`}
              className="text-sm text-white/70 uppercase tracking-widest hover:text-white transition-colors duration-300"
            >
              {t.categories.aroma}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Subtle */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border border-white/30 flex items-start justify-center pt-2">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-scroll-bounce" />
        </div>
      </div>
    </section>
  );
};
