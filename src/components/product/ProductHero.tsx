import { Link } from 'react-router-dom';
import { Copy, Check, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
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
    <section className="relative w-full">
      {/* Background Image */}
      <div className="absolute inset-0 h-full">
        <img 
          src={bannerUrl} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-white/70 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link to={`/${lang}`} className="hover:text-white transition-colors">
              Accueil
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <Link to={`/${lang}/catalogue`} className="hover:text-white transition-colors">
              Catalogue
            </Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-white font-medium truncate max-w-[180px] sm:max-w-none">
              {productName}
            </span>
          </nav>

          {/* Category Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
            <Badge className={`${config.bg} text-white border-0 font-sans text-[10px] uppercase tracking-wider px-2.5 py-1`}>
              <Icon className="w-3 h-3 mr-1.5" />
              {config.label}
            </Badge>
            {origine && (
              <Badge variant="outline" className="border-white/30 text-white/90 font-sans text-[10px] uppercase tracking-wider px-2.5 py-1">
                {origine}
              </Badge>
            )}
            {gamme && (
              <Badge variant="outline" className="border-white/30 text-white/90 font-sans text-[10px] uppercase tracking-wider px-2.5 py-1">
                {gamme}
              </Badge>
            )}
          </div>

          {/* Product Name (H1) */}
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-semibold mb-3 sm:mb-4 leading-tight">
            {productName}
          </h1>

          {/* Product Code with Copy */}
          <button
            onClick={handleCopy}
            className="group inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-3 sm:px-4 py-2 hover:bg-white/20 transition-all"
            title="Copier la référence"
          >
            <span className="font-mono text-sm sm:text-base text-white/90 font-medium tracking-wide">
              REF: {productCode}
            </span>
            {copied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
