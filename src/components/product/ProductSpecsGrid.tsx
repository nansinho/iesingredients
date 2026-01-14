import { Copy, Check, Droplets, MapPin, Eye, Shield, Award, FlaskConical, Leaf, Tag } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { getCategoryConfig } from '@/lib/productTheme';

interface SpecItem {
  label: string;
  value: string | null;
  icon: typeof Droplets;
  copyable?: boolean;
  mono?: boolean;
}

interface ProductSpecsGridProps {
  product: {
    inci?: string | null;
    cas_no?: string | null;
    origine?: string | null;
    solubilite?: string | null;
    aspect?: string | null;
    conservateurs?: string | null;
    valorisations?: string | null;
    tracabilite?: string | null;
    nom_latin?: string | null;
    food_grade?: string | null;
    base?: string | null;
    ph?: string | null;
    dosage?: string | null;
    partie_utilisee?: string | null;
    typologie_de_produit?: string | null;
  };
}

function SpecCard({ 
  label, 
  value, 
  icon: Icon, 
  copyable, 
  mono, 
  index 
}: SpecItem & { index: number }) {
  const [copied, setCopied] = useState(false);

  if (!value || value === '-' || value.trim() === '') return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label} copié !`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erreur lors de la copie');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card className="group border border-forest-200 shadow-sm hover:shadow-lg hover:border-gold-400/50 transition-all duration-300 bg-white overflow-hidden h-full">
        <CardContent className="p-4 sm:p-5">
          {/* Header: Icon + Label */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-forest-100 group-hover:bg-gold-100 flex items-center justify-center shrink-0 transition-colors duration-300">
              <Icon className="w-5 h-5 text-forest-600 group-hover:text-gold-600 transition-colors duration-300" />
            </div>
            <span className="font-sans text-[10px] uppercase tracking-widest text-forest-500 font-semibold">
              {label}
            </span>
          </div>

          {/* Value + Copy */}
          <div className="flex items-start justify-between gap-2">
            <p className={`${mono ? 'font-mono text-xs' : 'font-sans text-sm'} font-bold text-forest-900 leading-snug break-words flex-1`}>
              {value}
            </p>
            {copyable && (
              <button
                onClick={handleCopy}
                className="shrink-0 p-2 rounded-lg hover:bg-forest-100 transition-colors"
                title={`Copier ${label}`}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-forest-400 hover:text-forest-600" />
                )}
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ProductSpecsGrid({ product }: ProductSpecsGridProps) {
  const specs: SpecItem[] = [
    { label: 'INCI', value: product.inci, icon: FlaskConical, copyable: true, mono: true },
    { label: 'N° CAS', value: product.cas_no, icon: Tag, copyable: true, mono: true },
    { label: 'Nom Latin', value: product.nom_latin, icon: Leaf, copyable: true, mono: true },
    { label: 'Origine', value: product.origine, icon: MapPin },
    { label: 'Solubilité', value: product.solubilite, icon: Droplets },
    { label: 'Aspect', value: product.aspect, icon: Eye },
    { label: 'Conservateurs', value: product.conservateurs, icon: Shield },
    { label: 'Valorisations', value: product.valorisations, icon: Award },
    { label: 'Traçabilité', value: product.tracabilite, icon: MapPin },
    { label: 'Base', value: product.base, icon: FlaskConical },
    { label: 'pH', value: product.ph, icon: FlaskConical },
    { label: 'Dosage', value: product.dosage, icon: FlaskConical },
    { label: 'Partie utilisée', value: product.partie_utilisee, icon: Leaf },
    { label: 'Food Grade', value: product.food_grade, icon: Award },
  ];

  const visibleSpecs = specs.filter(s => s.value && s.value !== '-' && s.value.trim() !== '');

  if (visibleSpecs.length === 0) return null;

  return (
    <motion.section 
      className="space-y-4 sm:space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center">
          <FlaskConical className="w-5 h-5 text-gold-400" />
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-forest-900">
          Caractéristiques techniques
        </h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {visibleSpecs.map((spec, i) => (
          <SpecCard 
            key={i} 
            {...spec} 
            index={i}
          />
        ))}
      </div>
    </motion.section>
  );
}
