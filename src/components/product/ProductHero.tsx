import { Link } from 'react-router-dom';
import { Copy, Check, ChevronRight, Sparkles, Package } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { getCategoryConfig } from '@/lib/productTheme';
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
    <section className="relative w-full overflow-hidden bg-forest-900">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        {/* Solid gradient background - no image to avoid confusion */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900" />
        
        {/* Decorative pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.3) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>
        
        {/* Decorative gold accents */}
        <motion.div 
          className="absolute -top-20 -right-20 w-80 h-80 bg-gold-400/20 rounded-full blur-3xl"
          animate={{ opacity: [0.15, 0.25, 0.15], scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-forest-700/50 rounded-full blur-3xl"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-400/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 sm:pt-32 sm:pb-16 lg:pt-36 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Product Info */}
          <div>
            {/* Breadcrumb */}
            <motion.nav 
              className="flex items-center gap-1.5 text-xs sm:text-sm text-white/50 mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to={`/${lang}`} className="hover:text-gold-400 transition-colors">
                Accueil
              </Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gold-400/40" />
              <Link to={`/${lang}/catalogue`} className="hover:text-gold-400 transition-colors">
                Catalogue
              </Link>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-gold-400/40" />
              <span className="text-gold-400 font-medium truncate max-w-[180px] sm:max-w-none">
                {productName}
              </span>
            </motion.nav>

            {/* Category Badges */}
            <motion.div 
              className="flex flex-wrap items-center gap-2 mb-5"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Badge className="bg-gold-400 text-forest-900 border-0 font-sans text-[10px] uppercase tracking-wider px-3 py-1.5 shadow-lg shadow-gold-400/30">
                <Sparkles className="w-3 h-3 mr-1.5" />
                {config.label}
              </Badge>
              {origine && (
                <Badge variant="outline" className="border-gold-400/40 text-gold-400 bg-gold-400/10 font-sans text-[10px] uppercase tracking-wider px-3 py-1.5 backdrop-blur-sm">
                  {origine}
                </Badge>
              )}
              {gamme && (
                <Badge variant="outline" className="border-white/20 text-white/80 bg-white/5 font-sans text-[10px] uppercase tracking-wider px-3 py-1.5 backdrop-blur-sm">
                  {gamme}
                </Badge>
              )}
            </motion.div>

            {/* Product Name (H1) */}
            <motion.h1 
              className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {productName}
            </motion.h1>

            {/* Product Code with Copy */}
            <motion.button
              onClick={handleCopy}
              className="group inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-5 py-3 hover:border-gold-400/50 hover:bg-white/15 transition-all"
              title="Copier la référence"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-[10px] uppercase tracking-widest text-gold-400/70 font-semibold">
                Réf.
              </span>
              <span className="font-mono text-lg text-white font-bold tracking-wide">
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
              <div className="absolute inset-0 bg-gold-400/20 rounded-3xl blur-2xl" />
              
              {/* Image container */}
              <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-24 h-24 rounded-2xl bg-gold-400/20 border border-gold-400/30 flex items-center justify-center">
                      <Package className="w-12 h-12 text-gold-400" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-white/30 font-medium">
                      Aperçu produit
                    </span>
                  </div>
                )}
              </div>

              {/* Decorative elements */}
              <div className="absolute -inset-4 rounded-[32px] border border-gold-400/10" />
              <div className="absolute -inset-8 rounded-[40px] border border-gold-400/5" />
              
              {/* Corner accents */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-gold-400/40 rounded-tl-lg" />
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-gold-400/40 rounded-tr-lg" />
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-gold-400/40 rounded-bl-lg" />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-gold-400/40 rounded-br-lg" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-forest-50 to-transparent" />
    </section>
  );
}
