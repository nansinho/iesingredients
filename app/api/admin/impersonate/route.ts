import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { setImpersonateCookie, clearImpersonateCookie } from "@/lib/impersonate";

export async function POST(request: NextRequest) {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const body = await request.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json({ error: "userId requis" }, { status: 400 });
  }

  // Verify the target user exists
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, company, account_type")
    .eq("id", userId)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  // Set impersonation cookie
  await setImpersonateCookie(userId);

  // Audit log
  const { data: { user } } = await supabase.auth.getUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("audit_logs") as any).insert({
    user_id: user?.id || "",
    user_email: user?.email || "",
    user_name: user?.user_metadata?.full_name || user?.email || "",
    action: "create",
    entity_type: "impersonation",
    entity_id: userId,
    entity_label: (profile as Record<string, unknown>).full_name as string || (profile as Record<string, unknown>).email as string || "",
    details: { target_account_type: (profile as Record<string, unknown>).account_type },
  }).then(() => {});

  return NextResponse.json({
    success: true,
    user: {
      id: (profile as Record<string, unknown>).id,
      full_name: (profile as Record<string, unknown>).full_name,
      email: (profile as Record<string, unknown>).email,
      company: (profile as Record<string, unknown>).company,
    },
  });
}

export async function DELETE() {
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  await clearImpersonateCookie();

  return NextResponse.json({ success: true });
}
