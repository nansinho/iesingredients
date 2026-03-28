"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidePanel } from "@/components/admin/SlidePanel";
import { User, LogOut, Bell } from "lucide-react";
import { UserProfileForm } from "@/components/admin/UserProfileForm";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/routing";

interface ClientProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  company: string | null;
  phone: string | null;
  avatar_url: string | null;
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
  return "U";
}

export function ClientHeader({ profile }: { profile: ClientProfile }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const router = useRouter();
  const initials = getInitials(profile.full_name, profile.email);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push("/" as any);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-end gap-2 h-16 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-brown/8" suppressHydrationWarning>
        {/* Notifications bell */}
        <button className="relative p-2 rounded-xl text-dark/40 hover:text-dark hover:bg-brown/5 transition-colors">
          <Bell className="w-5 h-5" />
          {/* Badge — uncomment when notifications are live */}
          {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-accent" /> */}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-brown/5 transition-colors outline-none">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-dark leading-tight">
                  {profile.full_name || "Mon compte"}
                </p>
                <p className="text-xs text-dark/40 leading-tight">
                  {profile.company || profile.email}
                </p>
              </div>
              <Avatar className="h-9 w-9 ring-2 ring-brand-accent/20">
                {profile.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile.full_name || ""} />}
                <AvatarFallback className="text-sm font-medium bg-brand-accent/10 text-brand-accent">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{profile.full_name}</p>
                <p className="text-xs text-muted-foreground">{profile.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setPanelOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              Mon profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title="Mon profil"
        subtitle={profile.email || ""}
        width="lg"
      >
        <UserProfileForm
          profile={profile}
          onSave={() => { setPanelOpen(false); window.location.reload(); }}
          onCancel={() => setPanelOpen(false)}
        />
      </SlidePanel>
    </>
  );
}
