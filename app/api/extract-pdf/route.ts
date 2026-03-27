import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

interface ContentBlock {
  type: "paragraph" | "heading" | "quote" | "contact";
  text: string;
  bold?: string[];
}

interface ClaudeResponse {
  title_fr: string;
  title_en: string;
  excerpt_fr: string;
  excerpt_en: string;
  blocks_fr: ContentBlock[];
  blocks_en: ContentBlock[];
  author_name: string;
  meta_description: string;
  category: string;
}

function blocksToHtml(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      let text = block.text;

      // Apply bold to specified words/phrases
      if (block.bold?.length) {
        for (const term of block.bold) {
          // Escape regex chars in term
          const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          text = text.replace(new RegExp(escaped, "g"), `<strong>${term}</strong>`);
        }
      }

      switch (block.type) {
        case "heading":
          return `<h2>${text}</h2>`;
        case "quote":
          return `<blockquote><p>${text}</p></blockquote>`;
        case "contact":
          return `<h3>Contact presse</h3>\n<p>${text}</p>`;
        default:
          return `<p>${text}</p>`;
      }
    })
    .join("\n");
}

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
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: `Tu es un éditeur professionnel pour le blog d'IES Ingredients (distributeur B2B d'ingrédients naturels : parfumerie, cosmétique, arômes).

MISSION : Analyse ce texte extrait d'un PDF et structure-le en article.

TEXTE BRUT :
===
${rawText}
===

RÈGLE CRITIQUE : Tu dois DÉCOUPER le texte en BLOCS SÉPARÉS. Chaque idée, chaque changement de sujet, chaque citation = un bloc distinct. NE METS JAMAIS tout le texte dans un seul bloc.

Retourne un JSON avec cette structure EXACTE :

{
  "title_fr": "Titre concis en français",
  "title_en": "English title",
  "excerpt_fr": "Résumé 2-3 phrases, max 280 caractères",
  "excerpt_en": "English excerpt",
  "blocks_fr": [
    {"type": "paragraph", "text": "Premier paragraphe du texte...", "bold": ["Nom Personne", "Nom Entreprise"]},
    {"type": "paragraph", "text": "Deuxième paragraphe...", "bold": ["IES Ingredients"]},
    {"type": "quote", "text": "Citation entre guillemets d'une personne", "bold": ["Nom de la personne"]},
    {"type": "paragraph", "text": "Suite du texte...", "bold": []},
    {"type": "contact", "text": "NOM Prénom – email@exemple.com", "bold": []}
  ],
  "blocks_en": [
    {"type": "paragraph", "text": "First paragraph...", "bold": ["Person Name", "Company Name"]},
    ...même structure traduite en anglais...
  ],
  "author_name": "Nom de l'auteur ou contact presse",
  "meta_description": "Description SEO max 155 caractères",
  "category": "press"
}

RÈGLES POUR LES BLOCS :
- "paragraph" : texte normal. CHAQUE paragraphe distinct du PDF = un bloc séparé.
- "heading" : titre de section (s'il y en a dans le document)
- "quote" : citation directe entre guillemets « » d'une personne nommée
- "contact" : section contact presse en fin de document
- "bold" : liste des noms propres et entreprises à mettre en gras DANS ce bloc
- MINIMUM 4-5 blocs pour un texte normal. Si le texte fait plus de 500 mots, au moins 6-8 blocs.
- category : "news" | "press" | "events" | "certifications" | "trends"

FIDÉLITÉ : Garde 100% du contenu mot pour mot. Ne résume pas, n'invente rien.

Retourne UNIQUEMENT le JSON. Pas de backticks, pas de commentaire.`,
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

  const jsonStr = text.replace(/^```json?\s*/, "").replace(/\s*```$/, "").trim();
  const parsed: ClaudeResponse = JSON.parse(jsonStr);

  // Convert blocks to HTML
  const contentFr = blocksToHtml(parsed.blocks_fr || []);
  const contentEn = blocksToHtml(parsed.blocks_en || []);

  console.log(`[PDF Import] Claude returned ${parsed.blocks_fr?.length || 0} FR blocks, ${parsed.blocks_en?.length || 0} EN blocks`);

  return {
    title_fr: parsed.title_fr || "",
    title_en: parsed.title_en || "",
    excerpt_fr: parsed.excerpt_fr || "",
    excerpt_en: parsed.excerpt_en || "",
    content_fr: contentFr,
    content_en: contentEn,
    author_name: parsed.author_name || "",
    meta_description: parsed.meta_description || "",
    category: parsed.category || "press",
  };
}

function fallbackStructure(rawText: string): Record<string, string> {
  const lines = rawText.split("\n");

  let title = "";
  let contentStartIndex = 0;

  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i].trim();
    if (
      line.length < 5 ||
      /^communiqu[ée]/i.test(line) ||
      /^press\s*release/i.test(line) ||
      !line
    ) {
      continue;
    }
    title = line.replace(/\s*[.:]\s*$/, "");
    contentStartIndex = i + 1;
    break;
  }

  let author = "";
  const contactIdx = lines.findIndex((l) =>
    /contact\s*(presse|press|:)/i.test(l.trim())
  );
  if (contactIdx !== -1 && contactIdx + 1 < lines.length) {
    const namePart = lines[contactIdx + 1].trim().split(/[–\-—@]/).at(0)?.trim();
    if (namePart && namePart.length > 2 && namePart.length < 60) {
      author = namePart;
    }
  }

  // Build paragraphs - split on empty lines (not filtered out this time!)
  const contentLines = lines.slice(
    contentStartIndex,
    contactIdx > contentStartIndex ? contactIdx : undefined
  );

  const paragraphs: string[] = [];
  let current = "";
  for (const line of contentLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (current.trim()) {
        paragraphs.push(current.trim());
        current = "";
      }
    } else {
      current += (current ? " " : "") + trimmed;
    }
  }
  if (current.trim()) paragraphs.push(current.trim());

  // If still only 1 paragraph, try splitting by sentences
  if (paragraphs.length <= 1 && paragraphs[0]?.length > 400) {
    const text = paragraphs[0];
    const sentences = text.split(/(?<=[.!?»])\s+(?=[A-ZÀ-ÖÙ-Ü«])/);
    const newParagraphs: string[] = [];
    let chunk = "";
    for (const sentence of sentences) {
      chunk += (chunk ? " " : "") + sentence;
      if (chunk.length > 200) {
        newParagraphs.push(chunk);
        chunk = "";
      }
    }
    if (chunk) newParagraphs.push(chunk);
    if (newParagraphs.length > 1) {
      paragraphs.length = 0;
      paragraphs.push(...newParagraphs);
    }
  }

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
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });
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

    // Pre-clean PDF text
    const cleanedText = data.text
      .replace(/\r\n/g, "\n")
      .replace(/[^\S\n]+/g, " ")
      .replace(/\n\s*\n/g, "\n\n")
      .replace(/ +\n/g, "\n")
      .trim();

    let fields: Record<string, string>;
    let usedAI = false;
    try {
      fields = await analyzeWithClaude(cleanedText);
      usedAI = true;
    } catch (err) {
      console.warn("Claude analysis failed, using fallback:", err);
      fields = fallbackStructure(cleanedText);
    }

    const pCount = (fields.content_fr?.match(/<p>/g) || []).length;
    console.log(`[PDF Import] AI: ${usedAI}, paragraphs: ${pCount}, content length: ${fields.content_fr?.length}`);

    return NextResponse.json({
      fields,
      pages: data.numpages,
      fileName: file.name,
      _debug: { usedAI, paragraphs: pCount },
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de l'extraction du PDF" },
      { status: 500 }
    );
  }
}
