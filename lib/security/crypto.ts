import crypto from "crypto";

function getSecret(): string {
  const secret = process.env.SECURITY_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    throw new Error("SECURITY_SECRET or SUPABASE_SERVICE_ROLE_KEY must be set");
  }
  return secret;
}

export function signPayload(payload: Record<string, unknown>): string {
  const data = JSON.stringify(payload);
  const encoded = Buffer.from(data).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyToken<T = Record<string, unknown>>(
  token: string
): { valid: boolean; payload?: T; error?: string } {
  const parts = token.split(".");
  if (parts.length !== 2) return { valid: false, error: "malformed" };

  const [encoded, signature] = parts;
  const expected = crypto
    .createHmac("sha256", getSecret())
    .update(encoded)
    .digest("base64url");

  if (
    signature.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  ) {
    return { valid: false, error: "invalid_signature" };
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString()
    ) as T;
    return { valid: true, payload };
  } catch {
    return { valid: false, error: "invalid_payload" };
  }
}
