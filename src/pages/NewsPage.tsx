import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NewsPageProps {
  lang: Language;
}

const newsArticles = [
  {
    id: 'news-1',
    title: {
      fr: 'Lancement de notre nouvelle gamme d\'extraits botaniques',
      en: 'Launch of our new botanical extracts range',
    },
    excerpt: {
      fr: 'Découvrez notre sélection exclusive d\'extraits botaniques certifiés biologiques, issus des meilleures sources mondiales.',
      en: 'Discover our exclusive selection of certified organic botanical extracts, sourced from the best worldwide origins.',
    },
    date: '2024-12-15',
    category: { fr: 'Nouveautés', en: 'News' },
    image: null,
  },
  {
    id: 'news-2',
    title: {
      fr: 'IES Ingredients au salon In-Cosmetics 2024',
      en: 'IES Ingredients at In-Cosmetics 2024',
    },
    excerpt: {
      fr: 'Retrouvez-nous au salon In-Cosmetics Global à Paris du 16 au 18 avril. Stand B45, Hall 3.',
      en: 'Meet us at In-Cosmetics Global in Paris from April 16-18. Booth B45, Hall 3.',
    },
    date: '2024-11-28',
    category: { fr: 'Événements', en: 'Events' },
    image: null,
  },
  {
    id: 'news-3',
    title: {
      fr: 'Nouvelle certification COSMOS pour 50 de nos références',
      en: 'New COSMOS certification for 50 of our references',
    },
    excerpt: {
      fr: 'Nous sommes fiers d\'annoncer l\'obtention de la certification COSMOS pour 50 nouvelles références de notre catalogue.',
      en: 'We are proud to announce the COSMOS certification for 50 new references in our catalog.',
    },
    date: '2024-11-10',
    category: { fr: 'Certifications', en: 'Certifications' },
    image: null,
  },
  {
    id: 'news-4',
    title: {
      fr: 'Tendances 2025 : Les ingrédients qui feront la différence',
      en: '2025 Trends: The ingredients that will make a difference',
    },
    excerpt: {
      fr: 'Notre équipe R&D partage ses prédictions sur les ingrédients qui domineront le marché cosmétique en 2025.',
      en: 'Our R&D team shares its predictions on the ingredients that will dominate the cosmetic market in 2025.',
    },
    date: '2024-10-25',
    category: { fr: 'Tendances', en: 'Trends' },
    image: null,
  },
];

export const NewsPage = ({ lang }: NewsPageProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Layout lang={lang}>
      <Helmet>
        <title>
          {lang === 'fr' ? 'Actualités - IES Ingredients' : 'News - IES Ingredients'}
        </title>
        <meta
          name="description"
          content={
            lang === 'fr'
              ? 'Suivez les dernières actualités d\'IES Ingredients : nouveaux produits, événements, certifications et tendances du marché.'
              : 'Follow the latest news from IES Ingredients: new products, events, certifications and market trends.'
          }
        />
        <html lang={lang} />
      </Helmet>

      <div className="pt-28 pb-20">
        <div className="container">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              {lang === 'fr' ? 'Actualités' : 'News'}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4 animate-fade-in-up">
              {lang === 'fr' ? 'Nos dernières actualités' : 'Our latest news'}
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in-up stagger-1">
              {lang === 'fr'
                ? 'Restez informé des dernières nouveautés, événements et tendances du secteur.'
                : 'Stay informed about the latest news, events and industry trends.'}
            </p>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {newsArticles.map((article, index) => (
              <article
                key={article.id}
                className="group bg-card border border-border rounded-2xl overflow-hidden hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image placeholder */}
                <div className="aspect-video bg-gradient-nature relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-6xl font-bold text-primary/10">
                      IES
                    </span>
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category and Date */}
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="outline" className="text-xs">
                      {article.category[lang]}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(article.date)}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title[lang]}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {article.excerpt[lang]}
                  </p>

                  {/* Link */}
                  <Link
                    to={`/${lang}/actualites/${article.id}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 group/link"
                  >
                    {lang === 'fr' ? 'Lire la suite' : 'Read more'}
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
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
