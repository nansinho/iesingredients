import { Link } from 'react-router-dom';
import { ArrowRight, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Language } from '@/lib/i18n';
import { motion } from 'framer-motion';

interface MinimalCTAProps {
  lang: Language;
}

export const MinimalCTA = ({ lang }: MinimalCTAProps) => {
  return (
    <section className="py-24 px-4 bg-navy-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-6">
          {lang === 'fr'
            ? 'Prêt à découvrir nos ingrédients ?'
            : 'Ready to discover our ingredients?'}
        </h2>
        <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
          {lang === 'fr'
            ? 'Contactez notre équipe pour une consultation personnalisée ou parcourez notre catalogue.'
            : 'Contact our team for a personalized consultation or browse our catalog.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gold-500 hover:bg-gold-600 text-navy-900 rounded-full px-8"
          >
            <Link to={`/${lang}/contact`}>
              <Mail className="w-4 h-4 mr-2" />
              {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 rounded-full px-8"
          >
            <Link to={`/${lang}/catalogue`}>
              {lang === 'fr' ? 'Voir le catalogue' : 'View catalog'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
};
