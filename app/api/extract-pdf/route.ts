import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SEO_PROMPT = `Tu es un rédacteur web SEO expert pour le blog d'IES Ingredients (distributeur B2B d'ingrédients naturels : parfumerie, cosmétique, arômes alimentaires, basé en Provence).

MISSION : Transforme ce contenu en un article de blog parfaitement structuré, optimisé SEO/SEA/AEO (Answer Engine Optimization).

RÈGLES SEO CRITIQUES :
1. STRUCTURE SÉMANTIQUE : Utilise une hiérarchie de titres correcte (H2 > H3, jamais de H1)
2. MAILLAGE DE MOTS-CLÉS : Intègre naturellement les mots-clés du secteur (ingrédients naturels, cosmétique, parfumerie, arômes, bio, COSMOS, ECOCERT)
3. FEATURED SNIPPETS : Commence par répondre à la question principale en 2-3 phrases (position zéro)
4. LISIBILITÉ : Paragraphes courts (3-4 phrases max), phrases de transition, mots de liaison
5. LISTES : Utilise des listes à puces <ul>/<ol> quand pertinent (Google les adore pour les featured snippets)
6. MISE EN VALEUR : <strong> pour les termes importants, noms propres, données chiffrées
7. LONGUEUR : Article complet de 800-1500 mots minimum pour le SEO

CONTENU SOURCE :
===
{CONTENT}
===

Retourne un JSON avec cette structure EXACTE :

{
  "title_fr": "Titre SEO accrocheur en français (50-60 caractères max)",
  "title_en": "SEO-optimized English title (50-60 chars max)",
  "excerpt_fr": "Résumé optimisé pour les featured snippets, 2-3 phrases percutantes. Répond à la question principale. Max 280 caractères.",
  "excerpt_en": "English excerpt optimized for featured snippets. Max 280 chars.",
  "content_fr": "<h2>Titre section 1</h2>\\n<p>Paragraphe d'introduction avec <strong>mots-clés importants</strong> en gras...</p>\\n<h2>Titre section 2</h2>\\n<p>Suite...</p>\\n<ul>\\n<li>Point clé 1</li>\\n<li>Point clé 2</li>\\n</ul>\\n<blockquote><p>Citation si applicable</p></blockquote>",
  "content_en": "...même structure traduite en anglais professionnel...",
  "author_name": "Auteur ou contact presse si mentionné (chaîne vide sinon)",
  "meta_title": "Titre SEO < 60 caractères | IES Ingredients",
  "meta_description": "Description meta SEO 140-155 caractères avec mots-clés principaux et appel à l'action",
  "category": "press",
  "suggested_slug": "titre-article-en-kebab-case"
}

BALISES HTML AUTORISÉES dans content_fr/content_en :
- <h2> : titres de sections principales (3-5 par article)
- <h3> : sous-titres
- <p> : paragraphes (courts, 3-4 phrases)
- <strong> : mots-clés, noms propres, chiffres importants
- <em> : termes techniques, citations courtes inline
- <ul><li> : listes à puces (points clés, avantages, ingrédients)
- <ol><li> : listes numérotées (étapes, processus)
- <blockquote><p> : citations directes avec attribution

RÈGLES CONTENU :
- FIDÉLITÉ : Garde le sens et les informations du contenu source. Ne supprime rien d'important.
- ENRICHISSEMENT : Tu peux reformuler pour améliorer le SEO et la lisibilité
- category : "news" | "press" | "events" | "certifications" | "trends"
- Corrige les artefacts d'extraction (mots coupés, espaces en trop)

Retourne UNIQUEMENT le JSON. Pas de backticks, pas de commentaire.`;

interface ClaudeResponse {
  title_fr: string;
  title_en: string;
  excerpt_fr: string;
  excerpt_en: string;
  content_fr: string;
  content_en: string;
  author_name: string;
  meta_title: string;
  meta_description: string;
  category: string;
  suggested_slug: string;
}

async function analyzeWithClaude(
  content: string,
  mode: "text" | "image",
  imageBase64?: string,
  imageMimeType?: string
): Promise<Record<string, string>> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const prompt = SEO_PROMPT.replace("{CONTENT}", mode === "text" ? content : "[Voir l'image jointe — extrais tout le texte visible et transforme-le en article structuré]");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userContent: any[] = [];

  if (mode === "image" && imageBase64 && imageMimeType) {
    userContent.push({
      type: "image",
      source: {
        type: "base64",
        media_type: imageMimeType,
        data: imageBase64,
      },
    });
  }

  userContent.push({ type: "text", text: prompt });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 12000,
      messages: [{ role: "user", content: userContent }],
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

  return {
    title_fr: parsed.title_fr || "",
    title_en: parsed.title_en || "",
    excerpt_fr: parsed.excerpt_fr || "",
    excerpt_en: parsed.excerpt_en || "",
    content_fr: parsed.content_fr || "",
    content_en: parsed.content_en || "",
    author_name: parsed.author_name || "",
    meta_title: parsed.meta_title || "",
    meta_description: parsed.meta_description || "",
    category: parsed.category || "press",
    suggested_slug: parsed.suggested_slug || "",
  };
}

function fallbackStructure(rawText: string): Record<string, string> {
  const lines = rawText.split("\n");
  let title = "";
  let contentStartIndex = 0;

  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i].trim();
    if (line.length < 5 || /^communiqu[ée]/i.test(line) || /^press\s*release/i.test(line) || !line) continue;
    title = line.replace(/\s*[.:]\s*$/, "");
    contentStartIndex = i + 1;
    break;
  }

  let author = "";
  const contactIdx = lines.findIndex((l) => /contact\s*(presse|press|:)/i.test(l.trim()));
  if (contactIdx !== -1 && contactIdx + 1 < lines.length) {
    const namePart = lines[contactIdx + 1].trim().split(/[–\-—@]/).at(0)?.trim();
    if (namePart && namePart.length > 2 && namePart.length < 60) author = namePart;
  }

  const contentLines = lines.slice(contentStartIndex, contactIdx > contentStartIndex ? contactIdx : undefined);
  const paragraphs: string[] = [];
  let current = "";
  for (const line of contentLines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (current.trim()) { paragraphs.push(current.trim()); current = ""; }
    } else {
      current += (current ? " " : "") + trimmed;
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

const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isImage = IMAGE_TYPES.includes(file.type);
    const isPDF = file.type === "application/pdf";

    if (!isImage && !isPDF) {
      return NextResponse.json({ error: "Format non supporté. Utilisez PDF, JPG, PNG ou WebP." }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 10 Mo)" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let fields: Record<string, string>;
    let usedAI = false;
    let pages = 1;

    if (isImage) {
      // Image path: send directly to Claude Vision
      const base64 = buffer.toString("base64");
      try {
        fields = await analyzeWithClaude("", "image", base64, file.type);
        usedAI = true;
      } catch (err) {
        console.warn("Claude Vision failed:", err);
        return NextResponse.json({ error: "Impossible d'analyser l'image" }, { status: 500 });
      }
    } else {
      // PDF path: extract text then analyze
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdf = require("pdf-parse/lib/pdf-parse");
      const data = await pdf(buffer);
      pages = data.numpages || 1;

      if (!data.text?.trim()) {
        return NextResponse.json({ error: "Le PDF ne contient pas de texte extractible" }, { status: 400 });
      }

      const cleanedText = data.text
        .replace(/\r\n/g, "\n")
        .replace(/[^\S\n]+/g, " ")
        .replace(/\n\s*\n/g, "\n\n")
        .replace(/ +\n/g, "\n")
        .trim();

      try {
        fields = await analyzeWithClaude(cleanedText, "text");
        usedAI = true;
      } catch (err) {
        console.warn("Claude analysis failed, using fallback:", err);
        fields = fallbackStructure(cleanedText);
      }
    }

    const pCount = (fields.content_fr?.match(/<p>/g) || []).length;
    console.log(`[Import] AI: ${usedAI}, type: ${isImage ? "image" : "pdf"}, paragraphs: ${pCount}`);

    return NextResponse.json({
      fields,
      pages,
      fileName: file.name,
      _debug: { usedAI, paragraphs: pCount },
    });
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'extraction" }, { status: 500 });
  }
}
