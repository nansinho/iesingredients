"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { User, Package, Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  email: string | null;
}

interface SampleRequest {
  id: string;
  status: string;
  message: string | null;
  created_at: string | null;
  sample_request_items: {
    id: string;
    product_code: string;
    product_name: string;
    product_category: string | null;
    quantity: number | null;
  }[];
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export function AccountClient({
  profile,
  requests,
  userEmail,
}: {
  profile: Profile | null;
  requests: SampleRequest[];
  userEmail: string;
}) {
  const locale = useLocale();
  const isFr = locale === "fr";
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [form, setForm] = useState({
    fullName: profile?.full_name || "",
    company: profile?.company || "",
    phone: profile?.phone || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const supabase = createClient();
      const updateData = {
        full_name: form.fullName,
        company: form.company || null,
        phone: form.phone || null,
        updated_at: new Date().toISOString(),
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("profiles") as any)
        .update(updateData)
        .eq("id", profile?.id || "");

      if (error) throw error;

      toast.success(isFr ? "Profil mis à jour" : "Profile updated");
      router.refresh();
    } catch {
      toast.error(isFr ? "Erreur de mise à jour" : "Update error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/" as any);
    router.refresh();
  };

  const statusLabel = (status: string) => {
    const labels: Record<string, { fr: string; en: string }> = {
      pending: { fr: "En attente", en: "Pending" },
      processing: { fr: "En traitement", en: "Processing" },
      shipped: { fr: "Expédié", en: "Shipped" },
      delivered: { fr: "Livré", en: "Delivered" },
      cancelled: { fr: "Annulé", en: "Cancelled" },
    };
    const l = labels[status] || { fr: status, en: status };
    return isFr ? l.fr : l.en;
  };

  return (
    <Tabs defaultValue="profile" className="space-y-8">
      <TabsList className="bg-forest-50">
        <TabsTrigger value="profile" className="gap-2">
          <User className="w-4 h-4" />
          {isFr ? "Profil" : "Profile"}
        </TabsTrigger>
        <TabsTrigger value="requests" className="gap-2">
          <Package className="w-4 h-4" />
          {isFr ? "Mes Demandes" : "My Requests"}
          {requests.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-gold-500 text-forest-900">
              {requests.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <div className="bg-white rounded-2xl border border-forest-100 p-8">
          <h2 className="font-serif text-2xl text-forest-900 mb-6">
            {isFr ? "Informations personnelles" : "Personal Information"}
          </h2>
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={userEmail} disabled className="h-12 bg-forest-50" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">{isFr ? "Nom complet" : "Full name"}</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">{isFr ? "Entreprise" : "Company"}</Label>
                <Input
                  id="company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{isFr ? "Téléphone" : "Phone"}</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="h-12"
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleSignOut}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isFr ? "Déconnexion" : "Sign Out"}
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-forest-900 hover:bg-forest-800 text-white rounded-full px-8"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    {isFr ? "Enregistrement..." : "Saving..."}
                  </>
                ) : (
                  isFr ? "Enregistrer" : "Save"
                )}
              </Button>
            </div>
          </form>
        </div>
      </TabsContent>

      <TabsContent value="requests">
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-forest-100">
              <Package className="w-12 h-12 text-forest-300 mx-auto mb-4" />
              <p className="text-forest-600 text-lg">
                {isFr ? "Aucune demande d'échantillon" : "No sample requests yet"}
              </p>
              <p className="text-forest-500 text-sm mt-1">
                {isFr
                  ? "Parcourez notre catalogue pour demander des échantillons."
                  : "Browse our catalog to request samples."}
              </p>
            </div>
          ) : (
            requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-forest-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[req.status] || "bg-gray-100 text-gray-800"}`}
                    >
                      {statusLabel(req.status)}
                    </span>
                    <time className="text-xs text-forest-500 ml-3">
                      {req.created_at
                        ? new Date(req.created_at).toLocaleDateString(locale, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : ""}
                    </time>
                  </div>
                </div>

                {req.message && (
                  <p className="text-sm text-forest-600 mb-3">{req.message}</p>
                )}

                <div className="space-y-2">
                  {req.sample_request_items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-2 px-3 bg-forest-50 rounded-lg text-sm"
                    >
                      <div>
                        <span className="font-medium text-forest-900">
                          {item.product_name}
                        </span>
                        <span className="text-forest-500 ml-2">({item.product_code})</span>
                      </div>
                      {item.quantity && (
                        <span className="text-forest-600">
                          x{item.quantity}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
