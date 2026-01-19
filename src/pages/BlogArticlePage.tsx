import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Language } from '@/lib/i18n';
import { SEOHead } from '@/components/SEOHead';
import { ArrowLeft, Calendar, User, Tag, Share2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface BlogArticlePageProps {
  lang: Language;
}

interface BlogArticle {
  id: string;
  title_fr: string;
  title_en: string | null;
  slug: string;
  excerpt_fr: string | null;
  excerpt_en: string | null;
  content_fr: string | null;
  content_en: string | null;
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

export const BlogArticlePage = ({ lang }: BlogArticlePageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      
      if (!data) {
        navigate(`/${lang}/actualites`);
        return;
      }

      setArticle(data);

      // Fetch related articles
      const { data: related } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('published', true)
        .eq('category', data.category)
        .neq('id', data.id)
        .limit(3);

      setRelatedArticles(related || []);
    } catch (error) {
      console.error('Error fetching article:', error);
      navigate(`/${lang}/actualites`);
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

  const handleShare = async () => {
    try {
      await navigator.share({
        title: article ? (lang === 'fr' ? article.title_fr : (article.title_en || article.title_fr)) : '',
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success(lang === 'fr' ? 'Lien copié !' : 'Link copied!');
    }
  };

  if (loading) {
    return (
      <Layout lang={lang}>
        <section className="bg-forest-950 pt-32 pb-16">
          <div className="container-luxe">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </section>
        <section className="bg-background py-16">
          <div className="container-luxe max-w-4xl">
            <Skeleton className="h-64 w-full mb-8 rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!article) return null;

  const title = lang === 'fr' ? article.title_fr : (article.title_en || article.title_fr);
  const content = lang === 'fr' ? article.content_fr : (article.content_en || article.content_fr);
  const excerpt = lang === 'fr' ? article.excerpt_fr : (article.excerpt_en || article.excerpt_fr);
  const category = categoryConfig[article.category] || categoryConfig.news;

  return (
    <Layout lang={lang}>
      <SEOHead
        lang={lang}
        title={`${title} - IES Ingredients`}
        description={excerpt || ''}
        type="article"
      />

      {/* Hero Section */}
      <section className="relative bg-forest-950 pt-32 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
        </div>
        <div className="container-luxe relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              to={`/${lang}/actualites`}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {lang === 'fr' ? 'Retour aux actualités' : 'Back to news'}
            </Link>
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge className={category.color}>
                <Tag className="w-3 h-3 mr-1" />
                {category.label[lang]}
              </Badge>
              <span className="text-white/60 flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                {formatDate(article.published_at)}
              </span>
              {article.author_name && (
                <span className="text-white/60 flex items-center gap-2 text-sm">
                  <User className="w-4 h-4" />
                  {article.author_name}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4 max-w-4xl">
              {title}
            </h1>
            
            {excerpt && (
              <p className="text-white/70 text-lg max-w-2xl">
                {excerpt}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-background py-16">
        <div className="container-luxe">
          <div className="max-w-4xl mx-auto">
            {article.cover_image_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl"
              >
                <img
                  src={article.cover_image_url}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              {content ? (
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {content}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  {lang === 'fr' ? 'Contenu à venir...' : 'Content coming soon...'}
                </p>
              )}
            </motion.div>

            {/* Share Button */}
            <div className="mt-12 pt-8 border-t border-forest-100">
              <Button variant="outline" onClick={handleShare} className="gap-2">
                <Share2 className="w-4 h-4" />
                {lang === 'fr' ? 'Partager cet article' : 'Share this article'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-muted/30 py-16">
          <div className="container-luxe">
            <h2 className="font-serif text-2xl sm:text-3xl mb-8">
              {lang === 'fr' ? 'Articles similaires' : 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((related) => {
                const relTitle = lang === 'fr' ? related.title_fr : (related.title_en || related.title_fr);
                
                return (
                  <Link
                    key={related.id}
                    to={`/${lang}/actualites/${related.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-forest-100 to-gold-100 dark:from-forest-900 dark:to-forest-800 mb-4">
                      {related.cover_image_url ? (
                        <img
                          src={related.cover_image_url}
                          alt={relTitle}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-serif text-3xl text-forest-600/20">IES</span>
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {relTitle}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-sm text-primary mt-2">
                      {lang === 'fr' ? 'Lire' : 'Read'}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};
