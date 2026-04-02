import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import sharp from "sharp";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SEO_PROMPT = `Tu es un rédacteur web SEO expert pour le blog d'IES Ingredients (distributeur B2B d'ingrédients naturels : parfumerie, cosmétique, arômes alimentaires, basé en Provence).

Ce contenu provient d'un article web existant. Ta mission est de le transformer en un article de blog IMPACTANT, visuellement riche et optimisé SEO/SEA/AEO.

RÈGLES SEO :
1. STRUCTURE SÉMANTIQUE : Hiérarchie de titres correcte (H2 > H3, jamais de H1)
2. MAILLAGE DE MOTS-CLÉS : Intègre naturellement les mots-clés du secteur (ingrédients naturels, cosmétique, parfumerie, arômes, bio, COSMOS, ECOCERT)
3. FEATURED SNIPPETS : Commence par répondre à la question principale en 2-3 phrases
4. LISIBILITÉ : Paragraphes courts (3-4 phrases max), phrases de transition
5. LISTES : <ul>/<ol> quand pertinent pour aérer le contenu
6. MISE EN VALEUR : <strong> pour les termes importants, noms propres, données chiffrées
7. LONGUEUR : Article complet de 800-1500 mots minimum

RÈGLES DE MISE EN FORME IMPACTANTE :
1. CHIFFRES CLÉS : Quand il y a des données chiffrées importantes, utilise un encadré dédié :
   <div class="key-figure"><span class="key-figure-number">2 000</span><span class="key-figure-label">arbres plantés</span></div>
   Tu peux en mettre plusieurs côte à côte dans un <div class="key-figures">...</div>

2. ENCADRÉS "À RETENIR" : Pour les informations importantes, utilise :
   <div class="callout"><p><strong>À retenir :</strong> texte important ici...</p></div>

3. LIENS EXTERNES : Ajoute 2-4 liens pertinents vers des sources officielles en rapport avec le sujet.
   Par exemple : sites officiels des organisations mentionnées, mairies, labels, partenaires.
   Utilise la balise <a href="URL" target="_blank" rel="noopener noreferrer">texte du lien</a>
   Exemple : <a href="https://www.allauch.com" target="_blank" rel="noopener noreferrer">Ville d'Allauch</a>

4. LIENS INTERNES : Ajoute 1-2 liens vers d'autres pages du site IES Ingredients quand c'est pertinent :
   - Page entreprise : <a href="/fr/entreprise">IES Ingredients</a>
   - Page catalogue : <a href="/fr/catalogue">notre catalogue</a>
   - Page actualités : <a href="/fr/actualites">nos actualités</a>
   - Page équipe : <a href="/fr/equipe">notre équipe</a>

5. SÉPARATEURS : Utilise <hr> entre les grandes sections pour aérer visuellement.

6. CITATIONS : Pour les paroles rapportées, utilise <blockquote><p>citation</p></blockquote>

IMPORTANT : Si le contenu source est un communiqué de presse, reproduis le texte FIDÈLEMENT.
Indices : mention "communiqué de presse", "press release", contact presse, date et lieu en début, citations de dirigeants.
Si c'est un communiqué de presse :
- title_fr : le titre EXACT du communiqué
- content_fr : texte original fidèle, juste structuré en HTML (mais tu peux ajouter les key-figures et liens)
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
  "content_fr": "Contenu HTML structuré avec encadrés, liens, chiffres clés",
  "content_en": "English translation avec les mêmes enrichissements",
  "author_name": "Auteur si mentionné (chaîne vide sinon)",
  "published_at": "Date de publication originale au format ISO 8601 (YYYY-MM-DD). Cherche dans les métadonnées (article:published_time, datePublished), le texte visible (date en début d'article, byline), ou le contenu. Chaîne vide si introuvable.",
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
- <a href="..." target="_blank" rel="noopener noreferrer"> : liens externes
- <a href="/fr/..."> : liens internes
- <hr> : séparateur entre sections
- <div class="key-figures"> + <div class="key-figure"> : encadrés chiffres clés
- <div class="callout"> : encadré "à retenir"
- <div class="image-grid"> : grille responsive d'images (utilisé pour 3-5 photos)
- <div class="image-carousel"> : carrousel d'images swipeable (utilisé pour 6+ photos)

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
  const publishedDate = $('meta[property="article:published_time"]').attr("content")
    || $('meta[name="date"]').attr("content")
    || $('meta[name="DC.date"]').attr("content")
    || $('time[datetime]').first().attr("datetime")
    || "";

  // Remove non-content elements
  REMOVE_SELECTORS.forEach((sel) => $(sel).remove());

  // Find the main content area
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let $content: any = $("body");
  for (const selector of CONTENT_SELECTORS) {
    const $found = $(selector);
    if ($found.length > 0) {
      $content = $found.first();
      break;
    }
  }

  // Extract images from content (best resolution available)
  const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif|avif)(\?.*)?$/i;
  const images: { src: string; alt: string }[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $content.find("img").each((_: any, el: any) => {
    let bestSrc = "";

    // 1. Check parent <a> linking to full-size image (common WordPress pattern)
    const parentA = $(el).closest("a");
    if (parentA.length) {
      const href = parentA.attr("href") || "";
      if (href && IMAGE_EXTENSIONS.test(href)) {
        bestSrc = href;
      }
    }

    // 2. WordPress-specific full resolution attributes
    if (!bestSrc) {
      bestSrc = $(el).attr("data-full-url") || $(el).attr("data-orig-file") || $(el).attr("data-large-file") || "";
    }

    // 3. Parse srcset for highest resolution
    if (!bestSrc) {
      const srcset = $(el).attr("srcset") || $(el).attr("data-srcset") || "";
      if (srcset) {
        const candidates = srcset.split(",").map((s: string) => s.trim()).filter(Boolean);
        let maxWidth = 0;
        for (const candidate of candidates) {
          const parts = candidate.split(/\s+/);
          const url = parts[0];
          const descriptor = parts[1] || "";
          const width = parseInt(descriptor) || 0;
          if (width > maxWidth || !bestSrc) {
            maxWidth = width;
            bestSrc = url;
          }
        }
      }
    }

    // 4. Fallback to data-src (lazy loading) then src
    if (!bestSrc) {
      bestSrc = $(el).attr("data-src") || $(el).attr("data-lazy-src") || $(el).attr("src") || "";
    }

    if (!bestSrc || bestSrc.startsWith("data:") || bestSrc.endsWith(".svg")) return;

    try {
      const absoluteUrl = new URL(bestSrc, sourceUrl).href;
      images.push({ src: absoluteUrl, alt: $(el).attr("alt") || "" });
    } catch {
      // Skip invalid URLs
    }
  });

  // Extract background-image URLs (WordPress hero/banner pattern)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $("[style*='background-image']").each((_: any, el: any) => {
    const style = $(el).attr("style") || "";
    const match = style.match(/background-image\s*:\s*url\(\s*['"]?([^'")\s]+)['"]?\s*\)/i);
    if (match && match[1]) {
      const bgUrl = match[1];
      if (!bgUrl.startsWith("data:") && !bgUrl.endsWith(".svg")) {
        try {
          const absoluteUrl = new URL(bgUrl, sourceUrl).href;
          // Add as first image (likely the hero/banner)
          if (!images.some((img) => img.src === absoluteUrl)) {
            images.unshift({ src: absoluteUrl, alt: "" });
          }
        } catch {
          // Skip
        }
      }
    }
  });

  // Add og:image as fallback — don't override hero background-image if present
  if (ogImage) {
    try {
      const absoluteOg = new URL(ogImage, sourceUrl).href;
      if (!images.some((img) => img.src === absoluteOg)) {
        if (images.length > 0) {
          images.push({ src: absoluteOg, alt: "" });
        } else {
          images.unshift({ src: absoluteOg, alt: "" });
        }
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
    publishedDate,
    textContent,
    htmlContent,
    images: images.slice(0, 10), // Limit to 10 images
  };
}

// ── AI Image Metadata ──

async function generateImageMetadata(
  base64: string,
  mimeType: string
): Promise<{ alt: string; title: string; description: string }> {
  if (!ANTHROPIC_API_KEY) return { alt: "", title: "", description: "" };

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mimeType, data: base64 },
            },
            {
              type: "text",
              text: `Analyse cette image pour la médiathèque d'IES Ingredients (distributeur B2B d'ingrédients naturels : parfumerie, cosmétique, arômes).
Retourne un JSON avec :
- "alt": texte alternatif SEO concis (max 120 caractères), factuel et accessible
- "title": titre court de l'image (max 80 caractères)
- "description": description détaillée (1-2 phrases, max 200 caractères)
Retourne UNIQUEMENT le JSON, sans backticks.`,
            },
          ],
        }],
      }),
    });

    if (!res.ok) return { alt: "", title: "", description: "" };
    const data = await res.json();
    const text = (data.content?.[0]?.text || "").trim();
    const parsed = JSON.parse(text.replace(/^```json?\s*/, "").replace(/\s*```$/, ""));
    return {
      alt: parsed.alt || "",
      title: parsed.title || "",
      description: parsed.description || "",
    };
  } catch {
    return { alt: "", title: "", description: "" };
  }
}

// ── Image Download & Upload ──

interface UploadedImage {
  url: string;
  alt: string;
  title: string;
  description: string;
}

// Try to fetch an image URL, returns response or null
async function tryFetchImage(url: string): Promise<Response | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) return null;
    return res;
  } catch {
    return null;
  }
}

async function downloadAndUploadImage(
  imageUrl: string,
  adminClient: ReturnType<typeof createAdminClient>
): Promise<UploadedImage | null> {
  try {
    // Try full-size first (strip WordPress thumbnail suffix), then fallback to original
    const WP_THUMB_REGEX = /-\d+x\d+(\.(jpe?g|png|webp|gif|avif))/i;
    const fullSizeUrl = imageUrl.replace(WP_THUMB_REGEX, "$1");

    let res: Response | null = null;

    // If URL has a thumbnail suffix, try the full-size version first
    if (fullSizeUrl !== imageUrl) {
      res = await tryFetchImage(fullSizeUrl);
      if (res) {
        console.log(`[URL Import] Full-size found: ${fullSizeUrl}`);
      }
    }

    // Fallback to original URL
    if (!res) {
      res = await tryFetchImage(imageUrl);
    }

    if (!res) return null;

    const rawBuffer = Buffer.from(await res.arrayBuffer());

    // Skip tiny images (likely tracking pixels)
    if (rawBuffer.length < 1000) return null;

    // Smart resize + compress to WebP with sharp
    const meta = await sharp(rawBuffer).metadata();
    const w = meta.width || 0;
    const h = meta.height || 0;
    const ratio = w && h ? w / h : 1;

    let maxWidth: number | undefined;
    let maxHeight: number | undefined;
    if (ratio >= 2.5) {
      maxWidth = 1400; // banner
    } else if (ratio > 1) {
      maxWidth = 1280; // landscape
    } else if (ratio > 0.9) {
      maxWidth = 640; maxHeight = 640; // square
    } else {
      maxHeight = 853; // portrait → 640x853 for 3:4
    }

    const resized = sharp(rawBuffer)
      .resize({ width: maxWidth, height: maxHeight, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 });

    const webpBuffer = await resized.toBuffer();
    const finalMeta = await sharp(webpBuffer).metadata();

    const fileName = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

    const { error } = await adminClient.storage
      .from("product-images")
      .upload(fileName, webpBuffer, {
        upsert: true,
        contentType: "image/webp",
      });

    if (error) {
      console.warn("Upload error for", imageUrl, error.message);
      return null;
    }

    const { data: { publicUrl } } = adminClient.storage
      .from("product-images")
      .getPublicUrl(fileName);

    // Generate AI metadata (alt, title, description)
    const base64 = webpBuffer.toString("base64");
    const metadata = await generateImageMetadata(base64, "image/webp");

    // Track in media library
    try {
      const originalName = imageUrl.split("/").pop()?.split("?")[0] || fileName;
      await (adminClient.from("media" as never) as ReturnType<typeof adminClient.from>).insert({
        file_name: metadata.title || originalName,
        file_url: publicUrl,
        file_size: webpBuffer.length,
        file_type: "image/webp",
        width: finalMeta.width || 0,
        height: finalMeta.height || 0,
        folder: "blog",
        alt_text: metadata.alt,
        description: metadata.description,
      });
    } catch {
      // Media tracking is non-critical
    }

    return {
      url: publicUrl,
      alt: metadata.alt,
      title: metadata.title,
      description: metadata.description,
    };
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
    published_at: parsed.published_at || "",
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
    const { pageTitle, publishedDate, textContent, images } = extractContent(pageHtml, url);

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
    const uploadedImages: UploadedImage[] = [];

    imageResults.forEach((result, i) => {
      if (result.status === "fulfilled" && result.value) {
        const uploaded = result.value;
        imageMap.set(images[i].src, uploaded.url);
        uploadedImages.push(uploaded);
        if (!coverImageUrl) {
          coverImageUrl = uploaded.url;
        }
      }
    });

    // Remove cover image from content images (avoid duplication)
    const contentImages = uploadedImages.filter((img) => img.url !== coverImageUrl);

    const dateLine = publishedDate ? `Date de publication détectée : ${publishedDate}\n` : "";
    const contentForAI = `${dateLine}${pageTitle ? `Titre de la page : ${pageTitle}\n\n` : ""}${textContent.slice(0, 15000)}`;

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

    // 7. Set cover image
    if (coverImageUrl) {
      fields.cover_image_url = coverImageUrl;
    }

    // Preserve original slug from source URL for SEO continuity
    try {
      const sourceSlug = new URL(url).pathname
        .replace(/^\/+|\/+$/g, "")  // trim slashes
        .split("/")
        .pop() || "";
      if (sourceSlug && sourceSlug.length > 2) {
        fields.suggested_slug = sourceSlug
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9-]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
      }
    } catch {
      // Keep Claude's suggested slug as fallback
    }

    // 8. Inject content images as grid or carousel
    if (contentImages.length > 0) {
      const imgTags = contentImages
        .map((img) => `<img src="${img.url}" alt="${img.alt || "illustration"}" />`)
        .join("\n");

      // 3+ images → grid, 6+ → carousel, 1-2 → individual placement
      let gallery = "";
      if (contentImages.length >= 6) {
        gallery = `<div class="image-carousel">\n${imgTags}\n</div>`;
      } else if (contentImages.length >= 3) {
        gallery = `<div class="image-grid">\n${imgTags}\n</div>`;
      }

      for (const lang of ["content_fr", "content_en"] as const) {
        if (!fields[lang]) continue;

        if (gallery) {
          // Insert gallery after first H2 + first paragraph
          const firstH2Close = fields[lang].indexOf("</h2>");
          if (firstH2Close !== -1) {
            const afterH2 = firstH2Close + 5;
            const nextPClose = fields[lang].indexOf("</p>", afterH2);
            const insertPos = nextPClose !== -1 ? nextPClose + 4 : afterH2;
            fields[lang] = fields[lang].slice(0, insertPos) + "\n" + gallery + "\n" + fields[lang].slice(insertPos);
          } else {
            // No H2 — insert after first paragraph
            const firstPClose = fields[lang].indexOf("</p>");
            const insertPos = firstPClose !== -1 ? firstPClose + 4 : 0;
            fields[lang] = fields[lang].slice(0, insertPos) + "\n" + gallery + "\n" + fields[lang].slice(insertPos);
          }
        } else {
          // 1-2 images — insert individually after first H2
          const firstH2Close = fields[lang].indexOf("</h2>");
          if (firstH2Close !== -1) {
            const afterH2 = firstH2Close + 5;
            const nextPClose = fields[lang].indexOf("</p>", afterH2);
            const insertPos = nextPClose !== -1 ? nextPClose + 4 : afterH2;
            fields[lang] = fields[lang].slice(0, insertPos) + "\n" + imgTags + "\n" + fields[lang].slice(insertPos);
          } else {
            fields[lang] += "\n" + imgTags;
          }
        }
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
