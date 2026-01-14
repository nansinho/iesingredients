import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Sparkles, Award, Leaf, FileText, MapPin, Tag } from 'lucide-react';
import { getCategoryConfig } from '@/lib/productTheme';

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

export function ProductSummaryCard({ 
  description, 
  benefices, 
  certifications, 
  profilOlfactif,
  typologie,
  origine,
  gamme
}: ProductSummaryCardProps) {
  const config = getCategoryConfig(typologie);
  const beneficesList = parseTags(benefices);
  const certificationsList = parseTags(certifications);
  const profilList = parseTags(profilOlfactif);

  const hasBadges = origine || gamme;
  const hasContent = description || beneficesList.length > 0 || certificationsList.length > 0 || profilList.length > 0 || hasBadges;

  if (!hasContent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 sm:space-y-6"
    >
      {/* External title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center shadow-md">
          <FileText className="w-5 h-5 text-gold-400" />
        </div>
        <h2 className="font-sans text-lg sm:text-xl font-semibold text-forest-900">
          Description
        </h2>
      </div>

      <Card className="border border-forest-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-5 sm:p-8 space-y-6">
          {/* Origine & Gamme Badges with icons */}
          {hasBadges && (
            <motion.div 
              className="flex flex-wrap items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
            >
              {origine && (
                <Badge className="bg-gold-50 text-gold-700 border border-gold-300 font-sans text-xs font-medium px-3 py-1.5 hover:bg-gold-100 transition-colors inline-flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  {origine}
                </Badge>
              )}
              {gamme && (
                <Badge className="bg-forest-50 text-forest-700 border border-forest-200 font-sans text-xs font-medium px-3 py-1.5 hover:bg-forest-100 transition-colors inline-flex items-center gap-1.5">
                  <Tag className="w-3 h-3" />
                  {gamme}
                </Badge>
              )}
            </motion.div>
          )}
          {/* Description */}
          {description && description !== '-' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p className="font-sans text-base sm:text-lg text-forest-800 leading-relaxed">
                {description}
              </p>
            </motion.div>
          )}

          {/* Profil Olfactif */}
          {profilList.length > 0 && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold-500" />
                <h3 className="font-sans text-xs uppercase tracking-widest text-forest-600 font-semibold">
                  Profil olfactif
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profilList.map((tag, i) => (
                  <Badge 
                    key={i} 
                    className="bg-forest-100 text-forest-800 border border-forest-200 font-sans text-sm font-medium px-3 py-1.5 hover:bg-forest-200 transition-colors"
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
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-forest-600" />
                <h3 className="font-sans text-xs uppercase tracking-widest text-forest-600 font-semibold">
                  Bénéfices
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {beneficesList.map((tag, i) => (
                  <Badge 
                    key={i} 
                    className="bg-gold-100 text-gold-800 border border-gold-300 font-sans text-sm font-medium px-3 py-1.5 hover:bg-gold-200 transition-colors"
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
              className="space-y-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-600" />
                <h3 className="font-sans text-xs uppercase tracking-widest text-forest-600 font-semibold">
                  Certifications
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {certificationsList.map((tag, i) => (
                  <Badge 
                    key={i} 
                    className="bg-forest-900 text-gold-400 border-0 font-sans text-sm font-medium px-3 py-1.5 shadow-md hover:bg-forest-800 transition-colors"
                  >
                    <Award className="w-3 h-3 mr-1.5" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
