import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, Beaker, Target, Users, Info } from 'lucide-react';
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
      <Accordion type="multiple" defaultValue={defaultOpen} className="space-y-2">
        {/* Applications */}
        {hasApplications && (
          <AccordionItem value="applications" className="bg-forest-50/30 rounded-xl px-5 border-0">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-forest-600" />
                <span className="font-sans text-base font-semibold text-forest-900">Applications</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <div className="flex flex-wrap gap-2 pl-7">
                {applicationTags.map((tag, i) => (
                  <Badge 
                    key={i}
                    className="bg-gold-100/60 text-gold-800 border-0 font-sans text-sm font-medium px-3 py-1.5"
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
          <AccordionItem value="skin-types" className="bg-forest-50/30 rounded-xl px-5 border-0">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-forest-600" />
                <span className="font-sans text-base font-semibold text-forest-900">Types de peau</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <div className="flex flex-wrap gap-2 pl-7">
                {skinTypeTags.map((tag, i) => (
                  <Badge 
                    key={i}
                    className="bg-forest-100/60 text-forest-700 border-0 font-sans text-sm font-medium px-3 py-1.5"
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
          <AccordionItem value="performance" className="bg-forest-50/30 rounded-xl px-5 border-0">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-gold-500" />
                <span className="font-sans text-base font-semibold text-forest-900">Performance</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <div className="rounded-lg overflow-hidden ml-7">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-forest-100/50 hover:bg-forest-100/50 border-0">
                      <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider">Application</TableHead>
                      <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider text-right">Note</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceData.map((item, i) => (
                      <TableRow key={i} className="hover:bg-forest-50/50 border-0">
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
          <AccordionItem value="stability" className="bg-forest-50/30 rounded-xl px-5 border-0">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <Beaker className="w-5 h-5 text-forest-600" />
                <span className="font-sans text-base font-semibold text-forest-900">Stabilité</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <div className="rounded-lg overflow-hidden ml-7">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-forest-100/50 hover:bg-forest-100/50 border-0">
                      <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider">Base</TableHead>
                      <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider">Odeur</TableHead>
                      <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider text-right">pH</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stabilityData.map((item, i) => (
                      <TableRow key={i} className="hover:bg-forest-50/50 border-0">
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
          <AccordionItem value="additional" className="bg-forest-50/30 rounded-xl px-5 border-0">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-forest-600" />
                <span className="font-sans text-base font-semibold text-forest-900">Données complémentaires</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-5">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-7">
                {Object.entries(additionalFields)
                  .filter(([_, v]) => v && v !== '-')
                  .map(([key, value]) => (
                    <div key={key} className="bg-forest-100/40 rounded-lg p-3">
                      <dt className="font-sans text-[10px] uppercase tracking-widest text-forest-500 font-medium mb-1">
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
