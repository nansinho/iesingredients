import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Clock, Users } from 'lucide-react';
import { Language, useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';

import leavesHero from '@/assets/leaves-hero.jpg';

interface MinimalAboutProps {
  lang: Language;
}

const features = [
  {
    icon: Shield,
    titleFr: 'Éthique',
    titleEn: 'Ethical',
    descFr: 'Sourcing responsable',
    descEn: 'Responsible sourcing',
  },
  {
    icon: Award,
    titleFr: 'Certifié',
    titleEn: 'Certified',
    descFr: 'ISO, COSMOS, BIO',
    descEn: 'ISO, COSMOS, BIO',
  },
  {
    icon: Clock,
    titleFr: 'Rapide',
    titleEn: 'Fast',
    descFr: 'Livraison 48h',
    descEn: '48h Delivery',
  },
  {
    icon: Users,
    titleFr: 'Expert',
    titleEn: 'Expert',
    descFr: 'Conseil personnalisé',
    descEn: 'Personalized advice',
  },
];

export const MinimalAbout = ({ lang }: MinimalAboutProps) => {
  const t = useTranslation(lang);

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={leavesHero}
                alt="Natural ingredients"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-forest-900 rounded-2xl shadow-xl p-6 border border-forest-700"
            >
              <p className="text-4xl md:text-5xl font-serif text-gold-400">30+</p>
              <p className="text-white/70 text-sm mt-1">
                {lang === 'fr' ? "ans d'expertise" : 'years of expertise'}
              </p>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-gold-600 text-sm uppercase tracking-widest font-medium">
              {lang === 'fr' ? 'À propos' : 'About us'}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-forest-900 mt-4 mb-6">
              {lang === 'fr' ? 'Notre Engagement' : 'Our Commitment'}
            </h2>
            <p className="text-forest-700 text-lg leading-relaxed mb-8">
              {lang === 'fr'
                ? "Depuis 1994, nous sélectionnons les meilleurs ingrédients naturels pour l'industrie cosmétique, la parfumerie et l'agroalimentaire. Notre expertise et notre réseau mondial nous permettent de vous offrir des produits d'exception."
                : 'Since 1994, we have been selecting the finest natural ingredients for the cosmetic industry, perfumery and food industry. Our expertise and global network allow us to offer you exceptional products.'}
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.titleFr}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-forest-50 hover:bg-forest-100 transition-colors border border-forest-100"
                >
                  <feature.icon className="w-5 h-5 text-gold-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-forest-900">
                      {lang === 'fr' ? feature.titleFr : feature.titleEn}
                    </p>
                    <p className="text-sm text-forest-600">
                      {lang === 'fr' ? feature.descFr : feature.descEn}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              to={`/${lang}/entreprise`}
              className="inline-flex items-center gap-2 text-forest-900 font-medium hover:gap-3 hover:text-gold-600 transition-all group"
            >
              {lang === 'fr' ? 'Découvrir notre histoire' : 'Discover our story'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
