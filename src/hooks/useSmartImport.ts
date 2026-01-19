import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type ProductType = "parfum" | "cosmetique" | "arome";

export interface ParsedProduct {
  // Common fields
  code: string;
  nom_commercial: string;
  description?: string;
  origine?: string;
  statut?: string;
  image_url?: string;
  [key: string]: unknown;
}

export interface ParsedPerformance {
  product_code: string;
  ordre: number;
  option_name: string | null;
  performance_value: string | null;
  performance_rating: number | null;
}

export interface ParsedStability {
  product_code: string;
  ordre: number;
  base_name: string;
  ph_value: string | null;
  odeur_rating: number | null;
}

export interface SmartParseResult {
  products: ParsedProduct[];
  performances: ParsedPerformance[];
  stabilities: ParsedStability[];
  errors: string[];
  columnMapping: Record<string, string>;
  detectedType: ProductType | null;
}

// Map of expected column names to database field names
const PARFUM_COLUMN_MAP: Record<string, string> = {
  "nom commercial": "nom_commercial",
  "nom_commercial": "nom_commercial",
  "code": "code",
  "description": "description",
  "origine": "origine",
  "profil olfactif": "profil_olfactif",
  "profil_olfactif": "profil_olfactif",
  "aspect": "aspect",
  "base": "base",
  "odeur": "odeur",
  "ph": "ph",
  "certifications": "certifications",
  "valorisations": "valorisations",
  "famille olfactive": "famille_olfactive",
  "famille_olfactive": "famille_olfactive",
  "nom latin": "nom_latin",
  "nom_latin": "nom_latin",
  "food grade": "food_grade",
  "food_grade": "food_grade",
  "cas n°": "cas_no",
  "cas_no": "cas_no",
  "statut": "statut",
  "traçabilité": "tracabilite",
  "tracabilite": "tracabilite",
  "calendrier des récoltes": "calendrier_des_recoltes",
  "calendrier_des_recoltes": "calendrier_des_recoltes",
  "typologie de produit": "typologie_de_produit",
  "typologie_de_produit": "typologie_de_produit",
  "flavouring preparation": "flavouring_preparation",
  "flavouring_preparation": "flavouring_preparation",
};

// Performance columns mapping
const PERFORMANCE_COLUMNS = [
  { optionKey: "option 1", perfKey: "performance 1", ordre: 1 },
  { optionKey: "option 2", perfKey: "performance 2", ordre: 2 },
  { optionKey: "option 3", perfKey: "performance 3", ordre: 3 },
  { optionKey: "option 4", perfKey: "performance 4", ordre: 4 },
  { optionKey: "option 5", perfKey: "performance 5", ordre: 5 },
  { optionKey: "option 6", perfKey: "performance 6", ordre: 6 },
];

// Stability bases in expected order
const STABILITY_BASES = [
  "Shampooing",
  "APC",
  "Détergent liquide",
  "Savon",
  "Détergent poudre",
  "Eau de javel",
  "Nettoyant acide",
  "Assouplissant textile",
  "Antisudorifique",
];

/**
 * Parse rating from string format like "5/5" or "3/5"
 */
function parseRating(value: string | undefined | null): number | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  
  // Handle "X/5" format
  const match = trimmed.match(/^(\d+)\/5$/);
  if (match) {
    return parseInt(match[1], 10);
  }
  
  // Handle single digit
  if (/^\d$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }
  
  return null;
}

/**
 * Smart CSV parser that handles duplicate column names
 */
export function parseCSVWithDuplicates(csvText: string): { headers: string[], rows: string[][] } {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  // Parse headers - keep duplicates with index suffix
  const rawHeaders = parseCSVLine(lines[0]);
  const headerCount: Record<string, number> = {};
  const headers = rawHeaders.map(h => {
    const normalized = h.trim().toLowerCase();
    if (headerCount[normalized] !== undefined) {
      headerCount[normalized]++;
      return `${normalized}_${headerCount[normalized]}`;
    }
    headerCount[normalized] = 0;
    return normalized;
  });

  // Parse data rows
  const rows = lines.slice(1).map(line => parseCSVLine(line));

  return { headers, rows };
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  
  // Detect delimiter (comma or semicolon)
  const semicolonCount = (line.match(/;/g) || []).length;
  const commaCount = (line.match(/,/g) || []).length;
  const delimiter = semicolonCount > commaCount ? ";" : ",";

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Detect product type from headers
 */
function detectProductType(headers: string[]): ProductType | null {
  const headerSet = new Set(headers.map(h => h.toLowerCase().replace(/_\d+$/, "")));
  
  if (headerSet.has("famille olfactive") || headerSet.has("profil olfactif") || headerSet.has("option 1")) {
    return "parfum";
  }
  if (headerSet.has("type de peau") || headerSet.has("benefices") || headerSet.has("solubilite")) {
    return "cosmetique";
  }
  if (headerSet.has("profil aromatique") || headerSet.has("dosage")) {
    return "arome";
  }
  
  return null;
}

/**
 * Extract performance data from a row
 */
function extractPerformances(
  headers: string[],
  row: string[],
  productCode: string
): ParsedPerformance[] {
  const performances: ParsedPerformance[] = [];
  
  for (const { optionKey, perfKey, ordre } of PERFORMANCE_COLUMNS) {
    const optionIndex = headers.findIndex(h => h.replace(/_\d+$/, "") === optionKey);
    const perfIndex = headers.findIndex(h => h.replace(/_\d+$/, "") === perfKey);
    
    if (optionIndex === -1) continue;
    
    const optionValue = row[optionIndex]?.trim() || null;
    const perfValue = perfIndex !== -1 ? row[perfIndex]?.trim() : null;
    
    if (optionValue) {
      const rating = parseRating(perfValue);
      performances.push({
        product_code: productCode,
        ordre,
        option_name: optionValue,
        performance_value: rating === null ? perfValue : null,
        performance_rating: rating,
      });
    }
  }
  
  return performances;
}

/**
 * Extract stability data from a row with duplicate columns
 */
function extractStabilities(
  headers: string[],
  row: string[],
  productCode: string
): ParsedStability[] {
  const stabilities: ParsedStability[] = [];
  
  // Find all pH columns (ph, ph_1, ph_2, etc.)
  const phIndices = headers
    .map((h, i) => ({ header: h, index: i }))
    .filter(({ header }) => header === "ph" || header.startsWith("ph_"));
  
  // Find all base columns
  const baseIndices = headers
    .map((h, i) => ({ header: h, index: i }))
    .filter(({ header }) => header === "base" || header.startsWith("base_"));
  
  // Find all odeur columns
  const odeurIndices = headers
    .map((h, i) => ({ header: h, index: i }))
    .filter(({ header }) => header === "odeur" || header.startsWith("odeur_"));

  // If we have the old format (ph_shampooing, etc.), use that
  const oldFormatBases = [
    { key: "shampooing", base: "Shampooing" },
    { key: "apc", base: "APC" },
    { key: "detergent_liquide", base: "Détergent liquide" },
    { key: "savon", base: "Savon" },
    { key: "detergent_poudre", base: "Détergent poudre" },
    { key: "eau_javel", base: "Eau de javel" },
    { key: "nettoyant_acide", base: "Nettoyant acide" },
    { key: "assouplissant_textile", base: "Assouplissant textile" },
    { key: "antisudorifique", base: "Antisudorifique" },
  ];

  // Check for old format columns
  let hasOldFormat = false;
  for (const { key } of oldFormatBases) {
    const phKey = `ph_${key}`;
    if (headers.includes(phKey) || headers.includes(`ph ${key.replace(/_/g, " ")}`)) {
      hasOldFormat = true;
      break;
    }
  }

  if (hasOldFormat) {
    // Parse old format
    oldFormatBases.forEach(({ key, base }, index) => {
      const phKey = `ph_${key}`;
      const odeurKey = `odeur_${key}`;
      
      const phIndex = headers.findIndex(h => 
        h === phKey || h === `ph ${key.replace(/_/g, " ")}`
      );
      const odeurIndex = headers.findIndex(h => 
        h === odeurKey || h === `odeur ${key.replace(/_/g, " ")}`
      );
      
      const phValue = phIndex !== -1 ? row[phIndex]?.trim() || null : null;
      const odeurValue = odeurIndex !== -1 ? row[odeurIndex]?.trim() : null;
      
      stabilities.push({
        product_code: productCode,
        ordre: index + 1,
        base_name: base,
        ph_value: phValue,
        odeur_rating: parseRating(odeurValue),
      });
    });
  } else if (phIndices.length > 1 || baseIndices.length > 1) {
    // New format with duplicate columns
    const maxCount = Math.max(phIndices.length, baseIndices.length, odeurIndices.length);
    
    for (let i = 0; i < maxCount; i++) {
      const phIdx = phIndices[i]?.index;
      const baseIdx = baseIndices[i]?.index;
      const odeurIdx = odeurIndices[i]?.index;
      
      const phValue = phIdx !== undefined ? row[phIdx]?.trim() || null : null;
      const baseName = baseIdx !== undefined ? row[baseIdx]?.trim() || STABILITY_BASES[i] || `Base ${i + 1}` : STABILITY_BASES[i] || `Base ${i + 1}`;
      const odeurValue = odeurIdx !== undefined ? row[odeurIdx]?.trim() : null;
      
      if (baseName || phValue) {
        stabilities.push({
          product_code: productCode,
          ordre: i + 1,
          base_name: baseName,
          ph_value: phValue,
          odeur_rating: parseRating(odeurValue),
        });
      }
    }
  }
  
  return stabilities;
}

/**
 * Main smart parse function
 */
export function smartParseCSV(csvText: string): SmartParseResult {
  const { headers, rows } = parseCSVWithDuplicates(csvText);
  const errors: string[] = [];
  const products: ParsedProduct[] = [];
  const performances: ParsedPerformance[] = [];
  const stabilities: ParsedStability[] = [];
  const columnMapping: Record<string, string> = {};

  if (headers.length === 0) {
    errors.push("Fichier CSV vide ou invalide");
    return { products, performances, stabilities, errors, columnMapping, detectedType: null };
  }

  const detectedType = detectProductType(headers);
  
  // Build column mapping
  headers.forEach(header => {
    const baseHeader = header.replace(/_\d+$/, "");
    if (PARFUM_COLUMN_MAP[baseHeader]) {
      columnMapping[header] = PARFUM_COLUMN_MAP[baseHeader];
    }
  });

  // Parse each row
  rows.forEach((row, rowIndex) => {
    if (row.length === 0 || row.every(cell => !cell.trim())) return;

    // Find code column
    const codeIndex = headers.findIndex(h => h === "code");
    const nomIndex = headers.findIndex(h => h === "nom commercial" || h === "nom_commercial");
    
    const code = codeIndex !== -1 ? row[codeIndex]?.trim() : null;
    const nom = nomIndex !== -1 ? row[nomIndex]?.trim() : null;

    if (!code) {
      errors.push(`Ligne ${rowIndex + 2}: Code manquant`);
      return;
    }

    // Build product object
    const product: ParsedProduct = {
      code,
      nom_commercial: nom || code,
    };

    // Map other columns
    headers.forEach((header, index) => {
      const dbField = columnMapping[header] || PARFUM_COLUMN_MAP[header.replace(/_\d+$/, "")];
      if (dbField && row[index]?.trim()) {
        product[dbField] = row[index].trim();
      }
    });

    products.push(product);

    // Extract performance data for parfums
    if (detectedType === "parfum") {
      const perfData = extractPerformances(headers, row, code);
      performances.push(...perfData);

      const stabData = extractStabilities(headers, row, code);
      stabilities.push(...stabData);
    }
  });

  return { products, performances, stabilities, errors, columnMapping, detectedType };
}

/**
 * Hook for smart import functionality
 */
export function useSmartImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const importData = async (
    parseResult: SmartParseResult,
    productType: ProductType
  ): Promise<{ success: boolean; imported: number; errors: string[] }> => {
    setIsImporting(true);
    setProgress(0);
    const errors: string[] = [];
    let imported = 0;

    try {
      const tableName = productType === "parfum" 
        ? "parfum_fr" 
        : productType === "cosmetique" 
          ? "cosmetique_fr" 
          : "aromes_fr";

      // Step 1: Import products (50% of progress)
      const { products, performances, stabilities } = parseResult;
      
      if (products.length === 0) {
        errors.push("Aucun produit à importer");
        return { success: false, imported: 0, errors };
      }

      // Upsert products
      const { error: productError } = await supabase
        .from(tableName)
        .upsert(products as any, { onConflict: "code" });

      if (productError) {
        errors.push(`Erreur import produits: ${productError.message}`);
        return { success: false, imported: 0, errors };
      }

      imported = products.length;
      setProgress(50);

      // Step 2: Import performances if parfum (25% of progress)
      if (productType === "parfum" && performances.length > 0) {
        // Get unique product codes
        const productCodes = [...new Set(performances.map(p => p.product_code))];
        
        // Delete existing performances for these products
        const { error: deleteError } = await supabase
          .from("parfum_performance")
          .delete()
          .in("product_code", productCodes);

        if (deleteError) {
          errors.push(`Erreur suppression performances: ${deleteError.message}`);
        } else {
          // Insert new performances
          const { error: perfError } = await supabase
            .from("parfum_performance")
            .insert(performances);

          if (perfError) {
            errors.push(`Erreur import performances: ${perfError.message}`);
          }
        }
      }
      setProgress(75);

      // Step 3: Import stabilities if parfum (25% of progress)
      if (productType === "parfum" && stabilities.length > 0) {
        // Get unique product codes
        const productCodes = [...new Set(stabilities.map(s => s.product_code))];
        
        // Delete existing stabilities for these products
        const { error: deleteError } = await supabase
          .from("parfum_stabilite")
          .delete()
          .in("product_code", productCodes);

        if (deleteError) {
          errors.push(`Erreur suppression stabilités: ${deleteError.message}`);
        } else {
          // Insert new stabilities
          const { error: stabError } = await supabase
            .from("parfum_stabilite")
            .insert(stabilities);

          if (stabError) {
            errors.push(`Erreur import stabilités: ${stabError.message}`);
          }
        }
      }
      setProgress(100);

      const success = errors.length === 0;
      if (success) {
        toast.success(`${imported} produits importés avec succès`);
      } else {
        toast.warning(`Import partiel: ${imported} produits, ${errors.length} erreurs`);
      }

      return { success, imported, errors };
    } catch (error: any) {
      errors.push(error.message);
      return { success: false, imported: 0, errors };
    } finally {
      setIsImporting(false);
    }
  };

  return {
    importData,
    isImporting,
    progress,
    smartParseCSV,
  };
}
