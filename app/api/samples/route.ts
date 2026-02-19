import { NextRequest, NextResponse } from "next/server";
import { sampleRequestSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 sample requests per 10 minutes per IP
    const ip = getClientIp(request.headers);
    const limiter = rateLimit({ key: `samples:${ip}`, limit: 3, windowMs: 600_000 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "600" } }
      );
    }

    // Validate input
    const body = await request.json().catch(() => null);
    const parsed = sampleRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, company, phone, message, items } = parsed.data;

    const supabase = createAdminClient();

    // Check if user is logged in (via auth header)
    let userId: string | null = null;
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Create sample request
    const { data: sampleRequest, error: requestError } = await (
      supabase.from("sample_requests") as any
    )
      .insert({
        user_id: userId,
        status: "pending",
        contact_name: name || null,
        contact_email: email || null,
        contact_phone: phone || null,
        company: company || null,
        message: message || null,
      })
      .select("id")
      .single();

    if (requestError) {
      return NextResponse.json(
        { error: "Failed to create request" },
        { status: 500 }
      );
    }

    // Add items
    const itemsToInsert = items.map((item) => ({
      request_id: (sampleRequest as any).id,
      product_code: item.code,
      product_name: item.name,
      product_category: item.category,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await (
      supabase.from("sample_request_items") as any
    ).insert(itemsToInsert);

    if (itemsError) {
      return NextResponse.json(
        { error: "Failed to add items" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: (sampleRequest as any).id });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
