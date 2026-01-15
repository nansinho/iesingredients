import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Save, Eye, Image as ImageIcon } from 'lucide-react';

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
  published: boolean;
}

const categories = [
  { value: 'news', label: 'Nouveautés' },
  { value: 'events', label: 'Événements' },
  { value: 'certifications', label: 'Certifications' },
  { value: 'trends', label: 'Tendances' },
];

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const BlogEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<Partial<BlogArticle>>({
    title_fr: '',
    title_en: '',
    slug: '',
    excerpt_fr: '',
    excerpt_en: '',
    content_fr: '',
    content_en: '',
    cover_image_url: '',
    category: 'news',
    author_name: 'IES Ingredients',
    published: false,
  });

  const { data: article, isLoading } = useQuery({
    queryKey: ['admin-blog-article', id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase
        .from('blog_articles')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as BlogArticle;
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (article) {
      setFormData(article);
    }
  }, [article]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<BlogArticle>) => {
      const payload = {
        ...data,
        published_at: data.published ? new Date().toISOString() : null,
      };

      if (isNew) {
        const { error } = await supabase.from('blog_articles').insert([payload as any]);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('blog_articles')
          .update(payload)
          .eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-articles'] });
      toast.success(isNew ? 'Article créé' : 'Article mis à jour');
      navigate('/admin/blog');
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast.error('Erreur lors de l\'enregistrement');
    },
  });

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title_fr: value,
      slug: isNew ? generateSlug(value) : prev.slug,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title_fr || !formData.slug) {
      toast.error('Le titre et le slug sont requis');
      return;
    }
    saveMutation.mutate(formData);
  };

  if (!isNew && isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/blog')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <AdminPageHeader
          title={isNew ? 'Nouvel article' : 'Modifier l\'article'}
          subtitle={isNew ? 'Créez un nouvel article de blog' : formData.title_fr}
        />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu français</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title_fr">Titre *</Label>
                <Input
                  id="title_fr"
                  value={formData.title_fr}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Titre de l'article"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-de-l-article"
                  className="font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt_fr">Extrait</Label>
                <Textarea
                  id="excerpt_fr"
                  value={formData.excerpt_fr || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt_fr: e.target.value }))}
                  placeholder="Résumé court de l'article (affiché dans les listes)"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content_fr">Contenu</Label>
                <Textarea
                  id="content_fr"
                  value={formData.content_fr || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, content_fr: e.target.value }))}
                  placeholder="Contenu complet de l'article..."
                  rows={12}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contenu anglais (optionnel)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title_en">Titre anglais</Label>
                <Input
                  id="title_en"
                  value={formData.title_en || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title_en: e.target.value }))}
                  placeholder="Article title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt_en">Extrait anglais</Label>
                <Textarea
                  id="excerpt_en"
                  value={formData.excerpt_en || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt_en: e.target.value }))}
                  placeholder="Short article summary"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content_en">Contenu anglais</Label>
                <Textarea
                  id="content_en"
                  value={formData.content_en || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, content_en: e.target.value }))}
                  placeholder="Full article content..."
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published">Publier l'article</Label>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={saveMutation.isPending}>
                  <Save className="w-4 h-4 mr-2" />
                  {saveMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
                {!isNew && formData.published && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.open(`/fr/actualites/${formData.slug}`, '_blank')}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paramètres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Catégorie</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="author_name">Auteur</Label>
                <Input
                  id="author_name"
                  value={formData.author_name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                  placeholder="Nom de l'auteur"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Image de couverture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.cover_image_url}
                onChange={(url) => setFormData(prev => ({ ...prev, cover_image_url: url }))}
                folder="blog"
              />
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};
