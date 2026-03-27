import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { connector, apiKey } = await req.json();

    if (!connector || !apiKey) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    if (connector === "claude") {
      // Test Claude API with a minimal request
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 10,
          messages: [{ role: "user", content: "Hi" }],
        }),
      });

      if (res.ok) {
        return NextResponse.json({ success: true, message: "Connexion Claude réussie" });
      }

      const error = await res.json().catch(() => ({ error: { message: "Réponse invalide" } }));
      return NextResponse.json(
        { error: error.error?.message || "Clé API invalide" },
        { status: 401 }
      );
    }

    return NextResponse.json({ error: "Connecteur inconnu" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur interne" },
      { status: 500 }
    );
  }
}
