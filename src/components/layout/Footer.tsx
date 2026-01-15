import * as React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Language, useTranslation } from '@/lib/i18n';

interface FooterProps {
  lang: Language;
}

export const Footer = React.forwardRef<HTMLElement, FooterProps>(({ lang }, ref) => {
  const t = useTranslation(lang);
  const currentYear = new Date().getFullYear();

  return (
    <footer ref={ref} className="bg-forest-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to={`/${lang}`} className="inline-block mb-4">
              <span className="font-serif text-2xl font-semibold text-white">IES Ingredients</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              {lang === 'fr'
                ? 'Votre partenaire pour les ingrédients cosmétiques, parfums et arômes depuis plus de 30 ans.'
                : 'Your partner for cosmetic ingredients, perfumes and flavors for over 30 years.'}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium mb-4 text-white text-sm uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to={`/${lang}/catalogue`} className="text-white/60 hover:text-gold-400 transition-colors">{t.nav.catalog}</Link></li>
              <li><Link to={`/${lang}/entreprise`} className="text-white/60 hover:text-gold-400 transition-colors">{t.nav.company}</Link></li>
              <li><Link to={`/${lang}/equipe`} className="text-white/60 hover:text-gold-400 transition-colors">{t.nav.team}</Link></li>
              <li><Link to={`/${lang}/actualites`} className="text-white/60 hover:text-gold-400 transition-colors">{t.nav.news}</Link></li>
              <li><Link to={`/${lang}/podcast`} className="text-white/60 hover:text-gold-400 transition-colors">{t.nav.podcast}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4 text-white text-sm uppercase tracking-widest">{t.nav.contact}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-gold-500 shrink-0" />
                <span className="text-white/60">Nice, France</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="tel:+33493000000" className="text-white/60 hover:text-gold-400 transition-colors">+33 4 93 00 00 00</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-500 shrink-0" />
                <a href="mailto:contact@ies-ingredients.com" className="text-white/60 hover:text-gold-400 transition-colors">contact@ies-ingredients.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>© {currentYear} IES Ingredients. {t.footer.rights}.</p>
          <div className="flex gap-6">
            <Link to={`/${lang}/privacy`} className="hover:text-gold-400 transition-colors">{t.footer.privacy}</Link>
            <Link to={`/${lang}/terms`} className="hover:text-gold-400 transition-colors">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
});
Footer.displayName = 'Footer';
