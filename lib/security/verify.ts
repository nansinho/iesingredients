import { verifyToken, signPayload } from "./crypto";
import { TOKEN_TTL_MS, MIN_FORM_TIME_MS } from "./constants";
import crypto from "crypto";

interface ChallengePayload {
  type: "challenge";
  correctId: string;
  exp: number;
  nonce: string;
}

interface SecurityTokenPayload {
  type: "security_token";
  exp: number;
  nonce: string;
}

export function verifyCaptchaAnswer(
  challengeToken: string,
  selectedIconId: string
): { success: boolean; securityToken?: string; error?: string } {
  const result = verifyToken<ChallengePayload>(challengeToken);
  if (!result.valid || !result.payload) {
    return { success: false, error: "invalid_challenge" };
  }

  const { type, correctId, exp } = result.payload;
  if (type !== "challenge") return { success: false, error: "wrong_token_type" };
  if (Date.now() > exp) return { success: false, error: "challenge_expired" };
  if (selectedIconId !== correctId) return { success: false, error: "wrong_answer" };

  const securityToken = signPayload({
    type: "security_token",
    exp: Date.now() + TOKEN_TTL_MS,
    nonce: crypto.randomUUID(),
  });

  return { success: true, securityToken };
}

export function verifySecurityToken(
  token: string,
  formStartTime?: number
): { valid: boolean; error?: string } {
  const result = verifyToken<SecurityTokenPayload>(token);
  if (!result.valid || !result.payload) {
    return { valid: false, error: "invalid_token" };
  }

  const { type, exp } = result.payload;
  if (type !== "security_token") return { valid: false, error: "wrong_token_type" };
  if (Date.now() > exp) return { valid: false, error: "token_expired" };

  if (formStartTime && Date.now() - formStartTime < MIN_FORM_TIME_MS) {
    return { valid: false, error: "too_fast" };
  }

  return { valid: true };
}
