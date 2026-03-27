import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifySecurityToken } from "@/lib/security/verify";

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

    // Verify security token
    if (!body?.securityToken) {
      return NextResponse.json({ error: "Security verification required" }, { status: 403 });
    }
    const security = verifySecurityToken(body.securityToken, body.formStartTime);
    if (!security.valid) {
      return NextResponse.json({ error: `Security check failed: ${security.error}` }, { status: 403 });
    }

    const { securityToken: _st, formStartTime: _ft, ...formFields } = body || {};
    const parsed = contactSchema.safeParse(formFields);
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
