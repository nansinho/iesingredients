import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Droplets, Cherry } from 'lucide-react';
import { Language, useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';

// Import images
import botanicalsFlat from '@/assets/botanicals-flat.jpg';
import serumCollection from '@/assets/serum-collection.jpg';

interface BentoExpertiseProps {
  lang: Language;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      duration: 0.6
    } 
  },
};

export const BentoExpertise = ({ lang }: BentoExpertiseProps) => {
  const t = useTranslation(lang);

  return (
    <section className="py-24 px-4 bg-forest-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-gold-400 text-sm uppercase tracking-widest font-medium mb-4 block"
          >
            {lang === 'fr' ? 'Notre savoir-faire' : 'Our know-how'}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-4"
          >
            {lang === 'fr' ? 'Notre Expertise' : 'Our Expertise'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/70 text-lg max-w-2xl mx-auto"
          >
            {lang === 'fr'
              ? 'Des ingrédients soigneusement sélectionnés depuis plus de 30 ans'
              : 'Carefully selected ingredients for over 30 years'}
          </motion.p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {/* Large Image Card - Botanicals */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer"
          >
            <motion.img
              src={botanicalsFlat}
              alt="Botanicals"
              className="w-full h-full object-cover min-h-[400px] md:min-h-[500px]"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.7 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <motion.div 
              className="absolute bottom-6 left-6 right-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className="text-gold-400 text-sm uppercase tracking-widest mb-2 block">
                {lang === 'fr' ? 'Naturel' : 'Natural'}
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-white">
                {lang === 'fr' ? 'Ingrédients Botaniques' : 'Botanical Ingredients'}
              </h3>
            </motion.div>
          </motion.div>

          {/* Cosmétique Card - Gold Accent */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            className="col-span-1 bg-forest-800 rounded-3xl p-6 flex flex-col justify-between min-h-[200px] group cursor-pointer border border-forest-700"
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Leaf className="w-8 h-8 text-gold-400" />
            </motion.div>
            <div>
              <span className="text-gold-400/80 text-xs uppercase tracking-widest">
                {t.categories.cosmetic}
              </span>
              <p className="text-2xl md:text-3xl font-serif text-white mt-1">2000+</p>
              <p className="text-white/60 text-sm mt-1">
                {lang === 'fr' ? 'actifs naturels' : 'natural actives'}
              </p>
              <Link
                to={`/${lang}/catalogue?category=cosmetique`}
                className="inline-flex items-center text-gold-400 hover:text-gold-300 text-sm mt-3 group-hover:gap-2 transition-all"
              >
                {lang === 'fr' ? 'Explorer' : 'Explore'}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Parfumerie Card - Gold Accent */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            className="col-span-1 bg-forest-800 rounded-3xl p-6 flex flex-col justify-between min-h-[200px] group cursor-pointer border border-forest-700"
          >
            <motion.div
              whileHover={{ rotate: -10, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Droplets className="w-8 h-8 text-gold-400" />
            </motion.div>
            <div>
              <span className="text-gold-400/80 text-xs uppercase tracking-widest">
                {t.categories.perfume}
              </span>
              <p className="text-2xl md:text-3xl font-serif text-white mt-1">1500+</p>
              <p className="text-white/60 text-sm mt-1">
                {lang === 'fr' ? 'essences rares' : 'rare essences'}
              </p>
              <Link
                to={`/${lang}/catalogue?category=parfum`}
                className="inline-flex items-center text-gold-400 hover:text-gold-300 text-sm mt-3 group-hover:gap-2 transition-all"
              >
                {lang === 'fr' ? 'Explorer' : 'Explore'}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Wide Image Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="col-span-2 md:col-span-1 relative rounded-3xl overflow-hidden group cursor-pointer min-h-[200px]"
          >
            <motion.img
              src={serumCollection}
              alt="Serums"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.6 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <motion.div 
              className="absolute bottom-4 left-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="text-white/90 text-sm font-medium">
                {lang === 'fr' ? 'Collection Sérums' : 'Serum Collection'}
              </span>
            </motion.div>
          </motion.div>

          {/* Arômes Card - Gold Accent */}
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            className="col-span-1 bg-forest-800 rounded-3xl p-6 flex flex-col justify-between min-h-[200px] group cursor-pointer border border-forest-700"
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Cherry className="w-8 h-8 text-gold-400" />
            </motion.div>
            <div>
              <span className="text-gold-400/80 text-xs uppercase tracking-widest">
                {t.categories.aroma}
              </span>
              <p className="text-2xl md:text-3xl font-serif text-white mt-1">1500+</p>
              <p className="text-white/60 text-sm mt-1">
                {lang === 'fr' ? 'arômes alimentaires' : 'food flavors'}
              </p>
              <Link
                to={`/${lang}/catalogue?category=arome`}
                className="inline-flex items-center text-gold-400 hover:text-gold-300 text-sm mt-3 group-hover:gap-2 transition-all"
              >
                {lang === 'fr' ? 'Explorer' : 'Explore'}
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};