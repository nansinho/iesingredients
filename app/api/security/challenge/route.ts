import { NextResponse } from "next/server";
import { generateChallenge } from "@/lib/security/challenge";

export async function GET() {
  const challenge = generateChallenge();
  return NextResponse.json(challenge);
}
