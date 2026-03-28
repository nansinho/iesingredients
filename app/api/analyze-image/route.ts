import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

export async function POST(request: NextRequest) {
  // Auth check
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!roleData) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY non configurée" }, { status: 500 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file || !file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Fichier image requis" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: file.type, data: base64 },
            },
            {
              type: "text",
              text: `Analyse cette image pour la médiathèque d'IES Ingredients (distributeur B2B d'ingrédients naturels : parfumerie, cosmétique, arômes).
Retourne un JSON avec :
- "alt": texte alternatif SEO concis (max 120 caractères), factuel et accessible
- "title": titre court de l'image (max 80 caractères)
- "description": description détaillée (1-2 phrases, max 200 caractères)
Retourne UNIQUEMENT le JSON, sans backticks.`,
            },
          ],
        }],
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Erreur API Claude" }, { status: 500 });
    }

    const data = await res.json();
    const text = (data.content?.[0]?.text || "").trim();
    const parsed = JSON.parse(text.replace(/^```json?\s*/, "").replace(/\s*```$/, ""));

    return NextResponse.json({
      alt: parsed.alt || "",
      title: parsed.title || "",
      description: parsed.description || "",
    });
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'analyse" }, { status: 500 });
  }
}
