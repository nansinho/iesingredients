import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;
  const p = profile as Record<string, unknown>;
  return { ...p, email: user.email } as {
    id: string;
    full_name: string | null;
    company: string | null;
    phone: string | null;
    email: string | undefined;
  };
}

export async function getUserRole() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return (data as { role: string } | null)?.role || "user";
}

export async function isAdmin() {
  const role = await getUserRole();
  return role === "admin";
}

export async function requireAuth(locale: string) {
  const user = await getUser();
  if (!user) {
    redirect(`/${locale}/login`);
  }
  return user;
}

export async function requireAdmin(locale: string) {
  const user = await requireAuth(locale);
  const admin = await isAdmin();
  if (!admin) {
    redirect(`/${locale}`);
  }
  return user;
}
