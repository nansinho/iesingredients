import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getUser() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Failed to get user:", error.message);
      return null;
    }
    return user;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
}

export async function getProfile() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Failed to fetch profile:", profileError.message);
      return null;
    }

    if (!profile) return null;
    const p = profile as Record<string, unknown>;
    return { ...p, email: user.email } as {
      id: string;
      full_name: string | null;
      company: string | null;
      phone: string | null;
      email: string | undefined;
    };
  } catch (error) {
    console.error("Failed to get profile:", error);
    return null;
  }
}

export async function getUserRole() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return null;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    if (error) {
      console.error("Failed to fetch user role:", error.message);
      return "user";
    }

    const roles = (data as { role: string }[] | null) ?? [];
    if (roles.some((r) => r.role === "admin")) return "admin";
    return "user";
  } catch (error) {
    console.error("Failed to get user role:", error);
    return null;
  }
}

export async function isAdmin() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return false;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      console.error("Failed to check admin role:", error.message);
      return false;
    }

    return data !== null;
  } catch (error) {
    console.error("Failed to check admin status:", error);
    return false;
  }
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
