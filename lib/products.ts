import { createClient } from "@/lib/supabase/server";
import type { Product, PerformanceRow, StabiliteRow } from "@/lib/product-types";

// Re-export types and utils for server-side imports
export type { Product, PerformanceRow, StabiliteRow } from "@/lib/product-types";
export { getCategoryConfig } from "@/lib/product-types";

export interface SearchParams {
  search?: string;
  category?: string;
  famille?: string;
  origine?: string;
  aspect?: string;
  solubilite?: string;
  application?: string;
  type_de_peau?: string;
  saveur?: string;
  page?: string;
}

export interface FilterValues {
  familles: string[];
  origines: string[];
  aspects: string[];
  solubilites: string[];
  applications: string[];
  types_de_peau: string[];
  saveurs: string[];
}

const PAGE_SIZE = 24;

/** Generate search variants: original + without accents */
function searchVariants(term: string): string[] {
  const variants = new Set<string>();
  variants.add(term);
  // Remove accents
  const noAccent = term.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  variants.add(noAccent);
  // Add accented version for common patterns
  const withAccents = term
    .replace(/arome/gi, "arôme")
    .replace(/cosmetique/gi, "cosmétique")
    .replace(/parfumerie/gi, "parfumerie")
    .replace(/epice/gi, "épicé")
    .replace(/hesperide/gi, "hespéridé")
    .replace(/boise/gi, "boisé")
    .replace(/florale?/gi, "floral")
    .replace(/fruite/gi, "fruité");
  variants.add(withAccents);
  return [...variants];
}

// ── Search fields per table ──
const SEARCH_FIELDS: Record<string, string[]> = {
  aromes_fr: ["nom_commercial", "code", "code_fournisseurs", "cas_no", "famille_arome", "saveur"],
  cosmetique_fr: ["nom_commercial", "code", "code_fournisseurs", "cas_no", "inci", "description", "famille_cosmetique", "benefices"],
  parfum_fr: ["nom_commercial", "code", "code_fournisseurs", "cas_no", "inci", "description", "famille_olfactive", "profil_olfactif", "nom_latin"],
};

// ── Filter field mapping per table ──
const FAMILLE_FIELD: Record<string, string> = {
  aromes_fr: "famille_arome",
  cosmetique_fr: "famille_cosmetique",
  parfum_fr: "famille_olfactive",
};

const ORIGINE_FIELD: Record<string, string> = {
  aromes_fr: "origin",
  cosmetique_fr: "origine",
  parfum_fr: "origin",
};

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

    // Search across all relevant fields — with accent-insensitive variants
    if (params.search) {
      const fields = SEARCH_FIELDS[table] || ["nom_commercial", "code"];
      const variants = searchVariants(params.search);
      const orClauses = fields
        .flatMap((f) => variants.map((v) => `${f}.ilike.%${v}%`))
        .join(",");
      query = query.or(orClauses);
    }

    // Famille filter ("all" = no filter, just show all products of this category)
    if (params.famille && params.famille !== "all") {
      const familleField = FAMILLE_FIELD[table];
      if (familleField) {
        const values = params.famille.split(",");
        query = query.in(familleField, values);
      }
    }

    // Origine filter
    if (params.origine) {
      const origineField = ORIGINE_FIELD[table];
      if (origineField) {
        const values = params.origine.split(",");
        query = query.in(origineField, values);
      }
    }

    // Aspect filter
    if (params.aspect) {
      const values = params.aspect.split(",");
      query = query.in("aspect", values);
    }

    // Cosmétiques-specific filters
    if (table === "cosmetique_fr") {
      if (params.solubilite) {
        query = query.in("solubilite", params.solubilite.split(","));
      }
      if (params.application) {
        query = query.in("application", params.application.split(","));
      }
      if (params.type_de_peau) {
        query = query.in("type_de_peau", params.type_de_peau.split(","));
      }
    }

    // Aromes-specific: saveur
    if (table === "aromes_fr" && params.saveur) {
      query = query.in("saveur", params.saveur.split(","));
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

/**
 * Get unique filter values for sidebar filters.
 * Returns distinct values for each filterable field based on active category.
 */
export async function getFilterValues(category?: string): Promise<FilterValues> {
  const supabase = await createClient();
  const result: FilterValues = {
    familles: [],
    origines: [],
    aspects: [],
    solubilites: [],
    applications: [],
    types_de_peau: [],
    saveurs: [],
  };

  const cat = category?.toLowerCase();
  const tables = cat === "cosmetique"
    ? ["cosmetique_fr"]
    : cat === "parfum"
      ? ["parfum_fr"]
      : cat === "arome"
        ? ["aromes_fr"]
        : ["cosmetique_fr", "parfum_fr", "aromes_fr"];

  const familleSet = new Set<string>();
  const origineSet = new Set<string>();
  const aspectSet = new Set<string>();
  const solubiliteSet = new Set<string>();
  const applicationSet = new Set<string>();
  const typeDepeauSet = new Set<string>();
  const saveurSet = new Set<string>();

  for (const table of tables) {
    const familleField = FAMILLE_FIELD[table];
    const origineField = ORIGINE_FIELD[table];

    // Fetch distinct values in one query per table
    const { data } = await supabase
      .from(table)
      .select(`${familleField}, ${origineField}, aspect${table === "cosmetique_fr" ? ", solubilite, application, type_de_peau" : ""}${table === "aromes_fr" ? ", saveur" : ""}`)
      .eq("statut", "ACTIF");

    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const row of data as any[]) {
        if (row[familleField]) familleSet.add(row[familleField]);
        if (row[origineField]) origineSet.add(row[origineField]);
        if (row.aspect) aspectSet.add(row.aspect);
        if (row.solubilite) solubiliteSet.add(row.solubilite);
        if (row.application) applicationSet.add(row.application);
        if (row.type_de_peau) typeDepeauSet.add(row.type_de_peau);
        if (row.saveur) saveurSet.add(row.saveur);
      }
    }
  }

  result.familles = [...familleSet].sort();
  result.origines = [...origineSet].sort();
  result.aspects = [...aspectSet].sort();
  result.solubilites = [...solubiliteSet].sort();
  result.applications = [...applicationSet].sort();
  result.types_de_peau = [...typeDepeauSet].sort();
  result.saveurs = [...saveurSet].sort();

  return result;
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

export async function getProductPerformance(code: string): Promise<PerformanceRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("parfum_performance")
    .select("*")
    .eq("product_code", code)
    .order("ordre", { ascending: true });

  return (data || []) as unknown as PerformanceRow[];
}

export async function getProductStabilite(code: string): Promise<StabiliteRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("parfum_stabilite")
    .select("*")
    .eq("product_code", code)
    .order("ordre", { ascending: true });

  return (data || []) as unknown as StabiliteRow[];
}

export async function getRelatedProducts(
  code: string,
  table: string,
  filterField: string,
  filterValue: string | null
): Promise<Product[]> {
  if (!filterValue) return [];
  const supabase = await createClient();

  const { data } = await supabase
    .from(table)
    .select("*")
    .eq("statut", "ACTIF")
    .eq(filterField, filterValue)
    .neq("code", code)
    .limit(4);

  if (!data) return [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((p: any) => ({ ...p, _table: table }) as Product);
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
