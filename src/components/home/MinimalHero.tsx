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
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 pt-24 pb-16 bg-white overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-forest-500/30 to-transparent blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-gold-500/30 to-transparent blur-3xl"
        />
      </div>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-forest-900 text-gold-400 mb-8 relative z-10"
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
        className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center max-w-4xl leading-tight text-forest-900 relative z-10"
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
          className="text-gold-600"
        >
          {lang === 'fr' ? 'Ingrédients Premium.' : 'Premium Ingredients.'}
        </motion.span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-6 text-lg md:text-xl text-muted-foreground text-center max-w-2xl relative z-10"
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
        className="flex flex-col sm:flex-row gap-4 mt-10 relative z-10"
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button asChild size="lg" className="bg-forest-900 hover:bg-forest-800 text-white rounded-full px-8 shadow-lg shadow-forest-900/20">
            <Link to={`/${lang}/catalogue`}>
              {t.nav.catalog}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-forest-900/20 text-forest-900 hover:bg-forest-900/5">
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
        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl relative z-10 px-4"
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
              scale: 1.05,
              boxShadow: `0 30px 60px -15px ${cat.glowColor}`
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`relative w-full h-64 sm:h-72 md:h-80 rounded-3xl overflow-hidden cursor-pointer bg-gradient-to-br ${cat.gradient} shadow-xl`}
          >
                {/* Background Image with Overlay */}
                <img
                  src={cat.image}
                  alt={lang === 'fr' ? cat.titleFr : cat.titleEn}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-5 sm:p-6 h-full flex flex-col justify-between">
                  {/* Header: Icon + Counter */}
                  <div className="flex justify-between items-start">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 font-semibold">
                      {cat.count}
                    </Badge>
                  </div>

                  {/* Footer: Title + Description + Link */}
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {lang === 'fr' ? cat.titleFr : cat.titleEn}
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      {lang === 'fr' ? cat.descFr : cat.descEn}
                    </p>
                    <div className="flex items-center gap-2 text-white text-sm font-medium pt-2">
                      {lang === 'fr' ? 'Explorer' : 'Explore'}
                      <ArrowRight className="w-4 h-4" />
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