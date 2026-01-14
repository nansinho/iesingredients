import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, Beaker, Target, Users } from 'lucide-react';
import { motion } from 'framer-motion';

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
          className={`w-3.5 h-3.5 ${i < rating ? 'fill-gold-500 text-gold-500' : 'text-forest-200'}`}
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
  additionalFields = {},
}: ProductDetailsAccordionProps) {
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
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Accordion type="multiple" defaultValue={defaultOpen} className="space-y-2">
        {/* Applications */}
        {hasApplications && (
          <AccordionItem value="applications" className="border border-forest-200 rounded-lg bg-white px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-forest-100 flex items-center justify-center">
                  <Target className="w-4 h-4 text-forest-600" />
                </div>
                <span className="font-sans text-sm font-semibold text-forest-800">Applications</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-wrap gap-1.5">
                {applicationTags.map((tag, i) => (
                  <Badge 
                    key={i}
                    className="bg-gold-100 text-gold-700 border-0 font-sans text-xs font-medium px-2.5 py-1"
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
          <AccordionItem value="skin-types" className="border border-forest-200 rounded-lg bg-white px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-forest-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-forest-600" />
                </div>
                <span className="font-sans text-sm font-semibold text-forest-800">Types de peau</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-wrap gap-1.5">
                {skinTypeTags.map((tag, i) => (
                  <Badge 
                    key={i}
                    className="bg-forest-100 text-forest-700 border-0 font-sans text-xs font-medium px-2.5 py-1"
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
          <AccordionItem value="performance" className="border border-forest-200 rounded-lg bg-white px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gold-100 flex items-center justify-center">
                  <Star className="w-4 h-4 text-gold-600" />
                </div>
                <span className="font-sans text-sm font-semibold text-forest-800">Performance</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="overflow-x-auto -mx-4 px-4">
                <Table>
                  <TableHeader>
                    <TableRow className="border-forest-200">
                      <TableHead className="font-sans text-xs text-forest-600 font-semibold">Application</TableHead>
                      <TableHead className="font-sans text-xs text-forest-600 font-semibold text-right">Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceData.map((item, i) => (
                      <TableRow key={i} className="border-forest-100">
                        <TableCell className="font-sans text-sm text-forest-800">{item.option}</TableCell>
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
          <AccordionItem value="stability" className="border border-forest-200 rounded-lg bg-white px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-forest-100 flex items-center justify-center">
                  <Beaker className="w-4 h-4 text-forest-600" />
                </div>
                <span className="font-sans text-sm font-semibold text-forest-800">Stabilité</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="overflow-x-auto -mx-4 px-4">
                <Table>
                  <TableHeader>
                    <TableRow className="border-forest-200">
                      <TableHead className="font-sans text-xs text-forest-600 font-semibold">Base</TableHead>
                      <TableHead className="font-sans text-xs text-forest-600 font-semibold">Odeur</TableHead>
                      <TableHead className="font-sans text-xs text-forest-600 font-semibold text-right">pH</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stabilityData.map((item, i) => (
                      <TableRow key={i} className="border-forest-100">
                        <TableCell className="font-sans text-sm text-forest-800">{item.base}</TableCell>
                        <TableCell>
                          <StarRating rating={item.odeur} />
                        </TableCell>
                        <TableCell className="font-mono text-xs text-right text-forest-600">{item.ph}</TableCell>
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
          <AccordionItem value="additional" className="border border-forest-200 rounded-lg bg-white px-4 overflow-hidden">
            <AccordionTrigger className="hover:no-underline py-3">
              <span className="font-sans text-sm font-semibold text-forest-800">Données complémentaires</span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(additionalFields)
                  .filter(([_, v]) => v && v !== '-')
                  .map(([key, value]) => (
                    <div key={key} className="space-y-0.5">
                      <dt className="font-sans text-[10px] uppercase tracking-widest text-forest-500 font-semibold">
                        {key.replace(/_/g, ' ')}
                      </dt>
                      <dd className="font-sans text-sm text-forest-800">{value}</dd>
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
