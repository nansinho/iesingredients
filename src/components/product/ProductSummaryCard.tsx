import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getCategoryConfig } from '@/lib/productTheme';

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
  typologie 
}: ProductSummaryCardProps) {
  const config = getCategoryConfig(typologie);
  const beneficesList = parseTags(benefices);
  const certificationsList = parseTags(certifications);
  const profilList = parseTags(profilOlfactif);

  const hasContent = description || beneficesList.length > 0 || certificationsList.length > 0 || profilList.length > 0;

  if (!hasContent) return null;

  return (
    <Card className="border-0 shadow-sm bg-card">
      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Description */}
        {description && description !== '-' && (
          <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}

        {/* Profil Olfactif */}
        {profilList.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              Profil olfactif
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {profilList.map((tag, i) => (
                <Badge 
                  key={i} 
                  variant="secondary" 
                  className="font-sans text-xs font-medium px-2.5 py-0.5"
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
            <h3 className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              Bénéfices
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {beneficesList.map((tag, i) => (
                <Badge 
                  key={i} 
                  className={`${config.bgLight} ${config.text} border-0 font-sans text-xs font-medium px-2.5 py-0.5`}
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
            <h3 className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
              Certifications
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {certificationsList.map((tag, i) => (
                <Badge 
                  key={i} 
                  variant="outline"
                  className="font-sans text-xs font-medium px-2.5 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
