import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

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
  const supabase = await createClient();

  const { data, error } = await supabaseTable(supabase)
    .insert({
      slug: body.slug,
      label_fr: body.label_fr,
      label_en: body.label_en,
      color_bg: body.color_bg || "#EFF6FF",
      color_text: body.color_text || "#1D4ED8",
      color_border: body.color_border || "#BFDBFE",
      sort_order: body.sort_order || 0,
    })
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
  if (!body.id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = await createClient();
  const { id, ...updates } = body;

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
