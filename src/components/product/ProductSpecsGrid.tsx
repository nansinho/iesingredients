import { Copy, Check, Droplets, MapPin, Eye, Shield, Award, FlaskConical, Leaf, Tag } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
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
  accentColor 
}: SpecItem & { accentColor: string }) {
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
    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow bg-card">
      <CardContent className="p-3 sm:p-4">
        {/* Header: Icon + Label */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-8 h-8 rounded-lg ${accentColor} bg-opacity-10 flex items-center justify-center shrink-0`}>
            <Icon className={`w-4 h-4 ${accentColor}`} />
          </div>
          <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
            {label}
          </span>
        </div>

        {/* Value + Copy */}
        <div className="flex items-start justify-between gap-2">
          <p className={`${mono ? 'font-mono text-xs' : 'font-sans text-sm'} font-semibold text-foreground leading-snug break-words flex-1`}>
            {value}
          </p>
          {copyable && (
            <button
              onClick={handleCopy}
              className="shrink-0 p-1.5 rounded-md hover:bg-muted transition-colors"
              title={`Copier ${label}`}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductSpecsGrid({ product }: ProductSpecsGridProps) {
  const config = getCategoryConfig(product.typologie_de_produit || null);

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
    <section className="space-y-3 sm:space-y-4">
      <h2 className="font-serif text-lg sm:text-xl font-semibold text-foreground">
        Caractéristiques techniques
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {visibleSpecs.map((spec, i) => (
          <SpecCard 
            key={i} 
            {...spec} 
            accentColor={config.accent}
          />
        ))}
      </div>
    </section>
  );
}
