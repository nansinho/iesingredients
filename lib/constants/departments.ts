export const DEPARTMENTS = [
  { id: "direction", labelFr: "Direction", labelEn: "Management" },
  { id: "cosmetique", labelFr: "Contacts Cosmétique", labelEn: "Cosmetics Contacts" },
  { id: "parfum", labelFr: "Contacts Parfum", labelEn: "Perfume Contacts" },
  { id: "aromes", labelFr: "Contact Arômes", labelEn: "Aroma Contacts" },
  { id: "administration-ventes", labelFr: "Administration des Ventes", labelEn: "Sales Administration" },
  { id: "affaires-reglementaires", labelFr: "Affaires Réglementaires", labelEn: "Regulatory Affairs" },
  { id: "marketing-communication", labelFr: "Marketing & Communication", labelEn: "Marketing & Communication" },
  { id: "logistique", labelFr: "Logistique", labelEn: "Logistics" },
  { id: "achats", labelFr: "Achats", labelEn: "Purchasing" },
  { id: "laboratoires", labelFr: "Laboratoires", labelEn: "Laboratories" },
  { id: "rse", labelFr: "RSE", labelEn: "CSR" },
  { id: "ressources-humaines", labelFr: "Ressources Humaines", labelEn: "Human Resources" },
] as const;

export type DepartmentId = (typeof DEPARTMENTS)[number]["id"];

export function getDepartmentLabel(id: string, locale: string): string {
  const dept = DEPARTMENTS.find((d) => d.id === id);
  if (!dept) return id;
  return locale === "fr" ? dept.labelFr : dept.labelEn;
}
