import { NextRequest, NextResponse } from "next/server";

const LIBRETRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL || "http://libretranslate:5000";

async function translateText(text: string): Promise<string> {
  try {
    const res = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source: "fr", target: "en", format: "text" }),
    });
    if (!res.ok) return "";
    const data = await res.json();
    return data.translatedText || "";
  } catch {
    return "";
  }
}

function structureText(rawText: string) {
  // Clean up PDF extraction artifacts
  const text = rawText
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  // Extract title: first meaningful line that looks like a heading
  let title = "";
  let contentStartIndex = 0;

  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    // Skip very short lines, dates, or common headers like "COMMUNIQUÉ DE PRESSE"
    if (
      line.length < 5 ||
      /^communiqu[ée]/i.test(line) ||
      /^press\s*release/i.test(line) ||
      /^\d{1,2}[\s/.-]\d{1,2}[\s/.-]\d{2,4}$/.test(line)
    ) {
      continue;
    }
    // First real line = title candidate
    title = line.replace(/\s*[.:]\s*$/, "");
    contentStartIndex = i + 1;
    break;
  }

  // If title has a subtitle on the next line (shorter, related)
  if (
    contentStartIndex < lines.length &&
    lines[contentStartIndex].length > 10 &&
    lines[contentStartIndex].length < title.length * 2 &&
    !lines[contentStartIndex].includes(".")
  ) {
    title += " — " + lines[contentStartIndex].replace(/\s*[.:]\s*$/, "");
    contentStartIndex++;
  }

  // Extract author from "Contact presse" or similar patterns
  let author = "";
  const contactIdx = lines.findIndex((l) =>
    /contact\s*(presse|press|:)/i.test(l)
  );
  if (contactIdx !== -1 && contactIdx + 1 < lines.length) {
    const contactLine = lines[contactIdx + 1];
    const namePart = contactLine.split(/[–\-—@]/).at(0)?.trim();
    if (namePart && namePart.length > 2 && namePart.length < 60) {
      author = namePart;
    }
  }

  // Build content paragraphs (skip contact section at the end)
  const contentLines = lines.slice(
    contentStartIndex,
    contactIdx > contentStartIndex ? contactIdx : undefined
  );

  // Group lines into paragraphs
  const paragraphs: string[] = [];
  let currentParagraph = "";

  for (const line of contentLines) {
    if (line.length === 0) {
      if (currentParagraph) {
        paragraphs.push(currentParagraph.trim());
        currentParagraph = "";
      }
    } else {
      currentParagraph += (currentParagraph ? " " : "") + line;
    }
  }
  if (currentParagraph.trim()) {
    paragraphs.push(currentParagraph.trim());
  }

  // Excerpt = first paragraph (or first 2 if first is short)
  let excerpt = paragraphs[0] || "";
  if (excerpt.length < 80 && paragraphs.length > 1) {
    excerpt += " " + paragraphs[1];
  }
  // Limit excerpt
  if (excerpt.length > 300) {
    excerpt = excerpt.slice(0, 297).replace(/\s+\S*$/, "") + "...";
  }

  // Content as HTML
  const contentHtml = paragraphs
    .map((p) => `<p>${p}</p>`)
    .join("\n");

  // Meta description
  const metaDescription =
    excerpt.length > 160
      ? excerpt.slice(0, 157).replace(/\s+\S*$/, "") + "..."
      : excerpt;

  return {
    title_fr: title,
    excerpt_fr: excerpt,
    content_fr: contentHtml,
    author_name: author,
    meta_description: metaDescription,
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

    // Structure the text into article fields
    const fields = structureText(data.text);

    // Auto-translate to English in parallel
    const [titleEn, excerptEn, contentEn] = await Promise.all([
      translateText(fields.title_fr),
      translateText(fields.excerpt_fr),
      // Translate content paragraphs (strip HTML, translate, re-wrap)
      (async () => {
        const plainParagraphs = fields.content_fr
          .replace(/<\/?p>/g, "|||")
          .split("|||")
          .filter(Boolean);
        const translated = await Promise.all(
          plainParagraphs.map((p) => translateText(p))
        );
        return translated
          .filter(Boolean)
          .map((p) => `<p>${p}</p>`)
          .join("\n");
      })(),
    ]);

    return NextResponse.json({
      fields: {
        ...fields,
        title_en: titleEn,
        excerpt_en: excerptEn,
        content_en: contentEn,
      },
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
