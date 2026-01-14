import { Link } from 'react-router-dom';
import { Copy, Check, ChevronRight, Sparkles, Package } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { getCategoryConfig, getProductBanner } from '@/lib/productTheme';
import { Badge } from '@/components/ui/badge';

interface ProductHeroProps {
  code: string | null;
  name: string | null;
  typologie: string | null;
  origine: string | null;
  gamme: string | null;
  lang: string;
  imageUrl?: string | null;
}

export function ProductHero({ code, name, typologie, origine, gamme, lang, imageUrl }: ProductHeroProps) {
  const [copied, setCopied] = useState(false);
  const config = getCategoryConfig(typologie);
  const Icon = config.icon;
  const bannerUrl = getProductBanner(typologie);
  
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
    <section className="relative w-full overflow-hidden">
      {/* Background Image with overlay */}
      <div className="absolute inset-0 h-full">
        <motion.img 
          src={bannerUrl} 
          alt="" 
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/95 via-forest-900/85 to-forest-900/70" />
        
        {/* Decorative gold accents */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl"
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-1/3 w-64 h-64 bg-gold-400/5 rounded-full blur-2xl"
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Product Info */}
          <div>
            {/* Breadcrumb */}
            <motion.nav 
              className="flex items-center gap-1.5 text-xs sm:text-sm text-white/60 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to={`/${lang}`} className="hover:text-gold-400 transition-colors">
                Accueil
              </Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gold-400/50" />
              <Link to={`/${lang}/catalogue`} className="hover:text-gold-400 transition-colors">
                Catalogue
              </Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gold-400/50" />
              <span className="text-gold-400 font-medium truncate max-w-[180px] sm:max-w-none">
                {productName}
              </span>
            </motion.nav>

            {/* Category Badges */}
            <motion.div 
              className="flex flex-wrap items-center gap-2 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge className="bg-gold-400 text-forest-900 border-0 font-sans text-[10px] uppercase tracking-wider px-3 py-1.5 shadow-lg shadow-gold-400/20">
                <Sparkles className="w-3 h-3 mr-1.5" />
                {config.label}
              </Badge>
              {origine && (
                <Badge variant="outline" className="border-gold-400/40 text-gold-400 bg-gold-400/10 font-sans text-[10px] uppercase tracking-wider px-3 py-1.5">
                  {origine}
                </Badge>
              )}
              {gamme && (
                <Badge variant="outline" className="border-white/30 text-white/90 bg-white/5 font-sans text-[10px] uppercase tracking-wider px-3 py-1.5">
                  {gamme}
                </Badge>
              )}
            </motion.div>

            {/* Product Name (H1) */}
            <motion.h1 
              className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold mb-5 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {productName}
            </motion.h1>

            {/* Product Code with Copy */}
            <motion.button
              onClick={handleCopy}
              className="group inline-flex items-center gap-3 bg-forest-800/60 backdrop-blur-md border border-gold-400/20 rounded-xl px-4 py-2.5 hover:border-gold-400/40 hover:bg-forest-800/80 transition-all"
              title="Copier la référence"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-[10px] uppercase tracking-widest text-gold-400/70 font-medium">
                Réf.
              </span>
              <span className="font-mono text-lg text-white font-semibold tracking-wide">
                {productCode}
              </span>
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gold-400/60 group-hover:text-gold-400 transition-colors" />
              )}
            </motion.button>
          </div>

          {/* Right: Product Image */}
          <motion.div 
            className="hidden lg:flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="relative w-72 h-72 xl:w-80 xl:h-80">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gold-400/20 rounded-full blur-3xl" />
              
              {/* Image container */}
              <div className="relative w-full h-full rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-24 h-24 rounded-2xl bg-gold-400/20 flex items-center justify-center">
                      <Package className="w-12 h-12 text-gold-400" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-white/40 font-medium">
                      Aperçu produit
                    </span>
                  </div>
                )}
              </div>

              {/* Decorative ring */}
              <div className="absolute -inset-4 rounded-full border border-gold-400/10" />
              <div className="absolute -inset-8 rounded-full border border-gold-400/5" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
