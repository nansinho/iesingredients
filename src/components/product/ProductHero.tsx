import { Link } from 'react-router-dom';
import { Copy, Check, ChevronRight, Sparkles } from 'lucide-react';
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
}

export function ProductHero({ code, name, typologie, origine, gamme, lang }: ProductHeroProps) {
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
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/80 via-forest-900/60 to-forest-900/90" />
        
        {/* Decorative gold accents */}
        <motion.div 
          className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl"
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-64 h-64 bg-gold-400/5 rounded-full blur-2xl"
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <motion.nav 
            className="flex items-center gap-1.5 text-xs sm:text-sm text-white/60 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide"
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

          {/* Category Badge */}
          <motion.div 
            className="flex flex-wrap items-center gap-2 mb-4 sm:mb-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge className="bg-gold-400 text-forest-900 border-0 font-sans text-[10px] uppercase tracking-wider px-3 py-1.5 shadow-lg shadow-gold-400/20">
              <Sparkles className="w-3 h-3 mr-1.5" />
              {config.label}
            </Badge>
            {origine && (
              <Badge variant="outline" className="border-gold-400/30 text-gold-400/90 font-sans text-[10px] uppercase tracking-wider px-3 py-1.5 backdrop-blur-sm">
                {origine}
              </Badge>
            )}
            {gamme && (
              <Badge variant="outline" className="border-white/20 text-white/80 font-sans text-[10px] uppercase tracking-wider px-3 py-1.5 backdrop-blur-sm">
                {gamme}
              </Badge>
            )}
          </motion.div>

          {/* Product Name (H1) */}
          <motion.h1 
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-bold mb-5 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-gold-400">{productName.split(' ')[0]}</span>{' '}
            <span>{productName.split(' ').slice(1).join(' ')}</span>
          </motion.h1>

          {/* Product Code with Copy */}
          <motion.button
            onClick={handleCopy}
            className="group inline-flex items-center gap-3 bg-forest-800/60 backdrop-blur-md border border-gold-400/20 rounded-xl px-4 sm:px-5 py-3 hover:border-gold-400/40 hover:bg-forest-800/80 transition-all shadow-lg"
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
            <span className="font-mono text-base sm:text-lg text-white font-semibold tracking-wide">
              {productCode}
            </span>
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gold-400/60 group-hover:text-gold-400 transition-colors" />
            )}
          </motion.button>
        </div>
      </div>
    </section>
  );
}
