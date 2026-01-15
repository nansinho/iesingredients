import { Copy, Check, Droplets, MapPin, Eye, Shield, Award, FlaskConical, Leaf, Tag } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="group bg-forest-50/40 rounded-xl p-4 hover:bg-forest-100/50 transition-colors duration-200"
    >
      {/* Label with icon */}
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-forest-500" />
        <span className="font-sans text-[10px] uppercase tracking-widest text-forest-500 font-medium">
          {label}
        </span>
      </div>

      {/* Value + Copy */}
      <div className="flex items-start justify-between gap-2">
        <p className={`${mono ? 'font-mono text-xs' : 'font-sans text-sm'} font-semibold text-forest-900 leading-snug break-words flex-1`}>
          {value}
        </p>
        {copyable && (
          <button
            onClick={handleCopy}
            className="shrink-0 p-1.5 rounded-lg hover:bg-forest-200/50 transition-colors opacity-0 group-hover:opacity-100"
            title={`Copier ${label}`}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-forest-400" />
            )}
          </button>
        )}
      </div>
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
      className="space-y-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Section title - inline icon */}
      <div className="flex items-center gap-2">
        <FlaskConical className="w-5 h-5 text-forest-600" />
        <h2 className="font-sans text-lg font-semibold text-forest-900">
          Caractéristiques techniques
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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
