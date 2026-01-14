import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, Beaker, Target, Users } from 'lucide-react';
import { getCategoryConfig } from '@/lib/productTheme';

interface PerformanceData {
  option: string;
  rating: number;
}

interface StabilityData {
  base: string;
  odeur: number;
  ph: string;
}

interface ProductDetailsAccordionProps {
  application: string | null;
  typeDePeau: string | null;
  performanceData: PerformanceData[];
  stabilityData: StabilityData[];
  typologie: string | null;
  additionalFields?: Record<string, string | null>;
}

function parseTags(value: string | null): string[] {
  if (!value || value === '-') return [];
  return value
    .split(/[,;\/]/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s !== '-');
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'fill-gold-500 text-gold-500' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  );
}

export function ProductDetailsAccordion({
  application,
  typeDePeau,
  performanceData,
  stabilityData,
  typologie,
  additionalFields = {},
}: ProductDetailsAccordionProps) {
  const config = getCategoryConfig(typologie);
  const applicationTags = parseTags(application);
  const skinTypeTags = parseTags(typeDePeau);

  const hasApplications = applicationTags.length > 0;
  const hasSkinTypes = skinTypeTags.length > 0;
  const hasPerformance = performanceData.length > 0;
  const hasStability = stabilityData.length > 0;
  const hasAdditional = Object.values(additionalFields).some(v => v && v !== '-');

  if (!hasApplications && !hasSkinTypes && !hasPerformance && !hasStability && !hasAdditional) {
    return null;
  }

  const defaultOpen: string[] = [];
  if (hasApplications) defaultOpen.push('applications');
  if (hasSkinTypes) defaultOpen.push('skin-types');

  return (
    <Accordion type="multiple" defaultValue={defaultOpen} className="space-y-2">
      {/* Applications */}
      {hasApplications && (
        <AccordionItem value="applications" className="border rounded-lg bg-card px-4">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Target className={`w-4 h-4 ${config.accent}`} />
              <span className="font-sans text-sm font-semibold">Applications</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="flex flex-wrap gap-1.5">
              {applicationTags.map((tag, i) => (
                <Badge 
                  key={i}
                  className={`${config.bgLight} ${config.text} border-0 font-sans text-xs font-medium px-2.5 py-1`}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Types de peau */}
      {hasSkinTypes && (
        <AccordionItem value="skin-types" className="border rounded-lg bg-card px-4">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Users className={`w-4 h-4 ${config.accent}`} />
              <span className="font-sans text-sm font-semibold">Types de peau</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="flex flex-wrap gap-1.5">
              {skinTypeTags.map((tag, i) => (
                <Badge 
                  key={i}
                  variant="secondary"
                  className="font-sans text-xs font-medium px-2.5 py-1"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Performance (Parfums) */}
      {hasPerformance && (
        <AccordionItem value="performance" className="border rounded-lg bg-card px-4">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Star className={`w-4 h-4 ${config.accent}`} />
              <span className="font-sans text-sm font-semibold">Performance</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sans text-xs">Application</TableHead>
                  <TableHead className="font-sans text-xs text-right">Note</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceData.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-sans text-sm">{item.option}</TableCell>
                    <TableCell className="text-right">
                      <StarRating rating={item.rating} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Stabilité (Parfums) */}
      {hasStability && (
        <AccordionItem value="stability" className="border rounded-lg bg-card px-4">
          <AccordionTrigger className="hover:no-underline py-3">
            <div className="flex items-center gap-2">
              <Beaker className={`w-4 h-4 ${config.accent}`} />
              <span className="font-sans text-sm font-semibold">Stabilité</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sans text-xs">Base</TableHead>
                  <TableHead className="font-sans text-xs">Odeur</TableHead>
                  <TableHead className="font-sans text-xs text-right">pH</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stabilityData.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-sans text-sm">{item.base}</TableCell>
                    <TableCell>
                      <StarRating rating={item.odeur} />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-right">{item.ph}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Données complémentaires */}
      {hasAdditional && (
        <AccordionItem value="additional" className="border rounded-lg bg-card px-4">
          <AccordionTrigger className="hover:no-underline py-3">
            <span className="font-sans text-sm font-semibold">Données complémentaires</span>
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(additionalFields)
                .filter(([_, v]) => v && v !== '-')
                .map(([key, value]) => (
                  <div key={key} className="space-y-0.5">
                    <dt className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
                      {key.replace(/_/g, ' ')}
                    </dt>
                    <dd className="font-sans text-sm text-foreground">{value}</dd>
                  </div>
                ))}
            </dl>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
