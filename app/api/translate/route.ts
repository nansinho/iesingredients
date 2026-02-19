import { NextRequest, NextResponse } from "next/server";

const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || "http://libretranslate:5000";

export async function POST(request: NextRequest) {
  try {
    const { text, source, target } = await request.json();

    if (!text || !source || !target) {
      return NextResponse.json(
        { error: "Missing required fields: text, source, target" },
        { status: 400 }
      );
    }

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
