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
    <section className="min-h-[90vh] flex flex-col items-center justify-center px-4 pt-24 pb-16 bg-cream-50">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold-100 text-gold-800 mb-8"
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">+5000 références produits</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center max-w-4xl leading-tight text-foreground"
      >
        {lang === 'fr' ? 'Excellence Naturelle.' : 'Natural Excellence.'}
        <br />
        <span className="text-navy-700">
          {lang === 'fr' ? 'Ingrédients Premium.' : 'Premium Ingredients.'}
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 text-lg md:text-xl text-muted-foreground text-center max-w-2xl"
      >
        {lang === 'fr'
          ? 'Découvrez nos ingrédients cosmétiques, parfums et arômes de qualité exceptionnelle depuis 1994.'
          : 'Discover our exceptional quality cosmetic ingredients, perfumes and flavors since 1994.'}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 mt-10"
      >
        <Button asChild size="lg" className="bg-navy-900 hover:bg-navy-800 text-white rounded-full px-8">
          <Link to={`/${lang}/catalogue`}>
            {t.nav.catalog}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-navy-900/20 hover:bg-navy-900/5">
          <Link to={`/${lang}/contact`}>
            {t.nav.contact}
          </Link>
        </Button>
      </motion.div>

      {/* Floating Image Trio */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-16 flex items-end justify-center gap-4 md:gap-6"
      >
        <motion.div
          whileHover={{ y: -8, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="relative w-28 h-36 sm:w-36 sm:h-44 md:w-44 md:h-56 rounded-2xl overflow-hidden shadow-xl"
        >
          <img
            src={creamJar}
            alt="Cosmétique"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-cosmetique/90 rounded-full">
            <span className="text-[10px] font-medium text-white uppercase tracking-wide">Cosmétique</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -12 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="relative w-32 h-44 sm:w-44 sm:h-56 md:w-52 md:h-72 rounded-2xl overflow-hidden shadow-2xl -mb-4"
        >
          <img
            src={essentialOil}
            alt="Parfumerie"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-parfum/90 rounded-full">
            <span className="text-[10px] font-medium text-white uppercase tracking-wide">Parfumerie</span>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -8, rotate: 2 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="relative w-28 h-36 sm:w-36 sm:h-44 md:w-44 md:h-56 rounded-2xl overflow-hidden shadow-xl"
        >
          <img
            src={blueberriesHerbs}
            alt="Arômes"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-arome/90 rounded-full">
            <span className="text-[10px] font-medium text-white uppercase tracking-wide">Arômes</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Logo Strip Placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-20 flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50"
      >
        {['COSMOS', 'ECOCERT', 'BIO', 'VEGAN', 'ISO 9001'].map((logo) => (
          <span key={logo} className="text-xs md:text-sm font-medium tracking-widest text-muted-foreground">
            {logo}
          </span>
        ))}
      </motion.div>
    </section>
  );
};
