import { Link } from 'react-router-dom';
import { Copy, Check, ChevronRight } from 'lucide-react';
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

export function ProductHero({ code, name, typologie, origine, gamme, lang }: ProductHeroProps) {
  const [copied, setCopied] = useState(false);
  const config = getCategoryConfig(typologie);
  
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
    <section className="relative w-full bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900">
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 sm:pt-36 sm:pb-16">
        {/* Breadcrumb */}
        <motion.nav 
          className="flex items-center gap-1.5 text-xs sm:text-sm text-white/50 mb-6"
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
          <span className="text-gold-400 font-medium">
            {productName}
          </span>
        </motion.nav>

        {/* Category Label */}
        <motion.div 
          className="flex flex-wrap items-center gap-2 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="text-gold-400 text-xs font-semibold uppercase tracking-widest">
            {config.label}
          </span>
          {origine && (
            <Badge variant="outline" className="border-gold-400/30 text-gold-400/80 bg-transparent font-sans text-[10px] uppercase tracking-wider px-2 py-0.5">
              {origine}
            </Badge>
          )}
          {gamme && (
            <Badge variant="outline" className="border-white/20 text-white/60 bg-transparent font-sans text-[10px] uppercase tracking-wider px-2 py-0.5">
              {gamme}
            </Badge>
          )}
        </motion.div>

        {/* Product Name (H1) */}
        <motion.h1 
          className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-semibold mb-4 leading-tight max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {productName}
        </motion.h1>

        {/* Product Code with Copy */}
        <motion.button
          onClick={handleCopy}
          className="group inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-4 py-2 hover:bg-white/15 transition-all"
          title="Copier la référence"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <span className="text-[10px] uppercase tracking-widest text-white/50 font-medium">
            Réf.
          </span>
          <span className="font-mono text-base text-white font-semibold">
            {productCode}
          </span>
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
          )}
        </motion.button>
      </div>
    </section>
  );
}
