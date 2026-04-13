import { cookies } from "next/headers";
import { isAdmin, getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const COOKIE_NAME = "impersonate_user_id";

/**
 * Get the impersonated user ID from cookie (server-side).
 * Returns null if not impersonating.
 */
export async function getImpersonatedUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

/**
 * Set the impersonate cookie (server-side, called from API route).
 */
export async function setImpersonateCookie(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60, // 1 hour max
  });
}

/**
 * Clear the impersonate cookie.
 */
export async function clearImpersonateCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Get the effective profile for the client area.
 * If an admin is impersonating a user, returns the impersonated user's profile.
 * Otherwise returns the logged-in user's profile.
 */
export async function getEffectiveProfile() {
  const impersonatedUserId = await getImpersonatedUserId();
  const admin = await isAdmin();

  if (impersonatedUserId && admin) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", impersonatedUserId)
      .maybeSingle();

    if (profile) {
      const p = profile as Record<string, unknown>;
      return {
        ...p,
        id: p.id as string,
        full_name: (p.full_name as string) || null,
        email: (p.email as string) || null,
        impersonating: true,
      };
    }
  }

  const profile = await getProfile();
  if (!profile) return null;
  return { ...profile, impersonating: false };
}
