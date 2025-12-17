import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Language, useTranslation } from '@/lib/i18n';

interface FooterProps {
  lang: Language;
}

export const Footer = ({ lang }: FooterProps) => {
  const t = useTranslation(lang);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to={`/${lang}`} className="inline-block mb-4">
              <span className="font-serif text-2xl font-semibold">IES Ingredients</span>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              {lang === 'fr'
                ? 'Votre partenaire pour les ingrédients cosmétiques, parfums et arômes depuis plus de 30 ans.'
                : 'Your partner for cosmetic ingredients, perfumes and flavors for over 30 years.'}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to={`/${lang}/catalogue`} className="text-background/70 hover:text-background transition-colors">{t.nav.catalog}</Link></li>
              <li><Link to={`/${lang}/entreprise`} className="text-background/70 hover:text-background transition-colors">{t.nav.company}</Link></li>
              <li><Link to={`/${lang}/equipe`} className="text-background/70 hover:text-background transition-colors">{t.nav.team}</Link></li>
              <li><Link to={`/${lang}/actualites`} className="text-background/70 hover:text-background transition-colors">{t.nav.news}</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium mb-4">{t.filters.category}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to={`/${lang}/catalogue?category=cosmetic`} className="text-background/70 hover:text-background transition-colors">{t.categories.cosmetic}</Link></li>
              <li><Link to={`/${lang}/catalogue?category=perfume`} className="text-background/70 hover:text-background transition-colors">{t.categories.perfume}</Link></li>
              <li><Link to={`/${lang}/catalogue?category=aroma`} className="text-background/70 hover:text-background transition-colors">{t.categories.aroma}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4">{t.nav.contact}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-background/50" />
                <span className="text-background/70">Nice, France</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-background/50" />
                <a href="tel:+33493000000" className="text-background/70 hover:text-background transition-colors">+33 4 93 00 00 00</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-background/50" />
                <a href="mailto:contact@ies-ingredients.com" className="text-background/70 hover:text-background transition-colors">contact@ies-ingredients.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
          <p>© {currentYear} IES Ingredients. {t.footer.rights}.</p>
          <div className="flex gap-6">
            <Link to={`/${lang}/privacy`} className="hover:text-background transition-colors">{t.footer.privacy}</Link>
            <Link to={`/${lang}/terms`} className="hover:text-background transition-colors">{t.footer.terms}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
