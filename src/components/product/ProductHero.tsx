import { Link } from 'react-router-dom';
import { Copy, Check, ChevronRight, Leaf, Droplets, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { getCategoryConfig } from '@/lib/productTheme';

// Import category images for defaults
import creamJar from '@/assets/cream-jar.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';
import productBottle from '@/assets/product-bottle.jpg';

interface ProductHeroProps {
  code: string | null;
  name: string | null;
  typologie: string | null;
  origine: string | null;
  gamme: string | null;
  lang: string;
  imageUrl?: string | null;
}

// Get default image based on category
function getDefaultImage(typologie: string | null) {
  const type = typologie?.toUpperCase() || '';
  if (type.includes('COSMET') || type.includes('COSMÉT')) return creamJar;
  if (type.includes('PARFUM')) return essentialOil;
  if (type.includes('AROME') || type.includes('ARÔME')) return blueberriesHerbs;
  return productBottle;
}

// Get placeholder icon based on category
function getCategoryIcon(typologie: string | null) {
  const type = typologie?.toUpperCase() || '';
  if (type.includes('COSMETIQUE')) return Droplets;
  if (type.includes('PARFUM')) return Sparkles;
  return Leaf;
}

export function ProductHero({ code, name, typologie, origine, gamme, lang, imageUrl }: ProductHeroProps) {
  const [copied, setCopied] = useState(false);
  const config = getCategoryConfig(typologie);
  const IconComponent = getCategoryIcon(typologie);
  
  const productName = name || 'Produit sans nom';
  const productCode = code || '-';

  const handleCopy = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success('Référence copiée !');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erreur lors de la copie');
    }
  };

  return (
    <section className="relative bg-forest-950 pt-24 sm:pt-32 pb-8 sm:pb-16 overflow-hidden">
      {/* Decorative background elements - same as Contact/Company pages */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-gold-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-primary rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="container-luxe relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 sm:gap-8">
          {/* Left side - Text content */}
          <div className="flex-1 order-2 lg:order-1 text-center lg:text-left">
            {/* Breadcrumb */}
            <motion.nav 
              className="flex items-center justify-center lg:justify-start gap-1.5 text-xs sm:text-sm text-white/50 mb-4 sm:mb-6 flex-wrap"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to={`/${lang}`} className="hover:text-gold-400 transition-colors whitespace-nowrap">
                {lang === 'fr' ? 'Accueil' : 'Home'}
              </Link>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-gold-400/40" />
              <Link to={`/${lang}/catalogue`} className="hover:text-gold-400 transition-colors whitespace-nowrap">
                {lang === 'fr' ? 'Catalogue' : 'Catalog'}
              </Link>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 text-gold-400/40" />
              <span className="text-gold-400 font-medium line-clamp-1">
                {productName}
              </span>
            </motion.nav>

            {/* Category Label */}
            <motion.div 
              className="mb-3 sm:mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-gold-400 text-[10px] sm:text-xs font-semibold uppercase tracking-widest">
                {config.label}
              </span>
            </motion.div>

            {/* Product Name (H1) */}
            <motion.h1 
              className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-semibold mb-3 sm:mb-4 leading-tight max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {productName}
            </motion.h1>

            {/* Product Code with Copy */}
            <motion.button
              onClick={handleCopy}
              className="group inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 sm:px-4 py-2 hover:bg-white/15 transition-all"
              title={lang === 'fr' ? 'Copier la référence' : 'Copy reference'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/50 font-medium">
                {lang === 'fr' ? 'Réf.' : 'Ref.'}
              </span>
              <span className="font-mono text-sm sm:text-base text-white font-semibold">
                {productCode}
              </span>
              {copied ? (
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40 group-hover:text-white/70 transition-colors" />
              )}
            </motion.button>
          </div>

          {/* Right side - Round product avatar with hover effect */}
          <motion.div 
            className="flex-shrink-0 flex justify-center lg:justify-end order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="group relative w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 rounded-full 
                            bg-gradient-to-br from-forest-800 to-forest-900 
                            border-2 border-gold-500/30 
                            flex items-center justify-center 
                            shadow-2xl overflow-hidden
                            transition-all duration-500 ease-out cursor-pointer
                            hover:scale-105 hover:border-gold-400 
                            hover:shadow-[0_0_60px_rgba(212,175,55,0.35)]">
              {/* Golden glow overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-tr from-gold-400/0 via-gold-400/0 to-gold-400/0 
                              group-hover:from-gold-400/10 group-hover:via-gold-400/5 group-hover:to-transparent 
                              transition-all duration-500 pointer-events-none" />
              <img 
                src={imageUrl || getDefaultImage(typologie)} 
                alt={productName}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
