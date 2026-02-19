import { NextRequest, NextResponse } from "next/server";
import { translateSchema } from "@/lib/validations";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

const LIBRETRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL || "http://libretranslate:5000";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 20 requests per minute per IP
    const ip = getClientIp(request.headers);
    const limiter = rateLimit({ key: `translate:${ip}`, limit: 20, windowMs: 60_000 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }

    // Validate input
    const body = await request.json().catch(() => null);
    const parsed = translateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { text, source, target } = parsed.data;

    const response = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source,
        target,
        format: "text",
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Translation service unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ translatedText: data.translatedText });
  } catch {
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
