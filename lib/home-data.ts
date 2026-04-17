import { createPublicClient } from "@/lib/supabase/public";
import type { Product } from "@/lib/product-types";

const FEATURED_TABLES = ["cosmetique_fr", "parfum_fr", "aromes_fr"] as const;
const FEATURED_TARGET = 6;
const PER_TABLE_LIMIT = 6;

export interface HomeArticle {
  id: string;
  slug: string;
  title_fr: string;
  title_en: string | null;
  excerpt_fr: string | null;
  excerpt_en: string | null;
  cover_image_url: string | null;
  category: string | null;
  published_at: string | null;
  created_at: string;
}

/**
 * Fetch featured products for the homepage in a single parallel pass.
 *
 * Replaces three sequential queries (and an optional fallback round) with one
 * Promise.all. Result is a balanced selection of {@link FEATURED_TARGET}
 * products across the three universes, preferring those with a description.
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = createPublicClient();

  const results = await Promise.all(
    FEATURED_TABLES.map((table) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from(table) as any)
        .select("*")
        .eq("statut", "ACTIF")
        .order("nom_commercial", { ascending: true })
        .limit(PER_TABLE_LIMIT),
    ),
  );

  const byTable: Record<string, Product[]> = {};
  FEATURED_TABLES.forEach((table, i) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = (results[i].data || []) as any[];
    // Prefer products with a description (matches the previous behaviour),
    // then fall back to the rest, in stable nom_commercial order.
    const withDesc = rows.filter((p) => p.description != null);
    const withoutDesc = rows.filter((p) => p.description == null);
    byTable[table] = [...withDesc, ...withoutDesc].map(
      (p) => ({ ...p, _table: table }) as Product,
    );
  });

  // Round-robin pick across the three universes for a balanced selection.
  const selected: Product[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < PER_TABLE_LIMIT && selected.length < FEATURED_TARGET; i++) {
    for (const table of FEATURED_TABLES) {
      if (selected.length >= FEATURED_TARGET) break;
      const candidate = byTable[table][i];
      if (!candidate) continue;
      const key = `${table}-${candidate.id}`;
      if (seen.has(key)) continue;
      seen.add(key);
      selected.push(candidate);
    }
  }

  return selected;
}

/**
 * Fetch the latest published blog articles for the homepage carousel.
 */
export async function getLatestArticles(): Promise<HomeArticle[]> {
  const supabase = createPublicClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from("blog_articles") as any)
    .select(
      "id, slug, title_fr, title_en, excerpt_fr, excerpt_en, cover_image_url, category, published_at, created_at",
    )
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(6);

  return (data ?? []) as HomeArticle[];
}
