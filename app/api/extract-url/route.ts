import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SEO_PROMPT = `Tu es un rédacteur web SEO expert pour le blog d'IES Ingredients (distributeur B2B d'ingrédients naturels : parfumerie, cosmétique, arômes alimentaires, basé en Provence).

Ce contenu provient d'un article web existant. Ta mission est de le transformer en un article de blog parfaitement structuré, optimisé SEO/SEA/AEO.

RÈGLES SEO :
1. STRUCTURE SÉMANTIQUE : Hiérarchie de titres correcte (H2 > H3, jamais de H1)
2. MAILLAGE DE MOTS-CLÉS : Intègre naturellement les mots-clés du secteur (ingrédients naturels, cosmétique, parfumerie, arômes, bio, COSMOS, ECOCERT)
3. FEATURED SNIPPETS : Commence par répondre à la question principale en 2-3 phrases
4. LISIBILITÉ : Paragraphes courts (3-4 phrases max), phrases de transition
5. LISTES : <ul>/<ol> quand pertinent
6. MISE EN VALEUR : <strong> pour les termes importants, noms propres, données chiffrées
7. LONGUEUR : Article complet de 800-1500 mots minimum

IMPORTANT : Si le contenu source est un communiqué de presse, reproduis le texte FIDÈLEMENT (voir règles presse ci-dessous).
Indices d'un communiqué de presse : mention "communiqué de presse", "press release", contact presse, date et lieu en début, citations de dirigeants.
Si c'est un communiqué de presse :
- title_fr : le titre EXACT du communiqué
- content_fr : texte original fidèle, juste structuré en HTML
- category : "press"

CONTENU SOURCE :
===
{CONTENT}
===

Retourne un JSON avec cette structure EXACTE :

{
  "title_fr": "Titre français",
  "title_en": "English title",
  "excerpt_fr": "Résumé 2-3 phrases. Max 280 caractères.",
  "excerpt_en": "English excerpt. Max 280 chars.",
  "content_fr": "Contenu HTML structuré",
  "content_en": "English translation",
  "author_name": "Auteur si mentionné (chaîne vide sinon)",
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

// ── HTML Extraction ──

const CONTENT_SELECTORS = [
  "article",
  "[role='main']",
  ".post-content",
  ".article-body",
  ".entry-content",
  ".post-body",
  "#content",
  "main",
];

const REMOVE_SELECTORS = [
  "script", "style", "noscript", "iframe",
  "nav", "footer", "header", "aside",
  ".sidebar", ".comments", ".comment",
  ".share", ".social", ".ad", ".advertisement",
  "[role='navigation']", "[role='complementary']",
  ".cookie", ".popup", ".modal", ".newsletter",
  ".breadcrumb", ".pagination",
];

function extractContent(html: string, sourceUrl: string) {
  const $ = cheerio.load(html);

  // Extract metadata
  const pageTitle = $("title").text().trim();
  const metaDescription = $('meta[name="description"]').attr("content") || "";
  const ogImage = $('meta[property="og:image"]').attr("content") || "";

  // Remove non-content elements
  REMOVE_SELECTORS.forEach((sel) => $(sel).remove());

  // Find the main content area
  let $content: cheerio.Cheerio<cheerio.Element> | null = null;
  for (const selector of CONTENT_SELECTORS) {
    const $found = $(selector);
    if ($found.length > 0) {
      $content = $found.first();
      break;
    }
  }
  if (!$content) {
    $content = $("body");
  }

  // Extract images from content
  const images: { src: string; alt: string }[] = [];
  $content.find("img").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || "";
    if (!src || src.startsWith("data:") || src.endsWith(".svg")) return;
    try {
      const absoluteUrl = new URL(src, sourceUrl).href;
      images.push({ src: absoluteUrl, alt: $(el).attr("alt") || "" });
    } catch {
      // Skip invalid URLs
    }
  });

  // Add og:image as first image if not already present
  if (ogImage) {
    try {
      const absoluteOg = new URL(ogImage, sourceUrl).href;
      if (!images.some((img) => img.src === absoluteOg)) {
        images.unshift({ src: absoluteOg, alt: "" });
      }
    } catch {
      // Skip
    }
  }

  // Get text content (preserving some structure)
  const textContent = $content.text().replace(/\s+/g, " ").trim();

  // Get HTML content for better structure preservation
  const htmlContent = $content.html() || "";

  return {
    pageTitle,
    metaDescription,
    textContent,
    htmlContent,
    images: images.slice(0, 10), // Limit to 10 images
  };
}

// ── Image Download & Upload ──

async function downloadAndUploadImage(
  imageUrl: string,
  adminClient: ReturnType<typeof createAdminClient>
): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) return null;

    const buffer = Buffer.from(await res.arrayBuffer());

    // Skip tiny images (likely tracking pixels)
    if (buffer.length < 1000) return null;

    const ext = contentType.includes("png") ? "png"
      : contentType.includes("webp") ? "webp"
      : contentType.includes("gif") ? "gif"
      : "jpg";

    const fileName = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error } = await adminClient.storage
      .from("product-images")
      .upload(fileName, buffer, {
        upsert: true,
        contentType,
      });

    if (error) {
      console.warn("Upload error for", imageUrl, error.message);
      return null;
    }

    const { data: { publicUrl } } = adminClient.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return publicUrl;
  } catch {
    return null;
  }
}

// ── Claude AI Analysis ──

async function analyzeWithClaude(content: string): Promise<Record<string, string>> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  const prompt = SEO_PROMPT.replace("{CONTENT}", content);

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
      messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
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
  const parsed = JSON.parse(jsonStr);

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
    category: parsed.category || "news",
    suggested_slug: parsed.suggested_slug || "",
  };
}

// ── Main Route ──

export async function POST(request: NextRequest) {
  try {
    // 1. Auth check
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    // 2. Parse URL
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL manquante" }, { status: 400 });
    }

    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return NextResponse.json({ error: "URL invalide (HTTP/HTTPS uniquement)" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "URL invalide" }, { status: 400 });
    }

    // 3. Fetch the page
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let pageHtml: string;
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
        },
        redirect: "follow",
      });
      clearTimeout(timeout);

      if (!res.ok) {
        return NextResponse.json({ error: `Impossible de récupérer la page (${res.status})` }, { status: 400 });
      }

      pageHtml = await res.text();
    } catch {
      clearTimeout(timeout);
      return NextResponse.json({ error: "Impossible de récupérer la page (timeout ou erreur réseau)" }, { status: 400 });
    }

    // Limit HTML size
    if (pageHtml.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Page trop volumineuse" }, { status: 400 });
    }

    // 4. Extract content
    const { pageTitle, textContent, images } = extractContent(pageHtml, url);

    if (!textContent || textContent.length < 50) {
      return NextResponse.json({ error: "Aucun contenu exploitable trouvé sur cette page" }, { status: 400 });
    }

    // 5. Download and re-upload images
    const adminClient = createAdminClient();
    const imageResults = await Promise.allSettled(
      images.map((img) => downloadAndUploadImage(img.src, adminClient))
    );

    const imageMap = new Map<string, string>();
    let coverImageUrl = "";

    imageResults.forEach((result, i) => {
      if (result.status === "fulfilled" && result.value) {
        imageMap.set(images[i].src, result.value);
        if (!coverImageUrl) {
          coverImageUrl = result.value;
        }
      }
    });

    // 6. Analyze with Claude AI
    // Include page title as context for better analysis
    const contentForAI = pageTitle
      ? `Titre de la page : ${pageTitle}\n\n${textContent.slice(0, 15000)}`
      : textContent.slice(0, 15000);

    let fields: Record<string, string>;
    let usedAI = false;

    try {
      fields = await analyzeWithClaude(contentForAI);
      usedAI = true;
    } catch (err) {
      console.warn("Claude analysis failed:", err);
      // Fallback: basic extraction
      fields = {
        title_fr: pageTitle || "",
        content_fr: `<p>${textContent.slice(0, 3000)}</p>`,
        excerpt_fr: textContent.slice(0, 280),
        category: "news",
      };
    }

    // 7. Replace image URLs in content and set cover
    if (coverImageUrl) {
      fields.cover_image_url = coverImageUrl;
    }

    // Replace original image URLs with Supabase URLs in content
    for (const [originalUrl, supabaseUrl] of imageMap) {
      if (fields.content_fr) {
        fields.content_fr = fields.content_fr.split(originalUrl).join(supabaseUrl);
      }
      if (fields.content_en) {
        fields.content_en = fields.content_en.split(originalUrl).join(supabaseUrl);
      }
    }

    const pCount = (fields.content_fr?.match(/<p>/g) || []).length;
    console.log(`[URL Import] AI: ${usedAI}, images: ${imageMap.size}/${images.length}, paragraphs: ${pCount}`);

    return NextResponse.json({
      fields,
      _debug: { usedAI, paragraphs: pCount, imagesFound: images.length, imagesUploaded: imageMap.size, sourceUrl: url },
    });
  } catch (err) {
    console.error("[extract-url] Error:", err);
    return NextResponse.json({ error: "Erreur lors de l'extraction" }, { status: 500 });
  }
}
