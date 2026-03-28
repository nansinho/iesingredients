"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserProfileForm } from "@/components/admin/UserProfileForm";
import { Loader2 } from "lucide-react";

export default function ClientProfilPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile({ ...(data as Record<string, unknown>), email: user.email });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-dark tracking-tight">
          Mon profil
        </h1>
        <p className="text-sm text-dark/40 mt-1">
          Gérez vos informations personnelles et votre entreprise
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6">
        {profile && (
          <UserProfileForm
            profile={profile}
            onSave={() => window.location.reload()}
          />
        )}
      </div>
    </div>
  );
}
