import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { Link } from 'react-router-dom';
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
  const formatDate = (d: string) => new Date(d).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>{lang === 'fr' ? 'Actualités - IES Ingredients' : 'News - IES Ingredients'}</title>
        <html lang={lang} />
      </Helmet>

      <div className="pt-24 pb-16">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl text-foreground mb-4">
              {lang === 'fr' ? 'Actualités' : 'News'}
            </h1>
            <p className="text-muted-foreground">{lang === 'fr' ? 'Nos dernières nouvelles.' : 'Our latest updates.'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {news.map((n, i) => (
              <article key={i} className="bg-card border border-border rounded-lg overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-secondary/30 flex items-center justify-center">
                  <span className="font-serif text-4xl text-muted-foreground/20">IES</span>
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
      </div>
    </Layout>
  );
};
