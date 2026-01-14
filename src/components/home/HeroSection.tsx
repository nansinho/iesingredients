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

  // Auto-rotate images every 8 seconds for smoother experience
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
      
      {/* Dark Overlay - Noir élégant */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      {/* Content - Centered */}
      <div className="container relative z-10 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge Premium - Doré */}
          <div className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-gold-500/25 to-gold-400/15 backdrop-blur-md border border-gold-400/40 shadow-[0_4px_20px_rgba(212,175,55,0.15)] mb-10 animate-fade-in">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-medium text-white tracking-wide">
              {lang === 'fr' ? '+5000 références produits' : '+5000 product references'}
            </span>
          </div>

          {/* Title - Plus impactant */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-white leading-[1.1] tracking-tight mb-8 animate-fade-in-up [text-shadow:_0_4px_40px_rgba(0,0,0,0.3)]">
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-12 animate-fade-in-up font-light leading-relaxed" style={{ animationDelay: '0.1s' }}>
            {t.hero.subtitle}
          </p>

          {/* Search Bar Premium */}
          <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar
              lang={lang}
              value={searchValue}
              onChange={onSearchChange}
              variant="hero"
            />
          </div>

          {/* CTA Buttons - Raffinés */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Button asChild size="xl" className="rounded-full bg-[#FAF6F0] text-[#1a1a1a] hover:bg-white font-semibold px-10 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-white/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:scale-[1.02]">
              <Link to={`/${lang}/catalogue`}>
                {t.hero.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              variant="outline"
              className="rounded-full bg-white/20 border-2 border-white/60 text-white hover:bg-white/30 hover:border-white font-medium px-10 py-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
            >
              <Link to={`/${lang}/contact`}>
                {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
              </Link>
            </Button>
          </div>

          {/* Category Pills - Style Luxe avec Glow */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link
              to={`/${lang}/catalogue?category=cosmetic`}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#D4A5A5]/50 border border-[#D4A5A5]/60 hover:bg-[#D4A5A5]/70 hover:shadow-[0_0_25px_rgba(212,165,165,0.35)] transition-all duration-300 backdrop-blur-sm"
            >
              <Droplets className="w-5 h-5 text-[#D4A5A5]" />
              <span className="text-sm font-semibold text-white uppercase tracking-widest">
                {t.categories.cosmetic}
              </span>
              <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={`/${lang}/catalogue?category=perfume`}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#8B7EC8]/50 border border-[#8B7EC8]/60 hover:bg-[#8B7EC8]/70 hover:shadow-[0_0_25px_rgba(139,126,200,0.35)] transition-all duration-300 backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 text-[#8B7EC8]" />
              <span className="text-sm font-semibold text-white uppercase tracking-widest">
                {t.categories.perfume}
              </span>
              <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={`/${lang}/catalogue?category=aroma`}
              className="group flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#D4915C]/50 border border-[#D4915C]/60 hover:bg-[#D4915C]/70 hover:shadow-[0_0_25px_rgba(212,145,92,0.35)] transition-all duration-300 backdrop-blur-sm"
            >
              <Leaf className="w-5 h-5 text-[#D4915C]" />
              <span className="text-sm font-semibold text-white uppercase tracking-widest">
                {t.categories.aroma}
              </span>
              <ArrowRight className="w-4 h-4 text-white/70 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Élégant */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="w-8 h-12 rounded-full border-2 border-white/40 flex items-start justify-center pt-3 backdrop-blur-sm">
          <div className="w-1.5 h-3 bg-white/80 rounded-full animate-scroll-bounce" />
        </div>
      </div>
    </section>
  );
};
