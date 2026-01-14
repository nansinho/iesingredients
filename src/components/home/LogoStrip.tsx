import { motion } from 'framer-motion';
import { Language } from '@/lib/i18n';

interface LogoStripProps {
  lang: Language;
}

const certifications = [
  { name: 'COSMOS', subtitle: 'CERTIFIED' },
  { name: 'ECOCERT', subtitle: 'ORGANIC' },
  { name: 'BIO', subtitle: 'CERTIFIED' },
  { name: 'VEGAN', subtitle: 'FRIENDLY' },
  { name: 'ISO 9001', subtitle: 'QUALITY' },
];

export const LogoStrip = ({ lang }: LogoStripProps) => {
  return (
    <section className="py-12 bg-cream-50 border-t border-cream-200">
      <div className="max-w-7xl mx-auto px-4">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8"
        >
          {lang === 'fr' ? 'Nos certifications' : 'Our certifications'}
        </motion.p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex flex-col items-center group cursor-default"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-forest-900 flex items-center justify-center mb-2 group-hover:bg-forest-800 transition-colors duration-300">
                <span className="text-lg md:text-xl font-bold text-gold-400">
                  {cert.name.charAt(0)}
                </span>
              </div>
              <span className="text-sm font-medium text-forest-900">{cert.name}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {cert.subtitle}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};