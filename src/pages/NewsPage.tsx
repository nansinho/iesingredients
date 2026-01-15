import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { SEOHead } from '@/components/SEOHead';
import { ArrowRight, Calendar, Tag, Search, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

interface NewsPageProps {
  lang: Language;
}

interface BlogArticle {
  id: string;
  title_fr: string;
  title_en: string | null;
  slug: string;
  excerpt_fr: string | null;
  excerpt_en: string | null;
  cover_image_url: string | null;
  category: string;
  author_name: string | null;
  published_at: string | null;
  created_at: string;
}

const categoryConfig: Record<string, { label: { fr: string; en: string }; color: string }> = {
  news: { label: { fr: 'Nouveautés', en: 'News' }, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  events: { label: { fr: 'Événements', en: 'Events' }, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  certifications: { label: { fr: 'Certifications', en: 'Certifications' }, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  trends: { label: { fr: 'Tendances', en: 'Trends' }, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
};

export const NewsPage = ({ lang }: NewsPageProps) => {
  const location = useLocation();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const filteredArticles = articles.filter(article => {
    const title = lang === 'fr' ? article.title_fr : (article.title_en || article.title_fr);
    const excerpt = lang === 'fr' ? article.excerpt_fr : (article.excerpt_en || article.excerpt_fr);
    const matchesSearch = !searchQuery || 
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (excerpt && excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Object.keys(categoryConfig);

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
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-forest-400 rounded-full blur-3xl" />
        </div>
        <div className="container-luxe relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-gold-500 text-sm font-medium uppercase tracking-widest mb-4">
              <Sparkles className="w-4 h-4" />
              {lang === 'fr' ? 'Notre Blog' : 'Our Blog'}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              {lang === 'fr' ? 'Actualités & Tendances' : 'News & Trends'}
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl">
              {lang === 'fr' 
                ? 'Découvrez les dernières innovations, événements et tendances du secteur des ingrédients naturels.' 
                : 'Discover the latest innovations, events and trends in the natural ingredients sector.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-muted/30 border-b border-border/50 py-6 sticky top-[72px] z-30 backdrop-blur-sm">
        <div className="container-luxe">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={lang === 'fr' ? 'Rechercher un article...' : 'Search articles...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? 'bg-forest-600 hover:bg-forest-700' : ''}
              >
                {lang === 'fr' ? 'Tous' : 'All'}
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? 'bg-forest-600 hover:bg-forest-700' : ''}
                >
                  {categoryConfig[cat].label[lang]}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="bg-background py-16">
        <div className="container-luxe">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video rounded-2xl" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <Tag className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium mb-2">
                {lang === 'fr' ? 'Aucun article trouvé' : 'No articles found'}
              </h3>
              <p className="text-muted-foreground">
                {lang === 'fr' 
                  ? 'Essayez de modifier vos critères de recherche.' 
                  : 'Try adjusting your search criteria.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => {
                const title = lang === 'fr' ? article.title_fr : (article.title_en || article.title_fr);
                const excerpt = lang === 'fr' ? article.excerpt_fr : (article.excerpt_en || article.excerpt_fr);
                const category = categoryConfig[article.category] || categoryConfig.news;

                return (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/${lang}/actualites/${article.slug}`} className="block">
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-forest-100 to-gold-100 dark:from-forest-900 dark:to-forest-800 mb-4">
                        {article.cover_image_url ? (
                          <img
                            src={article.cover_image_url}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="font-serif text-5xl text-forest-600/20 dark:text-forest-400/20">
                              IES
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge className={category.color}>
                            {category.label[lang]}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(article.published_at)}
                          </span>
                        </div>
                        <h2 className="font-serif text-xl font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {title}
                        </h2>
                        {excerpt && (
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {excerpt}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                          {lang === 'fr' ? 'Lire l\'article' : 'Read article'}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};
