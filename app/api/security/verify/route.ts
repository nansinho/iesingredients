import { NextRequest, NextResponse } from "next/server";
import { verifyCaptchaAnswer } from "@/lib/security/verify";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request.headers);
  const limiter = rateLimit({ key: `captcha:${ip}`, limit: 10, windowMs: 60_000 });
  if (!limiter.success) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.challengeToken || !body?.selectedIconId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const result = verifyCaptchaAnswer(body.challengeToken, body.selectedIconId);

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true, securityToken: result.securityToken });
}
