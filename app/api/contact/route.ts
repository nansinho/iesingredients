import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 contact submissions per 10 minutes per IP
    const ip = getClientIp(request.headers);
    const limiter = rateLimit({ key: `contact:${ip}`, limit: 5, windowMs: 600_000 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        { status: 429, headers: { "Retry-After": "600" } }
      );
    }

    // Validate input
    const body = await request.json().catch(() => null);
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, company, phone, subject, message } = parsed.data;

    const supabase = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("contact_submissions") as any).insert({
      first_name: firstName,
      last_name: lastName,
      email,
      company: company || null,
      phone: phone || null,
      subject,
      message,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to save submission" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
