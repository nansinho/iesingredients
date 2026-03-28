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
import { User, Settings } from "lucide-react";
import { UserProfileForm } from "@/components/admin/UserProfileForm";

interface AdminProfile {
  id: string;
  full_name: string | null;
  email: string | null;
  [key: string]: unknown;
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
  const [panelOpen, setPanelOpen] = useState(false);
  const avatarUrl = (profile.avatar_url as string) || "";
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
                <AvatarFallback className="text-sm font-medium">
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
            <DropdownMenuItem asChild>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Link href={"/admin/settings" as any} className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Mon profil — même SlidePanel que partout */}
      <SlidePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title="Mon profil"
        subtitle={profile.email || ""}
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
