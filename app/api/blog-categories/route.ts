import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

const categorySchema = z.object({
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, "Slug invalide (lettres minuscules, chiffres, tirets)"),
  label_fr: z.string().min(1).max(100).trim(),
  label_en: z.string().min(1).max(100).trim(),
  color_bg: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur hex invalide").default("#2E1F3D"),
  color_text: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur hex invalide").default("#FAF8F6"),
  color_border: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Couleur hex invalide").default("#2E1F3D"),
  sort_order: z.number().int().min(0).default(0),
});

const categoryUpdateSchema = z.object({
  id: z.string().uuid(),
}).merge(categorySchema.partial());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const supabaseTable = (supabase: any) => supabase.from("blog_categories") as any;

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabaseTable(supabase)
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabaseTable(supabase)
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = categoryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { id, ...updates } = parsed.data;

  const { data, error } = await supabaseTable(supabase)
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = await createClient();

  // Check if any articles use this category
  const { data: category } = await supabaseTable(supabase)
    .select("slug")
    .eq("id", id)
    .single();

  if (category) {
    const { count } = await (supabase.from("blog_articles") as any)
      .select("id", { count: "exact", head: true })
      .eq("category", category.slug);

    if (count && count > 0) {
      return NextResponse.json(
        { error: `${count} article(s) utilisent cette catégorie. Réassignez-les d'abord.` },
        { status: 409 }
      );
    }
  }

  const { error } = await supabaseTable(supabase).delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
