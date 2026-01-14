import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language, useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';

// Import images
import creamJar from '@/assets/cream-jar.jpg';
import essentialOil from '@/assets/essential-oil.jpg';
import blueberriesHerbs from '@/assets/blueberries-herbs.jpg';

interface MinimalHeroProps {
  lang: Language;
}

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

      {/* Floating Image Trio */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.7, type: 'spring', stiffness: 50 }}
        className="mt-16 flex items-end justify-center gap-4 md:gap-6 relative z-10"
      >
        <motion.div
          whileHover={{ y: -12, rotate: -3, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative w-28 h-36 sm:w-36 sm:h-44 md:w-44 md:h-56 rounded-2xl overflow-hidden shadow-xl cursor-pointer"
        >
          <img
            src={creamJar}
            alt="Cosmétique"
            className="w-full h-full object-cover"
          />
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-2 left-2 px-2 py-1 bg-forest-900/90 backdrop-blur-sm rounded-full"
          >
            <span className="text-[10px] font-medium text-white uppercase tracking-wide">Cosmétique</span>
          </motion.div>
        </motion.div>

        <motion.div
          whileHover={{ y: -16, scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative w-32 h-44 sm:w-44 sm:h-56 md:w-52 md:h-72 rounded-2xl overflow-hidden shadow-2xl -mb-4 cursor-pointer"
        >
          <img
            src={essentialOil}
            alt="Parfumerie"
            className="w-full h-full object-cover"
          />
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="absolute bottom-2 left-2 px-2 py-1 bg-gold-600/90 backdrop-blur-sm rounded-full"
          >
            <span className="text-[10px] font-medium text-white uppercase tracking-wide">Parfumerie</span>
          </motion.div>
        </motion.div>

        <motion.div
          whileHover={{ y: -12, rotate: 3, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="relative w-28 h-36 sm:w-36 sm:h-44 md:w-44 md:h-56 rounded-2xl overflow-hidden shadow-xl cursor-pointer"
        >
          <img
            src={blueberriesHerbs}
            alt="Arômes"
            className="w-full h-full object-cover"
          />
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-2 left-2 px-2 py-1 bg-arome/90 backdrop-blur-sm rounded-full"
          >
            <span className="text-[10px] font-medium text-white uppercase tracking-wide">Arômes</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};