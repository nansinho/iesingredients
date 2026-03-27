import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

async function analyzeWithClaude(rawText: string): Promise<Record<string, string>> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Tu es un assistant éditorial pour IES Ingredients, un distributeur B2B d'ingrédients naturels pour la parfumerie, cosmétique et arômes.

Analyse ce texte extrait d'un PDF et structure-le en article de blog professionnel.

TEXTE EXTRAIT:
---
${rawText}
---

Retourne un JSON valide avec ces champs:
- "title_fr": Titre concis et professionnel en français
- "title_en": Traduction anglaise du titre
- "excerpt_fr": Résumé de 2-3 phrases en français (max 300 caractères)
- "excerpt_en": Traduction anglaise de l'extrait
- "content_fr": Le contenu complet restructuré en HTML propre (utilise <p>, <h2>, <h3>, <blockquote> pour les citations, <strong> pour les noms importants). Garde le contenu fidèle au texte original mais améliore la mise en forme. N'ajoute pas de contenu inventé.
- "content_en": Traduction anglaise du contenu HTML
- "author_name": Nom de l'auteur ou contact presse si mentionné
- "meta_description": Description SEO en français (max 155 caractères)
- "category": Une des valeurs suivantes: "news", "press", "events", "certifications", "trends". Choisis la plus appropriée.

IMPORTANT: Retourne UNIQUEMENT le JSON, sans backticks, sans explication.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Claude API error:", err);
    throw new Error("Erreur lors de l'analyse IA");
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || "";

  // Parse JSON from response (handle potential markdown wrapping)
  const jsonStr = text.replace(/^```json?\s*/, "").replace(/\s*```$/, "").trim();
  return JSON.parse(jsonStr);
}

function fallbackStructure(rawText: string): Record<string, string> {
  const text = rawText
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  let title = "";
  let contentStartIndex = 0;

  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    if (
      line.length < 5 ||
      /^communiqu[ée]/i.test(line) ||
      /^press\s*release/i.test(line)
    ) {
      continue;
    }
    title = line.replace(/\s*[.:]\s*$/, "");
    contentStartIndex = i + 1;
    break;
  }

  let author = "";
  const contactIdx = lines.findIndex((l) =>
    /contact\s*(presse|press|:)/i.test(l)
  );
  if (contactIdx !== -1 && contactIdx + 1 < lines.length) {
    const namePart = lines[contactIdx + 1].split(/[–\-—@]/).at(0)?.trim();
    if (namePart && namePart.length > 2 && namePart.length < 60) {
      author = namePart;
    }
  }

  const contentLines = lines.slice(
    contentStartIndex,
    contactIdx > contentStartIndex ? contactIdx : undefined
  );

  const paragraphs: string[] = [];
  let current = "";
  for (const line of contentLines) {
    if (!line) {
      if (current) { paragraphs.push(current.trim()); current = ""; }
    } else {
      current += (current ? " " : "") + line;
    }
  }
  if (current.trim()) paragraphs.push(current.trim());

  const excerpt = (paragraphs[0] || "").slice(0, 300);
  const contentHtml = paragraphs.map((p) => `<p>${p}</p>`).join("\n");

  return {
    title_fr: title,
    excerpt_fr: excerpt,
    content_fr: contentHtml,
    author_name: author,
    meta_description: excerpt.slice(0, 155),
    category: "press",
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "File must be a PDF" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 10 MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdf = require("pdf-parse/lib/pdf-parse");
    const data = await pdf(buffer);

    if (!data.text?.trim()) {
      return NextResponse.json(
        { error: "Le PDF ne contient pas de texte extractible" },
        { status: 400 }
      );
    }

    // Try Claude AI analysis first, fallback to regex
    let fields: Record<string, string>;
    try {
      fields = await analyzeWithClaude(data.text);
    } catch (err) {
      console.warn("Claude analysis failed, using fallback:", err);
      fields = fallbackStructure(data.text);
    }

    return NextResponse.json({
      fields,
      pages: data.numpages,
      fileName: file.name,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de l'extraction du PDF" },
      { status: 500 }
    );
  }
}
