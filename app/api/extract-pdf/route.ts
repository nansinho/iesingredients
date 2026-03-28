import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SEO_PROMPT = `Tu es un rédacteur web SEO expert pour le blog d'IES Ingredients (distributeur B2B d'ingrédients naturels : parfumerie, cosmétique, arômes alimentaires, basé en Provence).

ÉTAPE 1 — DÉTECTION DU TYPE DE CONTENU :
Analyse le contenu source et détermine s'il s'agit d'un communiqué de presse (press release) ou d'un autre type de contenu.
Indices d'un communiqué de presse : mention "communiqué de presse", "press release", contact presse, date et lieu en début, citations de dirigeants, ton institutionnel.

ÉTAPE 2 — TRAITEMENT SELON LE TYPE :

=== SI COMMUNIQUÉ DE PRESSE (category = "press") ===
RÈGLE ABSOLUE : Tu ne dois JAMAIS réécrire, reformuler ou inventer du contenu.
- title_fr : le titre EXACT du communiqué tel qu'il apparaît dans le document source (ne pas inventer un nouveau titre)
- content_fr : reproduis FIDÈLEMENT le texte original, mot pour mot. Tu ne fais que :
  1. Corriger les artefacts d'extraction PDF (mots coupés, espaces en trop, retours à la ligne cassés)
  2. Structurer en HTML avec les balises autorisées (h2, p, strong, blockquote, etc.)
  3. Mettre en <strong> les noms propres, dates et chiffres déjà présents
  4. Mettre les citations directes en <blockquote><p> avec le nom et titre de la personne en <strong> avant la citation. Supprimer les guillemets ouvrants/fermants (" " « ») qui entourent le bloc entier car la balise <blockquote> sert déjà d'indicateur de citation — ne garder que les guillemets « » autour de la phrase citée elle-même
- excerpt_fr : les 2-3 premières phrases du communiqué (telles quelles, pas de réécriture)
- NE PAS ajouter de mots-clés SEO qui ne sont pas dans le texte original
- NE PAS reformuler les phrases
- NE PAS changer l'ordre des paragraphes
- NE PAS inventer de contenu supplémentaire

STRUCTURE PARAGRAPHIQUE (CRITIQUE) :
- Chaque paragraphe du document source = un <p> SÉPARÉ. Ne JAMAIS fusionner plusieurs paragraphes en un seul <p>.
- Quand le document a un saut de ligne/section entre deux blocs de texte, c'est un nouveau <p>.
- CHAQUE citation directe = son propre <blockquote><p>...</p></blockquote> SÉPARÉ.
- INTERDIT de mettre plusieurs citations dans un seul <blockquote>. Si deux personnes sont citées, il faut DEUX balises <blockquote> distinctes.

EXEMPLE de structure attendue pour un communiqué :
<p><strong>Allauch, le 26 février 2026</strong> – Après 33 années à la tête d'IES Ingredients...</p>
<p>Grâce à un portefeuille de partenaires prestigieux...</p>
<p>Depuis le <strong>1er février 2026</strong>, la direction générale est assurée par...</p>
<blockquote><p><strong>Noël Poinsignon</strong>, directeur général : « Je suis honoré... »</p></blockquote>
<blockquote><p><strong>Marion Fabre</strong>, directrice générale adjointe : « Je suis enthousiaste... »</p></blockquote>
<p><strong>François-Patrick Sabater</strong> tient à remercier...</p>
<p>Cette transition marque une étape majeure...</p>

=== SI AUTRE CONTENU (news, events, certifications, trends) ===
MISSION : Transforme ce contenu en un article de blog parfaitement structuré, optimisé SEO/SEA/AEO.
RÈGLES SEO :
1. STRUCTURE SÉMANTIQUE : Hiérarchie de titres correcte (H2 > H3, jamais de H1)
2. MAILLAGE DE MOTS-CLÉS : Intègre naturellement les mots-clés du secteur (ingrédients naturels, cosmétique, parfumerie, arômes, bio, COSMOS, ECOCERT)
3. FEATURED SNIPPETS : Commence par répondre à la question principale en 2-3 phrases
4. LISIBILITÉ : Paragraphes courts (3-4 phrases max), phrases de transition
5. LISTES : <ul>/<ol> quand pertinent
6. MISE EN VALEUR : <strong> pour les termes importants, noms propres, données chiffrées
7. LONGUEUR : Article complet de 800-1500 mots minimum

CONTENU SOURCE :
===
{CONTENT}
===

Retourne un JSON avec cette structure EXACTE :

{
  "title_fr": "Titre français (pour press : titre EXACT du document source)",
  "title_en": "English title (for press: faithful translation of original title)",
  "excerpt_fr": "Résumé 2-3 phrases. Max 280 caractères. (pour press : premières phrases du document)",
  "excerpt_en": "English excerpt. Max 280 chars.",
  "content_fr": "Contenu HTML structuré (pour press : texte original fidèle mis en forme HTML)",
  "content_en": "English translation (pour press : traduction fidèle, pas de réécriture)",
  "author_name": "Auteur ou contact presse si mentionné (chaîne vide sinon)",
  "meta_title": "Titre SEO < 60 caractères | IES Ingredients",
  "meta_description": "Description meta 140-155 caractères",
  "category": "press | news | events | certifications | trends",
  "suggested_slug": "titre-article-en-kebab-case"
}

BALISES HTML AUTORISÉES dans content_fr/content_en :
- <h2> : titres de sections principales
- <h3> : sous-titres
- <p> : paragraphes
- <strong> : mots-clés, noms propres, chiffres importants
- <em> : termes techniques, citations courtes inline
- <ul><li> : listes à puces
- <ol><li> : listes numérotées
- <blockquote><p> : citations directes avec attribution

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

async function generateImageAlt(
  imageBase64: string,
  imageMimeType: string
): Promise<string> {
  if (!ANTHROPIC_API_KEY) throw new Error("No API key");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [{
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: imageMimeType, data: imageBase64 },
          },
          {
            type: "text",
            text: "Génère un texte alternatif SEO concis (max 120 caractères) pour cette image, en français. Décris ce qu'on voit de manière factuelle et utile pour l'accessibilité. Retourne UNIQUEMENT le texte, sans guillemets ni explication.",
          },
        ],
      }],
    }),
  });

  if (!res.ok) throw new Error("Claude API error");
  const data = await res.json();
  return (data.content?.[0]?.text || "").trim();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const altOnly = formData.get("altOnly") === "true";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Alt-only mode: generate just the alt text for an image
    if (altOnly && file.type.startsWith("image/")) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString("base64");
      try {
        const alt = await generateImageAlt(base64, file.type);
        return NextResponse.json({ alt });
      } catch {
        return NextResponse.json({ alt: "" });
      }
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
