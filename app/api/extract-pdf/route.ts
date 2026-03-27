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
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: `Tu es un éditeur professionnel expert en mise en page HTML pour le blog d'IES Ingredients (distributeur B2B d'ingrédients naturels : parfumerie, cosmétique, arômes).

MISSION : Analyse ce document PDF extrait et transforme-le en article de blog parfaitement mis en forme.

TEXTE BRUT EXTRAIT DU PDF :
===
${rawText}
===

RÈGLES STRICTES POUR LE CONTENU HTML (content_fr et content_en) :

1. STRUCTURE : Respecte fidèlement la structure du document original.
   - Chaque section distincte doit avoir son titre en <h2> ou <h3>
   - Chaque paragraphe du document = un <p> séparé
   - Ne fusionne JAMAIS plusieurs paragraphes en un seul
   - Respecte les retours à la ligne et les séparations du texte original

2. MISE EN FORME RICHE :
   - Noms de personnes en <strong> (ex: <strong>François-Patrick Sabater</strong>)
   - Noms d'entreprises en <strong> (ex: <strong>IES Ingredients</strong>, <strong>Givaudan</strong>)
   - Citations directes (entre guillemets « ») en <blockquote><p>texte</p></blockquote>
   - Dates importantes en <strong>
   - Listes d'éléments en <ul><li>...</li></ul>
   - Si le document a des sections (ex: "Contact presse"), utilise <h3>

3. FIDÉLITÉ :
   - GARDE 100% du contenu textuel original, mot pour mot
   - N'invente rien, n'ajoute rien, ne résume pas le contenu
   - Corrige uniquement les artefacts d'extraction PDF (mots coupés, espaces en trop)
   - Respecte la ponctuation française (espaces insécables avant : ; ! ?)

4. QUALITÉ :
   - Le HTML doit être propre, bien indenté
   - Pas de <br> sauf cas exceptionnel - utilise des <p> séparés
   - Pas de <div> - uniquement des balises sémantiques

CHAMPS À RETOURNER (JSON) :

- "title_fr" : Titre principal du document, concis et professionnel
- "title_en" : Traduction anglaise fidèle du titre
- "excerpt_fr" : Résumé éditorial de 2-3 phrases (max 280 caractères). Doit donner envie de lire.
- "excerpt_en" : Traduction anglaise de l'extrait
- "content_fr" : Le contenu HTML complet selon les règles ci-dessus
- "content_en" : Traduction anglaise professionnelle du contenu HTML (même structure HTML)
- "author_name" : Auteur ou contact presse mentionné dans le document (chaîne vide si absent)
- "meta_description" : Description SEO en français (max 155 caractères, avec mots-clés pertinents)
- "category" : "news" | "press" | "events" | "certifications" | "trends" (choisis la plus appropriée)

Retourne UNIQUEMENT le JSON valide. Pas de backticks, pas de commentaire.`,
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
