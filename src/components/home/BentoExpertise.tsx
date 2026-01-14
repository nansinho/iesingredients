import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Droplets, Cherry } from 'lucide-react';
import { Language, useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';

// Import images
import botanicalsFlat from '@/assets/botanicals-flat.jpg';
import serumCollection from '@/assets/serum-collection.jpg';
import pumpBottle from '@/assets/pump-bottle.jpg';
import heroBotanical from '@/assets/hero-botanical.jpg';

interface BentoExpertiseProps {
  lang: Language;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const BentoExpertise = ({ lang }: BentoExpertiseProps) => {
  const t = useTranslation(lang);

  return (
    <section className="py-24 px-4 bg-cream-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            {lang === 'fr' ? 'Notre Expertise' : 'Our Expertise'}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {lang === 'fr'
              ? 'Des ingrédients soigneusement sélectionnés depuis plus de 30 ans'
              : 'Carefully selected ingredients for over 30 years'}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {/* Large Image Card - Botanicals */}
          <motion.div
            variants={itemVariants}
            className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer"
          >
            <img
              src={botanicalsFlat}
              alt="Botanicals"
              className="w-full h-full object-cover min-h-[400px] md:min-h-[500px] transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-gold-400 text-sm uppercase tracking-widest mb-2 block">
                {lang === 'fr' ? 'Naturel' : 'Natural'}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-white">
                {lang === 'fr' ? 'Ingrédients Botaniques' : 'Botanical Ingredients'}
              </h3>
            </div>
          </motion.div>

          {/* Cosmétique Card - Dark */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 bg-cosmetique rounded-3xl p-6 flex flex-col justify-between min-h-[200px] group"
          >
            <Leaf className="w-8 h-8 text-white/80" />
            <div>
              <span className="text-white/60 text-xs uppercase tracking-widest">
                {t.categories.cosmetic}
              </span>
              <p className="text-2xl md:text-3xl font-serif text-white mt-1">2000+</p>
              <p className="text-white/70 text-sm mt-1">
                {lang === 'fr' ? 'actifs naturels' : 'natural actives'}
              </p>
              <Link
                to={`/${lang}/catalogue?category=cosmetic`}
                className="inline-flex items-center text-white/80 hover:text-white text-sm mt-3 group-hover:gap-2 transition-all"
              >
                {lang === 'fr' ? 'Explorer' : 'Explore'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </motion.div>

          {/* Parfumerie Card - Dark */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 bg-parfum rounded-3xl p-6 flex flex-col justify-between min-h-[200px] group"
          >
            <Droplets className="w-8 h-8 text-white/80" />
            <div>
              <span className="text-white/60 text-xs uppercase tracking-widest">
                {t.categories.perfume}
              </span>
              <p className="text-2xl md:text-3xl font-serif text-white mt-1">1500+</p>
              <p className="text-white/70 text-sm mt-1">
                {lang === 'fr' ? 'essences rares' : 'rare essences'}
              </p>
              <Link
                to={`/${lang}/catalogue?category=perfume`}
                className="inline-flex items-center text-white/80 hover:text-white text-sm mt-3 group-hover:gap-2 transition-all"
              >
                {lang === 'fr' ? 'Explorer' : 'Explore'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </motion.div>

          {/* Wide Image Card */}
          <motion.div
            variants={itemVariants}
            className="col-span-2 md:col-span-1 relative rounded-3xl overflow-hidden group cursor-pointer min-h-[200px]"
          >
            <img
              src={serumCollection}
              alt="Serums"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4">
              <span className="text-white/90 text-sm font-medium">
                {lang === 'fr' ? 'Collection Sérums' : 'Serum Collection'}
              </span>
            </div>
          </motion.div>

          {/* Arômes Card - Dark */}
          <motion.div
            variants={itemVariants}
            className="col-span-1 bg-arome rounded-3xl p-6 flex flex-col justify-between min-h-[200px] group"
          >
            <Cherry className="w-8 h-8 text-white/80" />
            <div>
              <span className="text-white/60 text-xs uppercase tracking-widest">
                {t.categories.aroma}
              </span>
              <p className="text-2xl md:text-3xl font-serif text-white mt-1">1500+</p>
              <p className="text-white/70 text-sm mt-1">
                {lang === 'fr' ? 'arômes alimentaires' : 'food flavors'}
              </p>
              <Link
                to={`/${lang}/catalogue?category=aroma`}
                className="inline-flex items-center text-white/80 hover:text-white text-sm mt-3 group-hover:gap-2 transition-all"
              >
                {lang === 'fr' ? 'Explorer' : 'Explore'}
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
