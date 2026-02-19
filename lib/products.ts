import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/product-types";

// Re-export types and utils for server-side imports
export type { Product } from "@/lib/product-types";
export { getCategoryConfig } from "@/lib/product-types";

export interface SearchParams {
  search?: string;
  category?: string;
  gamme?: string;
  origine?: string;
  page?: string;
}

const PAGE_SIZE = 24;

export async function searchProducts(params: SearchParams) {
  const supabase = await createClient();
  const page = parseInt(params.page || "1", 10);
  const offset = (page - 1) * PAGE_SIZE;

  let allProducts: Product[] = [];

  const cat = params.category?.toLowerCase();
  const tables: string[] =
    cat === "cosmetique"
      ? ["cosmetique_fr"]
      : cat === "parfum"
        ? ["parfum_fr"]
        : cat === "arome"
          ? ["aromes_fr"]
          : ["cosmetique_fr", "parfum_fr", "aromes_fr"];

  for (const table of tables) {
    let query = supabase
      .from(table)
      .select("*")
      .eq("statut", "ACTIF")
      .order("nom_commercial", { ascending: true });

    if (params.search) {
      query = query.or(
        `nom_commercial.ilike.%${params.search}%,code.ilike.%${params.search}%,description.ilike.%${params.search}%`
      );
    }

    if (params.gamme) {
      query = query.eq("gamme", params.gamme);
    }

    if (params.origine) {
      query = query.eq("origine", params.origine);
    }

    const { data, error } = await query;

    if (!error && data) {
      allProducts = [
        ...allProducts,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...data.map((p: any) => ({ ...p, _table: table }) as Product),
      ];
    }
  }

  allProducts.sort((a, b) =>
    (a.nom_commercial || "").localeCompare(b.nom_commercial || "")
  );

  const total = allProducts.length;
  const products = allProducts.slice(offset, offset + PAGE_SIZE);

  return { products, total, page, pageSize: PAGE_SIZE, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export async function getProduct(code: string): Promise<Product | null> {
  const supabase = await createClient();

  for (const table of ["cosmetique_fr", "parfum_fr", "aromes_fr"]) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("code", code)
      .eq("statut", "ACTIF")
      .maybeSingle();

    if (!error && data) {
      return { ...(data as Record<string, unknown>), _table: table } as Product;
    }
  }

  return null;
}

export async function getAllProductCodes(): Promise<string[]> {
  const supabase = await createClient();
  const codes: string[] = [];

  for (const table of ["cosmetique_fr", "parfum_fr", "aromes_fr"]) {
    const { data } = await supabase
      .from(table)
      .select("code")
      .eq("statut", "ACTIF")
      .not("code", "is", null);

    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      codes.push(...data.map((p: any) => p.code).filter(Boolean));
    }
  }

  return codes;
}
