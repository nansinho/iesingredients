export interface Product {
  id: number;
  code: string | null;
  nom_commercial: string | null;
  typologie_de_produit: string | null;
  gamme?: string | null;
  origine: string | null;
  cas_no: string | null;
  inci?: string | null;
  benefices?: string | null;
  solubilite?: string | null;
  description: string | null;
  aspect: string | null;
  certifications: string | null;
  valorisations: string | null;
  statut: string | null;
  application?: string | null;
  type_de_peau?: string | null;
  image_url?: string | null;
  famille_olfactive?: string | null;
  profil_olfactif?: string | null;
  nom_latin?: string | null;
  food_grade?: string | null;
  odeur?: string | null;
  base?: string | null;
  partie_utilisee?: string | null;
  benefices_aqueux?: string | null;
  benefices_huileux?: string | null;
  calendrier_des_recoltes?: string | null;
  calendrier_recoltes?: string | null;
  conservateurs?: string | null;
  tracabilite?: string | null;
  flavouring_preparation?: string | null;
  profil_aromatique?: string | null;
  dosage?: string | null;
  ph?: string | null;
  famille_arome?: string | null;
  saveur?: string | null;
  famille_cosmetique?: string | null;
  code_fournisseurs?: string | null;
  created_at?: string | null;
  _table?: string;
}

export interface PerformanceRow {
  id?: number;
  product_code: string;
  ordre: number;
  option_name: string | null;
  performance_value: string | null;
  performance_rating: number | null;
}

export interface StabiliteRow {
  id?: number;
  product_code: string;
  ordre: number;
  base_name: string;
  ph_value: string | null;
  odeur_rating: number | null;
}

/**
 * Get category config from either:
 * - typography_de_produit (DB column name with typo)
 * - _table name (fallback, always reliable)
 */
export function getCategoryConfig(typologieOrTable: string | null, table?: string | null) {
  const t = (typologieOrTable || "").toUpperCase();
  const tbl = (table || "").toLowerCase();

  if (t.includes("COSMET") || t.includes("COSMÉT") || tbl === "cosmetique_fr") {
    return {
      accent: "#5B7B6B",
      label: "Cosmétique",
      gradient: "from-[#4A6B5A] to-[#5B7B6B]",
      image: "/images/cream-bowl.jpg",
    };
  }
  if (t.includes("PARFUM") || tbl === "parfum_fr") {
    return {
      accent: "#8B6A80",
      label: "Parfumerie",
      gradient: "from-[#7A5970] to-[#8B6A80]",
      image: "/images/essential-oil.jpg",
    };
  }
  if (t.includes("AROME") || t.includes("ARÔME") || tbl === "aromes_fr") {
    return {
      accent: "#D4907E",
      label: "Arômes",
      gradient: "from-[#C4806E] to-[#D4907E]",
      image: "/images/product-bottle.jpg",
    };
  }
  return {
    accent: "#5B7B6B",
    label: "Cosmétique",
    gradient: "from-[#4A6B5A] to-[#5B7B6B]",
    image: "/images/cream-bowl.jpg",
  };
}
