import { NextResponse } from "next/server";

export async function GET() {
  const health: Record<string, unknown> = {
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
    uptime: process.uptime(),
    node: process.version,
    env: process.env.NODE_ENV,
  };

  // Check Supabase connectivity
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: "HEAD",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
        },
        signal: AbortSignal.timeout(3000),
      });
      health.supabase = res.ok ? "connected" : "error";
    }
  } catch {
    health.supabase = "unreachable";
  }

  return NextResponse.json(health);
}
