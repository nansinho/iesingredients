import { Link } from 'react-router-dom';
import { ArrowRight, Copy, Check } from 'lucide-react';
import { Language, useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { useState } from 'react';
import { toast } from 'sonner';
import { getCategoryConfig } from '@/lib/productTheme';
import { Skeleton } from '@/components/ui/skeleton';

interface MinimalProductsProps {
  lang: Language;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const MinimalProducts = ({ lang }: MinimalProductsProps) => {
  const t = useTranslation(lang);
  const { data: products, isLoading } = useProducts();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const featuredProducts = products?.slice(0, 6) || [];

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(lang === 'fr' ? 'Référence copiée !' : 'Reference copied!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">
              {lang === 'fr' ? 'Produits Vedettes' : 'Featured Products'}
            </h2>
            <p className="text-muted-foreground mt-2">
              {lang === 'fr'
                ? 'Une sélection de nos meilleurs ingrédients'
                : 'A selection of our finest ingredients'}
            </p>
          </div>
          <Link
            to={`/${lang}/catalogue`}
            className="inline-flex items-center gap-2 text-navy-900 font-medium hover:gap-3 transition-all group"
          >
            {t.nav.catalog}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[4/3] rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredProducts.map((product) => {
              const config = getCategoryConfig(product.typologie_de_produit);
              return (
                <motion.div key={product.id} variants={itemVariants}>
                  <Link
                    to={`/${lang}/produit/${product.code}`}
                    className="group block"
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream-100 mb-4">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.nom_commercial || ''}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <img
                          src={config.image}
                          alt={product.nom_commercial || ''}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      {/* Category Badge */}
                      <div
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: config.accent }}
                      >
                        {config.label}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-lg text-foreground group-hover:text-navy-700 transition-colors line-clamp-1">
                        {product.nom_commercial}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground font-mono">
                          {product.code}
                        </span>
                        <button
                          onClick={(e) => handleCopyCode(product.code || '', e)}
                          className="p-1.5 rounded-lg hover:bg-cream-100 transition-colors"
                        >
                          {copiedCode === product.code ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                      {product.origine && (
                        <p className="text-sm text-muted-foreground">
                          {lang === 'fr' ? 'Origine' : 'Origin'}: {product.origine}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
};
