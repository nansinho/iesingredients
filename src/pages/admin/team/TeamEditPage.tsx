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
import { toast } from 'sonner';
import { ArrowLeft, Save, User, Image as ImageIcon } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role_fr: string;
  role_en: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  photo_url: string | null;
  bio_fr: string | null;
  bio_en: string | null;
  display_order: number;
  is_active: boolean;
}

export const TeamEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    role_fr: '',
    role_en: '',
    email: '',
    phone: '',
    linkedin_url: '',
    photo_url: '',
    bio_fr: '',
    bio_en: '',
    display_order: 0,
    is_active: true,
  });

  const { data: member, isLoading } = useQuery({
    queryKey: ['admin-team-member', id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as TeamMember;
    },
    enabled: !isNew,
  });

  const { data: maxOrder } = useQuery({
    queryKey: ['max-team-order'],
    queryFn: async () => {
      const { data } = await supabase
        .from('team_members')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);
      return data?.[0]?.display_order || 0;
    },
    enabled: isNew,
  });

  useEffect(() => {
    if (member) {
      setFormData(member);
    }
  }, [member]);

  useEffect(() => {
    if (isNew && maxOrder !== undefined) {
      setFormData(prev => ({ ...prev, display_order: maxOrder + 1 }));
    }
  }, [isNew, maxOrder]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<TeamMember>) => {
      if (isNew) {
        const { error } = await supabase.from('team_members').insert(data);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('team_members')
          .update(data)
          .eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-team-members'] });
      toast.success(isNew ? 'Membre ajouté' : 'Membre mis à jour');
      navigate('/admin/equipe');
    },
    onError: (error) => {
      console.error('Save error:', error);
      toast.error('Erreur lors de l\'enregistrement');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role_fr) {
      toast.error('Le nom et le rôle sont requis');
      return;
    }
    saveMutation.mutate(formData);
  };

  if (!isNew && isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/equipe')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <AdminPageHeader
          title={isNew ? 'Nouveau membre' : 'Modifier le membre'}
          subtitle={isNew ? 'Ajoutez un membre à l\'équipe' : formData.name}
        />
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Informations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Sophie Martin"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="display_order">Ordre d'affichage</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role_fr">Rôle (FR) *</Label>
                  <Input
                    id="role_fr"
                    value={formData.role_fr}
                    onChange={(e) => setFormData(prev => ({ ...prev, role_fr: e.target.value }))}
                    placeholder="Directrice Générale"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role_en">Rôle (EN)</Label>
                  <Input
                    id="role_en"
                    value={formData.role_en || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, role_en: e.target.value }))}
                    placeholder="General Director"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="sophie.martin@ies.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+33 4 92 61 06 80"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  value={formData.linkedin_url || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                  placeholder="https://linkedin.com/in/sophie-martin"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Biographie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio_fr">Bio (FR)</Label>
                <Textarea
                  id="bio_fr"
                  value={formData.bio_fr || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio_fr: e.target.value }))}
                  placeholder="Courte biographie en français..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio_en">Bio (EN)</Label>
                <Textarea
                  id="bio_en"
                  value={formData.bio_en || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio_en: e.target.value }))}
                  placeholder="Short biography in English..."
                  rows={3}
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
                <Label htmlFor="is_active">Membre actif</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Les membres inactifs ne sont pas affichés sur le site.
              </p>
              <Button type="submit" className="w-full" disabled={saveMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                {saveMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Photo de profil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                currentImageUrl={formData.photo_url || undefined}
                onImageUploaded={(url) => setFormData(prev => ({ ...prev, photo_url: url }))}
                onImageRemoved={() => setFormData(prev => ({ ...prev, photo_url: null }))}
                folder="team"
              />
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};
