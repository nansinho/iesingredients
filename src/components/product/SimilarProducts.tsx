import { Link } from 'react-router-dom';
import { Copy, Check, ArrowRight, Sparkles } from 'lucide-react';
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
      <Link to={`/${lang}/produit/${product.code}`}>
        <Card className="group h-full border border-forest-200 hover:border-gold-400 hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
          {/* Image placeholder or actual image */}
          <div className="relative h-32 sm:h-36 bg-gradient-to-br from-forest-50 to-forest-100">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.nom_commercial || ''} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-12 h-12 text-forest-300" />
              </div>
            )}
            {/* Category badge */}
            <Badge className="absolute top-2 left-2 bg-forest-900 text-gold-400 border-0 text-[9px] uppercase tracking-wider px-2.5 py-1 shadow-md">
              <Icon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/10 transition-colors duration-300" />
          </div>

          <CardContent className="p-4 space-y-3">
            {/* Code with copy */}
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-xs font-bold text-forest-500">
                {product.code || '-'}
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg hover:bg-forest-100 transition-colors"
                title="Copier la référence"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-forest-400" />
                )}
              </button>
            </div>

            {/* Gold separator */}
            <div className="w-10 h-0.5 bg-gold-400 mx-auto" />

            {/* Product name */}
            <h3 className="font-serif text-sm sm:text-base font-bold text-forest-900 text-center line-clamp-2 group-hover:text-gold-700 transition-colors">
              {product.nom_commercial || 'Produit sans nom'}
            </h3>

            {/* Benefits tags */}
            {benefices.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5">
                {benefices.map((tag, i) => (
                  <Badge 
                    key={i}
                    className="bg-forest-100 text-forest-700 border-0 text-[10px] font-sans px-2 py-0.5"
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
      className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-10 sm:py-14 bg-forest-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-forest-700/30 rounded-full blur-2xl" />
      
      <div className="relative max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-forest-900" />
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Produits similaires
            </h2>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-gold-400 hover:text-gold-300 hover:bg-forest-800">
            <Link to={`/${lang}/catalogue`}>
              Voir tout
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.slice(0, 8).map((product, index) => (
            <SimilarProductCard key={product.id} product={product} lang={lang} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
