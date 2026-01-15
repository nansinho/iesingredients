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

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  pending: { label: 'En attente', icon: Clock, color: 'bg-yellow-500/20 text-yellow-600' },
  processing: { label: 'En cours', icon: Package, color: 'bg-blue-500/20 text-blue-600' },
  shipped: { label: 'Expédiée', icon: Truck, color: 'bg-purple-500/20 text-purple-600' },
  delivered: { label: 'Livrée', icon: CheckCircle, color: 'bg-green-500/20 text-green-600' },
  cancelled: { label: 'Annulée', icon: XCircle, color: 'bg-red-500/20 text-red-600' },
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
      // Using raw query since types aren't generated yet
      const { data: requestsData, error: requestsError } = await supabase
        .from('sample_requests' as any)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Fetch items for each request
      const requestsWithItems: SampleRequest[] = await Promise.all(
        (requestsData || []).map(async (request: any) => {
          const { data: items } = await supabase
            .from('sample_request_items' as any)
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

      toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour', {
        description: error.message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnexion réussie');
    navigate(`/${lang}`);
  };

  if (authLoading) {
    return (
      <Layout lang={lang}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout lang={lang}>
      {/* Hero Section */}
      <section className="bg-forest-950 pt-24 pb-12 sm:pt-32 sm:pb-16">
        <div className="container-luxe">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4">
              Mon Compte
            </h1>
            <p className="text-cream-300 text-lg">
              Gérez votre profil et suivez vos demandes d'échantillons
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 sm:py-12 bg-cream-50">
        <div className="container-luxe">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-white border border-border p-1 rounded-xl">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-forest-900 data-[state=active]:text-white rounded-lg px-4 py-2"
              >
                <User className="h-4 w-4 mr-2" />
                Profil
              </TabsTrigger>
              <TabsTrigger
                value="requests"
                className="data-[state=active]:bg-forest-900 data-[state=active]:text-white rounded-lg px-4 py-2"
              >
                <Package className="h-4 w-4 mr-2" />
                Mes demandes
                {requests.length > 0 && (
                  <Badge className="ml-2 bg-gold-500 text-forest-950">{requests.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Profile Form */}
                <Card className="md:col-span-2 bg-white shadow-md border-0">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Informations personnelles</CardTitle>
                    <CardDescription>Mettez à jour vos informations de contact</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Nom complet</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="full_name"
                              value={formData.full_name}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, full_name: e.target.value }))
                              }
                              className="pl-10"
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
                              className="pl-10 bg-muted"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company">Entreprise</Label>
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="company"
                              value={formData.company}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, company: e.target.value }))
                              }
                              className="pl-10"
                              placeholder="Votre entreprise"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData((prev) => ({ ...prev, phone: e.target.value }))
                              }
                              className="pl-10"
                              placeholder="+33 1 23 45 67 89"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          disabled={isUpdating}
                          className="bg-forest-900 hover:bg-forest-800"
                        >
                          {isUpdating ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Enregistrement...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Enregistrer
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="bg-white shadow-md border-0 h-fit">
                  <CardHeader>
                    <CardTitle className="font-serif text-xl">Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to={`/${lang}/catalogue`}>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Parcourir le catalogue
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Requests Tab */}
            <TabsContent value="requests">
              <Card className="bg-white shadow-md border-0">
                <CardHeader>
                  <CardTitle className="font-serif text-xl">Historique des demandes</CardTitle>
                  <CardDescription>Suivez le statut de vos demandes d'échantillons</CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingRequests ? (
                    <div className="py-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-gold-500 mx-auto" />
                      <p className="mt-4 text-muted-foreground">Chargement...</p>
                    </div>
                  ) : requests.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="h-8 w-8 text-forest-600" />
                      </div>
                      <h3 className="text-lg font-medium text-forest-900 mb-2">
                        Aucune demande pour le moment
                      </h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Explorez notre catalogue et ajoutez des produits à votre panier pour demander des échantillons.
                      </p>
                      <Button asChild className="bg-forest-900 hover:bg-forest-800">
                        <Link to={`/${lang}/catalogue`}>
                          Explorer le catalogue
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {requests.map((request) => {
                        const status = statusConfig[request.status] || statusConfig.pending;
                        const StatusIcon = status.icon;

                        return (
                          <motion.div
                            key={request.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-border rounded-xl p-4 sm:p-5 hover:shadow-md transition-shadow"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                              <div className="flex items-center gap-3">
                                <Badge className={status.color}>
                                  <StatusIcon className="h-3.5 w-3.5 mr-1.5" />
                                  {status.label}
                                </Badge>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {format(new Date(request.created_at), 'dd MMM yyyy', {
                                    locale: frLocale,
                                  })}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground font-mono">
                                #{request.id.slice(0, 8)}
                              </span>
                            </div>

                            {request.message && (
                              <p className="text-sm text-muted-foreground mb-4 italic">
                                "{request.message}"
                              </p>
                            )}

                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Produits demandés ({request.items.length})
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {request.items.map((item) => (
                                  <Link
                                    key={item.id}
                                    to={`/${lang}/produit/${item.product_code}`}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-cream-100 hover:bg-cream-200 rounded-lg text-sm transition-colors"
                                  >
                                    <span className="font-medium text-forest-900">
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
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default AccountPage;
