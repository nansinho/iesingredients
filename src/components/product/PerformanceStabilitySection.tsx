import { Star, Beaker } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AnimatedStarRating } from './AnimatedStarRating';

interface PerformanceItem {
  option: string;
  value?: string;
  rating?: number;
  isText?: boolean;
}

interface StabilityItem {
  ph: string;
  base: string;
  odeur: number;
}

interface PerformanceStabilitySectionProps {
  performanceData: PerformanceItem[];
  stabilityData: StabilityItem[];
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export function PerformanceStabilitySection({
  performanceData,
  stabilityData,
}: PerformanceStabilitySectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (performanceData.length === 0 && stabilityData.length === 0) {
    return null;
  }

  return (
    <motion.section
      ref={ref}
      className="space-y-6"
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-gold-500" />
        <h2 className="font-sans text-lg font-semibold text-forest-900">
          Performance & Stabilité
        </h2>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Table */}
        {performanceData.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-gold-500" />
              <h3 className="text-forest-700 font-semibold">Performance</h3>
            </div>
            <div className="bg-forest-50/50 rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-forest-100/50 hover:bg-forest-100/50 border-0">
                    <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider">
                      Option
                    </TableHead>
                    <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider text-right">
                      Note
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {performanceData.map((item, i) => (
                    <TableRow key={i} className="hover:bg-forest-50/50 border-0">
                      <TableCell className="font-sans text-sm text-forest-800 font-medium">
                        {item.option}
                      </TableCell>
                      <TableCell className="text-right">
                        {item.isText ? (
                          <span className="font-mono text-sm text-forest-600">{item.value}</span>
                        ) : (
                          <div className="flex justify-end">
                            <AnimatedStarRating rating={item.rating || 0} />
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Stability Table */}
        {stabilityData.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Beaker className="w-4 h-4 text-forest-600" />
              <h3 className="text-forest-700 font-semibold">Stabilité</h3>
            </div>
            <div className="bg-forest-50/50 rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-forest-100/50 hover:bg-forest-100/50 border-0">
                    <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider">
                      pH
                    </TableHead>
                    <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider">
                      Base
                    </TableHead>
                    <TableHead className="font-sans text-xs font-semibold text-forest-600 uppercase tracking-wider text-right">
                      Odeur
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stabilityData.map((item, i) => (
                    <TableRow key={i} className="hover:bg-forest-50/50 border-0">
                      <TableCell className="font-mono text-sm text-forest-600 font-medium">
                        {item.ph}
                      </TableCell>
                      <TableCell className="font-sans text-sm text-forest-800 font-medium">
                        {item.base}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end">
                          <AnimatedStarRating rating={item.odeur} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <p className="text-xs text-forest-500 flex items-center gap-1">
        <span className="text-gold-500">★</span> médiocre 
        <span className="mx-1">|</span>
        <span className="text-gold-500">★★</span> passable 
        <span className="mx-1">|</span>
        <span className="text-gold-500">★★★</span> moyen 
        <span className="mx-1">|</span>
        <span className="text-gold-500">★★★★</span> bon 
        <span className="mx-1">|</span>
        <span className="text-gold-500">★★★★★</span> excellent
      </p>
    </motion.section>
  );
}
