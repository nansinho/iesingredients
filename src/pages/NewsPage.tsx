import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { SEOHead } from '@/components/SEOHead';
import { ArrowRight, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NewsPageProps {
  lang: Language;
}

const news = [
  { id: '1', title: { fr: 'Lancement nouvelle gamme botaniques', en: 'New botanical range launch' }, date: '2024-12-15', cat: { fr: 'Nouveautés', en: 'News' } },
  { id: '2', title: { fr: 'IES au salon In-Cosmetics 2024', en: 'IES at In-Cosmetics 2024' }, date: '2024-11-28', cat: { fr: 'Événements', en: 'Events' } },
  { id: '3', title: { fr: 'Certification COSMOS pour 50 références', en: 'COSMOS certification for 50 references' }, date: '2024-11-10', cat: { fr: 'Certifications', en: 'Certifications' } },
  { id: '4', title: { fr: 'Tendances 2025', en: '2025 Trends' }, date: '2024-10-25', cat: { fr: 'Tendances', en: 'Trends' } },
];

export const NewsPage = ({ lang }: NewsPageProps) => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Layout lang={lang}>
      <SEOHead
        lang={lang}
        title={lang === 'fr' ? 'Actualités & Tendances - IES Ingredients' : 'News & Trends - IES Ingredients'}
        description={lang === 'fr'
          ? 'Restez informé des dernières actualités, tendances et innovations en ingrédients cosmétiques, parfumerie et arômes alimentaires.'
          : 'Stay informed about the latest news, trends and innovations in cosmetic ingredients, perfumery and food flavors.'}
        type="article"
      />

      {/* Hero Section */}
      <section className="relative bg-forest-950 pt-32 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="container-luxe relative z-10">
          <span className="inline-block text-gold-500 text-sm font-medium uppercase tracking-widest mb-4">
            {lang === 'fr' ? 'Blog' : 'Blog'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            {lang === 'fr' ? 'Actualités' : 'News'}
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-2xl">
            {lang === 'fr' ? 'Nos dernières nouvelles et tendances du secteur.' : 'Our latest news and industry trends.'}
          </p>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="container-luxe">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {news.map((n, i) => (
              <article key={i} className="bg-card border border-border rounded-2xl overflow-hidden group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="aspect-video bg-gradient-to-br from-forest-100 to-gold-100 flex items-center justify-center">
                  <span className="font-serif text-4xl text-forest-600/30">IES</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="outline" className="text-xs">{n.cat[lang]}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{formatDate(n.date)}
                    </span>
                  </div>
                  <h2 className="font-medium text-foreground mb-3 group-hover:text-primary transition-colors">
                    {n.title[lang]}
                  </h2>
                  <Link to={`/${lang}/actualites/${n.id}`} className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                    {lang === 'fr' ? 'Lire' : 'Read'}<ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};
