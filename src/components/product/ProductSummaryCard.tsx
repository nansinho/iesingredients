import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface ProductSummaryCardProps {
  description: string | null;
  benefices: string | null;
  certifications: string | null;
  profilOlfactif: string | null;
  typologie: string | null;
}

function parseTags(value: string | null): string[] {
  if (!value || value === '-') return [];
  return value
    .split(/[,;\/]/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s !== '-');
}

export function ProductSummaryCard({ 
  description, 
  benefices, 
  certifications, 
  profilOlfactif,
}: ProductSummaryCardProps) {
  const beneficesList = parseTags(benefices);
  const certificationsList = parseTags(certifications);
  const profilList = parseTags(profilOlfactif);

  const hasContent = description || beneficesList.length > 0 || certificationsList.length > 0 || profilList.length > 0;

  if (!hasContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border border-forest-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Description */}
          {description && description !== '-' && (
            <p className="font-sans text-sm sm:text-base text-forest-700 leading-relaxed">
              {description}
            </p>
          )}

          {/* Profil Olfactif */}
          {profilList.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-sans text-[10px] uppercase tracking-widest text-forest-500 font-semibold">
                Profil olfactif
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profilList.map((tag, i) => (
                  <Badge 
                    key={i} 
                    className="bg-forest-100 text-forest-700 border-0 font-sans text-xs font-medium px-2.5 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Bénéfices */}
          {beneficesList.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-sans text-[10px] uppercase tracking-widest text-forest-500 font-semibold">
                Bénéfices
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {beneficesList.map((tag, i) => (
                  <Badge 
                    key={i} 
                    className="bg-gold-100 text-gold-700 border-0 font-sans text-xs font-medium px-2.5 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certificationsList.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-sans text-[10px] uppercase tracking-widest text-forest-500 font-semibold">
                Certifications
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {certificationsList.map((tag, i) => (
                  <Badge 
                    key={i} 
                    variant="outline"
                    className="border-forest-300 text-forest-600 font-sans text-xs font-medium px-2.5 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
