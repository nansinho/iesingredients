"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Settings, Loader2, Linkedin, Instagram, Globe, Twitter } from "lucide-react";

interface AdminProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
  phone: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  twitter_url?: string | null;
  website_url?: string | null;
  siret?: string | null;
  tva_intracom?: string | null;
  billing_address?: string | null;
  billing_city?: string | null;
  billing_postal_code?: string | null;
  billing_country?: string | null;
  shipping_address?: string | null;
  shipping_city?: string | null;
  shipping_postal_code?: string | null;
  shipping_country?: string | null;
  shipping_same_as_billing?: boolean | null;
}

function getInitials(name: string | null, email: string | null): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) return email[0].toUpperCase();
  return "A";
}

export function AdminHeader({ profile }: { profile: AdminProfile }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    fullName: profile.full_name || "",
    company: profile.company || "",
    phone: profile.phone || "",
    linkedinUrl: profile.linkedin_url || "",
    instagramUrl: profile.instagram_url || "",
    twitterUrl: profile.twitter_url || "",
    websiteUrl: profile.website_url || "",
    siret: profile.siret || "",
    tvaIntracom: profile.tva_intracom || "",
    billingAddress: profile.billing_address || "",
    billingCity: profile.billing_city || "",
    billingPostalCode: profile.billing_postal_code || "",
    billingCountry: profile.billing_country || "France",
    shippingAddress: profile.shipping_address || "",
    shippingCity: profile.shipping_city || "",
    shippingPostalCode: profile.shipping_postal_code || "",
    shippingCountry: profile.shipping_country || "France",
    shippingSameAsBilling: profile.shipping_same_as_billing !== false,
  });
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Formats acceptés : JPG, PNG, WebP");
      return;
    }

    if (file.size > 500 * 1024) {
      toast.error("L'image ne doit pas dépasser 500 Ko");
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const filePath = `avatars/${profile.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast.success("Photo mise à jour");
    } catch {
      toast.error("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("profiles") as any)
        .update({
          full_name: form.fullName || null,
          company: form.company || null,
          phone: form.phone || null,
          linkedin_url: form.linkedinUrl || null,
          instagram_url: form.instagramUrl || null,
          twitter_url: form.twitterUrl || null,
          website_url: form.websiteUrl || null,
          avatar_url: avatarUrl || null,
          siret: form.siret || null,
          tva_intracom: form.tvaIntracom || null,
          billing_address: form.billingAddress || null,
          billing_city: form.billingCity || null,
          billing_postal_code: form.billingPostalCode || null,
          billing_country: form.billingCountry || null,
          shipping_same_as_billing: form.shippingSameAsBilling,
          shipping_address: form.shippingSameAsBilling ? null : (form.shippingAddress || null),
          shipping_city: form.shippingSameAsBilling ? null : (form.shippingCity || null),
          shipping_postal_code: form.shippingSameAsBilling ? null : (form.shippingPostalCode || null),
          shipping_country: form.shippingSameAsBilling ? null : (form.shippingCountry || null),
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;

      toast.success("Profil mis à jour");
      setDialogOpen(false);
      window.location.reload();
    } catch {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsUpdating(false);
    }
  };

  const initials = getInitials(profile.full_name, profile.email);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-end h-16 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-brand-primary/[0.06]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-brand-primary/[0.04] transition-colors outline-none">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-brand-primary leading-tight">
                  {profile.full_name || "Administrateur"}
                </p>
                <p className="text-xs text-brand-secondary/60 leading-tight">
                  {profile.email}
                </p>
              </div>
              <Avatar className="h-9 w-9 ring-2 ring-brand-primary/10">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={profile.full_name || ""} />}
                <AvatarFallback className="bg-brand-primary text-white text-sm font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium">{profile.full_name || "Administrateur"}</p>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDialogOpen(true)} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Mon profil
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Link href={"/admin/settings" as any}>
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Mon profil</SheetTitle>
            <SheetDescription>
              Modifiez vos informations personnelles
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSave} className="space-y-5 pt-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={profile.full_name || ""} />}
                <AvatarFallback className="bg-brand-primary text-white text-lg font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  ) : null}
                  Changer la photo
                </Label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP. Max 500 Ko</p>
              </div>
            </div>

            {/* Name & Company */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Jean Dupont"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">Entreprise</Label>
                <Input
                  id="company"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="IES Ingredients"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+33 6 12 34 56 78"
              />
            </div>

            {/* Entreprise */}
            {form.company && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>N° SIRET</Label>
                  <Input name="siret" value={form.siret} onChange={handleChange} placeholder="123 456 789 00012" />
                </div>
                <div className="space-y-1.5">
                  <Label>TVA intracommunautaire</Label>
                  <Input name="tvaIntracom" value={form.tvaIntracom} onChange={handleChange} placeholder="FR 12 345678901" />
                </div>
              </div>
            )}

            {/* Adresse de facturation */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Adresse de facturation</p>
              <Input name="billingAddress" value={form.billingAddress} onChange={handleChange} placeholder="Adresse" />
              <div className="grid grid-cols-3 gap-3">
                <Input name="billingPostalCode" value={form.billingPostalCode} onChange={handleChange} placeholder="Code postal" />
                <Input name="billingCity" value={form.billingCity} onChange={handleChange} placeholder="Ville" />
                <Input name="billingCountry" value={form.billingCountry} onChange={handleChange} placeholder="Pays" />
              </div>
            </div>

            {/* Adresse de livraison */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">Adresse de livraison</p>
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.shippingSameAsBilling}
                    onChange={(e) => setForm((prev) => ({ ...prev, shippingSameAsBilling: e.target.checked }))}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-brand-accent"
                  />
                  Identique
                </label>
              </div>
              {!form.shippingSameAsBilling && (
                <>
                  <Input name="shippingAddress" value={form.shippingAddress} onChange={handleChange} placeholder="Adresse" />
                  <div className="grid grid-cols-3 gap-3">
                    <Input name="shippingPostalCode" value={form.shippingPostalCode} onChange={handleChange} placeholder="Code postal" />
                    <Input name="shippingCity" value={form.shippingCity} onChange={handleChange} placeholder="Ville" />
                    <Input name="shippingCountry" value={form.shippingCountry} onChange={handleChange} placeholder="Pays" />
                  </div>
                </>
              )}
            </div>

            {/* Social links */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Réseaux sociaux</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Linkedin className="h-4 w-4 text-[#0A66C2] shrink-0" />
                  <Input
                    name="linkedinUrl"
                    value={form.linkedinUrl}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Instagram className="h-4 w-4 text-[#E4405F] shrink-0" />
                  <Input
                    name="instagramUrl"
                    value={form.instagramUrl}
                    onChange={handleChange}
                    placeholder="https://instagram.com/..."
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Twitter className="h-4 w-4 text-gray-800 shrink-0" />
                  <Input
                    name="twitterUrl"
                    value={form.twitterUrl}
                    onChange={handleChange}
                    placeholder="https://x.com/..."
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-brand-accent shrink-0" />
                  <Input
                    name="websiteUrl"
                    value={form.websiteUrl}
                    onChange={handleChange}
                    placeholder="https://monsite.com"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit" variant="accent" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  "Enregistrer"
                )}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
