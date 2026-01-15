import { Badge } from '@/components/ui/badge';
import { motion, type Variants } from 'framer-motion';
import { Sparkles, Award, Leaf, FileText, MapPin, Tag } from 'lucide-react';

interface ProductSummaryCardProps {
  description: string | null;
  benefices: string | null;
  certifications: string | null;
  profilOlfactif: string | null;
  typologie: string | null;
  origine?: string | null;
  gamme?: string | null;
}

function parseTags(value: string | null): string[] {
  if (!value || value === '-') return [];
  return value
    .split(/[,;\/]/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s !== '-');
}

// Animation variants for internal cascade
const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

export function ProductSummaryCard({ 
  description, 
  benefices, 
  certifications, 
  profilOlfactif,
  typologie,
  origine,
  gamme
}: ProductSummaryCardProps) {
  const beneficesList = parseTags(benefices);
  const certificationsList = parseTags(certifications);
  const profilList = parseTags(profilOlfactif);

  const hasBadges = origine || gamme;
  const hasContent = description || beneficesList.length > 0 || certificationsList.length > 0 || profilList.length > 0 || hasBadges;

  if (!hasContent) return null;

  return (
    <div className="space-y-5">
      {/* Section title - inline icon */}
      <div className="flex items-center gap-2">
        <FileText className="w-5 h-5 text-forest-600" />
        <h2 className="font-sans text-lg font-semibold text-forest-900">
          Description
        </h2>
      </div>

      {/* Content with cascade animation */}
      <motion.div 
        className="space-y-5 pl-7"
        variants={contentVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Origine & Gamme Badges */}
        {hasBadges && (
          <motion.div 
            className="flex flex-wrap items-center gap-2"
            variants={itemVariants}
          >
            {origine && (
              <Badge 
                variant="forest"
                className="font-sans text-xs font-medium px-3 py-1.5 inline-flex items-center gap-1.5"
              >
                <MapPin className="w-3 h-3" />
                {origine}
              </Badge>
            )}
            {gamme && (
              <Badge 
                variant="forest"
                className="font-sans text-xs font-medium px-3 py-1.5 inline-flex items-center gap-1.5"
              >
                <Tag className="w-3 h-3" />
                {gamme}
              </Badge>
            )}
          </motion.div>
        )}

        {/* Description */}
        {description && description !== '-' && (
          <motion.p
            className="font-sans text-base text-forest-700 leading-relaxed"
            variants={itemVariants}
          >
            {description}
          </motion.p>
        )}

        {/* Profil Olfactif */}
        {profilList.length > 0 && (
          <motion.div 
            className="space-y-2"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span className="font-sans text-xs uppercase tracking-widest text-forest-500 font-medium">
                Profil olfactif
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {profilList.map((tag, i) => (
                <Badge 
                  key={i} 
                  variant="forest"
                  className="font-sans text-sm font-medium px-3 py-1.5"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {/* Bénéfices */}
        {beneficesList.length > 0 && (
          <motion.div 
            className="space-y-2"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-forest-600" />
              <span className="font-sans text-xs uppercase tracking-widest text-forest-500 font-medium">
                Bénéfices
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {beneficesList.map((tag, i) => (
                <Badge 
                  key={i} 
                  variant="forest"
                  className="font-sans text-sm font-medium px-3 py-1.5"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}

        {/* Certifications */}
        {certificationsList.length > 0 && (
          <motion.div 
            className="space-y-2"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-600" />
              <span className="font-sans text-xs uppercase tracking-widest text-forest-500 font-medium">
                Certifications
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {certificationsList.map((tag, i) => (
                <Badge 
                  key={i} 
                  variant="gold"
                  className="font-sans text-sm font-medium px-3 py-1.5 inline-flex items-center gap-1.5"
                >
                  <Award className="w-3 h-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
