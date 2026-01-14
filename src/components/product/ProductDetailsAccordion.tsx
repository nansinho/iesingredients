import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, Beaker, Target, Users, Info } from 'lucide-react';
import { motion } from 'framer-motion';
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
          className={`w-4 h-4 ${i < rating ? 'fill-gold-500 text-gold-500' : 'text-forest-200'}`}
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Accordion type="multiple" defaultValue={defaultOpen} className="space-y-3">
        {/* Applications */}
        {hasApplications && (
          <AccordionItem value="applications" className="border border-forest-200 rounded-xl bg-white px-5 shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-forest-900 flex items-center justify-center">
                  <Target className="w-4 h-4 text-gold-400" />
                </div>
                <span className="font-sans text-sm font-bold text-forest-900">Applications</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <div className="flex flex-wrap gap-2">
                {applicationTags.map((tag, i) => (
                  <Badge 
                    key={i}
                    className="bg-gold-100 text-gold-800 border border-gold-300 font-sans text-sm font-medium px-3 py-1.5"
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
          <AccordionItem value="skin-types" className="border border-forest-200 rounded-xl bg-white px-5 shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-forest-900 flex items-center justify-center">
                  <Users className="w-4 h-4 text-gold-400" />
                </div>
                <span className="font-sans text-sm font-bold text-forest-900">Types de peau</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <div className="flex flex-wrap gap-2">
                {skinTypeTags.map((tag, i) => (
                  <Badge 
                    key={i}
                    className="bg-forest-100 text-forest-800 border border-forest-200 font-sans text-sm font-medium px-3 py-1.5"
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
          <AccordionItem value="performance" className="border border-forest-200 rounded-xl bg-white px-5 shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold-500 flex items-center justify-center">
                  <Star className="w-4 h-4 text-forest-900" />
                </div>
                <span className="font-sans text-sm font-bold text-forest-900">Performance</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <div className="rounded-lg border border-forest-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-forest-50 hover:bg-forest-50">
                      <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider">Application</TableHead>
                      <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider text-right">Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceData.map((item, i) => (
                      <TableRow key={i} className="hover:bg-forest-50/50">
                        <TableCell className="font-sans text-sm text-forest-800 font-medium">{item.option}</TableCell>
                        <TableCell className="text-right">
                          <StarRating rating={item.rating} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Stabilité (Parfums) */}
        {hasStability && (
          <AccordionItem value="stability" className="border border-forest-200 rounded-xl bg-white px-5 shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-forest-600 flex items-center justify-center">
                  <Beaker className="w-4 h-4 text-white" />
                </div>
                <span className="font-sans text-sm font-bold text-forest-900">Stabilité</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <div className="rounded-lg border border-forest-100 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-forest-50 hover:bg-forest-50">
                      <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider">Base</TableHead>
                      <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider">Odeur</TableHead>
                      <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider text-right">pH</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stabilityData.map((item, i) => (
                      <TableRow key={i} className="hover:bg-forest-50/50">
                        <TableCell className="font-sans text-sm text-forest-800 font-medium">{item.base}</TableCell>
                        <TableCell>
                          <StarRating rating={item.odeur} />
                        </TableCell>
                        <TableCell className="font-mono text-sm text-forest-600 font-medium text-right">{item.ph}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Données complémentaires */}
        {hasAdditional && (
          <AccordionItem value="additional" className="border border-forest-200 rounded-xl bg-white px-5 shadow-sm overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-forest-100 flex items-center justify-center">
                  <Info className="w-4 h-4 text-forest-600" />
                </div>
                <span className="font-sans text-sm font-bold text-forest-900">Données complémentaires</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(additionalFields)
                  .filter(([_, v]) => v && v !== '-')
                  .map(([key, value]) => (
                    <div key={key} className="bg-forest-50 rounded-lg p-4">
                      <dt className="font-sans text-[10px] uppercase tracking-widest text-forest-500 font-semibold mb-1">
                        {key.replace(/_/g, ' ')}
                      </dt>
                      <dd className="font-sans text-sm text-forest-900 font-medium">{value}</dd>
                    </div>
                  ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </motion.div>
  );
}
