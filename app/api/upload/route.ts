import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  // 1. Verify the user is authenticated
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  // 2. Verify admin role
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!roleData) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  // 3. Parse the upload
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const bucket = (formData.get("bucket") as string) || "product-images";
  const folder = (formData.get("folder") as string) || "uploads";

  if (!file) {
    return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
  }

  // 4. Upload using admin client (bypasses RLS)
  const adminClient = createAdminClient();
  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await adminClient.storage
    .from(bucket)
    .upload(fileName, buffer, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: { publicUrl } } = adminClient.storage
    .from(bucket)
    .getPublicUrl(fileName);

  // 5. Track in media library (untyped table)
  try {
    const width = parseInt(formData.get("width") as string) || 0;
    const height = parseInt(formData.get("height") as string) || 0;

    await (adminClient.from("media" as never) as ReturnType<typeof adminClient.from>).insert({
      file_name: file.name,
      file_url: publicUrl,
      file_size: file.size,
      file_type: file.type,
      width,
      height,
      folder,
      alt_text: "",
      description: "",
    });
  } catch {
    // Media tracking is non-critical
  }

  return NextResponse.json({ url: publicUrl });
}
