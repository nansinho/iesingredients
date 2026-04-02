import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  // 1. Verify admin
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

  // 2. Parse request
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const mediaId = formData.get("mediaId") as string;
  const width = parseInt(formData.get("width") as string) || 0;
  const height = parseInt(formData.get("height") as string) || 0;
  const oldUrl = formData.get("oldUrl") as string;

  if (!file || !mediaId || !oldUrl) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  // 3. Extract storage path from URL
  // URL format: https://xxx.supabase.co/storage/v1/object/public/product-images/folder/file.webp
  const bucket = "product-images";
  const marker = `/storage/v1/object/public/${bucket}/`;
  const markerIndex = oldUrl.indexOf(marker);
  if (markerIndex === -1) {
    return NextResponse.json({ error: "URL de stockage invalide" }, { status: 400 });
  }
  const storagePath = oldUrl.substring(markerIndex + marker.length);

  // 4. Overwrite file at same path
  const adminClient = createAdminClient();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await adminClient.storage
    .from(bucket)
    .upload(storagePath, buffer, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // 5. Update media record
  await (adminClient.from("media" as never) as ReturnType<typeof adminClient.from>)
    .update({
      file_size: file.size,
      file_type: file.type,
      width,
      height,
    })
    .eq("id", mediaId);

  return NextResponse.json({ ok: true, size: file.size, width, height });
}
