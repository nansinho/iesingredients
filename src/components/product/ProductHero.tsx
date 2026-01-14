import { Link } from 'react-router-dom';
import { Copy, Check, ChevronRight } from 'lucide-react';
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
        <img 
          src={bannerUrl} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/80 via-forest-900/60 to-forest-900/90" />
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-10 right-10 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 left-10 w-24 h-24 bg-gold-500/10 rounded-full blur-2xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-1.5 text-xs sm:text-sm text-cream-200/80 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide"
          >
            <Link to={`/${lang}`} className="hover:text-gold-400 transition-colors">
              Accueil
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-cream-300/50" />
            <Link to={`/${lang}/catalogue`} className="hover:text-gold-400 transition-colors">
              Catalogue
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-cream-300/50" />
            <span className="text-gold-400 font-medium truncate max-w-[180px] sm:max-w-none">
              {productName}
            </span>
          </motion.nav>

          {/* Category Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4"
          >
            <Badge className="bg-gold-500 text-forest-900 border-0 font-sans text-[10px] uppercase tracking-wider px-2.5 py-1 font-semibold">
              <Icon className="w-3 h-3 mr-1.5" />
              {config.label}
            </Badge>
            {origine && (
              <Badge variant="outline" className="border-cream-200/30 text-cream-100/90 font-sans text-[10px] uppercase tracking-wider px-2.5 py-1">
                {origine}
              </Badge>
            )}
            {gamme && (
              <Badge variant="outline" className="border-cream-200/30 text-cream-100/90 font-sans text-[10px] uppercase tracking-wider px-2.5 py-1">
                {gamme}
              </Badge>
            )}
          </motion.div>

          {/* Product Name (H1) */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-semibold mb-3 sm:mb-4 leading-tight"
          >
            {productName}
          </motion.h1>

          {/* Product Code with Copy */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            onClick={handleCopy}
            className="group inline-flex items-center gap-2 bg-forest-800/50 backdrop-blur-sm border border-gold-400/30 rounded-lg px-3 sm:px-4 py-2 hover:bg-forest-700/50 hover:border-gold-400/50 transition-all"
            title="Copier la référence"
          >
            <span className="font-mono text-sm sm:text-base text-gold-400 font-medium tracking-wide">
              REF: {productCode}
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
