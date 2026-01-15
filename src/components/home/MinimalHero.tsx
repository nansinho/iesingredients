import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Leaf, FlaskConical, Cherry } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Language, useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';

// Import images
import creamJar from '@/assets/cream-jar.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';

interface MinimalHeroProps {
  lang: Language;
}

const categories = [
  {
    key: 'cosmetic',
    icon: Leaf,
    image: creamJar,
    gradient: 'from-[#2D5A3D] to-[#4A7C59]',
    glowColor: 'rgba(74, 124, 89, 0.5)',
    count: '2000+',
    titleFr: 'Cosmétique',
    titleEn: 'Cosmetics',
    descFr: 'Actifs botaniques et extraits naturels',
    descEn: 'Botanical actives and natural extracts',
    filter: 'COSMETIQUE',
  },
  {
    key: 'perfumery',
    icon: FlaskConical,
    image: essentialOil,
    gradient: 'from-[#A67B5B] to-[#D4A574]',
    glowColor: 'rgba(212, 165, 116, 0.5)',
    count: '1500+',
    titleFr: 'Parfumerie',
    titleEn: 'Perfumery',
    descFr: 'Huiles essentielles et absolues',
    descEn: 'Essential oils and absolutes',
    filter: 'PARFUMERIE',
  },
  {
    key: 'aromas',
    icon: Cherry,
    image: blueberriesHerbs,
    gradient: 'from-[#8B4A5E] to-[#C97B8B]',
    glowColor: 'rgba(201, 123, 139, 0.5)',
    count: '1500+',
    titleFr: 'Arômes',
    titleEn: 'Aromas',
    descFr: 'Arômes alimentaires naturels',
    descEn: 'Natural food flavors',
    filter: 'AROMES',
  },
];

export const MinimalHero = ({ lang }: MinimalHeroProps) => {
  const t = useTranslation(lang);

  return (
    <section className="min-h-[100svh] flex flex-col items-center justify-center px-4 pt-20 sm:pt-24 pb-12 sm:pb-16 bg-forest-950 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute top-1/4 -left-32 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gradient-to-br from-gold-500/40 to-transparent blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
          className="absolute bottom-1/4 -right-32 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-gradient-to-br from-primary/40 to-transparent blur-3xl"
        />
        {/* Additional subtle pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-forest-900/50 via-transparent to-transparent" />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-forest-800/80 backdrop-blur-sm border border-gold-500/20 text-gold-400 mb-6 sm:mb-8 relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
        <span className="text-sm font-medium">+5000 références produits</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-center max-w-4xl leading-tight text-white relative z-10"
      >
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {lang === 'fr' ? 'Excellence Naturelle.' : 'Natural Excellence.'}
        </motion.span>
        <br />
        <motion.span
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-gold-400"
        >
          {lang === 'fr' ? 'Ingrédients Premium.' : 'Premium Ingredients.'}
        </motion.span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-cream-300 text-center max-w-2xl px-4 relative z-10"
      >
        {lang === 'fr'
          ? 'Découvrez nos ingrédients cosmétiques, parfums et arômes de qualité exceptionnelle depuis 1994.'
          : 'Discover our exceptional quality cosmetic ingredients, perfumes and flavors since 1994.'}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-10 relative z-10 w-full sm:w-auto px-4 sm:px-0"
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
          <Button asChild size="lg" className="w-full sm:w-auto h-12 sm:h-auto bg-gold-500 hover:bg-gold-400 text-forest-950 rounded-full px-8 shadow-lg shadow-gold-500/20 font-medium">
            <Link to={`/${lang}/catalogue`}>
              {t.nav.catalog}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 sm:h-auto rounded-full px-8 border-cream-300/30 text-cream-100 hover:bg-cream-100/10 hover:text-white">
            <Link to={`/${lang}/contact`}>
              {t.nav.contact}
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Category Cards */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7, type: 'spring', stiffness: 50 }}
        className="mt-10 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-5xl relative z-10 px-4"
      >
        {categories.map((cat, i) => {
          const IconComponent = cat.icon;
          return (
            <Link
              key={cat.key}
              to={`/${lang}/catalogue?typologie=${cat.filter}`}
            >
              <motion.div
                whileHover={{ 
                  y: -12, 
                  scale: 1.03,
                  boxShadow: `0 30px 60px -15px ${cat.glowColor}`
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`relative w-full h-48 sm:h-64 md:h-72 lg:h-80 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br ${cat.gradient} shadow-xl`}
              >
                {/* Background Image with Overlay */}
                <img
                  src={cat.image}
                  alt={lang === 'fr' ? cat.titleFr : cat.titleEn}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-4 sm:p-5 md:p-6 h-full flex flex-col justify-between">
                  {/* Header: Icon + Counter */}
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <IconComponent className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 font-semibold text-xs sm:text-sm">
                      {cat.count}
                    </Badge>
                  </div>

                  {/* Footer: Title + Description + Link */}
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                      {lang === 'fr' ? cat.titleFr : cat.titleEn}
                    </h3>
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {lang === 'fr' ? cat.descFr : cat.descEn}
                    </p>
                    <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-medium pt-1 sm:pt-2">
                      {lang === 'fr' ? 'Explorer' : 'Explore'}
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </section>
  );
};
