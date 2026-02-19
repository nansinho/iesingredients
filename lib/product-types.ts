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
  conservateurs?: string | null;
  tracabilite?: string | null;
  flavouring_preparation?: string | null;
  profil_aromatique?: string | null;
  dosage?: string | null;
  ph?: string | null;
  _table?: string;
}

export function getCategoryConfig(typologie: string | null) {
  const t = (typologie || "").toUpperCase();
  if (t.includes("COSMET") || t.includes("COSMÉT")) {
    return {
      accent: "#4A7C59",
      label: "Cosmétique",
      gradient: "from-[#2D5A3D] to-[#4A7C59]",
      image: "/images/cream-bowl.jpg",
    };
  }
  if (t.includes("PARFUM")) {
    return {
      accent: "#A67B5B",
      label: "Parfumerie",
      gradient: "from-[#A67B5B] to-[#D4A574]",
      image: "/images/essential-oil.jpg",
    };
  }
  if (t.includes("AROME") || t.includes("ARÔME")) {
    return {
      accent: "#C97B8B",
      label: "Arômes",
      gradient: "from-[#8B4A5E] to-[#C97B8B]",
      image: "/images/product-bottle.jpg",
    };
  }
  return {
    accent: "#4A7C59",
    label: "Produit",
    gradient: "from-forest-800 to-forest-900",
    image: "/images/cream-bowl.jpg",
  };
}
