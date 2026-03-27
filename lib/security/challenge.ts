import { ICON_POOL, GRID_SIZE, CHALLENGE_TTL_MS } from "./constants";
import { signPayload } from "./crypto";
import crypto from "crypto";

export interface ChallengeResponse {
  grid: string[];
  targetId: string;
  targetName: { fr: string; en: string };
  challengeToken: string;
}

export function generateChallenge(): ChallengeResponse {
  const shuffled = [...ICON_POOL].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, GRID_SIZE);

  const correctIndex = Math.floor(Math.random() * GRID_SIZE);
  const target = selected[correctIndex];

  const challengeToken = signPayload({
    type: "challenge",
    correctId: target.id,
    exp: Date.now() + CHALLENGE_TTL_MS,
    nonce: crypto.randomUUID(),
  });

  return {
    grid: selected.map((i) => i.id),
    targetId: target.id,
    targetName: { fr: target.fr, en: target.en },
    challengeToken,
  };
}
