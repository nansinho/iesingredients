import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Instagram } from 'lucide-react';
import { Language, useTranslation } from '@/lib/i18n';

interface FooterProps {
  lang: Language;
}

export const Footer = ({ lang }: FooterProps) => {
  const t = useTranslation(lang);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to={`/${lang}`} className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="font-display font-bold text-xl">IES</span>
              </div>
              <span className="font-display text-2xl font-semibold">
                IES Ingredients
              </span>
            </Link>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-6">
              {lang === 'fr'
                ? 'Spécialiste des ingrédients cosmétiques, parfums et arômes alimentaires depuis plus de 30 ans.'
                : 'Specialist in cosmetic ingredients, perfumes and food flavors for over 30 years.'}
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to={`/${lang}/entreprise`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {t.nav.company}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${lang}/catalogue`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {t.nav.catalog}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${lang}/equipe`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {t.nav.team}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${lang}/actualites`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {t.nav.news}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${lang}/contact`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              {t.filters.category}
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to={`/${lang}/catalogue?category=cosmetic`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {t.categories.cosmetic}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${lang}/catalogue?category=perfume`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {t.categories.perfume}
                </Link>
              </li>
              <li>
                <Link
                  to={`/${lang}/catalogue?category=aroma`}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  {t.categories.aroma}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg font-semibold mb-6">
              {t.nav.contact}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-accent" />
                <span className="text-primary-foreground/80 text-sm">
                  123 Avenue des Parfums<br />
                  06000 Nice, France
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent" />
                <a
                  href="tel:+33493000000"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                >
                  +33 4 93 00 00 00
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <a
                  href="mailto:contact@ies-ingredients.com"
                  className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm"
                >
                  contact@ies-ingredients.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} IES Ingredients. {t.footer.rights}.
          </p>
          <div className="flex gap-6">
            <Link
              to={`/${lang}/privacy`}
              className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors"
            >
              {t.footer.privacy}
            </Link>
            <Link
              to={`/${lang}/terms`}
              className="text-primary-foreground/60 hover:text-primary-foreground text-sm transition-colors"
            >
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
