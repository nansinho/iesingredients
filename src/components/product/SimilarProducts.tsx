import { Link } from 'react-router-dom';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCategoryConfig } from '@/lib/productTheme';

interface Product {
  id: number;
  code: string | null;
  nom_commercial: string | null;
  typologie_de_produit: string | null;
  origine: string | null;
  benefices?: string | null;
  image_url?: string | null;
}

interface SimilarProductsProps {
  products: Product[];
  lang: string;
}

function SimilarProductCard({ product, lang, index }: { product: Product; lang: string; index: number }) {
  const [copied, setCopied] = useState(false);
  const config = getCategoryConfig(product.typologie_de_produit);
  const Icon = config.icon;

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.code) return;
    try {
      await navigator.clipboard.writeText(product.code);
      setCopied(true);
      toast.success('Référence copiée !');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erreur lors de la copie');
    }
  };

  const benefices = product.benefices
    ?.split(/[,;\/]/)
    .map(s => s.trim())
    .filter(s => s && s !== '-')
    .slice(0, 2) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/${lang}/produit/${product.code}`} className="block h-full">
        <Card className="group h-full border border-forest-200 hover:border-gold-400 hover:shadow-lg transition-all duration-300 overflow-hidden bg-white">
          {/* Image placeholder or actual image */}
          <div className="relative h-28 sm:h-32 bg-gradient-to-br from-forest-50 to-forest-100">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.nom_commercial || ''} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-10 h-10 text-forest-300" />
              </div>
            )}
            {/* Category badge */}
            <Badge className="absolute top-2 left-2 bg-forest-900 text-gold-400 border-0 text-[9px] uppercase tracking-wider px-2 py-0.5 font-semibold">
              <Icon className="w-2.5 h-2.5 mr-1" />
              {config.label}
            </Badge>
          </div>

          <CardContent className="p-3 sm:p-4 space-y-2">
            {/* Code with copy */}
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-mono text-xs sm:text-sm font-bold text-forest-500">
                {product.code || '-'}
              </span>
              <button
                onClick={handleCopy}
                className="p-1 rounded hover:bg-forest-100 transition-colors"
                title="Copier la référence"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3 text-forest-400" />
                )}
              </button>
            </div>

            {/* Separator */}
            <div className="w-8 h-px bg-gold-300 mx-auto" />

            {/* Product name */}
            <h3 className="font-serif text-sm sm:text-base font-semibold text-forest-800 text-center line-clamp-2 group-hover:text-gold-600 transition-colors">
              {product.nom_commercial || 'Produit sans nom'}
            </h3>

            {/* Benefits tags */}
            {benefices.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1">
                {benefices.map((tag, i) => (
                  <Badge 
                    key={i}
                    className="bg-forest-100 text-forest-600 border-0 text-[10px] font-sans px-1.5 py-0"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export function SimilarProducts({ products, lang }: SimilarProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg sm:text-xl font-semibold text-forest-900">
          Produits similaires
        </h2>
        <Button variant="ghost" size="sm" asChild className="text-forest-600 hover:text-gold-600 hover:bg-gold-50">
          <Link to={`/${lang}/catalogue`}>
            Voir tout
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.slice(0, 8).map((product, index) => (
          <SimilarProductCard key={product.id} product={product} lang={lang} index={index} />
        ))}
      </div>
    </motion.section>
  );
}
