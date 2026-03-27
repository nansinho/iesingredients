"use client";

import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Settings, Loader2, Linkedin, Instagram } from "lucide-react";

interface AdminProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
  phone: string | null;
  avatar_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
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
  });
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 2 Mo");
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
          avatar_url: avatarUrl || null,
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
      <header className="sticky top-0 z-30 flex items-center justify-end h-16 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm border-b border-black/5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-black/5 transition-colors outline-none">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900 leading-tight">
                  {profile.full_name || "Administrateur"}
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  {profile.email}
                </p>
              </div>
              <Avatar className="h-9 w-9">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={profile.full_name || ""} />}
                <AvatarFallback className="bg-[var(--brand-primary)] text-white text-sm font-medium">
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
              <a href="/fr/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Mon profil</DialogTitle>
            <DialogDescription>
              Modifiez vos informations personnelles
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-5 pt-2">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {avatarUrl && <AvatarImage src={avatarUrl} alt={profile.full_name || ""} />}
                <AvatarFallback className="bg-[var(--brand-primary)] text-white text-lg font-medium">
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
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-400 mt-1">JPG, PNG. Max 2 Mo</p>
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
        </DialogContent>
      </Dialog>
    </>
  );
}
