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

  // Auto-rotate images every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      {/* Background Images with Ken Burns Effect */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1500 ${
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
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950/70 via-forest-950/50 to-forest-950/80" />

      {/* Content - Centered */}
      <div className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-medium text-white/90 tracking-wide">
              {lang === 'fr' ? '+5000 références produits' : '+5000 product references'}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-white leading-tight mb-6 animate-fade-in-up">
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 animate-fade-in-up font-light leading-relaxed" style={{ animationDelay: '0.1s' }}>
            {t.hero.subtitle}
          </p>

          {/* Search Bar */}
          <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar
              lang={lang}
              value={searchValue}
              onChange={onSearchChange}
              variant="hero"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button asChild size="xl" className="rounded-full bg-[#FAF8F5] text-forest-900 hover:bg-white font-semibold px-8 shadow-lg">
              <Link to={`/${lang}/catalogue`}>
                {t.hero.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="rounded-full bg-white/15 border-white/40 text-white hover:bg-white/25 font-medium px-8 backdrop-blur-sm"
            >
              <Link to={`/${lang}/contact`}>
                {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
              </Link>
            </Button>
          </div>

          {/* Category Pills - Couleurs affirmées */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link
              to={`/${lang}/catalogue?category=cosmetic`}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#D4A5A5]/35 border border-[#D4A5A5]/50 hover:bg-[#D4A5A5]/50 transition-all backdrop-blur-sm"
            >
              <Droplets className="w-5 h-5 text-[#D4A5A5]" />
              <span className="text-sm font-semibold text-white uppercase tracking-widest">
                {t.categories.cosmetic}
              </span>
              <ArrowRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={`/${lang}/catalogue?category=perfume`}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#8B7EC8]/35 border border-[#8B7EC8]/50 hover:bg-[#8B7EC8]/50 transition-all backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 text-[#8B7EC8]" />
              <span className="text-sm font-semibold text-white uppercase tracking-widest">
                {t.categories.perfume}
              </span>
              <ArrowRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={`/${lang}/catalogue?category=aroma`}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#D4915C]/35 border border-[#D4915C]/50 hover:bg-[#D4915C]/50 transition-all backdrop-blur-sm"
            >
              <Leaf className="w-5 h-5 text-[#D4915C]" />
              <span className="text-sm font-semibold text-white uppercase tracking-widest">
                {t.categories.aroma}
              </span>
              <ArrowRight className="w-4 h-4 text-white/60 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};
