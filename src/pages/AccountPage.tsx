import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Language } from '@/lib/i18n';
import { SEOHead } from '@/components/SEOHead';
import {
  User,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Loader2,
  Save,
  LogOut,
  Building,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';

interface AccountPageProps {
  lang: Language;
}

interface SampleRequestItem {
  id: string;
  product_code: string;
  product_name: string;
  product_category: string | null;
  quantity: number;
}

interface SampleRequest {
  id: string;
  status: string;
  company: string | null;
  message: string | null;
  created_at: string;
  items: SampleRequestItem[];
}

const statusConfig: Record<string, { label: string; labelEn: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'En attente', labelEn: 'Pending', icon: Clock, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  processing: { label: 'En cours', labelEn: 'Processing', icon: Package, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  shipped: { label: 'Expédiée', labelEn: 'Shipped', icon: Truck, color: 'bg-violet-100 text-violet-700 border-violet-200' },
  delivered: { label: 'Livrée', labelEn: 'Delivered', icon: CheckCircle, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Annulée', labelEn: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-700 border-red-200' },
};

export const AccountPage = ({ lang }: AccountPageProps) => {
  const { user, profile, signOut, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [requests, setRequests] = useState<SampleRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    company: '',
    phone: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        company: profile.company || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;
    
    try {
      const { data: requestsData, error: requestsError } = await supabase
        .from('sample_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      const requestsWithItems: SampleRequest[] = await Promise.all(
        (requestsData || []).map(async (request: any) => {
          const { data: items } = await supabase
            .from('sample_request_items')
            .select('*')
            .eq('request_id', request.id);

          return {
            id: request.id,
            status: request.status,
            company: request.company,
            message: request.message,
            created_at: request.created_at,
            items: (items || []).map((item: any) => ({
              id: item.id,
              product_code: item.product_code,
              product_name: item.product_name,
              product_category: item.product_category,
              quantity: item.quantity,
            })),
          };
        })
      );

      setRequests(requestsWithItems);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          company: formData.company,
          phone: formData.phone,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(lang === 'fr' ? 'Profil mis à jour avec succès' : 'Profile updated successfully');
    } catch (error: any) {
      toast.error(lang === 'fr' ? 'Erreur lors de la mise à jour' : 'Error updating profile', {
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success(lang === 'fr' ? 'Déconnexion réussie' : 'Signed out successfully');
    navigate(`/${lang}`);
  };

  if (authLoading) {
    return (
      <Layout lang={lang}>
        <div className="min-h-[60vh] flex items-center justify-center bg-background">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-muted-foreground">{lang === 'fr' ? 'Chargement...' : 'Loading...'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    navigate(`/${lang}/login`);
    return null;
  }

  const userInitials = formData.full_name
    ? formData.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <Layout lang={lang}>
      <SEOHead
        lang={lang}
        title={lang === 'fr' ? 'Mon Compte - IES Ingredients' : 'My Account - IES Ingredients'}
        description={lang === 'fr' ? 'Gérez votre profil et suivez vos demandes d\'échantillons.' : 'Manage your profile and track your sample requests.'}
      />

      {/* Hero Section */}
      <section className="relative bg-forest-950 pt-32 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="container-luxe relative z-10">
          <div className="flex items-center gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-xl"
            >
              <span className="font-serif text-2xl sm:text-3xl text-forest-950 font-medium">
                {userInitials}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block text-gold-500 text-sm font-medium uppercase tracking-widest mb-2">
                {lang === 'fr' ? 'Bienvenue' : 'Welcome'}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white">
                {formData.full_name || user?.email?.split('@')[0]}
              </h1>
              {formData.company && (
                <p className="text-white/60 mt-1">{formData.company}</p>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 sm:py-16 bg-background">
        <div className="container-luxe">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="bg-card border border-forest-100 p-1.5 rounded-xl inline-flex">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-5 py-2.5 transition-all"
              >
                <User className="h-4 w-4 mr-2" />
                {lang === 'fr' ? 'Profil' : 'Profile'}
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-5 py-2.5 transition-all"
              >
                <Package className="h-4 w-4 mr-2" />
                {lang === 'fr' ? 'Mes demandes' : 'My requests'}
                {requests.length > 0 && (
                  <Badge className="ml-2 bg-gold-500 text-forest-950 hover:bg-gold-600">{requests.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Profile Form */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="lg:col-span-2"
                >
                  <Card className="border-forest-100 shadow-sm">
                    <CardHeader className="border-b border-forest-100">
                      <CardTitle className="font-serif text-xl">
                        {lang === 'fr' ? 'Informations personnelles' : 'Personal information'}
                      </CardTitle>
                      <CardDescription>
                        {lang === 'fr' ? 'Mettez à jour vos informations de contact' : 'Update your contact information'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="full_name">{lang === 'fr' ? 'Nom complet' : 'Full name'}</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="full_name"
                                value={formData.full_name}
                                onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                                className="pl-10 h-11"
                                placeholder="Jean Dupont"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="email"
                                value={user?.email || ''}
                                disabled
                                className="pl-10 h-11 bg-muted"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="company">{lang === 'fr' ? 'Entreprise' : 'Company'}</Label>
                            <div className="relative">
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="company"
                                value={formData.company}
                                onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                                className="pl-10 h-11"
                                placeholder={lang === 'fr' ? 'Votre entreprise' : 'Your company'}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">{lang === 'fr' ? 'Téléphone' : 'Phone'}</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                                className="pl-10 h-11"
                                placeholder="+33 1 23 45 67 89"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-forest-100">
                          <Button type="submit" disabled={isUpdating} size="lg">
                            {isUpdating ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                {lang === 'fr' ? 'Enregistrement...' : 'Saving...'}
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                {lang === 'fr' ? 'Enregistrer' : 'Save changes'}
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Sidebar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-6"
                >
                  {/* Quick Actions */}
                  <Card className="border-forest-100 shadow-sm">
                    <CardHeader>
                      <CardTitle className="font-serif text-lg">
                        {lang === 'fr' ? 'Actions rapides' : 'Quick actions'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-start h-11" asChild>
                        <Link to={`/${lang}/catalogue`}>
                          <ShoppingBag className="h-4 w-4 mr-3" />
                          {lang === 'fr' ? 'Parcourir le catalogue' : 'Browse catalog'}
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start h-11" asChild>
                        <Link to={`/${lang}/contact`}>
                          <Mail className="h-4 w-4 mr-3" />
                          {lang === 'fr' ? 'Nous contacter' : 'Contact us'}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Logout */}
                  <Card className="border-forest-100 shadow-sm">
                    <CardContent className="pt-6">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-11"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        {lang === 'fr' ? 'Déconnexion' : 'Sign out'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            {/* Requests Tab */}
            <TabsContent value="requests">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-forest-100 shadow-sm">
                  <CardHeader className="border-b border-forest-100">
                    <CardTitle className="font-serif text-xl">
                      {lang === 'fr' ? 'Historique des demandes' : 'Request history'}
                    </CardTitle>
                    <CardDescription>
                      {lang === 'fr' ? 'Suivez le statut de vos demandes d\'échantillons' : 'Track the status of your sample requests'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {loadingRequests ? (
                      <div className="py-16 text-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                        <p className="mt-4 text-muted-foreground">{lang === 'fr' ? 'Chargement...' : 'Loading...'}</p>
                      </div>
                    ) : requests.length === 0 ? (
                      <div className="py-16 text-center">
                        <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <Sparkles className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">
                          {lang === 'fr' ? 'Aucune demande pour le moment' : 'No requests yet'}
                        </h3>
                        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                          {lang === 'fr' 
                            ? 'Explorez notre catalogue et ajoutez des produits pour demander des échantillons.'
                            : 'Explore our catalog and add products to request samples.'}
                        </p>
                        <Button asChild size="lg">
                          <Link to={`/${lang}/catalogue`}>
                            {lang === 'fr' ? 'Explorer le catalogue' : 'Explore catalog'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {requests.map((request, index) => {
                          const status = statusConfig[request.status] || statusConfig.pending;
                          const StatusIcon = status.icon;

                          return (
                            <motion.div
                              key={request.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border border-forest-100 rounded-xl p-5 hover:shadow-md hover:border-primary/20 transition-all"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline" className={`${status.color} border`}>
                                    <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                                    {lang === 'fr' ? status.label : status.labelEn}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {format(new Date(request.created_at), 'dd MMM yyyy', {
                                      locale: lang === 'fr' ? frLocale : undefined,
                                    })}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                                  #{request.id.slice(0, 8)}
                                </span>
                              </div>

                              {request.message && (
                                <p className="text-sm text-muted-foreground mb-4 italic border-l-2 border-primary/30 pl-3">
                                  "{request.message}"
                                </p>
                              )}

                              <div className="space-y-2">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  {lang === 'fr' ? 'Produits demandés' : 'Requested products'} ({request.items.length})
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {request.items.map((item) => (
                                    <Link
                                      key={item.id}
                                      to={`/${lang}/produit/${item.product_code}`}
                                      className="inline-flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors group"
                                    >
                                      <span className="font-medium group-hover:text-primary transition-colors">
                                        {item.product_name}
                                      </span>
                                      <span className="text-xs text-muted-foreground">
                                        {item.product_code}
                                      </span>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};
