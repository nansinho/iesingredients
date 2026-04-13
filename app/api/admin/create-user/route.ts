import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const { email, fullName } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }

  if (!fullName || typeof fullName !== "string" || fullName.trim().length === 0 || fullName.length > 200) {
    return NextResponse.json({ error: "Nom complet requis (200 caractères max)" }, { status: 400 });
  }

  // Only @ies-ingredients.com emails can be internal team accounts
  if (!email.endsWith("@ies-ingredients.com")) {
    return NextResponse.json(
      { error: "Seuls les emails @ies-ingredients.com peuvent être ajoutés comme membres IES" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  try {
    // Create auth user with a strong random password
    const randomPassword = crypto.randomBytes(24).toString("base64url");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: userData, error: createError } = await (supabase.auth.admin as any).createUser({
      email,
      password: randomPassword,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || email,
        company: "IES Ingredients",
      },
    });

    if (createError) {
      // User might already exist
      if (createError.message?.includes("already") || createError.message?.includes("exists")) {
        return NextResponse.json({ error: "Un compte existe déjà avec cet email" }, { status: 409 });
      }
      throw createError;
    }

    const userId = userData.user?.id;
    if (!userId) {
      throw new Error("User ID not returned");
    }

    // Get IES organization ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: org } = await (supabase.from("organizations") as any)
      .select("id")
      .eq("name", "IES Ingredients")
      .single();

    // Update profile with internal account type and must_change_password
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("profiles") as any)
      .update({
        account_type: "internal",
        must_change_password: true,
        organization_id: org?.id || null,
        company: "IES Ingredients",
      })
      .eq("id", userId);

    return NextResponse.json({ success: true, userId });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur lors de la création" },
      { status: 500 }
    );
  }
}
