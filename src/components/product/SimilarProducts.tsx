import { Link } from 'react-router-dom';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
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

function SimilarProductCard({ product, lang }: { product: Product; lang: string }) {
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
    <Link to={`/${lang}/produit/${product.code}`}>
      <Card className="group h-full border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Image placeholder or actual image */}
        <div className={`relative h-28 sm:h-32 bg-gradient-to-br ${config.gradient}`}>
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.nom_commercial || ''} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className={`w-10 h-10 ${config.accent} opacity-30`} />
            </div>
          )}
          {/* Category badge */}
          <Badge className={`absolute top-2 left-2 ${config.bg} text-white border-0 text-[9px] uppercase tracking-wider px-2 py-0.5`}>
            <Icon className="w-2.5 h-2.5 mr-1" />
            {config.label}
          </Badge>
        </div>

        <CardContent className="p-3 sm:p-4 space-y-2">
          {/* Code with copy */}
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-mono text-xs sm:text-sm font-bold text-muted-foreground">
              {product.code || '-'}
            </span>
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-muted transition-colors"
              title="Copier la référence"
            >
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Separator */}
          <div className="w-8 h-px bg-border mx-auto" />

          {/* Product name */}
          <h3 className="font-serif text-sm sm:text-base font-semibold text-foreground text-center line-clamp-2 group-hover:text-primary transition-colors">
            {product.nom_commercial || 'Produit sans nom'}
          </h3>

          {/* Benefits tags */}
          {benefices.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1">
              {benefices.map((tag, i) => (
                <Badge 
                  key={i}
                  variant="secondary"
                  className="text-[10px] font-sans px-1.5 py-0"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export function SimilarProducts({ products, lang }: SimilarProductsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg sm:text-xl font-semibold text-foreground">
          Produits similaires
        </h2>
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
          <Link to={`/${lang}/catalogue`}>
            Voir tout
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {products.slice(0, 8).map((product) => (
          <SimilarProductCard key={product.id} product={product} lang={lang} />
        ))}
      </div>
    </section>
  );
}
