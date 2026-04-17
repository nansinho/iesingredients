import { Instagram, Leaf, Linkedin, FlaskConical, Droplets } from "lucide-react";

export const socialLinks = [
  {
    name: "Instagram",
    icon: Instagram,
    url: "https://www.instagram.com/ies_ingredients/",
    color: "#E1306C",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://www.linkedin.com/company/ies-ingredients/",
    color: "#0A66C2",
  },
];

export const catalogColumns = [
  {
    id: "cosmetique",
    titleKey: "cosmetic" as const,
    icon: Leaf,
    accent: "#5B7B6B",
    image: "/images/Cosmetique/Portrait Cosmetique.jpg",
    tagline: "Actifs botaniques & extraits naturels",
    totalFamilies: 6,
    typeLabel: "Catégorie",
    families: [
      { name: "Actifs", image: "/catalogues/Famille Cosmetiques/actifs.jpg" },
      { name: "Extraits végétaux", image: "/catalogues/Famille Cosmetiques/extrait_vegetaux.jpg" },
      { name: "Huiles essentielles", image: "/catalogues/Famille Cosmetiques/huiles_essentielles.jpg" },
      { name: "Performance", image: "/catalogues/Famille Cosmetiques/performance.jpg" },
    ],
    subKeys: ["cosmeticSub1", "cosmeticSub2", "cosmeticSub3", "cosmeticSub4"] as const,
  },
  {
    id: "parfum",
    titleKey: "perfume" as const,
    icon: FlaskConical,
    accent: "#8B6A80",
    image: "/images/Parfum/Parfum Portrait.jpg",
    tagline: "Absolues, naturels & molécules de synthèse",
    totalFamilies: 16,
    typeLabel: "Famille olfactive",
    families: [
      { name: "Floral", image: "/catalogues/Famille Parfums/floral.jpg" },
      { name: "Boisé", image: "/catalogues/Famille Parfums/boise.jpg" },
      { name: "Hespéridé", image: "/catalogues/Famille Parfums/hesperide.jpg" },
      { name: "Ambré", image: "/catalogues/Famille Parfums/ambre.jpg" },
    ],
    subKeys: ["perfumeSub1", "perfumeSub2", "perfumeSub3", "perfumeSub4"] as const,
  },
  {
    id: "arome",
    titleKey: "aroma" as const,
    icon: Droplets,
    accent: "#D4907E",
    image: "/images/Aromes/Aromes Portrait.jpg",
    tagline: "Arômes naturels & de synthèse",
    totalFamilies: 6,
    typeLabel: "Gamme",
    families: [
      { name: "Citrus", image: "/catalogues/Famille Aromes/citrus.jpg" },
      { name: "Kitchen", image: "/catalogues/Famille Aromes/kitchen.jpg" },
      { name: "High Intensity", image: "/catalogues/Famille Aromes/high_intensity.jpg" },
      { name: "Wellness & Nutrition", image: "/catalogues/Famille Aromes/wellness_nutrition.jpg" },
    ],
    subKeys: ["aromaSub1", "aromaSub2", "aromaSub3", "aromaSub4"] as const,
  },
];

export type CatalogColumn = (typeof catalogColumns)[number];
export type SocialLink = (typeof socialLinks)[number];
